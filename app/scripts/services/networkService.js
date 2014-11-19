'use strict';
angular.module('TCV1')
.service('NetworkService', function NetworkService($ionicLoading) {
	var startTime, endTime, timeDiff, totalBytes, speed;
	var downloadUrl = encodeURI("http://71.43.59.189:10026/tcvbeta/download.php");
	var uploadUrl = encodeURI("http://71.43.59.189:10026/tcvbeta/upload.php");
    return {
        // Test download speed 
        downloadFile : function(callback) {
        	startTime = new Date().getTime();
            $ionicLoading.show({
                template: 'Checking Download Speed...'
            });
            try {
                var fileTransfer = new FileTransfer();
                var downLoadFileURL = "file:/storage/emulated/0/Download/SampleVideo.mp4";
                var options = new FileUploadOptions();
                options.headers = {
                    Connection: "close"
                };
                fileTransfer.download(
                    downloadUrl,
                    downLoadFileURL,
                    function(entry) {
                        endTime = new Date().getTime();
                        timeDiff = (endTime - startTime) / 1000;
                        //totalBytes;//need to get values from downloaded file
                        totalBytes = 5652590;
                        speed = (totalBytes / timeDiff) / 1024 / 1024 * 8;
                        speed = Math.round(speed * 100) / 100;
                        callback(speed + " Mb/s ");
                    },
                    function(error) {
                        alert("An error has occurred: Downloading File : Code : " + error.code);
                    }, false, options);
            } catch (err) {
                alert("An error has occurred: Uploading File : " + err);
                $ionicLoading.hide();
            }
        },
        // Test upload speed 
        uploadFile : function(callback) {
            $ionicLoading.show({
                template: 'Checking Upload Speed...'
            });
            startTime = new Date().getTime();
            try {
                var uploadFileURL = 'file:/storage/emulated/0/Download/SampleVideo.mp4';
                var options = new FileUploadOptions();
                options.chunkedMode = false;
                options.fileKey = 'file';
                options.fileName = 'SampleVideo.mp4';
                options.mimeType = 'text/plain';
                options.headers = {
                    Connection: 'close'
                };

                var ft = new FileTransfer();
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                        $scope.showSpeed = (progressEvent.loaded / progressEvent.total);
                    } else {
                        loadingStatus.increment();
                    }
                };
                ft.upload(uploadFileURL, uploadUrl, function(r) {
                    endTime = new Date().getTime();
                    timeDiff = (endTime - startTime) / 1000;
                    totalBytes = r.bytesSent;
                    speed = (totalBytes / timeDiff) / 1024 / 1024 * 8;
                    speed = Math.round(speed * 100) / 100;
                    $ionicLoading.hide();
                    callback(speed + " Mb/s ");
                }, function(error) {
                    alert("An error has occurred: Uploading File : Code : " + error.code);
                    $ionicLoading.hide();
                }, options);
            } catch (err) {
                alert("An error has occurred: Uploading File :" + error);
                $ionicLoading.hide();
            }
        }
    }
  })