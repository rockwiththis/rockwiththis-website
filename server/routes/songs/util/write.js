const database = require('../../../db');

// TODO `required` flags in parity w/ sql
const songsWriteSchema = {
  fields: {
    name: { required: true },
    description: { required: true },
    imageUrl: { db: 'image_url', required: true },
    songFileName: { db: 'song_file_name', required: true },
    curatorId: { db: 'curator_id', required: true },
    artistName: { db: 'artist_name', required: true },
    spotify: {
      required: true, // DB way ... shouldn't we actually at least one / exactly one link type?
      fields: {
        link: { required: true },
      }
    },
    soundcloud: {
      fields: {
        link: { required: true },
        trackId: { db: 'track_id', required: true },
      }
    },
    youtube: {
      fields: {
        link: { required: true },
        trackId: { db: 'track_id', required: true },
      }
    },
    // Should these really be required?
    bpm: { required: true },
    artistLocation: { db: 'artist_location', required: true },
    createdAt: { db: 'created_at', required: true },
    hidden: {}
  },
  relations: {
    subgenreIds: { join_table: 'subgenre_songs', db: 'subgenre_id' },
    momentIds: { join_table: 'song_moments', db: 'moment_id' }
  }
}


// TODO import recompose and use this w/ `compose` in `getMissingRequiredFields` instead of reduce
const keyValueArrayToObject = keyValueArray => (
    keyValueArray.reduce( (curr, [ key, value ]) => ({
      ...curr,
      key: value
    }), {})
);


const requiredFieldNameIfMissing = (fieldName, fieldData, params) => (
  (!params[fieldName] && fieldData.required) ?
    fieldName :
    (!!fieldData.fields && !!params[fieldName] && fieldData.isRequired) ?
      getMissingRequiredFields(params[fieldName], fieldData.fields) :
      null
);

const getMissingRequiredFields = (params, schema = songsWriteSchema.fields) => (
    Object.entries(schema)
      .map( ([ fieldName, fieldData ]) => (
          [ fieldName, requiredFieldNameIfMissing(fieldName, fieldData, params) ]
      ))
      .filter( ([fieldName, fieldData ]) => fieldData != null && Object.keys(fieldData).length > 0 )
      .reduce( (allMissingFields, [ fieldName, missingData ]) => ({
        ...allMissingFields,
        [fieldName]: missingData
      }), {})
);

const getDbFieldValues = (params, schema = songsWriteSchema.fields, dbNamePrefix = '') => (
    Object.entries(schema)
      .reduce ( (currPairs, [fieldName, fieldData]) => {

        const paramValue = (!params[fieldName] && !!fieldData.default) ?
          fieldData.default() :
          params[fieldName];

        const dbFieldName = dbNamePrefix + (fieldData.db ? fieldData.db : fieldName);

        const nextPairs = (!!fieldData.fields && !!paramValue) ?
          getDbFieldValues(params[fieldName], fieldData.fields, fieldName + '_') :
          [ [dbFieldName, paramValue] ];

        return [ ...currPairs, ...nextPairs ];
      }, [] )
      .filter( ([fieldName, fieldData ]) => !!fieldData )
);

const insertSong = params => {
  const missingFields = getMissingRequiredFields(params);
  if (Object.keys(missingFields).length > 0) {
    console.log('Missing fields:');
    console.log(missingFields);
    throw 400;
  }

  const dbFieldValues = getDbFieldValues(params)

  const queryText =
    'INSERT INTO songs (' +
      dbFieldValues.map(([ dbFieldName, dbFieldValue ]) => dbFieldName).join(',') +
    ') VALUES (' +
    dbFieldValues.map((fields, i)  => '$' + (i+1)).join(',') +
  ') RETURNING id';

  return database.query({
    text: queryText,
    values: dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue )
  })
  .then(insertResponse => insertRelation(insertResponse.rows[0].id, params));
};

const processRelationQueries = getQuery =>
  Promise.all(
    Object.keys(songsWriteSchema.relations).map(relationName => {
      if (!params[relationName] || params[relationName].length == 0)
        return null;

      const { joinTable, db } = songsWriteSchema.relations[relationName];

      return getQuery(relationName, joinTable, db).then(database.query);
    })
  );

const insertRelations = (songId, params) => {
  if (!songId)
    throw "Cannot insert relations w/o song id";

  return processRelationQueries((relationName, joinTable, db) => ({
    text: `
      INSERT INTO ${joinTable} (song_id, ${db}) VALUES ' +
      params[relationName].map((id, i) => '($1,$' + (i+2) + ')').join(',');
    `,
    values: [ songId, ...params[relationName] ]
  }));
}

const updateSong = (songId, params) => {
  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }

  const dbFieldValues = getDbFieldValues(params);
  const queryText =
    'UPDATE songs SET ' +
    dbFieldValues.map( ([ dbFieldName, dbFieldValue ], i) => dbFieldName + ' = $' + (i+1) ).join(',') +
    ' WHERE id = $' + (dbFieldValues.length + 1)
  ');';

  return database.query({
    text: queryText,
    values: [
      ...dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue ),
      songId
    ]
  })
  .then(() => deleteRelations(songId))
  .then(() => insertRelations(songId, params));
};

const deleteSong = songId => {
  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }

  return database.query({
    text: 'DELETE FROM songs WHERE songs.id = $1',
    values: [songId]
  })
  .then(() => deleteRelations(songId));
}

const deleteRelations = songId => {
  if (!songId)
    throw "Cannot delete relations w/o song id";

  return processRelationQueries((relationName, joinTable, db) => ({
    text: `DELETE FROM ${join_table} WHERE subgenre_songs.song_id = $1`,
    values: [ songId ]
  }));
};


module.exports = {
  insertSong,
  updateSong,
  deleteSong
};
