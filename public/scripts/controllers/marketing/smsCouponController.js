'use strict';
/**
 * @ngdoc function refreshSelectedItems()
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select'])
  .controller('smsCoupon',['$scope','$http','NgTableParams', function($scope, $http, NgTableParams) {
    // console.log('sms marketing controller');
      $http.post("/role1/parlorList").success(function(response, status){
          $scope.parlors = response.data;
          // console.log($scope.parlors);
      });

      $scope.istevenMultiSelect={}
      $scope.chCount=0;
      $scope.messageCount=0;
      $scope.messagedata= messagedata;
      var index = 0;
      $scope.messsageused = {};
      var store = {
          counts : [],
          dataset: $scope.data
      };
      function messagedata(){
          var mdate= $scope.data;
      }
      $scope.messagecount=function(){
          $scope.mc=($scope.sms.message.length/160);
          $scope.mc=Math.ceil($scope.mc);
      };


      $scope.activities=[{name:"No appts in three months (Male)",value:"apptThreeMonthsMale"},{name:"No appts in three months (Female)",value:"apptThreeMonthsFemale"},{name:"Inactive Salons Customer (Male)",value:"inactiveMale"},{name:"Inactive Salons Customer (Female)",value:"inactiveFemale"}];
		// var page = 1;
      // console.log($scope.activities);
      $http.post("/role1/allParlors").success(function(response, status){
        $scope.parlors = response.data;
        // console.log($scope.parlors);
      });

		// $scope.mcount=function(){
		// 	$scope.mc=($scope.sms.message.length/160);
		// 	$scope.mc=Math.ceil($scope.mc);
		// };

		// $scope.dateChanged=function(){
		// 	$scope.smsUsed = {};
		// 	var d = new Date();
		// 	document.write('Today is: ' + d.toLocaleString());
        //
		// 	d.setDate(d.getDate() - 5);
        //
		// 	document.write('<br>5 days ago was: ' + d.toLocaleString());
		// };

		// $scope.sms={};
		// $scope.sms.lastApptDate = moment(new Date()).format();
		// $scope.filterchanged = function(){
		// 	$scope.smsUsed = {};
		// 	$scope.sms.lastApptDate = new Date();
		// 	$scope.sms.lastApptDate.setDate($scope.sms.lastApptDate.getDate() - $scope.da);
		// 		console.log($scope.sms);
		//       $http.post("/role3/marketing/target", $scope.sms).success(function(response, status){
         //      $scope.result=(response.data);
         //      console.log($scope.result);
         //    });
        //
		// };

		// $scope.send = function(){
		// 	$scope.smsData = {numbers : $scope.result.users.map(function(u){ return u.phoneNumber; }), message : $scope.sms.message };
		// 	console.log($scope.smsData);
		// 	$http.post("/role3/marketing/sendSms", $scope.smsData).success(function(response, status){
         //      	$scope.result= {};
         //      	$scope.smsData = {};
         //      	$scope.sms = {};
         //      	$scope.smsRemaining = response.data.smsRemaining
         //      	$scope.smsUsed.value = response.data.smsUsed;
         //    });
		// };


      $scope.send=function(){
          var a=[]
          $scope.salons.forEach(function(em){
              a.push(em.parlorId);
          })

          $scope.smsData={message:$scope.sms.message,appActivity:$scope.appActivity,parlorIds:a,testingNumber:$scope.testingNumber};
          // console.log(JSON.stringify($scope.smsData));
          $http.post("/role1/couponCodeSms",$scope.smsData).success(function(response){
              // console.log(response)
              angular.forEach( $scope.parlors, function( value, key ) {
                  value[ 'ticked' ] = false;
              });
              alert(response.data);
          })
      }

  }]);

