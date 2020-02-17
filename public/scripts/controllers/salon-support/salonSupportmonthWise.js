angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select'])

    .controller('salonSupportmonthwiseCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel, $timeout) {
     
           // console.log("this is saolons month wise");
       
            $scope.showMonths=[];
            $scope.month=[
            {id:0,'value':'January'},
            {id:1,'value':'February'},
            {id:2,'value':'March'}, 
            {id:3,'value':'April'}, 
            {id:4,'value':'May'}, 
            {id:5,'value':'June'}, 
            {id:6,'value':'July'}, 
            {id:7,'value':'August'}, 
            {id:8,'value':'September'}, 
            {id:9,'value':'October'}, 
            {id:10,'value':'November'}, 
            {id:11,'value':'December'} 
            ];
                  
            $scope.repeats=[1,2,3,4]

            var date=new Date();
            var currentMonth=date.getMonth();
             $scope.month.forEach(function(month){
                if(month.id<=currentMonth){
                    $scope.showMonths.unshift(month)
                }
             });
             $scope.range = function() {
                 return new Array($scope.showMonths.length*4);
            };
            // console.log($scope.showMonths);
        $scope.year=['2017','2018'];
        $scope.city=[{value:1,cityName:'Delhi'},{value:2,cityName:'Bangalore'}];
         $scope.active=[{active:"true",value:'Active'},{active:"false",value:'Inactive'}];
        $http.post("/role1/parlorList").success(function(response, status){
            $scope.parlors = response.data;
               // console.log($scope.parlors);
            });
        
$scope.salonType=function(){

    // console.log($scope.selectedActive)
    // console.log($scope.selectedCity)
  $http.post("/role1/salonSupportMonthWise",{cityId:$scope.selectedCity,active:$scope.selectedActive.active}).success(function(res){

            // console.log(res)
             $scope.salonData=res;
      
       // console.log($scope.salonData);
        // $scope.salonData=[$scope.salonData[0]]
       $scope.salonData.forEach(function(salon){
        salon.support=[];
            for(var  i=currentMonth;i>=0;i--){
                var data=salon.monthData.filter(function (item) {return item.usageMonth==i})[0];
                if(data){
                    var totalBudget=0
                    var totalSpent=0;
                    var count=0
                    data.supportData.forEach(function(s){
                        if(s.supportTypeName!="Discount"){
                        count++
                        totalBudget+=s.budget
                        totalSpent+=s.usageThisMonth
                    }
                        salon.support.push({"value":s.budget})
                        salon.support.push({"value":s.usageThisMonth})
                        
                    });
                    if(totalBudget>totalSpent && count==2){
                      salon.support.push({"value":totalBudget,"cellStyle":{"background-color":"rgb(255, 178, 174);"}})
                        salon.support.push({"value":totalSpent,"cellStyle":{"background-color":"rgb(255, 178, 174);"}})
                        
                    }else if( count==2){
                        
                        salon.support.push({"value":totalBudget,"cellStyle":{"background-color":"rgb(214, 255, 214);"}})
                        salon.support.push({"value":totalSpent,"cellStyle":{"background-color":"rgb(214, 255, 214);"}})
                    }
                }else{
                     for(var  j=1;j<9;j++){
                         salon.support.push({"value":0})
                     }
            }
        }
       })
        
       // console.log("final data",$scope.salonData);
      })

}

      

    

    });

