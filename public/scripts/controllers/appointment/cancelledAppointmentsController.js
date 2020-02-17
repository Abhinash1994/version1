angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('cancelledAppointmentsCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel) {
	
	
	$scope.employees=employees;
	// console.log($scope.employees);
	$scope.filterEmployees=[];
	$scope.filterServices=[];
	$scope.services=services;
	$scope.categories = [];
//    var today=new Date();
//        $scope.dateRangeSelected={
//            startDate:{'_d':null},
//            endDate:{'_d':null}
//        }
    $http.get("/role1/cancelledAppointments").success(function(response, status){
         console.log(response.data);
        $scope.data = response.data;
		$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data});
    });
    $scope.data = [];
    //$log.debug('Params : ',$scope.tableParams);
	$scope.order = [ 'date','noOfAppointments','totalRevenue', 'totalServices', 'totalProducts','totalMemberships','package','totalTax' ];
	$scope.employees=employees;
	$scope.superCategory=services;
	$scope.filter={};
	$scope.filter.date= {
        startDate: null,
        endDate: null
						};
    
    
 
	$scope.applyFilter=function(){
		// console.log($scope.filter.date.startDate._d);
		// console.log($scope.filter.date.endDate._d);
		//console.log($scope.dateRangeSelected);
          $http.get("/role1/cancelledAppointments?startDate="+$scope.filter.date.startDate._d+"&endDate="+$scope.filter.date.endDate._d
            ).success(function(response, status){
        // console.log(response.data);
        $scope.data = response.data;
		$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data});
    });
	};
       $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
	});
	