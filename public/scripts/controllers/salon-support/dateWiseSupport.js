angular.module('sbAdminApp', ['isteven-multi-select'])
    .controller('dateWiseSupport', function ($scope, $http) {
       // console.log("this is calling")

       // console.log("this is saolons month wise");
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
       // console.log($scope.dts);
        $scope.dte = new Date();


        $scope.repeats = [1, 2, 3, 4]
        var date = new Date();
        var currentMonth = date.getMonth();
       // console.log($scope.showMonths);
        $scope.year = ['2017', '2018'];
        $scope.city = [{ value: 1, cityName: 'Delhi' }, { value: 2, cityName: 'Bangalore' },{ value: 3, cityName: 'Pune' }];
        $scope.active = [{ active: "true", value: 'Active' }, { active: "false", value: 'Inactive' }];
        $http.post("/role1/parlorList").success(function (response, status) {
            $scope.parlors = response.data;
           // console.log($scope.parlors);
        });
        $scope.applyFilter = function () {
            var parlorIds = [];
            $scope.selectedParlor.forEach(function (parlor) {
                parlorIds.push(parlor.parlorId)
            }, this);
           // console.log("support report date wise");
            var reqObj = {
                startDate: $scope.dts,
                endDate: $scope.dte,
                parlorIds: parlorIds,
            };
           // console.log("final obj", reqObj)
            $http.post('/role1/relevanceReport',reqObj).success(function(response, status) {
                $scope.data = response;
              //  console.log(response);
            
            });
        }



    })