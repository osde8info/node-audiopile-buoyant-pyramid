angular.module('jam.songs', [])

.controller('SongsController', ['$scope', '$location', 'Songs', 'Auth', 'Groups', function ($scope, loc, Songs, Auth, GR) {
  // When user adds a new link, put it in the collection
  $scope.data = {};
  $scope.user = {};
  $scope.where = 'songs';

  $scope.updateIndex = function(index) {
    Songs.choose(index, $scope.where);
  };

  Auth.getUserData()
  .then(function (user) {
    $scope.user = user;
    $scope.refreshSongs();
    GR.getPlaylistsByGroupId($scope.user.currentGroup.id)
    .then(function (playlists) {
      $scope.data.playlists = playlists;
    });
  })
  .catch(console.error);
  $scope.addToPlaylist = function(playlist) {
    $scope.newSong.playlistId = playlist.id;
    Songs.addSongToPlaylist($scope.newSong.id, playlist.id)
    .then(function (resp) {
      // tell user song was added
    })
    .catch(console.error);
  };

  $scope.toggleAddModal = function () {
    $scope.addModalShown = !$scope.addModalShown;
  };

  $scope.refreshSongs = function() {
    Songs.getAllSongs($scope.user.currentGroupId)
    .then(function(songs) {
      $scope.data.songs = songs;
    })
    .catch(console.error);
  };

  $scope.makeSongPending = function (song, index) {
    $scope.deleteModalShown = true;
    $scope.pendingSong = song;
    $scope.pendingSong.index = index;
  };

  $scope.deleteSong = function(index) {
    var song = $scope.data.songs[index];
    Songs.checkReset(song.id, 'songs');
    Songs.deleteSong(song)
    .then(function() {
      $scope.deleteModalShown = false;
      $scope.data.songs = _.filter($scope.data.songs, function(currentSong) {
        return currentSong.id !== song.id;
      });
    })
    .catch(function (err) {
      $scope.message = 'error: ' + err;
    });
  };
}]);
