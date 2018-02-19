const Prismic = require('prismic.io');
const logger = require('winston');

const redisClient = require('../services/redis.service');


const {
  PRISMIC_API,
  PRISMIC_ACCESS_TOKEN,
  REDIS_CACHE_KEY,
  REDIS_TTL
} = process.env;


const getCachedDocuments = () => {
  return redisClient.getAsync(REDIS_CACHE_KEY)
};

const accessDocuments = (api, token) => {
  return Prismic.api(api, { accessToken: token });
};

const queryDocument = (api) => {
  return api.query(
    Prismic.Predicates.at('document.type', 'main')
  );
};

const filterData = (response) => {
  const { results } = response;

  if (results.length > 0 && results[0].data) {
    return Promise.resolve(results[0].data['main.songlist'].value);
  }

  return Promise.reject(new Error('SONG_NOT_FOUND'));
};

const cacheData = (docs) => {
  return redisClient.setAsync(REDIS_CACHE_KEY, JSON.stringify(docs), 'EX', REDIS_TTL)
    .then(() => docs);
}

const getAllSongs = () => {
  return getCachedDocuments()
    .then((docs) => {
      return docs
        ? JSON.parse(docs)
        : accessDocuments(PRISMIC_API, PRISMIC_ACCESS_TOKEN)
            .then(queryDocument)
            .then(filterData)
            .then(cacheData);
    });
};

module.exports = getAllSongs;