angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('serviceReportSalonCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {

    // console.log("inside the serviceReportSalonCtrl");
        $scope.parlorsSelected='';
        $scope.dateRangeSelected='';
        $scope.parlorIdsToBeSent=[];
        $scope.reportArray='';
        var today=new Date();
        $scope.dateRangeSelected={
            startDate:{'_d':new Date()},
            endDate:{'_d':new Date().setDate(today.getDate()-30)}
        }
        // console.log("these are the initial dates");
        // console.log($scope.dateRangeSelected.startDate._d);
        // console.log($scope.dateRangeSelected.endDate._d);
        $scope.sortType='';
        $scope.sortFlag=false;

        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
       /* $scope.changeIncentiveModel=function(){
            console.log($scope.incentiveModelSelected);
        }*/
        $scope.apply=function(){
            // console.log("These are he final dates which are being sent in the api");
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
            $('#tableToExport').fixedHeaderTable();
            $('#tableToExport').fixedHeaderTable('destroy');
            $scope.reportArray=[];
            $scope.parlorNamesHeader=[];
            $http({
                method: 'POST',
                url: '/role3/report/serviceReport',
                data: {
                    'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d
                }
            }).success(function(response){
                // console.log("this is the final response from the api");
                // console.log(response);
                $scope.reportArray=response;
                for(var i=0;i<$scope.reportArray.length;i++){
                    $scope.reportArray[i]['hideFromDepartment']=false;
                    for(var j=0;j<$scope.reportArray[i].values.length;j++){
                        $scope.reportArray[i].values[j]['hideFromCategory']=false;

                    }
                }
                 

            });
        }
        /*******************************Initial call for report**************starts**********************/
        $scope.parlorIdsToBeSent=["587088445c63a33c0af62727"];
        $http({
            method: 'POST',
            url: '/role3/report/serviceReport',
            data: {
                'startDate':$scope.dateRangeSelected.startDate._d,
                'endDate':$scope.dateRangeSelected.endDate._d
            }
        }).success(function(response){
            // console.log("this is the initial response from the api");
            // console.log(response);
            $scope.reportArray=response;
            for(var i=0;i<$scope.reportArray.length;i++){
                $scope.reportArray[i]['hideFromDepartment']=false;
                for(var j=0;j<$scope.reportArray[i].values.length;j++){
                    $scope.reportArray[i].values[j]['hideFromCategory']=false;
                }
            }
           
        });

        /*******************************Initial call for report**********stops**************************/
        $scope.hideCategory=function(fullList){
            fullList.hideFromDepartment=!fullList.hideFromDepartment;
        }
        $scope.hideService=function(categoryList){
            categoryList.hideFromCategory=!categoryList.hideFromCategory;
        }

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
        
        
     
          $scope.expand=function(){
            $('#tableToExport').fixedHeaderTable();
            $('#tableToExport').fixedHeaderTable('destroy');
            $('#tableToExport').fixedHeaderTable();
            $scope.fixedHeaderMethod();
            }
        
             $scope.fixedHeaderMethod = function(){
                var a=document.getElementsByClassName("fht-cell");
                var mid=(a.length)/2
                for(var i=0;i<mid;i++){
                    a[i].clientWidth=a[i+mid].clientWidth;
                    a[i].offsetWidth=a[i+mid].clientWidth;
                    a[i].scrollWidth=a[i+mid].clientWidth;
                    a[i].style.width=a[i+mid].style.width;
                    console.log(i+" "+(i+mid));
                }
            
        }

    });

