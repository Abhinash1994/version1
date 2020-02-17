angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('revenueReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams) {
	
	//console.log(employees)
	$scope.employees=employees;
   

    
	var today=new Date();
	//console.log($scope.employees);
	$scope.filterEmployees=[];
	$scope.filterServices=[];
	$scope.services=services;
	$scope.categories = [];
        $scope.filter = {};
        $scope.filter.date = {startDate: null, endDate: null};
        function loadData(filter) {
        	//console.log(filter);
            $http.post("/role3/report/revenue",filter).success(function (response, status) {
              //  console.log(response.data)
                $scope.data = response.data;
                $scope.tableParams = new NgTableParams({count: 10}, {counts: [10, 20], dataset: $scope.data});
            });
        }
        function initialFilter(){
            var filter = $scope.filter;
           // console.log(filter);
            var emp = [];
            employees.forEach(function(e){
                emp.push(e.userId);
            });
            loadData({startDate : new Date(today.getFullYear(),today.getMonth(),0,0,0), endDate : new Date(today.getFullYear(),today.getMonth(),23,59,59), employees : emp});
		}
		initialFilter();

    $scope.data = [];
    //$log.debug('Params : ',$scope.tableParams);
	$scope.order = [ 'date','noOfAppointments','totalRevenue', 'totalServices', 'totalProducts','totalMemberships',
'totalLoyalityPoints'
 ];
	$scope.employees=employees;
	$scope.superCategory=services;

	$scope.filterApplied=function(){
        var filter = $scope.filter;
       // console.log(filter);
        var emp = [];
        filter.employees.forEach(function(e){
        	emp.push(e.userId);
        });
        loadData({startDate : filter.date.startDate._d, endDate : filter.date.endDate._d, employees : emp, parlorId : $scope.selectedParlorId});
	};
	
	$scope.superCat=function(){
		$scope.serv=[];
			for(var i=0;i<$scope.filter.superCategory.length;i++){
				for(var j=0;j<$scope.filter.superCategory[i].categories.length;j++){
				$scope.serv.push($scope.filter.superCategory[i].categories[j]);
				}
			}
	};


    
        $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;
 $http.post("/role3/employeesByParlor",{parlorId : $scope.selectedParlorId}).success(function(response, status){
            employees = response.data;
    $scope.employees=employees;
        });
        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
         $http.post("/role3/employeesByParlor", {parlorId : $scope.selectedParlorId}).success(function(response, status){
            employees = response.data;
    $scope.employees=employees;
        });
      };
    
	});
	