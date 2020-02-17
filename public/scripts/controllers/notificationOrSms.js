
		angular.module("sbAdminApp",[ 'isteven-multi-select'])
		.controller("notificationOrSmsCtrl",function($scope,$http)
	{

					$scope.buttonDisable=false;
					$scope.parlors=[];
					$scope.role=[{role:0,name:"Operations"}
								,{role:2,name:"Manager"}
								,{role:3,name:"Receptionist"},
								{role:4,name:"Stylist"}
								,{role:5,name:"Helper"}
								,{role:6,name:"Masseuse"},
								{role:7,name:"salon owner"}
								,{role:8,name:"Assistant Manager"}
								,{role:9,name:" Salon Head"}]


					$scope.message={};
					$scope.notification={}

					$scope.checkBox={
										sms:0,
										notification:0
					}
					$scope.copiedRoles={};

					$scope.parlor={};
						$http.get("/beuApp/getParlors").success(function(response){
							console.log(response);
								$scope.parlors=response.data
						})

			$scope.optionChanged=function(i){

			}
			$scope.roleChanged=function(i){

			}


		$scope.submitNow=function(){
			$scope.buttonDisable=true;	
			var a={roles:[],parlorIds:[],sms:0,notification:0,notificationTitle:$scope.notification.title,notificationText:$scope.notification.message,messageText:$scope.message.message};
				$scope.copiedRoles.role.forEach(function(b){
									a.roles.push(b.role)
					})
				$scope.parlor.copiedParlor.forEach(function(b){
								a.parlorIds.push(b._id)
				})

				a.sms=$scope.checkBox.sms?1:0;
				a.notification=$scope.checkBox.notification?1:0;
					console.log(a)
				$http.post("/beuApp/notificationSmsToSalons",a)
				.success(function(res){
					alert(res.message);
						$scope.buttonDisable=false;		
				})


		}

	})
