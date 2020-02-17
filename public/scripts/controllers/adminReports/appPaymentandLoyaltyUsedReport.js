// module definition 
  angular.module("sbAdminApp",['daterangepicker','ngTable','isteven-multi-select'])
      .controller("appPaymentandLoyaltyUsedReportCtrl",function($scope,$http,$timeout,NgTableParams){    
          console.log(role)
       
        $scope.selected={};
        
         $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
        
      };

        var promise=$http.post("/role1/allParlors")
                         .success(function(response, status)
                        {
                                   $scope.parlors = response.data;
        
                          });
          promise.then(function()
          {
               $scope.filter();
          })

        // controller defined
        $scope.dates={};
        $scope.dates.date={startDate:null,endDate:null}
          var today = new Date()
                                    // payment Modes

    $scope.freebiesRange={};

     $scope.paymentModes=[{name:'Be U Cash',method:1},{name:'Be U App',method:5},{name:'all'}]
                                    // FreeBie Ranges
    $scope.freebieRange=[{range:'0-500', minRange:0,maxRange:500}
                        ,{range:'500-1000',minRange:500,maxRange:1000}
                        ,{range:'1000-2000',minRange:1000,maxRange:2000}
                        ,{range:'2000-4000',minRange:2000,maxRange:4000}
                        ,{range:'4000-8000',minRange:4000,maxRange:8000}
                        ,{range:'More Then 8000',minRange:8000},
                        {range:'Any Range'}]
     
            $scope.dates.date.startDate=  moment().startOf('month') ;
             $scope.dates.date.endDate=moment().endOf('month');
                
$scope.filter=function(){
          var parlorIdTobeSent=[];
            if($scope.selected.selectedParlor){
                      $scope.selected.selectedParlor.forEach(function(a)
                  {
                          parlorIdTobeSent.push(a.parlorId)
                  })
            }
              console.log(parlorIdTobeSent)
                  $scope.data=[];
                        $http.post("/role3/appCashDigitalPaymentAppointments",{minRange:$scope.freebiesRange.minRange,
                                                                              maxRange:$scope.freebiesRange.maxRange,
                                                                              parlorId : $scope.selectedParlorId,
                                                                              startDate:$scope.dates.date.startDate._d,
                                                                           endDate:$scope.dates.date.endDate._d,
                                                                           paymentMode:$scope.selectedpaymentMode,
                                                                           parlorIds:parlorIdTobeSent
                                                                          }).success(function(res){
                                                    console.log(res)
                                                    console.log($scope.data)
                         var b={freePointsRedemeed:0,freePointsUsed:0,freeServicePoints:0,totalAmount:0};
                                                      $scope.data=res.data;
                                    var a={totalAmount:0,freePointsUsed:0,freePointsRedemeed:0,freeServicePoints:0}
                                       $scope.total= $scope.data.reduce(function(sum,val){
                                                  sum.totalAmount+=val.totalAmount;
                                                  sum.freePointsUsed+=val.freePointsUsed;
                                                  sum.freeServicePoints+=val.freeServicePoints;
                                                  sum.freePointsRedemeed+=val.freePointsRedemeed;
                                                  return sum;
                                        },a)

                                       console.log($scope.total);
                                    
                                           
                            })
}


            if(role!=1)
          {
            $scope.filter();
          }

           
})