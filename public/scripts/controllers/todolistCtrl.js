'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3'])
    
  .controller('todo_list',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {

    $scope.edit_task_date2;
    $('#datetimepicker1').datetimepicker({
      format: 'DD-MM-YYYY'
    });
    $('#datetimepicker2').datetimepicker({
      format: 'DD-MM-YYYY'
    });
    $scope.filtertext = "";
  	$scope.value;
    $scope.new_task_description;
    $scope.new_task_duedate;

    $("#datetimepicker1").on("dp.change", function() {

        $scope.new_task_duedate = $("#datetimepicker").val();

    });

    $("#datetimepicker2").on("dp.change", function() {

        $scope.edit_task_date2 = $("#datetimepicker").val();

    });
    console.log($scope.new_task_description);
    $scope.addtask = function(){
      jQuery('#addNewTask').modal('hide');
      console.log($scope.new_task_description,$scope.new_task_duedate);
      $scope.todolist.splice(0, 0,
      {
        description: $scope.new_task_description, 
        status:"Pending", 
        duedate: $scope.new_task_duedate,
        resolved:false
      }
      );
    };
  	$scope.setvalue = function(text){
  		console.log(text);
  		$scope.value = text;
  	}
  	$scope.todolist = [
  		{
  			description:"Complete Task 1",
  			status:"Pending",
  			duedate:"22-7-2016",
  			resolved:false
  		},{
  			description:"Complete Task 2",
  			status:"Pending",
  			duedate:"15-7-2016",
  			resolved:false
  		},{
  			description:"Complete Task 3",
  			status:"Pending",
  			duedate:"29-7-2016",
  			resolved:false
  		},{
  			description:"Complete Task 4",
  			status:"Pending",
  			duedate:"16-7-2016",
  			resolved:false
  		},{
  			description:"Complete Task 5",
  			status:"Pending",
  			duedate:"12-7-2016",
  			resolved:false
  		}
  	];	
  	var date = new Date();
  	for (var i = $scope.todolist.length - 1; i >= 0; i--) {
  		var temp = $scope.todolist[i].duedate.split("-");
  		var tempdate = new Date(temp[2],parseInt(temp[1])-1,temp[0]);
  		if(tempdate < date){
  			if($scope.todolist[i].resolved != true){
  				$scope.todolist[i].status = "Missed";
  				$scope.todolist[i].resolved = true;
  			}
  		}
  	};
  	$scope.isActive = false;
  	$scope.resolve = function(task) {
    	task.resolved = !task.resolved;
  	};

    $scope.setstatus = function(task) {
      task.resolved = true;
      task.status = "Complete";
    };

    console.log($scope.todolist[0]);
    $scope.change = function(task){
      jQuery('#editTask').modal('show');
      $scope.edit_task_date2 = task.duedate;
      $scope.edit_task_description = task.description;
      $scope.edit_task_date = task.duedate;
      for (var i = $scope.todolist.length - 1; i >= 0; i--) {
        console.log(i);
        if($scope.todolist[i]===task){
          $scope.i = i;
          break;
        }
      };
     }

    $scope.edittask = function(){
      
      $scope.todolist[$scope.i].description = $scope.edit_task_description;
      console.log($scope.edit_task_date2);
      if($scope.edit_task_date2.length<2){
        $scope.edit_task_date2 = $scope.edit_task_date;
      }
      $scope.todolist[$scope.i].duedate = $scope.edit_task_date2;
      console.log($scope.todolist[$scope.i]);
      jQuery('#editTask').modal('hide');
      var temp =$scope.edit_task_date2.split("-");
      var tempdate = new Date(temp[2],parseInt(temp[1])-1,temp[0]);
      if(date>tempdate){
        $scope.todolist[$scope.i].resolved = true;

      }else{
        $scope.todolist[$scope.i].resolved = false;
        if($scope.todolist[$scope.i].status == "Missed"){
          $scope.todolist[$scope.i].status = "Pending";
        }
        if($scope.todolist[$scope.i].status == "Completed"){
          $scope.todolist[$scope.i].status = "Pending";
        }
      }
    }

}]);