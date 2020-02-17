angular.module('sbAdminApp', [ 'ui.bootstrap'])
.controller('create&EditCtrl',function($scope,$http){
				$scope.createDeals={};
				$scope.a='e.g hair cut @ {{X}}';
				$scope.b='E.G Get hair cut @ {{X}} and {{Y}} % off on first download'
				$scope.tableData=[]

				

			$scope.getDailyDeals=function(){


				$http.get("/role1/getDailyDeals").success(function(res){
							// console.log(res);
							$scope.tableData=[];
							$scope.tableData=res.data;
				})

			}	
			$scope.getDailyDeals();	


				$scope.createDeal=function(){
									// console.log($scope.createDeals);
								if($scope.createDeals.offerGender!=undefined){
												$http.post("/role1/createDailyDeal",$scope.createDeals).success(function(res)
											{
															// console.log(res);
																$scope.getDailyDeals();
																$scope.createDeals={};
											})

								}

								else{
									alert("Please select Your Gender");
								}

					}


				$scope.editDeal=function(deal){
								$("#myModal").modal('show');
								$scope.edit=deal;
				}

				$scope.updateDeal=function(){

											$http.post("/role1/updateDailyDeal",$scope.edit).success(function(res){
															// console.log(res);
															$("#myModal").modal('hide');	
																$scope.getDailyDeals();
											})	



										}
			$scope.removeDeal=function(a){
						var b={_id:a._id};
						
						$http.post("/role1/removeDailyDeal",b).success(function(res){
									$scope.getDailyDeals();		
						})

			}


})