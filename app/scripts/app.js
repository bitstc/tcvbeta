'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('TCV1', ['ionic', 'config', 'TCV1.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: false,
            templateUrl: 'templates/menu.html'
        })
        .state('app.main', {
            url: '/main',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main.html',
                    controller: 'MainCtrl'
                }
            }
        })
        .state('app.deviceinfo', {
            url: '/deviceinfo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/deviceinfo.html',
                    controller: 'DeviceinfoCtrl'
                }
            }
        })
        .state('app.camera', {
            url: '/camera',
            views: {
                'menuContent': {
                    templateUrl: 'templates/camera.html',
                    controller: 'CameraCtrl'
                }
            }
        })
        .state('app.capturepic', {
            url: '/capturepic',
            views: {
                'menuContent': {
                    templateUrl: 'templates/capturepic.html',
                    controller: 'CapturPicCtrl'
                }
            }
        })
        .state('app.capturevideo', {
            url: '/capturevideo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/capturevideo.html',
                    controller: 'CaptureVideoCtrl'
                }
            }
        })
        .state('app.networkspeed', {
            url: '/networkspeed',
            views: {
                'menuContent': {
                    templateUrl: 'templates/networkspeed.html',
                    controller: 'NetworkSpeedCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');
});
document.addEventListener('deviceready', function() {
    console.log('Device is ready ... ');
}, false);