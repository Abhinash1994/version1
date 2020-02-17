angular.module('sbAdminApp',[ 'ngCsv'])
.controller('innvoiceOfSalon',function($scope, $http,NgTableParams) {
    $scope.data={};

    $scope.months=[{"name":"January","value":0},{"name":"Feburary","value":1},{"name":"March","value":2},{"name":"April","value":3},{"name":"May","value":4},{"name":"June","value":5},{"name":"July","value":6},{"name":"August","value":7},{"name":"September","value":8},{"name":"October","value":9},{"name":"November","value":10},{"name":"December","value":11}]
     $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
    $scope.item1=$scope.year[0]

    $scope.saveSalon=function(parlorId,managementFee,tax,nonTax,invoiceNumber){
        var obj={managementFee:managementFee,parlorId:parlorId,month:$scope.data.month.value,onlinePaymentFee:tax,onlinePaymentFeeExempt:nonTax,invoiceNumber:invoiceNumber}
        console.log(obj)
        $http.post('/role1/SettlementMonthlyInvoice',obj).success(function(response){
            $scope.salonData=response;
            // console.log("parlors", $scope.salonData)
        })
    }
    $scope.changeMonth=function(){
        $http.get('/role1/getSettlementMonthlyInvoiceForAll?month='+$scope.data.month.value+'&year='+$scope.item1).success(function(response){
            $scope.salonData=response.data;
              console.log("final data", $scope.salonData)
        })
    }
    $scope.loadData = function () {
            // console.log("yeh function chalta hai")
            var data=[];
             $scope.salonData.forEach(function(salon){

                        data.push({"Salon Name":salon.parlorName,"Invoice Number": salon.invoiceNumber,"Amount": salon.managementFee,"E Tax": salon.onlinePaymentFee,"E Non Tax":salon.onlinePaymentFeeExempt })
                    
                   
                })
                return data;
        };
        $scope.generateData=function(){
            
        }

    

});
