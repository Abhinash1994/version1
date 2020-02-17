angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSelectable', 'ngCsv'])

    .controller('facebookqueries', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log();
        $scope.colors = ['blue','red', 'green']
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

        console.log("seclected",$scope.selection);
        $http.get("/role1/customerCareMembers?type=3").success(function(response, status) {
            console.log(response);
            $scope.customerCareMembers=response
        });

        $scope.applyqueries=function(){

            console.log("seclected",$scope.selection)
            $http.post('/role1/facebookQuery',{ 'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).then(function(res){
                $scope.data=res.data;

                console.log( $scope.data)
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
                ids.push(element._id)
            }, this);

            $http.post('/role1/allotFacebookQuery',{customerCareId:customerCareId,queryIds:ids }).then(function(res){
                $('#allotData').modal('hide');
                alert("Data Alloted Successfully");
                $scope.data=[];
                $http.post('/role1/facebookQuery',{ 'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).then(function(res){
                    $scope.data=res.data;
                    console.log( $scope.data)

                })
            })
          }

    });

