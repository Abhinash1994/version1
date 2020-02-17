'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3'])
    
  .controller('employeeHomeController',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {

    $scope.data = {};

    $scope.time = [
        {
            period : "one",
            name : "Yesterday"
        },
        {
            period : "two",
            name : "This Week"
        },
        {
            period : "three",
            name : "This Month"
        }
    ];

	$scope.EAoptions = {
        chart: {
            type: 'discreteBarChart',
            height: 350,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
            }
        }
    };


    $scope.EFHoptions = {
        chart: {
            type: 'pieChart',
            height: 350,
            donut: true,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: true,
            pie: {
                startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
            },
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 70,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.selected_period = "one";
    $scope.change = function(){
        var postData = new Object();
        postData.period = $scope.selected_period;
        $http.post("/role2/employeeHomeDetail",postData).success(function(data){
            $log.debug(data);
            $scope.data = data;

            $scope.attendance = $scope.data.attendance;
            $scope.avgService = $scope.data.avg_services_per_emp;
            $scope.mostProductiveEmployee = $scope.data.mostProductiveEmployee;
            $scope.leastProductiveEmployee = $scope.data.leastProductiveEmployee;

            $scope.EAdata = [{}];
            var len = $scope.data.appointment_trend.length;
            for(var i = 0;i<len;i++){
                $scope.data.appointment_trend[i].label = $scope.data.appointment_trend[i].name;
                $scope.data.appointment_trend[i].value = $scope.data.appointment_trend[i].appointments;
                delete $scope.data.appointment_trend[i].name;
                delete $scope.data.appointment_trend[i].appointments;
            }
            $scope.EAdata[0].values = $scope.data.appointment_trend;
            $scope.EAdata[0].key = "Cumulative Returns";

            len = $scope.data.unproductive_hrs.length;
            for(var i = 0;i<len;i++){
                $scope.data.unproductive_hrs[i].key = $scope.data.unproductive_hrs[i].name;
                $scope.data.unproductive_hrs[i].y = $scope.data.unproductive_hrs[i].hrs;
                delete $scope.data.unproductive_hrs[i].name;
                delete $scope.data.unproductive_hrs[i].hrs;
            }
            $scope.EFHdata= $scope.data.unproductive_hrs;
        });
    }
    $scope.change();

  }]);
