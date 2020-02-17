angular.module('sbAdminApp',['daterangepicker']).controller('salonSideSubscriptionCtrl',function($scope,$http,$timeout){
					// console.log('hello my name is mayank bhatt');

            $scope.m=[{'jan':'jan','id':'1'},{'jan':'Feb','id':'2'},{'jan':'March','id':'3'},{'jan':'April','id':'4'},{'jan':'May','id':'5'},{'jan':'June','id':'6'},{'jan':'July','id':'7'},{'jan':'August','id':'8'},{'jan':'September','id':'9'},{'jan':'October','id':'10'},{'jan':'November','id':'11'},{'jan':'December','id':'12'}]

      var today=new Date();
//    $scope.dateRangeSelected = {startDate: new Date(), endDate: new Date()};
         $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
//      $scope.dateRangeSelected = {startDate: moment().format('L'), endDate: moment().format('L')};
    $scope.selectedParlor ={};
        $http.post("/role1/parlorList").success(function(response, status) {

                        // console.log(response);
                         $scope.parlors = response.data;
                })
$scope.parlorChanged=function(selectedParlor){
}
        $scope.applyFilter=function(){
            // console.log($scope.dateRangeSelected)
            // console.log($scope.dateRangeSelected.startDate._d)
            //    console.log($scope.dateRangeSelected.endDate._d)
        $http.post('/role3/salonSubscription',{'parlorId':$scope.selectedParlor.selectedParlor,'startDate':$scope.dateRangeSelected.startDate._d,'endDate':$scope.dateRangeSelected.endDate._d}).success(function(res){
            // console.log(res);
            $scope.copyingArray=res.data.subscriptions;

            $scope.sname=res.data.subscriptions[0].apptsDetail;
            $scope.count=res.data.count;
       
            })

    }
    $scope.phoneNumberFilter=function(){
        
        
        // console.log("sagddgas");
        
    }
//     $scope.exportToExcel = function (tableId) { // ex: '#my-table'
//
//            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
//            $timeout(function () {
//                location.href = exportHref;
//            }, 100); // trigger download
//        }

//      $scope.revenueOfMonth=function(month,monthData){
//          return 0;
//          monthData.forEach(function(element){
//            if(element.month== month){
//                return element.revenue
//          }
//          })
//      }  
		})


