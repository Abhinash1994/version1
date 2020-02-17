angular.module("sbAdminApp").controller("searchByCtrl",function($scope,$http){
	$scope.data={}
	$scope.getData=function(){
		console.log($scope.data)
				$http.post("/role3/salonConvertAppointment",{phoneNumber:$scope.data.phoneNumber}).success(function(res){
						console.log(res)
							$scope.searchedData=res.data;

				})

	}

$scope.startAppointment=function(rd){


			if(confirm("Are you sure , do you want to start Appointment")==true)
			{
					$http.post("/role3/salonConvertAppointment",{apptId:rd}).success(function(res){
						console.log(res)
						$scope.getData();
							// $scope.searchedData=res.data;

				})			
			}
			else
			{
						console.log("")
			}


}





})