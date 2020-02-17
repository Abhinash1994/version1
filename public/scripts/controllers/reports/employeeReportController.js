 angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('employeeReportController', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel) {
    	$scope.filter = {};
	    $scope.filter.date = {startDate: null, endDate: null};
    function loadData(filter){
    	// console.log(filter);
    	$http.post("/role3/report/employee", filter).success(function(response, status){
        	$scope.data = response.data;
            // console.log($scope.data);
			$scope.tableParams = new NgTableParams({ count: 10 }, { counts: [10, 20], dataset: $scope.data});
	    });
    }


    
	    $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
       
      };


 	loadData({});
    //$log.debug('Params : ',$scope.tableParams);
//   $scope.order = [ 'name','appointments','totalCustomers', 'returningCustomers', 'totalRevenue','employeeCommission','unproductiveHours/60','leaves' ];
	$scope.employees=employees;
	$scope.superCategory=services;
	
	$scope.filterApplied=function(){
		var filter = $scope.filter;
		loadData({startDate : filter.date.startDate._d, endDate : filter.date.endDate._d, parlorId : $scope.selectedParlorId });
	};
	
	$scope.superCat=function(){
		$scope.serv=[];
			for(var i=0;i<$scope.filter.superCategory.length;i++){
				for(var j=0;j<$scope.filter.superCategory[i].categories.length;j++){
				$scope.serv.push($scope.filter.superCategory[i].categories[j]);
				}
			}
	};
      $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
	});
	