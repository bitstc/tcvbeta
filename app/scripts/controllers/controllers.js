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
    .controller('DeviceinfoCtrl', function($scope, $cordovaDevice, UtilService ) {
        var init = function() {
            try {
                $scope.cordova = $cordovaDevice.getCordova();
                $scope.model = $cordovaDevice.getModel();
                $scope.platform = $cordovaDevice.getPlatform();
                $scope.uuid = $cordovaDevice.getUUID();
                $scope.version = $cordovaDevice.getVersion();
                $scope.camera = (typeof(Camera) !== 'undefined') ? 'Yes' : 'No';
                $scope.microphone = (!navigator.device.capture) ? 'No' : 'Yes';
                UtilService.checkNetwork(function(network){
                    $scope.networkType = network.networkType;
                    $scope.connectionType = network.connectionType;
                })
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
    .controller('NetworkSpeedCtrl', function($scope,$ionicLoading, NetworkService , UtilService) {
        $scope.showSpeed = "";
        $scope.downloadSpeed = "";
        $scope.toggal = false;
        var checkEligibility = function(uploadSpeed,downloadSpeed) {
            uploadSpeed = parseInt(uploadSpeed.replace(" Mb/s ","")) * 1024;
            downloadSpeed = parseInt(downloadSpeed.replace(" Mb/s ","")) * 1024;
            if(uploadSpeed < 500 && downloadSpeed < 500) {
                $scope.checkNetworkEligibility = "Switch to better network and try again.";
                $scope.inactiveNetworkClass = "inactive";
                $scope.toggal = true;
            } else {
                $scope.checkNetworkEligibility = "Everything seems to be fine.";
                $scope.toggal = true;
            }
        }
        $scope.testSpeed = function() {          
        UtilService.checkNetwork(function(network) {
            $scope.connectionType = network.connectionType;
            if(network.connectionType == "Online") {
                try {
                    NetworkService.downloadFile(function(downloadSpeed) {
                        $scope.downloadSpeed = downloadSpeed;
                        $ionicLoading.hide();
                        NetworkService.uploadFile(function(showSpeed) {
                            $scope.showSpeed = showSpeed;
                            $ionicLoading.hide();
                            checkEligibility($scope.showSpeed,$scope.downloadSpeed);
                        });
                    });    
                } catch(err){
                    //alert("err "+err);
                }
            } else {
                alert("You are offline now, Please check your Network Connection.");
            }
        })
    }
            
});