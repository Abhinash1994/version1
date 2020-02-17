angular.module('sbAdminApp', ['isteven-multi-select'])

    .controller('inventoryOrdered', function ($scope, $http) {

        $scope.filter = {};
        $scope.filter.date = {
            startDate: new Date(),
            endDate: new Date()
        }
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
        $http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function (response) {
            // console.log(response);
            $scope.salons = response.data;
        });

        $http.post("/role1/getSeller").success(function (response, status) {
            // console.log(response);
            $scope.sellers = response.data;
        });
        var today = new Date();
        $scope.dts = new Date(today.getFullYear(), today.getMonth(), 1);
        $scope.dte = new Date();
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
            $scope.popup2.opened = true;
        };
        $scope.filterApplied = function () {
            $scope.filter.date = {
                startDate: $scope.dts.toJSON(),
                endDate: $scope.dte.toJSON()
            }
            // console.log($scope.filter);
            var s=[];
            $scope.filter.salons.forEach(function(element) {
                s.push(element.parlorId)
            }, this);
            // console.log("salons",s)
            $http.post('/role1/getOrderedInventory', $scope.filter)
                .success(function (response) {
                    // console.log(response)
                    $scope.orderData=response.data


                })

        }
    });
