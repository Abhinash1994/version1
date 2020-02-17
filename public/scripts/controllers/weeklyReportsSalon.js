angular.module("sbAdminApp",['daterangepicker'])
       .controller("weeklyReportSalonsCtrl",function($scope,$http,$timeout,Excel)
{
				$scope.selected={};
               $scope.months=[{"month":"January","value":"0"},{"month":"Feburary","value":"1"},{"month":"March","value":"2"},{"month":"April","value":"3"},{"month":"May","value":"4"},{"month":"June","value":"5"},{"month":"July","value":"6"},{"month":"August","value":"7"},{"month":"September","value":"8"},{"month":"October","value":"9"},{"month":"November","value":"10"},{"month":"December","value":"11"}];
    $scope.years=[];
    $scope.selectedYear=2017;
    var i=$scope.selectedYear;
    $scope.role=role;



            // console.log("this is saolons report")
            $scope.selectedParlor ={};

     $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
        
      };
    
       $http.post("/role1/allParlors").success(function(response, status) {
                         $scope.parlorList=response.data;
                          console.log("parlorId",$scope.parlorList)
                         
                })

    $scope.dates={};
    var today=new Date();
    $scope.dates.date={startDate:new Date(today),endDate:new Date()}
    console.log($scope.role);
    $scope.selectedParlor={};
    while(i<=new Date().getFullYear())
    {
        $scope.years.push({value:i,name:i});
        i++;
    }
    $http.get("/beuApp/getParlors").success(function(res) {
      console.log(res);
      $scope.parlors=res.data;
    })
    $scope.selectedParlorfunc=function() {
      console.log($scope.selectedParlor.selected._id);
    }

    $scope.monthSelected=function()
                {

                    console.log($scope.dates)

                    var query ={};
                    console.log("year",$scope.selectedYear)
                    if($scope.selectedYear )
                    {
                        console.log($scope.selectedYear)

                        console.log($scope.selected.month+1)
                        $scope.startDate=new Date(parseInt($scope.selectedYear),parseInt($scope.dates.date.startDate._d.getMonth()),$scope.dates.date.startDate._d.getDate(),23,59,59);
                        $scope.endDate=new Date(parseInt($scope.selectedYear),parseInt($scope.dates.date.endDate._d.getMonth()),$scope.dates.date.endDate._d.getDate(),23,59,59);
                        console.log($scope.startDate);
                        console.log($scope.endDate);
                        if($scope.role==3){
                          query={
                            parlorId : $scope.selectedParlor.selected._id,
                            startDate:$scope.startDate,
                            endDate:$scope.endDate,
                            year:$scope.selectedYear
                          }
                        }

                          if($scope.role!=3){
                          query={
                              startDate:$scope.startDate,
                              endDate:$scope.endDate,
                              year:$scope.selectedYear,
                              // parlorId : $scope.selectedParlorId
                            }
                          }
                          console.log("query",query);
                           console.log("id",$scope.selectedParlor.selectedParlor);
                           query.parlorId =  $scope.selectedParlor.selectedParlor
                        $http.post("/role3/newWeeklyReport",query)
                            .success(function(res)
                            {
                                console.log(res)
                                $scope.salonData=res;
                            })


                    }

                 }

   $scope.exportToExcel = function (tableId) { // ex: '#my-table'
       var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
       $timeout(function () {
           location.href = exportHref;
       }, 100); // trigger download
   }

})
