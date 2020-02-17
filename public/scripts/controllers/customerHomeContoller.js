'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('CustomerHomeCtrl', function($scope, $http, $stateParams, $window,NgTableParams) {
    $scope.userName = $stateParams.userName;
    $scope.userId = $stateParams.userId;
    $scope.memberships = memberships;
    $scope.newUser = {};

    getCustomer();


    function getCustomer(){
      $http.post("/role3/customer", {userId : $scope.userId}).success(function(response, status){
        $scope.user = response.data;
        console.log( "hi",$scope.user);
           app=$scope.user.appointments;
            console.log(app);
        $scope.tableParams = new NgTableParams({ count: 10 }, { counts: [5, 10, 20], dataset: app});
    });
    }

    $scope.back = function(){
        $window.history.back();
    }

    $scope.openEditCustomer = function(){
          console.log(status);

       $http.get("/role3/customer?userId=" + $scope.userId).success(function(response, status){
          $scope.newUser = response.data.user;
           console.log($scope.newUser);
          
          $("#editCustomer").modal('show');
        });
        
    };
    $scope.apptStatus=function(status){
        if(status==1)
            return "Appointment Booked"
            else if(status==2)
                return "Appointment Cancelled"
            else if(status==3)
                    return "Appointment Completed"
            else if(status==4)
                        return "Appointment Started"    
          
    };
    $scope.editCustomer = function(){
      $scope.newUser.userId = $scope.userId;
        $http.post("/role2/editCustomer", $scope.newUser).success(function(response, status){
          if(response.success){
              $('#editCustomer').modal('hide');
              getCustomer();
          }
      });
    };

    $scope.update = function(){
      $scope.data.userId = $scope.userId
      $http.post("/role2/membershipCustomer", $scope.data).success(function(response, status){
          $scope.user = response.data;
          if(response.success){
              console.log(response.data);
              $scope.user.membership = response.data.membership;
              $scope.user.credits = response.data.credits;
              $('#addMembershipToCustomer').modal('hide');
              $scope.data = {};
          }
      });
	  console.log($scope.data);
    };

    $scope.removeMembership = function(){
      $scope.data = {};
      $scope.data.userId = $scope.userId;
      $scope.data.membershipId = $scope.user.membership.membershipId;
      $http({
    method: 'DELETE',
    url: '/role2/membershipCustomer',
    data: $scope.data,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
})
      .success(function(response, status){
          $scope.user = response.data;
          if(response.success){
              $scope.user.membership = response.data;
          }
      });
    }
  });
