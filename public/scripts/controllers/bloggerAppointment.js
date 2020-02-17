// module  for blogger Appointment
angular.module('sbAdminApp')
.controller('bloggerAppointmentCtrl',function($scope,$http)
{

			    $scope.date =  {

			    }
  				$scope.b=[""]
  			
   				$scope.popup1 = {
    							opened: false
  								};

     			$scope.formats = ['EEEE,d,MMMM,yy'];
     			$scope.format = $scope.formats[0];

    			$scope.open1 = function() {
    										$scope.popup1.opened = true;
 										 };
			$scope.blogger={};
			$scope.searchPhoneNumber=function()
			{
				console.log($scope.date.dt);
				$http.post("/role1/editBloggerAppointment",{phoneNumber:$scope.blogger.phoneNumber,date: $scope.date.dt}).success(function(res){
					console.log(res)
					$scope.bloggersApt={};
					$scope.bloggersApt=res.data;
				})
			}
			$scope.edit=function(a){
				$http.post("/role1/editBloggerAppointment",{edit:true,apptId:a.apptId}).success(function(res){
					if(res.success)
						{
							alert(res.data);
						}
				})
			}
})