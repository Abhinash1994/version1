angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('latestAppontmentDetails', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log('hi');
        var today=new Date();
        $scope.role=role;
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $scope.allotCustomer=function(customercareId){
            console.log("customer care",customercareId);
            var data=[]
            $scope.customerDetails.forEach(function(element) {
                data.push({phoneNumber:element.phoneNumber,name:element.userName})
            }, this);
            console.log("final object",{phoneNumber:data})
            $http.post("/role1/createNewLeadFacebookQueryFromAppointments",{phoneNumber:data}).success(function(response, status){
                $('#addCust').modal('hide');
                $scope.newClient={}
                alert("Data Alloted")
                $scope.refreshQuery()
         });
        }
        $http.get("/role1/customerCareMembers?type=2").success(function(response, status) {
            console.log(response);
            $scope.customerCareMembers=response
        });
        $scope.submitbtn=function(data){ 
            var obj ={"name":data.userName,"phoneNumber":data.phoneNumber}
            console.log("final",obj)
            $http.post('/role1/createWebsiteQueryByCustomerCare',obj).then(function(res){
            console.log("customer",res);
            })
        }
        $scope.newCustomer=function(){

                  $http.post('/role1/latestAppointmentDetail',{ 'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d}).then(function(res){

                     
                      $scope.customerDetails=res.data;
                      $scope.allotData=[];
                      $scope.customerDetails.forEach(function(customer){
                          if(customer.isSubscriber=="NO"&&customer.alloted==false){
                            $scope.allotData.push(customer)
                          }
                      }) 
                      console.log("allot data",$scope.allotData)          

      })

        }

        $scope.selectionStop = function(selected){
            console.log("seclected",selected);
            $scope.selectedCustomers=selected
            $('#allotData').modal('show');
          };

          $scope.allotCustomers=function(customercareId){
            console.log("customer care",customercareId);
            var data=[]
            $scope.selectedCustomers.forEach(function(element) {
                data.push({phoneNumber:element.phoneNumber,name:element.userName})
            }, this);
            console.log("customer care",customercareId);
            console.log("final object",{phoneNumber:data,customerCareId:customercareId})
            $http.post("/role1/createNewLeadFacebookQueryFromAppointments",{customerCareId:customercareId,phoneNumber:data}).success(function(response, status){
                $('#allotData').modal('hide');
                $scope.newClient={}
                alert("Data Alloted")
                $scope.newCustomer()
         });
        }

    });

