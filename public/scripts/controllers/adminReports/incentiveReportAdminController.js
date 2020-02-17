angular.module('sbAdminApp', ['isteven-multi-select','daterangepicker'])

    .controller('incentiveAdminReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {

        /*/report/empIncentiveReport*/
        $scope.incentiveModels=[{"modelName":'Model A',"value":1},{"modelName":'Model B',"value":2}];
        $scope.incentiveModelData='';

        $scope.filteredIncentive={values00:[],values01:[],values02:[]};
        $scope.year={}
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
        $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
        $scope.item1=$scope.year[0]
        // $scope.years=[];
        // var i=2017;
        // while(i<=new Date().getFullYear())
        // {
        //     $scope.years.push({id:i,name:i});
        //     i++;
        // }
        // $scope.selectedYear=2017

    
        $scope.selectedParlor="";

        $scope.parlorTypes={}

        $scope.parlorType=[{name:"Red",value:0},{name:"Blue",value:1},{name:"Green",value:2}];
        $scope.parlorTypes.selected=0;
        $scope.parlorSelected='';
        $scope.parlorList='';

        $scope.parlorsListToBeSent=[];
        $scope.sortType='';
        $scope.sortFlag=false;
        var today=new Date();
        $scope.monthSelected=today.getMonth();
        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
        // $http({
        //     method: 'POST',
        //     url: '/role1/incentiveModel',
        // }).success(function(response){
        //     console.log(response);
        //     $scope.incentiveModelData=response.data;

            
        //          // $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
        // });

        var promise=$http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){
            console.log(response);
            $scope.parlorList=response.data;
            // $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
        });

        promise.then(function(){
            console.log("hello")
        })

//        promise.then(function(){
//            $scope.apply();
//        })

        $scope.incentiveModelSelected=1;
        $scope.changeIncentiveModel=function(){
          //  console.log($scope.incentiveModelSelected);
        }
        $scope.changeParlor=function(){
            console.log($scope.parlorsSelected)
            $scope.parlorsListToBeSent=[];
            for(i=0;i<$scope.parlorsSelected.length;i++){
                $scope.parlorsListToBeSent.push($scope.parlorsSelected[i].parlorId);
            }
            console.log($scope.parlorsListToBeSent);
        }
        $scope.apply=function(){
            console.log($scope.item1)
           console.log( $scope.monthSelected);
            console.log($scope.selectedParlor);
//            $scope.parlorSelected=[];
//            $scope.parlorSelected.push($scope.selectedParlor)
            console.log($scope.parlorSelected)
            
            
            if($scope.parlorsListToBeSent.length<10)
            {
                 var startDate = new Date($scope.item1, $scope.monthSelected,1, 12);
                 console.log(startDate)
            var endDate =new Date($scope.item1, $scope.monthSelected,1, 23);
            console.log($scope.parlorsListToBeSent)
            console.log(startDate);
            console.log(endDate);
            $scope.tableData=[];

            $('#tableToExport').fixedHeaderTable('destroy');
            $http({
                method: 'POST',
                url: '/role1/report/empIncentiveReport',
                data:{
                    'parlorId': $scope.parlorsListToBeSent,
                    'startDate':startDate,
                    'endDate':endDate
                }
            }).success(function(response) {
                console.log(response);
                 for(var i=0;i<response.length;i++)
           {
                            if(response[i].dep.length>0)
                        {
                            var a=[]
                            for(var j=0;j<response[i].dep.length;j++){
                                    var b={unit:'',totalIncentive:0,totalRevenue:0};
                                    b.unit=response[i].dep[j].unit;
                                    a.push(b);
                                }
                            for(var j=0;j<response.length;j++)
                            {
                                if(response[j].dep.length==0)
                                {
                                    response[j].dep=angular.copy(a)
                                }
                            }
                                    break;
                        }
           }
                $scope.tableData = response;
                for (var i = 0; i < $scope.tableData.length; i++) {
                    var total = 0;
                    for (var j = 0; j < $scope.tableData[i].dep.length; j++) {
                        total = total + parseInt($scope.tableData[i].dep[j].totalIncentive);
                    }
                    $scope.tableData[i]['grandtotalIncentive'] = total;
                }
                console.log($scope.tableData);
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
            })
                        $scope.optionChanged();
                // $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
            });
               
            }
               
            else{
                        alert("Number of Selected Parlors must not be greater then 10")
               }
          
        }
         
        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }

        


                $scope.changedOption=function(val){
                        val.forEach(function(c){

                      c.incentive.forEach(function(d){
                        if(d.parlorType==$scope.parlorTypes.selected){
                                    d.incentives.forEach(function(e,i){
                                        var a={range:0,incentive:0};
                                        a.range=e.range;
                                        a.incentive=e.incentive;
                                        $scope.filteredIncentive['values0'+i].push(a);

                                    })
                        }
                      })  

            })

                        console.log($scope.filteredIncentive);

                }

    // $scope.optionChanged=function(){

    //             console.log($scope.parlorTypes.selected);
    //             $http.post("/role1/incentiveModel",{parlorType:$scope.parlorTypes.selected}).success(function(res){
    //                 console.log(res)
    //                     $scope.incentiveModelData=res.data;

    //             })


    // }



    });



/*  $scope.popup1 = {
 open1: false
 };
 $scope.open1 = function() {
 $scope.popup1.open1 = true;
 console.log("button pressed");
 };
 $scope.dateOptions = {
 formatYear: 'yy',
 startingDay: 1
 };
 var firstDay = new Date(2017, 2, 1);*/
