angular.module('sbAdminApp')
		.controller("customerMonthCohortCtrl",function($scope,$http,$timeout,Excel){
				$scope.monthNames = ["", "January", "February", "March", "April", "May", "June",
								"July", "August", "September", "October", "November","December" ];
				$http.get("/beuApp/getParlors").success(function(res){
							$scope.parlors=res.data;
				})



				$scope.filter=function()
			{

					// console.log($scope.selectedParlor)
			
 						 $('#tableToExport').fixedHeaderTable('destroy');
				$http.post('/role1/cohortMonthlyReport').success(function(res){
							
							$scope.monthlyCohort=res;
							// console.log(res)
							// console.log($scope.monthlyCohort.length)
							var c=1;
							var d=angular.copy($scope.monthlyCohort.length);
									// console.log("hello")
								for(var j=$scope.monthlyCohort[0].month;j>1;j--)
									{
										// var b={month:0,uniqueClients:0,uniqueRevenue:0,repeatedClients:[]};
										// b.month=c;
										// b.repeatedClients[0]=null;
										// c++;
										$scope.monthlyCohort.splice(0,0,{});
									}
									// console.log("hello")
						
								$scope.monthlyCohort.forEach(function(a,i){

										if(!a.month)
										{
											a.month=i+1;
											// a.repeatedClients=[];
											// a.repeatedClients[0]=null;
										}
								})
					

							$scope.monthlyCohort.forEach(function(a)
							{
											var h={total:0,totalRevenue:0}
									if(!a.repeatedClients)
									{
										a.repeatedClients=[];
									}
									if(a.repeatedClients[0]!=null)
									{
											a.repeatedClients[0].forEach(function(d)
											{
														h.total+=d.count;
														h.totalRevenue+=d.payableAmount;
											})
										a.totalRevenue=h.totalRevenue;
										a.total=h.total
									}
											
							})



									$scope.monthlyCohort=$scope.monthlyCohort.map(function(b){
													var c={month:0};
													
								if(b.repeatedClients[0])
								{
										if(b.repeatedClients[0][0])
									{
											c.month=b.repeatedClients[0][0].month;
											for(i=0;i<c.month-1;i++)
										{
											b.repeatedClients[0].splice(0,0,{});
										}
									}

								}
										else
								{

										// 	for(i=0;i<12;i++)
										// {
										// 			for(i=0;i<c.month-1;i++)
										// 			{
										// 				b.repeatedClients[0].splice(0,0,{});
										// 			}	
										// }
								}
												
													
										
												return b;
					})

									// console.log($scope.monthlyCohort)

						




					$timeout(
                           function() {
                               $('#tableToExport').fixedHeaderTable({
                                   fixedColumn: true});
                               var myTable = document.getElementById('firstRowFirstCell');
                               
                               document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight
                               // console.log(document.getElementsByClassName("fht-cell"));
                               var a=document.getElementsByClassName("fht-cell");
                               var mid=(a.length-1)/2
                               for(var i=1;i<=mid;i++){
                                   a[i].clientWidth=a[i+mid].clientWidth;
                                   a[i].offsetWidth=a[i+mid].clientWidth;
                                   a[i].scrollWidth=a[i+mid].clientWidth;
                                   a[i].style.width=a[i+mid].style.width;
                                   console.log(i+" "+(i+mid));
                               }
                           }
                       );
									// console.log($scope.monthlyCohort)
							
				})

			}
                
                $scope.filter();

				 $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }



				
		})