angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('dailySummaryCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams) {
		
	
	$scope.makeCSVData = makeCSVData;
   /* $scope.data = [{"unit":"Beauty","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Hair","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Nail","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Spa","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Massage","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Mani Pedi","service":100,"package":20,"product":10,"membership":200,"advance":20,"totalRevenue":350,"totalTax":30},
					{"unit":"Total","service":600,"package":120,"product":60,"membership":1200,"advance":120,"totalRevenue":2100,"totalTax":180},];*/
	
	$scope.allParlors = allParlors;
	$scope.selectedParlorId = parlorId;
	$scope.role = role;
	
	$scope.format = 'shortDate';
	$scope.date=new Date();
	$scope.popup1={};
	$scope.open1 = function() {
    $scope.popup1.opened = true;
	};
	$scope.changeParlor = function(pId){
		$scope.selectedParlorId = pId;
		$http({
		method: 'POST',
		url: '/role3/report/daily',
		data: {
			date: $scope.date,
			parlorId : $scope.selectedParlorId,
		}
		}).success(function(response, status){
            $scope.data = response.data;
            // console.log(response);
			// $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
    });	
	};
	$scope.dateChanged=function(date1){
	$http({
		method: 'POST',
		url: '/role3/report/daily',
		data: {
			date: date1,
			parlorId : $scope.selectedParlorId,
		}
		}).success(function(response, status){
            $scope.data = response.data;
            // console.log(response);
			// $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
    });	
	}
	$scope.dateChanged($scope.date);
	
	$scope.filter={};
	$scope.filter.date= {
        startDate: null,
        endDate: null
						};
    var index = 0;
    var parameters = {
        page : 1
    };

    var settings = {
        counts : [],
        dataset: $scope.data
    };

    $scope.tableParams = new NgTableParams(parameters, settings);
    //$log.debug('Params : ',$scope.tableParams);
    function makeCSVData(){
        var csvData = $scope.data;
        csvData.unshift({name:'name', id:'Product Id',sp:'Selling Price',bb:'Best Before(months)',cap:'Capacity'});
        return csvData;
    }
	$scope.employees=employees;
	$scope.superCategory=services;
	$scope.filterApplied=function(){
		// console.log($scope.filter);
	};
	
	$scope.superCat=function(){
		$scope.serv=[];
			for(var i=0;i<$scope.filter.superCategory.length;i++){
				for(var j=0;j<$scope.filter.superCategory[i].categories.length;j++){
				$scope.serv.push($scope.filter.superCategory[i].categories[j]);
				}
			}
	};



    
    $scope.sendToEmail = function(){
        // console.log("email called");
       $http.post("/role3/sendDailyReportEmail").success(function(response, status){
        $scope.msg = response;
           // console.log(response);

           alert(response.data);
    });
        
    }

        $scope.generateDailyReport=function() {
            var pdf = new jsPDF('2', 'pt', 'a4');
            pdf.addHTML(document.getElementById("generatetopdf"), function () {
                pdf.addPage();
                $scope.DailyReport="Daily Report";
                pdf.addHTML(document.getElementById("del"), function () {
                    pdf.save($scope.DailyReport + '.pdf');
                });
            });
        }

	});