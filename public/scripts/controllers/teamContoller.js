'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('TeamCtrl', function($scope,$position, $http, $state,NgTableParams) {
    $scope.members = [];
    $scope.data={}
    $scope.role=role;
    
      $scope.months=[{"name":"January","value":0},{"name":"Feburary","value":1},{"name":"March","value":2},{"name":"April","value":3},{"name":"May","value":4},{"name":"June","value":5},{"name":"July","value":6},{"name":"August","value":7},{"name":"September","value":8},{"name":"October","value":9},{"name":"November","value":10},{"name":"December","value":11}]
      $scope.year=['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
      $scope.item1=$scope.year[0]


       $scope.submitEmp=function(){
          $scope.days=getDaysInMonth($scope.data.month.value,Number($scope.item1))
          console.log("all days",$scope.days)
           $http.post("/role3/report/empAttendance",{month:$scope.data.month.value,year:Number($scope.item1)}).success(function(response, status){
           
            $scope.stats = response.data;
            console.log("here",$scope.stats)
            
         });
        
      }

       $http.post("/role2/teamMembers").success(function(response, status){
          $scope.members = response.data;
      });
       
       
       
    $scope.loadData = function () {
            var data=[];
            var options = { hour: 'numeric', minute: '2-digit' };

             $scope.stats.forEach(function(employee){
                employee.attendace.forEach(function(attendance){
                    data.push({"Name":employee.name,"Date":attendance.date,"From":new Date(attendance.shifts[0].from).toLocaleString('en-US', options),"To":new Date(attendance.shifts[0].to).toLocaleString('en-US', options),"Center Name":attendance.shifts[0].centerName})
                })
                })
             console.log("final data",data)
                return data;
    };

    function getDaysInMonth(month, year) {
     var date = new Date(year, month, 1,12,0,1);
     var days = [];
     var dateInString='';
     while (date.getMonth() === month) {
        dateInString=date.toISOString().substring(0,date.toISOString().indexOf("T"))
        days.push(dateInString);
        date.setDate(date.getDate() + 1);
     }
     return days;
      }



      $scope.refresh = function(){
        $http.post("/role2/teamMembers").success(function(response, status){
          $scope.members = response.data;
          console.log($scope.members)
        });
      };

      $scope.refresh();


      $scope.addMember = function(){
          if($scope.data.lastName==undefined){
              $scope.data.lastName="";
          }
        console.log($scope.data)
          $http.post("/role2/createTeamMember", $scope.data).success(function(response, status){
              $scope.members = response.data;
              $http.post("/role3/employees").success(function(response, status){
                  employees = response.data;
              });
              $scope.data = {};
              $('#addMember').modal('hide');
            });
      };


      $scope.changeActive = function(userId, active){
          var data = {userId : userId, active : active};
          $http.post("/role2/changeActiveOfTeam", data).success(function(response, status){
              
            });
      };
      
      $scope.changeIncentiveForSalon = function(userId, salonIncentive){
        var data = {userId : userId, salonIncentive : salonIncentive};
        console.log("change active incentive",data)
        $http.post("/role2/changeSalonIncentiveOfTeam", data).success(function(response, status){
            console.log("changed of value",response)
          });
    };

	  $scope.makeCSVData = makeCSVData;
        var index = 0;
        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.members
        };

        $scope.tableParams = new NgTableParams(parameters, settings);

        //$log.debug('Params : ',$scope.tableParams);

        function makeCSVData(){
            var csvData = $scope.members;
            csvData.unshift({name:'name', emailId:'Email Id',phoneNumber:'Phone Number',category:'Category',position:'Position'});
            return csvData;
        }

      $scope.openMemberDetail = function(userId, name){
          $state.go('dashboard.member-detail', {userId: userId, userName : name});
      };
  });
