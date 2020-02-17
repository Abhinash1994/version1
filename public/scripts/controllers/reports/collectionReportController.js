angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('collectionReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams) {

        
      $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
       
      };

    $scope.employees=employees;
    // console.log($scope.employees);
    $scope.filterEmployees=[];
    $scope.filterServices=[];
    $scope.services=services;
    $scope.categories = [];
    $scope.filter = {};
    $scope.filter.date = {startDate: null, endDate: null};
    function loadData(filter) {
        $http.post("/role3/report/collection",filter).success(function (response, status) {
            // console.log(response.data)

            var totalObject={
             advanceUsed:0,
             amex:0,
             affiliates:0,
             beU:0,
             cardPayment:0,
             serviceCollection:0,
             productCollection:0,
             cashPayment:0,
             loyaltyUsed:0,
             membershipUsed:0,
             noOfAppointments:0,
             totalAdvance:0,
             totalCollection:0,
             totalLoyaltyPoints:0,
             totalMemberships:0,
             totalProducts:0,
             totalRedemption:0,
                date:'GrandTotal',
                data:[]
            }

            for(var i=0;i<response.data.length;i++){
                totalObject.advanceUsed=totalObject.advanceUsed+response.data[i].advanceUsed;
                totalObject.amex= totalObject.amex+response.data[i].amex;
                totalObject.affiliates= totalObject.affiliates+response.data[i].affiliates;
                totalObject.beU= totalObject.beU+response.data[i].beU;
                totalObject.serviceCollection= totalObject.serviceCollection+response.data[i].serviceCollection;
                totalObject.productCollection= totalObject.productCollection+response.data[i].productCollection;
                totalObject.cardPayment=totalObject.cardPayment+response.data[i].cardPayment;
                totalObject.cashPayment=totalObject.cashPayment+response.data[i].cashPayment;
                totalObject.loyaltyUsed=totalObject.loyaltyUsed+response.data[i].loyaltyUsed;
                totalObject.membershipUsed=totalObject.membershipUsed+response.data[i].membershipUsed;
                totalObject.noOfAppointments=totalObject.noOfAppointments+response.data[i].noOfAppointments;
                totalObject.totalAdvance=totalObject.totalAdvance+response.data[i].totalAdvance;
                totalObject.totalCollection= totalObject.totalCollection+response.data[i].totalCollection;
                totalObject.totalLoyaltyPoints= totalObject.totalLoyaltyPoints+response.data[i].totalLoyaltyPoints;
                totalObject.totalMemberships= totalObject.totalMemberships+response.data[i].totalMemberships;
                totalObject.totalProducts=totalObject.totalProducts+response.data[i].totalProducts;
                totalObject.totalRedemption=totalObject.totalRedemption+response.data[i].totalRedemption;
            }
            response.data.push(totalObject);
            // console.log(response.data)
            $scope.data = response.data;
            var a=($scope.data.length/10);
            var b=($scope.data.length%10);
            // console.log(b)
            if(b>0){
                $scope.totalItems=$scope.data.length;
                $scope.maxSize=a+1;
            }
             else{
                $scope.totalItems=$scope.data.length;
                 $scope.maxSize=a;
            }
                $scope.dummy=[];
                for(var i=0;i<$scope.data.length;i++){
                    if(i<=9)
                    {
                       $scope.dummy.push($scope.data[i])  

                    }

                    else{
                        break;
                    }
                   
                }
           
            $scope.currentPage=1;
            // console.log($scope.totalItems)
          
        });
    }
    loadData({}); 
    $scope.data = [];
    //$log.debug('Params : ',$scope.tableParams);
    $scope.order = [ 'date','noOfAppointments','totalCollection', 'totalAdvance', 'totalMemberships','walletSoldBySalon','walletSoldByBeu','serviceCollection','productCollection','cashPayment' ,'cardPayment','beU','affiliates','amex','membershipUsed','advanceUsed','loyaltyUsed'];
    $scope.employees=employees;
    $scope.superCategory=services;

    $scope.filterApplied=function(){
        var filter = $scope.filter;
        loadData({startDate : filter.date.startDate._d, endDate : filter.date.endDate._d, parlorId : $scope.selectedParlorId});
    };

    $scope.superCat=function(){
        $scope.serv=[];
        for(var i=0;i<$scope.filter.superCategory.length;i++){
            for(var j=0;j<$scope.filter.superCategory[i].categories.length;j++){
                $scope.serv.push($scope.filter.superCategory[i].categories[j]);
            }
        }
    };

    $scope.pageChanged=function(currentPage){
            var b=currentPage*10;
            if(b<$scope.data.length){
                  $scope.dummy=angular.copy($scope.data.slice(b-10,b))   
            }
            else{
                  $scope.dummy=angular.copy($scope.data.slice(b-10,$scope.data.length))  
            }
          
    }
});
