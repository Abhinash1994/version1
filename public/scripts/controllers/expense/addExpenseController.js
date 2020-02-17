'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','ngSanitize', 'ngCsv'])

    .controller('addExpenseCtrl', function ($scope, $compile, $http, $timeout, $window, NgTableParams, $log) {



        // $scope.today = function() {
            $scope.dt={}
                $scope.dt.dt= new Date();
        // };
        // $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date(2017, 0, 1);
        };
        $scope.toggleMin();
        $scope.maxDate = new Date();

        $scope.open = function($event) {
            $scope.status.opened = true;

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];

        $scope.status = {
            opened: true
        };



        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
		$scope.profitObject={};
        $scope.expSum=0;



      $scope.test=function() {
           alert($scope.dt.dt)
        };

        $scope.month=$scope.dt.dt.getMonth()
        $scope.year=$scope.dt.dt.getFullYear()

        $scope.dataByDate=function(){
            // console.log($scope.month,$scope.year)
            $http.post('role2/expenseProfitLoss',{month:$scope.dt.dt.getMonth(),year:$scope.dt.dt.getFullYear()}).success(function (response, err) {

                $scope.profitObject=response
                // console.log("profit",$scope.profitObject)

                $scope.service=$scope.profitObject.service
                $scope.salary=$scope.profitObject.salary
                $scope.indirect=$scope.profitObject.indirect
                $scope.incentive=$scope.profitObject.incentive
                $scope.product=$scope.profitObject.product
                $scope.gross=$scope.service+$scope.product
                $scope.goodsConsumed=$scope.profitObject.product - $scope.profitObject.consumed
                $scope.beushare=$scope.profitObject.beushare
                $scope.directCost=$scope.beushare +$scope.goodsConsumed
                $scope.grosProfit=$scope.gross-$scope.directCost
                $scope.grosProfitMargin=($scope.grosProfit/$scope.gross)*100


                $scope.profitObject.indirect.forEach(function (l) {
                    // console.log(l)
                    $scope.expSum+=l.sum

                })

                $scope.totalIndirect=$scope.expSum +$scope.incentive+$scope.salary
                $scope.costMargin=$scope.grosProfit-$scope.totalIndirect
                $scope.marginPrc=($scope.costMargin/$scope.gross)*100
                $scope.cogs=$scope.profitObject.cog.closeStock
                $scope.itemOnFirstDay=$scope.profitObject.cog.itemOnFirstDay
                $scope.monthPurchase=$scope.profitObject.cog.monthPurchase
                $scope.consumedMonth=$scope.profitObject.cog.consumed

            });

        }

        $scope.dataByDate();

		var index = 0;
        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };
        $scope.order = [ 'subcategory','createdAt','amount', 'billNo', 'category' ];
        $scope.tableParams = new NgTableParams(parameters, settings);

        //$log.debug('Params : ',$scope.tableParams);
        $scope.makeCSVData = makeCSVData;
        function makeCSVData(){
            var csvData = angular.copy($scope.expenses);
            csvData.unshift({amount:'Amount',billNo:'Bill Number',category:'Category', subcategory:'Sub Category', createdAt : 'Created At'});
            // console.log(csvData);
            return csvData;
        }

        var page = 0;
        $scope.back  = true;
        $scope.showNext  = true;

        $scope.cancel = function() {
            $scope.expense = [];
            $scope.exp = {};

            $scope.expense.activesubcat = [];
            $scope.expense.cat = [
                {"key": "Rent", "value": "Rent"},
                {"key": "Electricity", "value": "Electricity"},
                {"key": "Phone", "value": "Phone"},
                {"key": "Advertising", "value": "Advertising"},
                {"key": "CA Fees", "value": "CA Fees"},
                {"key": "Lawyer Fees", "value": "Lawyer Fees"},
                {"key": "Internet", "value": "Internet"},
                {"key": "Products", "value": "Products"},
                {"key": "Dry Cleaning", "value": "Dry Cleaning"},
                {"key": "Gloves", "value": "Gloves"},
                {"key": "Cleaning Supplies", "value": "Cleaning Supplies"},
                {"key": "Misc Supplies", "value": "Misc Supplies"},
                {"key": "Others", "value": "Others"}

            ];

        }
            $scope.changePage = function (inc) {
                page = page + inc;
                $http.get('role2/expense?page=' + page).success(function (response, err) {
                    $scope.expenses = response.data;
                    // console.log($scope.expenses);
                    if (response.data.length < 10) $scope.showNext = false;
                    else $scope.showNext = true;
                    if (page <= 1) $scope.back = false;
                    else $scope.back = true;
                });
            };

            $scope.changePage(1);

            $scope.cancel();

            $scope.updatesubcat = function (index) {
                var index = 0;
                $scope.expense.cat.forEach(function (c, k) {
                    if (c.value == $scope.exp.cat) index = k;
                });
                $scope.expense.activesubcat = $scope.expense.cat[index].subcat;
            };

            $scope.publish = function () {
                $http.post('role2/expense', $scope.exp).success(function (response, err) {
                    $scope.cancel();
                    page = 0;
                    $scope.changePage(1);

                });
            }

    });