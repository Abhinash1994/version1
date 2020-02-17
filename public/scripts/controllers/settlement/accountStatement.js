angular.module("sbAdminApp")
    .controller("accountStatementCtrl", function($scope, $http) {
        $scope.parlor = {};
        $scope.role = role;
        $scope.userType=userType;
        $scope.parlors = [];
        $scope.parlor.selectedParlor='1'
        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.userType=userType;
    
        var today = new Date();

        $scope.dts ={time:new Date()};
        // console.log($scope.dts);
        $scope.reports = [];
        $http.get("/role1/getParlorForLedger")
            .success(function(res) {
                // console.log(res)
                $scope.parlors = res.data;
            })

            $scope.diffDate = function(date1, date2){
                var dateOut1 = new Date(date1); // it will work if date1 is in ISO format
                 var dateOut2 = new Date(date2);
    
                var timeDiff = Math.abs(dateOut2.getTime() - dateOut1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                return diffDays;
          };

        $scope.getLedger = function() {
            // console.log("date",$scope.dts)
            $http.get("/role3/getDataForLedger?parlorId=" + $scope.parlor.selectedParlor + "&date="+$scope.dts.time)
                .success(function(res) {
                    // console.log(res)
                    $scope.reports = res.data.settlement;
                    $scope.parlorName = res.data.settlement[0].parlorName;
                    $scope.discount = res.data.Discount;
                    $scope.gstAmount = res.data.gstAmountTransfer;
                    $scope.parlorAddress = res.data.settlement[0].parlorAddress;
                    $scope.subsAmountTransfer=res.data.subsAmountTransfer;

                })
        }
        if (role != 1) {
            $scope.getLedger();

        }

    })