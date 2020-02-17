angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('serviceReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams) {
	
	

    $scope.employees=employees;
	// console.log($scope.data);
    $scope.superCategory=services;

    function loadData(query){
        // console.log(query);
        $http.post("/role3/report/service", query).success(function(response, status){
            // console.log(response.data);
            $scope.data = response.data;
        });  
    }
	 
    $scope.filterApplied=function(){
        var filter = $scope.filter;
        var emp = [];
        filter.employees.forEach(function(e){
            emp.push(e.userId);
        });
        loadData({startDate : filter.date.startDate._d, endDate : filter.date.endDate._d, employees : emp});
    };

    $scope.superCat=function(){
        $scope.serv=[];
        for(var i=0;i<$scope.filter.superCategory.length;i++){
            for(var j=0;j<$scope.filter.superCategory[i].categories.length;j++){
                $scope.serv.push($scope.filter.superCategory[i].categories[j]);
            }
        }
    };

	var parameters = {
        page : 1
    };

    var settings = {
        counts : [],
        dataset: $scope.data,
      groupOptions: {
        isExpanded: false
      }
    };

    $scope.tableParams = new NgTableParams(parameters, settings);

	/*$scope.sum=function (data1, field){
		var sum=0;
		for(var i=0;i<data1.length;i++)
		{	
			sum=sum+data1[i][field];
			console.log("chala");	
			console.log("chala");	
		}
		return sum;
    };*/
	
	
	
	
	});