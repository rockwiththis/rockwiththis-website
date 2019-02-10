const database = require('../../../db');

const songSelect = `
  SELECT DISTINCT
    songs.*,
    curator.first_name as curator_first_name,
    curator.last_name as curator_last_name,
    random() as random
  FROM songs
  LEFT JOIN users AS curator ON curator.id = songs.curator_id
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
  ${joinType} JOIN song_moments ON songs.id = song_moments.song_id
  ${joinType} JOIN moments ON moments.id = song_moments.moment_id
`;

const getSongs = ({ songsLimit, songsOffset, subgenreIds, omitSongIds, isShuffle = false}) => {
      
  let sqlInjectValues = [songsLimit, songsOffset];
  const limitStatement = 'LIMIT $1';
  const offsetStatement = 'OFFSET $2';
  let subgenreIdFilter = '';
  let omitSongIdsFilter = '';

  if (subgenreIds.length > 0) {
    sqlInjectValues.push(subgenreIds);
    subgenreIdsFilter = `WHERE subgenres.id = ANY (\$${sqlInjectValues.length})`;
  }

  if (omitSongIds.length > 0) {
    sqlInjectValues.push(omitSongIds);
    omitSongIdsFilter = `WHERE NOT songs.id = ANY (\$${sqlInjectValues.length})`;
  }

  const orderStatement = isShuffle ?
    'ORDER BY random' :
    'ORDER BY songs.created_at DESC, songs.id';

  const queryText = `(
    ${songSelect}
    ${subgenreIdFilter}
    ${omitSongIdsFilter}
    ${orderStatement}
    ${limitStatement}
    ${offsetStatement}
  )`;

  return database.query({ text: queryText, values: sqlInjectValues })
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

const getRelatedSubgenres = songIds => {
  return database.query({
    text: `
      ${relationSelect('subgenres')}
      ${subgenreJoins('INNER')}
      WHERE songs.id IN (${songIds.map((_,i) => '$' + (i+1)).join(',')})
      ORDER BY songs.id
    `,
    values: songIds
  }).then(result => result.rows);
}

const getRelatedMoments = songIds =>
  database.query({
    text: `
      ${relationSelect('moments')}
      ${momentJoins('INNER')}
      WHERE songs.id IN (${songIds.map((_,i) => '$' + (i+1)).join(',')})
      ORDER BY songs.id
    `,
    values: [...songIds]
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
