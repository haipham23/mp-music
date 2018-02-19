const Rp = require('chat-rp');

const getAllSongs = require('../apis/getAllSongs');

const rp = new Rp([
  'SONG_NOT_FOUND'
]);

const routes = [{
  method: 'get',
  path: '/api/health-check',
  func: (req, res) => rp.ok(res, 'ok')
}, {
  method: 'get',
  path: '/api/songs',
  func: (req, res) =>
    getAllSongs()
      .then(songs => rp.ok(res, songs))
      .catch(error => rp.error(res, error))
}]

module.exports = routes;