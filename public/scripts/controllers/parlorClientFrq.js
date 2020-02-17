'use strict';

angular.module('sbAdminApp', ['isteven-multi-select','ui.bootstrap','daterangepicker','ngMap','ngSanitize','ngTable','uiGmapgoogle-maps'])
.controller('parlorClientFrq', function($scope,$http,$timeout,Excel) {

   console.log("hello parlor client frequency")
   $http.get('/role1/getParlorsClientsFrequency').then(function(res){
      console.log(res);
      $scope.parlorClient=res.data;
      console.log($scope.parlorClient);
      
      
      
   })

});
