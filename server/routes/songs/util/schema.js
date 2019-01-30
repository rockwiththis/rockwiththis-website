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

const getAllRelationQueries = getQueryByRelation => 
  Object.keys(songsWriteSchema.relations).map(relationName => {
    if (!params[relationName] || params[relationName].length == 0)
      return null;

    const { joinTable, db } = songsWriteSchema.relations[relationName];

    return getQuery(relationName, joinTable, db).then(database.query);
  });

module.exports = {
  getMissingRequiredFields,
  getDbFieldValues,
  getAllRelationQueries
};
