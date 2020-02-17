angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('additionreport', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
        // console.log();
        var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $scope.editPriceAtBooking = editPriceAtBooking

        $scope.apply=function(){
          console.log("date",$scope.dateRangeSelected)

                  $http.post('/role3/customAdditionsReport',{ 'startDate':$scope.dateRangeSelected.startDate._d,
                    'endDate':$scope.dateRangeSelected.endDate._d}).then(function(res){
                      
                      $scope.additionData=res.data;
                      console.log( $scope.additionData)

      })

        }
    

    });

