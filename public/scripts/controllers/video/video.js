'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('videoCtrl', function($scope,$position, $http, $state,NgTableParams) {
    $scope.link="http://vjs.zencdn.net/v/oceans.mp4";
    angular.element(document.getElementById('my-player')).attr('src', $scope.link)
    $scope.playerReady= function(){
        
        var options = {};
        var player = videojs('my-player', options, function onPlayerReady() {
            videojs.log('Your player is ready!');
            // In this context, `this` is the player that was created by Video.js.
            this.play();
            

            // How about an event listener?
            this.on('ended', function() {
                videojs.log('Awww...over so soon?!');
                // console.log("Video Ended");
            });
        });
    }
    
    
})