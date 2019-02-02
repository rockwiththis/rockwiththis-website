const dbPool = require('../../../db');

const {
  getMissingRequiredFields,
  getDbFieldValues,
  getAllRelationQueries
} = require('./schema.js');

const transactional = performQueries =>
  dbPool.connect((err, client, done) => {
    if (!!err) {
      console.log("Error connecting to db pool", err);
      done();
      throw err;
    }
    return client.query('BEGIN')
      .then(() => performQueries(client))
      .then(() => client.query('COMMIT'))
      .then(() => done())
      .catch(e => client.query('ROLLBACK').then(() => {
        done();
        throw e;
      }));
  });

const insertSong = params => transactional(client => {
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

  return client.query({
    text: queryText,
    values: dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue )
  })
  .then(insertResponse => insertRelations(client, insertResponse.rows[0].id, params));
});

const updateSong = (songId, params) => transactional(client => {
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

  return client.query({
    text: queryText,
    values: [
      ...dbFieldValues.map( ([ dbFieldName, dbFieldValue ]) => dbFieldValue ),
      songId
    ]
  })
  .then(() => deleteRelations(client, songId))
  .then(() => insertRelations(client, songId, params));
});

const deleteSong = songId => transactional(client => {
  if (!songId) {
    console.log("id required, not provided");
    throw 400
  }

  return client.query({
    text: 'DELETE FROM songs WHERE songs.id = $1',
    values: [songId]
  })
  .then(() => deleteRelations(client, songId));
});


const performRelationQueries = (client, getQuery) =>
  Promise.all(getAllRelationQueries(getQuery).map(q => q && client.query(q)));

const insertRelations = (client, songId, params) => {
  if (!songId)
    throw "Cannot insert relations w/o song id";

  return performRelationQueries(client, (relationName, joinTable, db) => {
    if (!params[relationName] || params[relationName].length == 0)
      return null;

    const text =
      `INSERT INTO ${joinTable} (song_id, ${db}) VALUES ` +
      params[relationName].map((id, i) => '($1,$' + (i+2) + ')').join(',');
    return {
      text,
      values: [ songId, ...params[relationName] ]
    };
  });
}

const deleteRelations = (client, songId) => {
  if (!songId)
    throw "Cannot delete relations w/o song id";

  return performRelationQueries(client, (relationName, joinTable, db) => ({
    text: `DELETE FROM ${joinTable} WHERE song_id = $1`,
    values: [ songId ]
  }));
};


module.exports = {
  insertSong,
  updateSong,
  deleteSong
};
