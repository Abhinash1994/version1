angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap', 'isteven-multi-select', 'daterangepicker', 'ngSanitize', 'ngCsv'])
    .controller('coupanCodeCtrl', function ($scope, $http) {
        console.log("coupan code");
        $scope.search = '';
        $scope.msg = "";
        // $scope.show=false;
        $scope.showTable = false;
        var today = new Date();
        $scope.dateRangeSelected = {
            startDate: {
                '_d': new Date(today.getFullYear(), today.getMonth(), 1)
            },
            endDate: {
                '_d': new Date().toJSON()
            }
        }
        console.log($scope.dateRangeSelected);
        $http.post("/role3/couponCodeListing", {
            "startDate": $scope.dateRangeSelected.startDate._d,
            "endDate": $scope.dateRangeSelected.endDate._d
        }).success(function (response) {
            $scope.datas = response.data;
            console.log($scope.datas);
        });

        $scope.searchCoupan = function () {
            //$scope.show=false;
            $scope.showTable = false;
            $scope.srchDatas = " ";
            $scope.msg = " ";
            console.log($scope.search);
            $http.post("/role3/couponCodeListing", {
                couponCode: $scope.search
            }).success(function (response) {
                console.log(response);
                $scope.showTable = true;
                $scope.srchDatas = response.data;
                $scope.msg = response.message;
                console.log($scope.srchDatas);
            });
        }
        $scope.applyFilter = function () {
            console.log($scope.dateRangeSelected.startDate._d);
            $http.post("/role3/couponCodeListing", {
                "startDate": $scope.dateRangeSelected.startDate._d,
                "endDate": $scope.dateRangeSelected.endDate._d
            }).success(function (response) {
                $scope.datas = response.data;
                console.log($scope.datas);
            });
        }
        $scope.activateCoupon = function (code) {
            console.log("Coupon Code", code);
            $http.post("/role3/activateCoupon", {
                couponCode: code
            }).success(function (response) {
                console.log('Hi', response);
                alert("Coupon Activated");
                $('#srchCode').modal('hide');
                $scope.msg = response.message;


            });
        }
        $scope.changeSortType = function (valuePassedForSorting) {
            if ($scope.sortType != valuePassedForSorting) {
                $scope.sortType = valuePassedForSorting;
                $scope.sortFlag = true;
            } else {
                $scope.sortType = '-' + valuePassedForSorting;
            }
        }
        $scope.couponStatus = function (status, active) {
            console.log("status", status)
            if (status == 1)
                return "A booked appt exsits"
            else if (status == 2 && !active)
                return "Appt has been cancelled. Click on button to activate coupon"
            else if (status == 2 && active)
                return "Appt has been cancelled and coupon is activated. Please book appt again"
            else if (status == 3)
                return "Coupon has been redeemed as appt has been closed"
            else
                return "Please contact support"

        }

    })