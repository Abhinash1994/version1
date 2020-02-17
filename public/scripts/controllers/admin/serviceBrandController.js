'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('serviceBrandCtrl', function($scope,$position, $http,$state) {
    $scope.parlors = [];
    $scope.p = {};
    $scope.sms = {};
    var index = 0;
    

    $scope.owners = [];
    $http.get("role1/serviceBrand").success(function(response, status){
        $scope.serviceProducts = response.data.brands;
        // console.log($scope.serviceProducts);
      });

    $scope.addNewServiceProduct=function(){
        $('#addNewServiceProduct').modal('show');
    }

    $scope.submitNewServiceProduct=function(){
        // console.log($scope.p);
        $http.post("role1/serviceBrand",{'name':$scope.p.name}).success(function(response, status){
        $scope.serviceProducts.push(angular.copy($scope.p))
        // console.log(response);
        $scope.p.name='';
         $('#addNewServiceProduct').modal('hide');
      });
    }

    /*$scope.updateParlor = function(idx){
        // $scope.p.tax = $scope.parlors[idx].tax;
    	// $scope.p.smscode = $scope.parlors[idx].smscode;
         $scope.p.parlorId = $scope.parlors[idx].parlorId;
        // $scope.p.logo = $scope.parlors[idx].logo;
        // $scope.p.latitude = $scope.parlors[idx].latitude;
        // $scope.p.longitude = $scope.parlors[idx].longitude;
    	// $scope.p.gender = $scope.parlors[idx].gender;
    	// index = idx;
        // $('#editParlor').modal('show');
		$state.go('dashboard.editSalon', {parlorId: $scope.p.parlorId});
		
    };

    $scope.showOwners = function(idx){
        index = idx;
        $('#owners').modal('show');
    };

    $scope.addOwner = function(){
        console.log({parlorId : $scope.parlors[index].parlorId, ownerId : $scope.newOwner});
        $http.post("/role1/addOwnerToParlor", {parlorId : $scope.parlors[index].parlorId, ownerId : $scope.newOwner}).success(function(response, status){
            var owner = getOwner($scope.newOwner);
            $scope.parlors[index].ownerName = owner.name;
            $scope.parlors[index].ownerPhoneNumber = owner.phoneNumber;
            $scope.newOwner = {};
            $('#owners').modal('hide');
      });
    };

    function getOwner(userId){
        var owner = {};
        $scope.owners.forEach(function(o){
            if(userId == o.userId)owner = o;
        });
        return owner;
    }

    $scope.editParlor = function(){
    	 $http.post("/role1/updateParlor", $scope.p).success(function(response, status){
            $scope.parlors[index].tax = response.data.tax;
            $scope.parlors[index].smscode = response.data.smscode;
            $scope.parlors[index].logo = response.data.logo;
            $scope.parlors[index].latitude = response.data.latitude;
            $scope.parlors[index].longitude = response.data.longitude;
        	$scope.parlors[index].gender = response.data.gender;
        	$scope.p = {};
        	$('#editParlor').modal('hide');
      });
    }

    $scope.showAddCredit = function(idx){
        $scope.sms.parlorId = $scope.parlors[idx].parlorId;
        index = idx;
        $('#addSmsCredit').modal('show');
    };

    $scope.addSmsCredit = function(){
        var credit = $scope.sms.credit;
        $http.post('role1/addSmsCredit', $scope.sms).success(function(response, status){
            $scope.parlors[index].smsCredits = response.data.smsCredits;
            $scope.sms = {};
            $('#addSmsCredit').modal('hide');
        });
    }*/
  });
