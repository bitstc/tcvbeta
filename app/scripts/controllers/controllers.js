'use strict';
angular.module('TCV1.controllers', [])

/**
 *  Main Page controllers
 */
.controller('MainCtrl', function($scope, $location) {
        $scope.goTo = function(page) {
            $location.path("/app/" + page);
        }
    })

    /**
     * Device controllers
     * Purpose : to display device information like model,version etc
     */
    .controller('DeviceinfoCtrl', function($scope, $cordovaDevice, $cordovaNetwork) {
        var init = function() {
            try {
                $scope.cordova = $cordovaDevice.getCordova();
                $scope.model = $cordovaDevice.getModel();
                $scope.platform = $cordovaDevice.getPlatform();
                $scope.uuid = $cordovaDevice.getUUID();
                $scope.version = $cordovaDevice.getVersion();
                $scope.camera = (typeof(Camera) !== 'undefined') ? 'Yes' : 'No';
                $scope.microphone = (!navigator.device.capture) ? 'No' : 'Yes';
                var checkNetwork = function() {
                    $scope.networkType = $cordovaNetwork.getNetwork();
                    if ($cordovaNetwork.isOnline() === true) {
                        $scope.connectionType = 'Online';
                    } else if ($cordovaNetwork.isOffline() === true) {
                        $scope.connectionType = 'Offline';
                    } else {
                        $scope.errorMsg = 'Error getting isOffline / isOnline methods';
                    }
                };
                $scope.refreshNetwork = function() {
                    checkNetwork();
                };
                checkNetwork();
            } catch (err) {
                console.log('Error ' + err.message);
            }
        };
        if (typeof(device) !== 'undefined') {
            $scope.deviceAvailbility = ' Device is detected ';
            init();
        } else {
            $scope.deviceAvailbility = ' Device is not detected ';
        }
    })
    /**
     * Camera controllers
     * Purpose : to display Camera availability and camera options
     */
    .controller('CameraCtrl', function($scope, $location) {
        if (typeof(Camera) !== 'undefined') {
            $scope.cameraAvailbility = ' Camera is detected ';
        } else {
            $scope.cameraAvailbility = ' Camera is not detected ';
        }
        $scope.goTo = function(page) {
            $location.path('/app/' + page);
        }
    })
    /**
     * Capture Picture controllers
     * Purpose : capture picture and display on screen
     */
    .controller('CapturPicCtrl', function($scope, $cordovaCamera) {
        var startCapturing = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                //popoverOptions: CameraPopoverOptions, //iOS-only options that specify popover location in iPad. Defined in CameraPopoverOptions.
                //cameraDirection is not working for android always shows back camera , reference from cordova core lib
                //cameraDirection : Camera.Direction.FRONT,
                MediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(imageURL) {
                $scope.cameraimage = imageURL;
            }, function(err) {
                console.log('Failed because: ' + err);
            });
        }
        $scope.tryAgain = function() {
            startCapturing();
        };
        startCapturing();
    })
    /**
     * Capture Video controllers
     * Purpose : capture video and play recorded video
     */
    .controller('CaptureVideoCtrl', function($scope, $cordovaCamera, $cordovaCapture, $cordovaMedia) {
        var startRecording = function() {
            var options = {
                limit: 1,
                duration: 5
            };
            $cordovaCapture.captureVideo(options).then(function(mediaFiles) {
                var i, path, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    $scope.videopath = mediaFiles[i].fullPath;
                    var video = document.getElementById('video');
                    var source = document.getElementById('source');
                    source.setAttribute('src', $scope.videopath);
                    video.load();
                }
            }, function(err) {
                console.log("err " + err);
            });
        };
        $scope.recordVideo = function() {
            startRecording();
        };
        startRecording();
    })
    /**
     * Network speed controllers
     * Purpose : test download and upload speed
     */
    .controller('NetworkSpeedCtrl', function($scope, $cordovaCapture, $cordovaMedia, $ionicLoading) {
        var startTime, endTime, timeDiff, totalBytes, speed;
        $scope.showSpeed = "";
        $scope.downloadSpeed = "";

        // Test upload speed 
        var uploadFile = function(callback) {
                $ionicLoading.show({
                    template: 'Uploading...'
                });
                startTime = new Date().getTime();
                try {
                    var uri = encodeURI("http://192.168.1.43:8080/technologychecker/test/upload.php");
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
                        } else {
                            loadingStatus.increment();
                        }
                    };
                    ft.upload(uploadFileURL, uri, function(r) {
                        endTime = new Date().getTime();
                        timeDiff = (endTime - startTime) / 1000;
                        totalBytes = r.bytesSent;
                        speed = (totalBytes / timeDiff) / 1024 / 1024 * 8;
                        speed = Math.round(speed * 100) / 100;
                        $scope.showSpeed = speed + " Mb/s ";
                        $ionicLoading.hide();
                        callback();
                    }, function(error) {
                        alert("An error has occurred: Uploading File : Code : " + error.code);
                        $ionicLoading.hide();
                    }, options);
                } catch (err) {
                    alert("An error has occurred: Uploading File :" + error);
                    $ionicLoading.hide();
                }
            }
            // Test download speed 
        var downloadFile = function(callback) {
            startTime = new Date().getTime();
            $ionicLoading.show({
                template: 'Downloading...'
            });
            try {
                var fileTransfer = new FileTransfer();
                var uri = encodeURI("http://192.168.1.43:8080/technologychecker/test/download.php");
                var downLoadFileURL = "file:/storage/emulated/0/Download/SampleVideo.mp4";
                var options = new FileUploadOptions();
                options.headers = {
                    Connection: "close"
                };

                fileTransfer.download(
                    uri,
                    downLoadFileURL,
                    function(entry) {
                        //alert("download complete: " + entry.toURL());
                        endTime = new Date().getTime();
                        timeDiff = (endTime - startTime) / 1000;
                        //totalBytes;//need to get values from downloaded file
                        totalBytes = 10252878;
                        speed = (totalBytes / timeDiff) / 1024 / 1024 * 8;
                        speed = Math.round(speed * 100) / 100;
                        $scope.downloadSpeed = speed + " Mb/s ";
                        
                        callback();
                    },
                    function(error) {
                        alert("An error has occurred: Downloading File : Code : " + error.code);
                    }, false, options);
            } catch (err) {
                alert("An error has occurred: Uploading File : " + err);
                $ionicLoading.hide();
            }
        }

        $scope.testSpeed = function() {
            downloadFile(function() {
                $ionicLoading.hide();
                uploadFile(function() {
                    $ionicLoading.hide();
                });
            });            
        }
    });