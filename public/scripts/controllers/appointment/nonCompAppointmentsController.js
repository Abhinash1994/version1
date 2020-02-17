angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('nonCompAppointmentsCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,$rootScope,$filter) {
	
	$scope.employees=employees;
	// console.log($scope.employees);
	$scope.filterEmployees=[];
	$scope.filterServices=[];
	$scope.services=services;
	$scope.categories = [];
	$scope.query={'term':''};
	var globalData='';
    function getAppointmentList(){
    	$http.get("/role1/appointmentList").success(function(response, status){
        // console.log(response.data);
        $scope.data = response.data;
        globalData=angular.copy(response.data)
        // console.log($scope.data);
		$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data,filter:$scope.query},
			{
		      total: $scope.data.length,
		      getData: function($defer, params) {
		          // console.log('here')
		        var orderedData;
		        
		          if (params.filter().term) {
		            orderedData = params.filter() ? $filter('filter')($scope.data, params.filter().term) : $scope.data;
		          } else {
		            orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
		          }
		          
		        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        
		      }
			});
	    });
    };
    getAppointmentList();
    $scope.data = [];
    //$log.debug('Params : ',$scope.tableParams);
	$scope.order = [ 'date','noOfAppointments','totalRevenue', 'totalServices', 'totalProducts','totalMemberships','package','totalTax' ];
	$scope.employees=employees;
	$scope.superCategory=services;
	$scope.filter={};
	 
	$scope.closeAppointment=function(appt){
        var num = [appt.client.phoneNumber];
        // console.log(appt);
        $scope.msg = "Hi "+appt.client.name+", Your bill summary for services is Rs."+ appt.payableAmount+". Download our APP to avail a trendy haircut Absolutely FREE here: http://onelink.to/bf45qf ."
       
       $rootScope.$broadcast("sendSMSEvent", {message: $scope.msg, numbers : num , type : "T", otp: '', parlorId : appt.parlorId});
        
        var apptId  = appt.appointmentId;
        // console.log(apptId);
		var data = {
                appointmentId: apptId,
                status: 3
            };
        // console.log(appt);
		$http.post('/role1/changeAppointmentStatus', data)
           .success(function (data, status, headers) {
               // console.log("appointment closed");
               getAppointmentList();
				/*$http.get("/role1/appointmentList").success(function(response, status){
				console.log(response.data);
				$scope.data = response.data;
				$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data});
			});*/
           })
	};
	$scope.filterTable=function(filterVar){
		$scope.data=angular.copy(globalData);
		$scope.data = $filter('filter')($scope.data,$scope.query.term);
		$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data,filter:$scope.query});
	}
	});
	