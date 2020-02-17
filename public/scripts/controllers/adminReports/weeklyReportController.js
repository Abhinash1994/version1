angular.module('sbAdminApp', ['isteven-multi-select','ngSanitize', 'ngCsv'])
    .controller('weeklyReportCtrl', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) {
    
       $scope.weeksName = [{"week" :"First WeeK"}, 
                     {"week" : "Second Week"},
                     {"week" : "Third Week"},
                     {"week" : "Fourth Week"},
                     {"week" : "Fifth Week"}];
 
    $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];
    $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025']
    $scope.sortType='parlorName';
    $scope.sortFlag=false;
    $scope.parlorIdsToBeSent={};
    
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
         console.log($scope.parlors);
        $scope.selectedParlor=$scope.parlors[0];

        var today=new Date();
        $scope.selectedMonth=(today.getMonth()).toString();
        $scope.selectedYear=(today.getFullYear());
        var year=Number($scope.item1);
        console.log($scope.selectedParlor);
        $http.post("/role1/report/weeklyReport",{month:today.getMonth(),year:today.getFullYear(),parlorIds:$scope.selectedParlor.parlorId}).success(function(response, status){
        $scope.datas = response;
        console.log( $scope.datas);
        $scope.headings=[];
        for(var i=0;i<$scope.datas.length;i++){
            var grandTotal=0;
            for(var j=0;j<$scope.datas[i].weekData.length;j++){
                    grandTotal=grandTotal+parseInt($scope.datas[i].weekData[j].totalSale);
            }
            $scope.datas[i]['grandTotal']=grandTotal;
        }
           $scope.load=function(){ $timeout(
                           function() {
                               $('#selector').fixedHeaderTable({
                                   fixedColumn: true});
                               var myTable = document.getElementById('firstRowFirstCell');
                               console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                               document.getElementById('firstRowFirstCell').style.height=(document.getElementById('firstRowSecondCell').offsetHeight+document.getElementById('firstRowThirdCell').offsetHeight)+'px';
                              console.log(document.getElementsByClassName("fht-cell"));
                               var a=document.getElementsByClassName("fht-cell");
                               var mid=(a.length-1)/2
                               for(var i=1;i<=mid;i++){
                                   a[i].clientWidth=a[i+mid].clientWidth;
                                   a[i].offsetWidth=a[i+mid].clientWidth;
                                   a[i].scrollWidth=a[i+mid].clientWidth;
                                   a[i].style.width=a[i+mid].style.width;
                                   console.log(i+" "+(i+mid));
                               }
                           }
                       );}

           $scope.load();
        $scope.datas[0].weekData.forEach(function(heading){
            $scope.headings.push("Service Revenue", "Product Sales", "Total");
            });
            $scope.datas.forEach(function(employees){
                employees.data1=[];
                employees.weekData.forEach(function(dep){
                employees.data1.push(dep.serviceSale, dep.productSale, dep.totalSale);
                });
               $scope.weekRange  =  employees.weekData;     
         });
          });



    });
    
    $scope.changeParlor=function(){
    $scope.parlorIdsToBeSent=$scope.selectedParlor;
  
         console.log( $scope.parlorIdsToBeSent);
    }
    
        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
                $scope.sortFlag=true;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
       
    
        $scope.applyFilter=function(){
           console.log($scope.selectedParlor);
            var ids=[];
            $scope.selectedParlor.forEach(function(element){
                    ids.push(element.parlorId)
            })
            if(ids.length>10){
                ids.splice(-0,ids.length-10 )
            }
           console.log($scope.selectedMonth);
            console.log(ids);
            $('#selector').fixedHeaderTable();
            $('#selector').fixedHeaderTable('destroy');
            $scope.datas=[];
            $scope.weekRange=[]
        $http.post("/role1/report/weeklyReport",{month:$scope.selectedMonth, year:$scope.selectedYear, 'parlorIds':ids}).success(function(response, status){
            $scope.datas = response;

            console.log( $scope.datas);
            for(var i=0;i<$scope.datas.length;i++){
                var grandTotal=0;
                for(var j=0;j<$scope.datas[i].weekData.length;j++){
                    grandTotal=grandTotal+parseInt($scope.datas[i].weekData[j].totalSale);
                }
                $scope.datas[i]['grandTotal']=grandTotal
            }
            $timeout(
                function() {
                    $('#selector').fixedHeaderTable({
                        fixedColumn: true});
                    var myTable = document.getElementById('firstRowFirstCell');
                    console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                    document.getElementById('firstRowFirstCell').style.height=(document.getElementById('firstRowSecondCell').offsetHeight+document.getElementById('firstRowThirdCell').offsetHeight)+'px';
                    // console.log(document.getElementsByClassName("fht-cell"));
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length-1)/2
                    for(var i=1;i<=mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].style.width;
                        console.log(i+" "+(i+mid));
                    }
                }
            );
            $scope.datas.forEach(function(employees){
                employees.data1=[];
                employees.weekData.forEach(function(dep){
                employees.data1.push(dep.serviceSale, dep.productSale, dep.totalSale,dep.subscribers,dep.subscriptionRevenue, dep.avgValueOfSubscriber);
                });
               $scope.weekRange  =  employees.weekData;

            });
        });
    }
    $scope.searchMethod =function(){
             $('#selector').fixedHeaderTable();
             $('#selector').fixedHeaderTable('destroy');
             $scope.newSearch= $scope.searchKey;
            $scope.load();
    }
 
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }
    
});