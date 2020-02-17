angular.module('sbAdminApp', ['isteven-multi-select'])
    .controller('LuckyDrawEmployeeWiseReport', function ($scope, $http) {
        // console.log("this is calling")

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = !$scope.popup2.opened;
        };
        var today = new Date();
        $scope.dts = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        
        $scope.dte = new Date();

        $http.post("/role1/parlorList").success(function (response, status) {
            $scope.parlors = response.data;
            // console.log($scope.parlors);
        });
        $scope.applyFilter = function () {
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
                parlorId: $scope.selectedParlor.selectedParlor,
            };
            // console.log("/role1/claimedUnclaimedStatusEmployeeWiseReport", reqObj)
            $http.post('/role1/claimedUnclaimedStatusEmployeeWiseReport',reqObj).success(function(response, status) {
                $scope.data = response;
                // console.log(response)
            });
        }



    });