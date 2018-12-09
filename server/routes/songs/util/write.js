// TODO get these in parity w/ sql
const songsWriteSchema = {
  name: { required: true },
  description: { required: true },
  imageUrl: { db: 'image_url', required: true },
  curatorId: { db: 'curator_id' },
  artistName: { db: 'artist_name', required: true},
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
  artistLocation: { db: 'artist_location', required: true }
}

// This doesn't work, but would be nice for debugging single-statement functions
const logThen = (msg, thing) => {
  console.log(msg);
  return thing();
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
    (!!fieldData.fields && !!params[fieldName]) ?
      getMissingRequiredFields(params[fieldName], fieldData.fields) :
      null
);

const getMissingRequiredFields = (params, schema) => (
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

const getDbFieldValues = (params, schema, dbNamePrefix = '') => (
    Object.entries(schema)
      .reduce ( (currPairs, [fieldName, fieldData]) => {
        const nextPairs = (!!fieldData.fields && !!params[fieldName]) ?
          getDbFieldValues(params[fieldName], fieldData.fields, fieldName + '_') :
          [ [dbNamePrefix + (fieldData.db ? fieldData.db : fieldName), params[fieldName]] ];
        return [ ...currPairs, ...nextPairs ];
      }, [] )
      .filter( ([fieldName, fieldData ]) => !!fieldData )
);

const getInsertSongQuery = params => {

  const missingFields = getMissingRequiredFields(params, songsWriteSchema);
  if (Object.keys(missingFields).length > 0) {
    console.log('Missing fields:');
    console.log(missingFields);
    return;
  }

  const dbFieldValues = [
    ...getDbFieldValues(params, songsWriteSchema),
    ['created_at', (new Date()).toJSON()]
  ];

  console.log(dbFieldValues);
  const queryText =
    'INSERT INTO songs (' +
      dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldName ).join(',') +
    ') VALUES (' +
    dbFieldValues.map((fields, i)  => '$' + (i+1)).join(',') +
  ');';

  return {
    text: queryText,
    values: dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue )
  };
};

const getUpdateSongQuery = (songId, params) => {

  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }

  const dbFieldValues = getDbFieldValues(params, songsWriteSchema);
  const queryText =
    'UPDATE songs SET ' +
    dbFieldValues.map( ([ dbFieldName, dbFieldValue ], i) => dbFieldName + ' = $' + (i+1) ).join(',') +
    ' WHERE id = $' + (dbFieldValues.length + 1)
  ');';

  return {
    text: queryText,
    values: [
      ...dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue ),
      songId
    ]
  };
};

const getDeleteSongQuery = songId => {

  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }
  return {
    text: 'DELETE FROM songs WHERE id = $1',
    values: [songId]
  };
}


module.exports = {
  getInsertSongQuery,
  getUpdateSongQuery,
  getDeleteSongQuery
};
