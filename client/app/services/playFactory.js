angular.module('jam.playFactory', [])
.factory('Playlists', ['$http', function(http) {
  var createPlaylist = function (playlist) {
    // takes an object with a title and optional description
    return http({
      method: 'POST',
      url: '/api/playlists/',
      data: playlist
    })
    .then(function (res) {
      return res.data;
    });
  };

  var addSongToPlaylist = function (songId, plId) {
    // takes a playlist id and a song obj
    return http({
      method: 'POST',
      url: '/api/playlists/' + songId + '/' + plId + '/'
    })
    .then(function (res) {
      return res.data;
    });
  };

  var getPlaylistSongs = function (id) {
    return http({
      method: 'GET',
      url: '/api/playlists/' + id + '/'
    })
    .then(function (res) {
      return res.data;
    });
  };

  var deleteFromPlaylist = function (sId, plId) {
    // Takes a playlist object with the song removed
    console.log('ID to delete: ', plId, sId);
    return http({
      method: 'DELETE',
      url: '/api/playlists/' + sId + '/' + plId + '/',
    })
    .then(function (res) {
      return res.data;
    });
  };

  var deletePlaylist = function (id) {
    return http({
      method: 'DELETE',
      url: '/api/playlists/' + id + '/' 
    })
    .then(function (res) {
      return res.data;
    });
  };

  return {
    createPlaylist: createPlaylist,
    addSongToPlaylist: addSongToPlaylist,
    getPlaylistSongs: getPlaylistSongs,
    deleteFromPlaylist: deleteFromPlaylist,
    deletePlaylist: deletePlaylist
  };
}])

.factory('Player', ['ngAudio', '$timeout', function (audio, t) {
  // use the observer pattern to watch for changes in the queue or song
  var observerCallbacks = [];

  //register an observer
  var registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  //call this when something chages
  var notifyObservers = function() {
    angular.forEach(observerCallbacks, function(callback) {
      callback();
    });
  };

  // songs in the queue
  var songQueue = ["http://mattyluv.com/mp3/hickey_firstlp/Hickey%20-%2001%20-%20Believe.mp3", "http://mattyluv.com/mp3/hickey_firstlp/Hickey%20-%2011%20-%20In%20The%20Beginning.mp3"];
  // index of the current song playing
  var soundIndex = 1;

  // load next song on song end
  var sounds = songQueue.map(function(url) {
    return audio.load(url);
  });
  sounds.updated = Date.now();

  var updateQueueByUser = function (userId) {
    // get the songs and set the song queue
  };

  var updateQueueByPlaylist = function (playlistId) {
    // get the songs and set the queue
  };

  var updateIndex = function() {
    if (soundIndex < sounds.length) {
      soundIndex++;
    } else {
      soundIndex = 0;
    }
    console.log(soundIndex);
    notifyObservers();
  };

  return {
    sounds: sounds,
    soundIndex: soundIndex,
    updateQueueByUser: updateQueueByUser,
    updateQueueByPlaylist: updateQueueByPlaylist,
    updateIndex: updateIndex,
    registerObserverCallback: registerObserverCallback
  };
}]);