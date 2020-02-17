angular.module('sbAdminApp',['ngCsv','daterangepicker'])
        .controller('subscriptionSalesCtrl',function($scope,$http,Excel,$timeout){
        
            $scope.m=[{'jan':'jan','id':'1'},{'jan':'Feb','id':'2'},{'jan':'March','id':'3'},{'jan':'April','id':'4'},{'jan':'May','id':'5'},{'jan':'June','id':'6'},{'jan':'July','id':'7'},{'jan':'August','id':'8'},{'jan':'September','id':'9'},{'jan':'October','id':'10'},{'jan':'November','id':'11'},{'jan':'December','id':'12'}]

      var today=new Date();
        // $scope.dateRangeSelected = {startDate: new Date(), endDate: new Date()};
         $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

    $scope.dropdown={options:[{name:'Gold'},
                              {name:'Silver'}],phoneNumber:''}
     $scope.paymentType={options:[{name:'online'},
                              {name:'cash'}]
                          }
    $scope.subscriptionData=[];
    $scope.obj={};
    $scope.assign=function(){
        console.log($scope.dropdown)
        $scope.obj.subscriptionType=$scope.dropdown.selected;
        $scope.obj.phoneNumber=undefined;
    }
    $scope.phoneNumberFilter=function(){
        $scope.dropdown.selected=undefined;
        $scope.obj.subscriptionType=undefined;
    }

     $scope.checkGifted = {
       value : false,
     };

    $scope.applyFilter=function(){
        console.log($scope.checkGifted)
        console.log($scope.paymentType);
        console.log($scope.dateRangeSelected);
    $http.post('/role1/subscriptionSaleReport',{'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d,'paymentType':$scope.paymentType.selected,'isGiftedOnly':$scope.checkGifted.value}).success(function(res){
        console.log(res);
            $scope.mon=res;
        $scope.goldCount=res.data.goldCount;
        $scope.silverCount=res.data.silverCount;
        $scope.onlineCount=res.data.onlineCount;
        $scope.cashCount=res.data.cashCount;
        $scope.maleCount=res.data.maleCount;
        $scope.femaleCount=res.data.femaleCount;
        $scope.totalCount=res.data.totalCount;
        $scope.subscriptionData=angular.copy(res.data.subscriptions);

       var monthLimit=12;
        var yearLimit=$scope.dateRangeSelected.endDate._d.getFullYear();
        var startMonth=$scope.dateRangeSelected.startDate._d.getMonth();
        var startYear=$scope.dateRangeSelected.startDate._d.getFullYear();
        var endYear=$scope.dateRangeSelected.endDate._d.getFullYear();
        var endMonth=$scope.dateRangeSelected.endDate._d.getMonth();
        var dummyArray=[];
        var year=startYear;



        var months=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
        $scope.copyingArray=angular.copy($scope.mon.data.subscriptions)

        $scope.copyingArray.forEach(function(client){
            client.clientRevenueTillNow1=[];
            months.forEach(function(month){
                var present=false;
                if( client.clientRevenueTillNow && client.clientRevenueTillNow.length){
                client.clientRevenueTillNow.forEach(function(clientMonth){
                    if(clientMonth.year==2019){
                        if((12+clientMonth.month)==month){
                            present=true;
                            client.clientRevenueTillNow1.push(clientMonth)
                        }
                    }else{
                        if(clientMonth.month==month){
                            present=true;
                            client.clientRevenueTillNow1.push(clientMonth)
                        }
                    }
                    
                })
            }
                        if(!client.clientAppointments){
                            client.clientAppointments=[]
                        }


                if(!present){
                    client.clientRevenueTillNow1.push({"month":month,"revenue":0})
                }
            })
            // client.clientRevenueTillNow
        })
            console.log($scope.dummyData)
    })
}
     $scope.exportToExcel = function (tableId) { // ex: '#my-table'

            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }

      $scope.revenueOfMonth=function(month,monthData){
          return 0;
          monthData.forEach(function(element){
            if(element.month== month){
                return element.revenue
          }
          })
      }  

})