angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('servReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        $scope.parlorNamesHeader=[];
        $scope.parlorsSelected='';
        $scope.dateRangeSelected='';
        $scope.parlorIdsToBeSent=[];
        $scope.reportArray='';
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $scope.sortType='';
        $scope.sortFlag=false;

        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
        $http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){
            // console.log(response);
            $scope.parlorList=response.data;
        });
        $scope.changeIncentiveModel=function(){
            // console.log($scope.incentiveModelSelected);
        }
        $scope.changeParlor=function(){
            // console.log($scope.parlorSelected)
        }
        $scope.updateParlorsSelected=function(){
            $scope.parlorIdsToBeSent=[];
            //console.log($scope.parlorsSelected)
            for(var i=0;i<$scope.parlorsSelected.length;i++){
                $scope.parlorIdsToBeSent.push($scope.parlorsSelected[i].parlorId);
            }

        };

        $scope.dateSelected=function(){
            //console.log($scope.dateRangeSelected);

        }
        $scope.apply=function(){
            
         
            if($scope.parlorIdsToBeSent.length<=10)
        {
            
            
            // console.log($scope.parlorIdsToBeSent);
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
//            $('#tableToExport').fixedHeaderTable();
//            $('#tableToExport').fixedHeaderTable('destroy');
            $scope.reportArray=[];
            $scope.parlorNamesHeader=[];

            $http({
                method: 'POST',
                url: '/role1/report/serviceReport',
                data: {
                    'parlorIds': $scope.parlorIdsToBeSent,
                    'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d
                }
            }).success(function(response){
               // console.log(response);
                $scope.reportArray=response;
                $scope.parlorNamesHeader=$scope.reportArray[0].values[0].values[0].parlors;
                for(var i=0;i<$scope.reportArray.length;i++){
                    $scope.reportArray[i]['hideFromDepartment']=false;
                    for(var j=0;j<$scope.reportArray[i].values.length;j++){
                        $scope.reportArray[i].values[j]['hideFromCategory']=false;

                    }
                }
                // console.log($scope.reportArray);

                $('#tableToExport').fixedHeaderTable();
                var a=document.getElementsByClassName("fht-cell");
                var mid=(a.length)/2
                for(var i=0;i<mid;i++){
                    a[i].clientWidth=a[i+mid].clientWidth;
                    a[i].offsetWidth=a[i+mid].clientWidth;
                    a[i].scrollWidth=a[i+mid].clientWidth;
                    a[i].style.width=a[i+mid].style.width;
                    console.log(i+" "+(i+mid));
                }


            });
            
            
            
            
        }
            
        else{
            
                        alert("Number of Selected Parlors must not be greater then 10");
            
            
        }
            //console.log($scope.parlorsSelected)
            //console.log($scope.dateRangeSelected.startDate._d)
            //console.log($scope.dateRangeSelected.endDate._d)
        }
        // console.log($scope.dateRangeSelected);
//        $http({
//            method: 'POST',
//            url: '/role1/report/serviceReport',
//            data: {
//                    'startDate':$scope.dateRangeSelected.startDate._d,
//                    'endDate':$scope.dateRangeSelected.endDate._d
//                }
//        }).success(function(response){
//            console.log(response);
//            $scope.reportArray=response;
//            $scope.parlorNamesHeader=$scope.reportArray[0].values[0].values[0].parlors;
//            for(var i=0;i<$scope.reportArray.length;i++){
//                $scope.reportArray[i]['hideFromDepartment']=false;
//                for(var j=0;j<$scope.reportArray[i].values.length;j++){
//                    $scope.reportArray[i].values[j]['hideFromCategory']=false;
//                }
//            }
//            console.log($scope.reportArray);
//            $timeout(
//
//                function() {
//
//                    $('#tableToExport').fixedHeaderTable({
//                        fixedColumn: false});
//                    console.log(document.getElementsByClassName("fht-cell"));
//                    var a=document.getElementsByClassName("fht-cell");
//                    var mid=(a.length)/2
//                    for(var i=0;i<mid;i++){
//                        a[i].clientWidth=a[i+mid].clientWidth;
//                        a[i].offsetWidth=a[i+mid].clientWidth;
//                        a[i].scrollWidth=a[i+mid].clientWidth;
//                        a[i].style.width=a[i+mid].style.width;
//                        console.log(i+" "+(i+mid));
//                    }
//                }
//            );
//        });

        $scope.expand=function(){
            $('#tableToExport').fixedHeaderTable();
            $('#tableToExport').fixedHeaderTable('destroy');
            $('#tableToExport').fixedHeaderTable();
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
        /*$scope.changeMonth=function(){
            console.log( $scope.monthSelected);
            var startDate = new Date($scope.monthSelected.year, $scope.monthSelected.value-1,1);
            var endDate = new Date($scope.monthSelected.year, $scope.monthSelected.value,0);
            console.log(startDate);
            console.log(endDate);

            $http({
                method: 'POST',
                url: '/role1/report/empIncentiveReport',
                data:{
                    'parlorId':$scope.parlorSelected,
                    'startDate':startDate,
                    'endDate':endDate
                }
            }).success(function(response){
                console.log(response);
                $scope.tableData=response;
                for(var i=0;i<$scope.tableData.length;i++){
                    var total=0;
                    for(var j=0;j<$scope.tableData[i].dep.length;j++){
                        total=total+ parseInt($scope.tableData[i].dep[j].totalIncentive);
                    }
                    $scope.tableData[i]['grandtotalIncentive']=total;
                }
                console.log($scope.tableData);
                // $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
            });
        }*/


    });

