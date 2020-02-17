angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize'])
    .controller('freeHairCutCtrl', function($scope, $http) { 
    
    $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $scope.parlors=[];
    $http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){
            // console.log(response);
            $scope.parlors=response.data;
        });

     var today=new Date();
     $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

            // console.log( $scope.dateRangeSelected);
 
    $http.post("/role1/report/otherServicesWithfreeServices", 
                  {'startDate':$scope.dateRangeSelected.startDate._d,
                   'endDate':$scope.dateRangeSelected.endDate._d
                 }).success(function(response, status)
              {
                      $scope.datas = response;
                      response[0].parlors.forEach(function(parlor)
                    {
                          $scope.parlors.push({"name":parlor.name,"parlorId":parlor.parlorId}); 
                    })
                      //   function  to calculate the total
                          $scope.manipulateData($scope.datas);
              });
     
        //   when the parlor is changed from the  select
    $scope.changeParlor=function()
    {
            $scope.parlorIdsToBeSent=[];
            for(var i=0;i<$scope.selectedParlor.length;i++)
            {
                    $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
  }
 
 // when the filter button is clicked           
    $scope.applyFilter=function()
  {
         $http.post("/role1/report/otherServicesWithfreeServices",{
                                                                    'startDate':$scope.dateRangeSelected.startDate._d,
                                                                    'endDate':$scope.dateRangeSelected.endDate._d, 
                                                                    'parlorIds':$scope.parlorIdsToBeSent   })
                                                                    .success(function(response, status)
                                                              {
                                                                        $scope.datas = response;
                
                                                                        // $scope.parlorCount=[];
                                                                          // for(var i=0;i<$scope.datas[0].parlors.length;i++){               
                                                                          //     var freeHairCutCountTotal = 0;
                                                                          //     var otherServicesCountTotal = 0;
                                                                          //      var otherServicesRevenueTotal = 0;
                                                                          //     var freeHairCutRevenue=0;
                                                                          //      for(var j=0;j<$scope.datas.length;j++){
                                                                          //         freeHairCutCountTotal += $scope.datas[j].parlors[i].freeHairCutCount;
                                                                          //          otherServicesCountTotal += $scope.datas[j].parlors[i].otherServicesCount;
                                                                          //          otherServicesRevenueTotal += $scope.datas[j].parlors[i].otherServicesRevenue;
                                                                          //          freeHairCutRevenue += $scope.datas[j].parlors[i].freeHairCutRevenue;
                                                                          //     $scope.parlorCount.push(freeHairCutCountTotal,
                                                                          //         otherServicesCountTotal,freeHairCutRevenue,
                                                                          //       otherServicesRevenueTotal//     )// }
                                                                      $scope.manipulateData($scope.datas)
                                                                 })
  }


//   function  to calculate the total of   each parlors 
      $scope.manipulateData=function(e) // manipulate Data
  {
            $scope.temp=[];
            for(i=0;i<e[0].parlors.length;i++)
        {
            //   Object A to be sent as total for Each and Every Loop
                var a={
                        totalFreeCount:0,
                        totalFreeAmount:0,
                        paidTotalCount:0,
                        paidTotalAmount:0,
                        threadingCount:0,
                        threadingAmount:0,
                        otherTotalCount:0,
                        OtherTotalAmount:0
                      }
                e.forEach(function(d,h){
                          a.totalFreeCount=d.parlors[i].serviceCount[0].number+a.totalFreeCount;
                          a.totalFreeAmount=d.parlors[i].serviceCount[0].amount+a.totalFreeAmount;
                          a.paidTotalCount=d.parlors[i].serviceCount[1].number+a.paidTotalCount;
                          a.paidTotalAmount=d.parlors[i].serviceCount[1].amount+a.paidTotalAmount;
                          a.threadingCount=d.parlors[i].serviceCount[2].number+a.threadingCount;
                          a.threadingAmount=d.parlors[i].serviceCount[2].amount+a.threadingAmount;
                          a.otherTotalCount=d.parlors[i].serviceCount[3].number+a.otherTotalCount;
                          a.OtherTotalAmount=d.parlors[i].serviceCount[3].amount+a.OtherTotalAmount;    
                })
                //  push object a to temp
              $scope.temp.push(a);
      }
             

  }




})


