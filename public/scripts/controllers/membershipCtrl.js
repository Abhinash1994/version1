'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
app.controller('membershipCtrl',function($scope,$log,$timeout, $http, $state) {

    $scope.memberships = [];

    $http.get("/role2/membership").success(function(response, status){
        $scope.memberships = response.data;
        console.log(response.data);
    });

  $scope.addMembershipType = function(){
      $http.post("/role2/membership", $scope.data).success(function(response, status){
          $scope.memberships.push(response.data);
          memberships = $scope.memberships;
          $scope.data = {};
          $('#addMembershipType').modal('hide');
        });
  };

  $scope.openMembershipDetail = function(membershipId, name){
      $state.go('dashboard.membership-detail', {membershipId: membershipId, name : name});
  };


  $scope.isTableVisible = false;

  var parameters = {
    page : 1
  };

  var settings = {
    counts: [],
    dataset: $scope.memberships
  };

  $scope.tableParams = new NgTableParams(parameters,settings);

  $scope.getMembershipById =function(membershipId,membershipName){
    $scope.isTableVisible = true;
    $scope.customers = [];
    $scope.membershipName = membershipName;
    $http.get("/role2/membershipCustomer?membershipId=" + membershipId).success(function(response, status){
        $scope.customers = response.data;
        console.log("Data",response.data);
    });
  }

  $scope.openCustomerDetail = function(userId, name){
        $state.go('dashboard.customer-home', {userId : userId, userName : name});
    };

});
