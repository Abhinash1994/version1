angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('empSegmentCtrl', function($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel) {

        $scope.months = [{"name": "January", "value": "01"}, {"name": "Feburary", "value": "02"}, {
            "name": "March",
            "value": "03"
        }, {"name": "April", "value": "04"}, {"name": "May", "value": "05"}, {
            "name": "June",
            "value": "06"
        }, {"name": "July", "value": "07"}, {"name": "August", "value": "08"}, {
            "name": "September",
            "value": "09"
        }, {"name": "October", "value": "10"}, {"name": "November", "value": "11"}, {
            "name": "December",
            "value": "12"
        }];
        $scope.selectedParlor="";
         $scope.newSearch = '';
        $scope.searchKey ='';
        $scope.parlorIdsToBeSent=[];
        $http.post("/role1/allParlors").success(function(response, status){
            $scope.parlors = response.data;
        });
    var today=new Date();
    var x=new Date();
    var previous=x.setMonth(x.getMonth()-1);
    var jsonPrevious=new Date(previous)

        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
    // console.log( "==============",$scope.dateRangeSelected);
        // $http.post("/role1/report/empSegmentReport",{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(response, status){
        //     $scope.employeeData = response;
        //     console.log(response);
        //     $scope.headings=[];
        //     $scope.headings1=[];
        //     $scope.employeeData[0].dep.forEach(function(heading){
        //         $scope.headings.push("Count");
        //         $scope.headings.push("Revenue");
        //         $scope.headings1.push(heading.unit);
                
        //     });
        //     $scope.employeeData.forEach(function(employees){
        //         employees.data=[];
        //         employees.dep.forEach(function(dep){
        //             employees.data.push(dep.serviceNo);
        //             employees.data.push(dep.totalRevenue);
        //         });
                
        //     });
        //     $timeout(
        //         function() {
        //             $('#selector').fixedHeaderTable({
        //                 fixedColumn: true});
        //             var myTable = document.getElementById('firstRowFirstCell');
        //             console.log(document.getElementById('firstRowSecondCell').offsetHeight)
        //             document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight+'px';
        //             console.log(document.getElementsByClassName("fht-cell"));
        //             var a=document.getElementsByClassName("fht-cell");
        //             var mid=(a.length-1)/2
        //             for(var i=1;i<=mid;i++){
        //                 a[i].clientWidth=a[i+mid].clientWidth;
        //                 a[i].offsetWidth=a[i+mid].clientWidth;
        //                 a[i].scrollWidth=a[i+mid].clientWidth;
        //                 a[i].style.width=a[i+mid].clientWidth+'px';
        //                     console.log(i+" "+(i+mid));
        //                 }
        //         }
        //     );
        // });
        $scope.changeParlor=function(){
           // console.log($scope.selectedparlor);
            $scope.parlorIdsToBeSent=[];
            for(var i=0;i<$scope.selectedParlor.length;i++){
                $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
           // console.log( $scope.parlorIdsToBeSent);
        }
    $scope.applyFilter=function(parlorId){
            // console.log("Change function called");
            // console.log($scope.selectedparlor)
            // console.log($scope.parlorIdsToBeSent);
//            $scope.parlorIdsToBeSent.push($scope.selectedparlor)
        
        if($scope.parlorIdsToBeSent.length<=10)
        {
            $http.post("/role1/report/empSegmentReport",{parlorIds:$scope.parlorIdsToBeSent,'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate}).success(function(response, status){
                // $scope.employeeData = response;
                // console.log(response);
                // $scope.headings=[];
                // $scope.employeeData[0].dep.forEach(function(heading){
                //     $scope.headings.push(heading.unit +" Count");
                //     $scope.headings.push(heading.unit +" Revenue");
                // });
                // $scope.employeeData.forEach(function(employees){
                //     employees.data=[];
                //     employees.dep.forEach(function(dep){
                //         employees.data.push(dep.serviceNo);
                //         employees.data.push(dep.totalRevenue);
                //     });

                // });
                   $scope.employeeData = response;
            // console.log(response);
            $scope.headings=[];
            $scope.headings1=[];
            $scope.employeeData[0].dep.forEach(function(heading){
                $scope.headings.push("Count");
                $scope.headings.push("Revenue");
                $scope.headings1.push(heading.unit);
                
            });
            $scope.employeeData.forEach(function(employees){
                employees.data=[];
                employees.dep.forEach(function(dep){
                    employees.data.push(dep.serviceNo);
                    employees.data.push(dep.totalRevenue);
                });
                
            });
                    $timeout(
                    function() {
                        $('#selector').fixedHeaderTable('destroy');
                        $('#selector').fixedHeaderTable({
                            fixedColumn: true});
                        var myTable = document.getElementById('firstRowFirstCell');
                        document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight+'px';
                        var a=document.getElementsByClassName("fht-cell");
                        var mid=(a.length-1)/2
                        for(var i=1;i<=mid;i++){
                            a[i].clientWidth=a[i+mid].clientWidth;
                            a[i].offsetWidth=a[i+mid].clientWidth;
                            a[i].scrollWidth=a[i+mid].clientWidth;
                            a[i].style.width=a[i+mid].clientWidth+'px';
                            console.log(i+" "+(i+mid));
                        }
                    }
                );      
            }); 
        }

        else{
                        alert("Number of Selected Parlors must not be greater then 10")
                }
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
           
        };
        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
        
        $scope.searchf = function(){
             $scope.newSearch = $scope.searchKey;
             $timeout(
                    function() {
                        $('#selector').fixedHeaderTable('destroy');
                        $('#selector').fixedHeaderTable({
                            fixedColumn: true});
                        var myTable = document.getElementById('firstRowFirstCell');
                        document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight+'px';
                        var a=document.getElementsByClassName("fht-cell");
                        var mid=(a.length-1)/2
                        for(var i=1;i<=mid;i++){
                            a[i].clientWidth=a[i+mid].clientWidth;
                            a[i].offsetWidth=a[i+mid].clientWidth;
                            a[i].scrollWidth=a[i+mid].clientWidth;
                            a[i].style.width=a[i+mid].clientWidth+'px';
                            console.log(i+" "+(i+mid));
                        }
                         
                    }
                );
        }
});