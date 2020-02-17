angular.module('sbAdminApp',['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
.controller("onlinePaymentCtrl",function($scope,$http){

	$http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){
            // console.log(response);
            $scope.parlorList=response.data;
        });

		

   var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
  		$scope.dateSelected=function(){
            // console.log($scope.dateRangeSelected);
		}

        $scope.updateParlorsSelected=function()
        {

        			// console.log($scope.parlorsSelected);
        }

        $scope.apply=function()
        {


        }

})