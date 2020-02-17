angular.module('sbAdminApp',['ui.bootstrap']).controller('subscriptionReports',function($scope,$http,$timeout){
        // console.log("Subscriotn reports");
        $scope.selectedActive={};
        $scope.alertMe=function(index){
            // console.log("index",index)
            if(index==1){
                $http.get("/role1/report/subscriberCountRevenueReport").success(function(response, status){
                   // console.log(response);
                    $scope.report1=response
                });
            }else if (index==2){
                
                $http.get("/role1/report/salonWiseSubscriptionSold").success(function(response, status){
                   // console.log(response);
                    $scope.report2=response
                });
            }else if(index==3){
                $http.get("/role1/report/subscribersPaymentTrends").success(function(response, status){
                    //console.log(response);
                    $scope.report3=response
                });
            }else if(index==4){
                $http.get("/role1/report/subscribersAttendanceTrends").success(function(response, status){
                  //  console.log(response);
                    $scope.totalSubscribers=0
                    $scope.report4=response;
                    $scope.report4.forEach(function(element) {
                        $scope.totalSubscribers+=element.count
                    }, this);
                });
            }else if(index==5){
                $http.get("/role2/report/clientFirstAppointmentAndSubscriptionBuyDate?parlorId="+"588a0cc3f8169604955dce8d").success(function(response, status){
                   // console.log(response);
                    $http.post("/role1/parlorList").success(function(response, status){
                        $scope.parlors = response.data;
                           // console.log($scope.parlors);
                        });
                    $scope.report5=response;
                    $scope.totalSalonSubscribers=0;
                    $scope.report5.forEach(function(element) {
                        $scope.totalSalonSubscribers+=element.count
                    }, this);
                });
            }
        }
        $scope.range=function(slabId){
            if(slabId==1)
            return "0%-20%"
            else if(slabId==2)
            return "20%-40%"
            else if(slabId==3)
            return "40%-60%"
            else if(slabId==4)
            return "60%-70%"
            else if(slabId==5)
            return "70%-80%"
            else if(slabId==6)
            return "80%-90%"
            else if(slabId==7)
            return "90%-100%"


        }
        $scope.salonChanged=function(parlorId){
            $http.get("/role2/report/clientFirstAppointmentAndSubscriptionBuyDate?parlorId="+parlorId).success(function(response, status){
               // console.log(response);
                $scope.report5=response;
                $scope.totalSalonSubscribers=0;
                $scope.report5.forEach(function(element) {
                    $scope.totalSalonSubscribers+=element.count
                }, this);
            });
        }
	})