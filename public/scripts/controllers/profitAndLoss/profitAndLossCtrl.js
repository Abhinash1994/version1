angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','ngSanitize', 'ngCsv'])

    .controller('profitAndLossCtrl', function ($scope, $compile, $http, $timeout, $window, NgTableParams, $log) 
    {

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
        	 if($scope.status.opened){
        	 	 $scope.status.opened = false;
        	 }
           else{
           	 $scope.status.opened=true;
           }

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = 'MMMM';

        $scope.status = {
            opened: false
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
                $scope.goodsConsumed=$scope.profitObject.consumed
                $scope.beushare=$scope.profitObject.beushare
                $scope.directCost=$scope.goodsConsumed
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
                $scope.stockConsumed=$scope.profitObject.cog.consumed
                $scope.consumedMonth=$scope.itemOnFirstDay+$scope.monthPurchase-$scope.profitObject.cog.consumed

            });

        }

        $scope.dataByDate();



    });