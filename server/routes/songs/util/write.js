const database = require('../../../db');

const {
  getMissingRequiredFields,
  getDbFieldValues,
  getAllRelationQueries
} = require('./schema.js');

const transactional = performQueries =>
  database.query('BEGIN')
    .then(() => performQueries())
    .then(() => database.query('COMMIT'))
    .catch(() => database.query('ROLLBACK'));

const insertSong = params => transactional(() => {
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
})();

const updateSong = (songId, params) => transactional(() => {
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
})();

const deleteSong = songId => transactional(() => {
  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }

  return database.query({
    text: 'DELETE FROM songs WHERE songs.id = $1',
    values: [songId]
  })
  .then(() => deleteRelations(songId));
})();


const performRelationQueries = getQuery =>
  Promise.all(getAllRelationQueries.map(database.query))

const insertRelations = (songId, params) => {
  if (!songId)
    throw "Cannot insert relations w/o song id";

  return performRelationQueries((relationName, joinTable, db) => ({
    text: `
      INSERT INTO ${joinTable} (song_id, ${db}) VALUES ' +
      params[relationName].map((id, i) => '($1,$' + (i+2) + ')').join(',');
    `,
    values: [ songId, ...params[relationName] ]
  }));
}

const deleteRelations = songId => {
  if (!songId)
    throw "Cannot delete relations w/o song id";

  return performRelationQueries((relationName, joinTable, db) => ({
    text: `DELETE FROM ${join_table} WHERE subgenre_songs.song_id = $1`,
    values: [ songId ]
  }));
};


module.exports = {
  insertSong,
  updateSong,
  deleteSong
};
