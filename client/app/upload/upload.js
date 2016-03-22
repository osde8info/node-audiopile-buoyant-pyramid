angular
  .module('jam.upload', [])
  .controller('UploadController', ['$scope', 'Upload', 'UploadFactory', 'ngProgressFactory', 'Auth', 'Songs', '$http', function($scope, Upload, UploadFactory, ngProgressFactory, Auth, Songs, $http) {
    
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.upload = UploadFactory.upload;


    var totalToUpload = 0;
    var totalUploaded = 0;
    var totalPercent = 0;

    var findTotalPercent = function() {
      var total = 0;
      for (var i = 0; i < $scope.queue.length; i++) {
        if ($scope.queue[i].progressPercentage) {
          total += $scope.queue[i].progressPercentage;
        }
      }

      totalPercent = Math.ceil(total / (totalToUpload));
      console.log('Total percent progress bar: ========== ', totalPercent);

      $scope.progressbar.set(totalPercent);
      if (totalPercent === 100) {
        $scope.progressbar.complete();
      }   
    };

    var throttledTotal = _.throttle(findTotalPercent, 250);

    $scope.addToQueue = function(files) {
      for (file in files) {
        var thisFile = files[file];
        thisFile['queueId'] = Math.floor( Math.random() * 10000000 );
        $scope.queue.push(thisFile);
      }
    };

    $scope.queue = [];
    
    $scope.removeFile = function(index) {
      if (index > -1) {
        $scope.queue.splice(index, 1);
      }
    };

    var progressCallback = function(file, evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      file['progressPercentage'] = progressPercentage;
      throttledTotal();
    };


    // for multiple files:
    $scope.uploadFiles = function() {
      $scope.progressbar.set(0);
      if ($scope.queue && $scope.queue.length) {
        totalToUpload = $scope.queue.length;
        totalUploaded = 0;
        for (var i = 0; i < $scope.queue.length; i++) {
          UploadFactory.upload($scope.queue[i], 'audio/', console.log, console.error, progressCallback);
        }
      }
    };
  }]);
