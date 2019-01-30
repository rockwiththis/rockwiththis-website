const database = require('../../../db');

const songSelect = `
  SELECT
    DISTINCT songs.*,
    curator.first_name as curator_first_name,
    curator.last_name as curator_last_name
  FROM songs
  LEFT JOIN users AS curator ON curator.id = songs.curator_id'
`;

const relationSelect = relationName => `
  SELECT songs.id as song_id, ${relationName}.*
  FROM songs
`;

const subgenreJoins = (joinType = 'INNER') => `
  ${joinType} JOIN subgenre_songs ON songs.id = subgenre_songs.song_id
  ${joinType} JOIN subgenres ON subgenres.id = subgenre_songs.subgenre_id
`;

const momentJoins = (joinType = 'INNER') => `
  ${joinType} JOIN moment_songs ON songs.id = moment_songs.song_id
  ${joinType} JOIN moments ON moments.id = moment_songs.moment_id
`;

const getSongs = (limit, offset, subgenreIds) => {

  const subgenreIdFilter = (
    subgenreIds.length > 0  ? `WHERE subgenres.id IN (${subgenreIds})` : ''
  );
  const offsetStatement = `OFFSET ${Number(offset)}`;
  const limitStatement = `LIMIT ${Number(limit)}`;

  const queryText = (`
    ${songSelect}
    ${subgenreJoins('LEFT')}
    ${subgenreIdFilter}
    ORDER BY songs.created_at DESC, songs.id
    ${limitStatement}
    ${offsetStatement}
  `);

  return database.query({ text: queryText })
    .then(result => result.rows);
}

const getSingleSong = songId =>
  database.query({
    text: `
      ${songSelect}
      WHERE songs.id = $1
    `,
    values: [songId]
  }).then(result => result.rows[0])

const includeNestedRelations = songs => {
  const songIds = songs.map(s => s.id);

  return Promise.all([
    songs,
    getRelatedSubgenres(songIds),
    getRelatedMoments(songIds)
  ])
  .then(([songs, subgenres, moments]) =>
    nestSongsWithRelations(songs, subgenres, moments)
  );
}

const getRelatedSubgenres = songIds =>
  database.query({
    text: `
      ${relationSelect('subgenres')}
      ${subgenreJoins('INNER')}
      WHERE songs.id IN ($1)
      ORDER BY songs.id
    `,
    values: [songIds]
  }).then(result => result.rows);

const getRelatedMoments = songIds =>
  database.query({
    text: `
      ${relationSelect('moments')}
      ${momentJoins('INNER')}
      WHERE songs.id IN ($1)
      ORDER BY songs.id
    `,
    values: [songIds]
  }).then(result => result.rows);

const nestSongsWithRelations = (songs, subgenres, moments) => {
  const groupedSubgenres = groupRelationBySongId(subgenres);
  const groupedMoments = groupRelationBySongId(moments);

  return songs.map(song => ({
    ...song,
    sub_genres: groupedSubgenres[song.id] || [],
    moments: groupedMoments[song.id] || []
  }));
}

const groupRelationBySongId = relations => (
  relations.reduce((groupedRelations, nextRelation) => ({
    ...groupedRelations,
    [nextRelation.song_id]: (groupedRelations[nextRelation.song_id] || []).concat([nextRelation])
  }), {})
);

module.exports = {
  getSongs,
  getSingleSong,
  includeNestedRelations
};
