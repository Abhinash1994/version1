angular.module('sbAdminApp', ['isteven-multi-select','daterangepicker'])

    .controller('incentiveReportSalonCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {

    // console.log("inside incentive report salon");
        /*/report/empIncentiveReport*/
        $scope.incentiveModels=[{"modelName":'Model A',"value":1},{"modelName":'Model B',"value":2}]
         $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
         $scope.item1=$scope.year[0];
        $scope.monthsArray=[
            {"value":0,"monthName":'Jan',"year":2017},
            {"value":1,"monthName":'Feb',"year":2017},
            {"value":2,"monthName":'Mar',"year":2017},
            {"value":3,"monthName":'Apr',"year":2017},
            {"value":4,"monthName":'May',"year":2017},
            {"value":5,"monthName":'Jun',"year":2017},
            {"value":6,"monthName":'Jul',"year":2017},
            {"value":7,"monthName":'Aug',"year":2017},
            {"value":8,"monthName":'Sep',"year":2017},
            {"value":9,"monthName":'Oct',"year":2017},
            {"value":10,"monthName":'Nov',"year":2017},
            {"value":11,"monthName":'Dec',"year":2017}

        ]
          $http.post('/role3/incentiveModel').success(function(response){
            // console.log(response);
            $scope.incentiveModelData=response;

        });

        
        $scope.parlorSelected='';
        $scope.parlorList='';
        var today=new Date();

        $scope.parlorsListToBeSent=["587088445c63a33c0af62727"];
        $scope.sortType='';
        $scope.sortFlag=false;

        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
        $scope.incentiveModelSelected=1;
    
        $scope.apply=function(){
            var startDate = new Date($scope.item1, $scope.monthSelected,1);
            var endDate = new Date($scope.item1, $scope.monthSelected+1,0);
            
            // console.log("these are the final dates sent to the api");
            // console.log(startDate);
            // console.log(endDate);
            $('#tableToExport').fixedHeaderTable('destroy');
            $http({
                method: 'POST',
                url: '/role3/report/empIncentiveReport',
                data:{
                    'startDate':startDate,
                    'endDate':endDate,
                    'year':$scope.year.item1
                }
            }).success(function(response){
                // console.log("this is the final response from the api");
                // console.log(response);
                $scope.tableData=response;
                for(var i=0;i<$scope.tableData.length;i++){
                    var total=0;
                    for(var j=0;j<$scope.tableData[i].dep.length;j++){
                        total=total+ parseInt($scope.tableData[i].dep[j].totalIncentive);
                    }
                    $scope.tableData[i]['grandtotalIncentive']=total;
                }
            $scope.fixedHeaderMethod();
                //console.log($scope.tableData);
            });
        }
        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }


        $scope.monthSelected=today.getMonth();
        $http({
            method: 'POST',
            url: '/role3/report/empIncentiveReport',
            data:{
                'startDate': new Date(today.getFullYear(),today.getMonth(),1),
                'endDate': new Date()
            }
        }).success(function(response){
            // console.log("this is the initial response");
            // console.log(response);
            $scope.tableData=response;
            for(var i=0;i<$scope.tableData.length;i++){
                var total=0;
                for(var j=0;j<$scope.tableData[i].dep.length;j++){
                    total=total+ parseInt($scope.tableData[i].dep[j].totalIncentive);
                }
                $scope.tableData[i]['grandtotalIncentive']=total;
            }
           $scope.fixedHeaderMethod();
        });

        $scope.search = function(){
              
             $('#tableToExport').fixedHeaderTable('destroy');
            $scope.fixedHeaderMethod();
            
        }
        
        $scope.fixedHeaderMethod = function(){
            
             $timeout(
                    function() {
                 $('#tableToExport').fixedHeaderTable({
                    fixedColumns: 2
                });
                var myTable = document.getElementById('firstRowFirstCell');
                console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                document.getElementById('firstRowFirstCell').style.height = document.getElementById('firstRowSecondCell').offsetHeight + 'px';
                document.getElementById('firstRowZeroCell').style.height = document.getElementById('firstRowSecondCell').offsetHeight + 'px';
                console.log(document.getElementsByClassName("fht-cell"));
                var a = document.getElementsByClassName("fht-cell");
                var mid = (a.length - 2) / 2
                for (var i = 2; i <= mid; i++) {
                    a[i].clientWidth = a[i + mid].clientWidth;
                    a[i].offsetWidth = a[i + mid].clientWidth;
                    a[i].scrollWidth = a[i + mid].clientWidth;
                    a[i].style.width = a[i + mid].clientWidth + 'px';
                    console.log(i + " " + (i + mid));
                }
            }
               )
            
            
        }
        
        
        
        
    });
    

