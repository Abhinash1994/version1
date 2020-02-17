angular.module('sbAdminApp')
  .controller('kpiDashboardEntryCtrl', ['$scope', '$http', function($scope, $http) {
      // console.log("sdbvzcznvx.--------------czv")
      
   $scope.months = [{"name": "January", "value": "jan"}, {"name": "Feburary", "value": "feb"}, {
            "name": "March",
            "value": "mar"
        }, {"name": "April", "value": "apr"}, {"name": "May", "value": "may"}, {
            "name": "June",
            "value": "jun"
        }, {"name": "July", "value": "jul"}, {"name": "August", "value": "aug"}, {
            "name": "September",
            "value": "sep"
        }, {"name": "October", "value": "oct"}, {"name": "November", "value": "nov"}, {
            "name": "December",
            "value": "dec"
        }];
      $scope.currentMonth=new Date().getMonth()+1;
      
      $scope.title  = [
          {'name': "App Download Count" , val:'downloadcount',types:[{'name': "Android" , val:'android', monthData:{}},{'name': "IOS" , val:'ios', monthData:{}}]}
          , {'name': " App Uninstalled Count" , val:'uninstallcount', types:[{'name': " Android" , val:'android', monthData:{}},{'name': " IOS" , val:'ios', monthData:{}}]},  
          {'name': "No. of referrals" , val:'referrals',types:[{'name': "Android" , val:'android', monthData:{}},{'name': " IOS" , val:'ios', monthData:{}}]}
      ]
       
      $scope.traffics =[
          {name:"Unique Visitors", monthData:{}},
          {name:"Avg Time Spent", monthData:{}},
          {name:"No. Of Appointments Booked", monthData:{}},
          {name:"No. Of Accounts Created", monthData:{}},
          {name:"Avg No. Of Logins in a Month", monthData:{}}
      ]
      
      $scope.addData =function(i){
          // console.log("---------------------------",i)
          
          
          
      }
   
      
      
      
  }]);