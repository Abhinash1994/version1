angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('newCustomerReport', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log();
        var today=new Date();
        $scope.role=role;
        $scope.userId=userId;
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $http.get("/role1/customerCareMembers?type=3").success(function(response, status) {
            console.log(response);
            $scope.customerCareMembers=response
        });

        $scope.newCustomer=function(){

                  $http.post('/role1/newCustomersDetail',{ 'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d}).then(function(res){
                      console.log(res);
                      $scope.customerDetails=res.data;
                      $scope.allotData=[];
                      $scope.customerDetails.forEach(function(element) {
                          if(element.isSubscriber=="NO" && element.isAllotedToSubscriptionTeam!=true){
                            $scope.allotData.push(element);
                          }
                      }, this);
                      console.log( $scope.customerDetails)

                    })

        }
        $scope.selectionStop = function(selected){
            console.log("seclected",selected);
            $scope.selectedCustomers=selected
            $('#allotData').modal('show');
          };

          $scope.allotCustomers=function(customerCareId){
            console.log("customer care id",customerCareId)
            var ids=[]
            console.log("customer array",$scope.selectedCustomers);
            $scope.selectedCustomers.forEach(function(element) {
                ids.push(element.userId)
            }, this);
            $http.post('/role1/allotToSubscriptionTeamFacebookQuery',{customerCareId:customerCareId,userIds:ids }).then(function(res){
                $('#allotData').modal('hide');
                alert("Data Alloted Successfully");
                $scope.data=[]
                $scope.newCustomer()
            })
          }
    

    });

