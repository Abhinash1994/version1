angular.module('sbAdminApp').controller('monthLedgerCtrl', function($scope,$http,$timeout) {
	$scope.loginRole = role;
	$scope.loginUserType = userType;
    $scope.year=[2018,2019,2020,2021,2022,2023,2024,2025]

	
		$scope.user=role;
			$scope.parlors=[];
			$scope.selected={};
			if ((role == 2 || role == 7) && (userType == 0)) {
				
						$scope.selected.parlor=parlorId
					}


			

$scope.month=[{name:'January',value:0},{name:'February',value:1},{name:'March',value:2},{name:'April',value:3},{name:'May',value:4},
{name:'June',value:5},{name:'July',value:6},{name:'August',value:7},{name:'September',value:8},{name:'October',value:9},{name:'November',value:10},{name:'December',value:11}]

$scope.check=function()
		{

			// console.log($scope.dt);
			// console.log($scope.selected)
			
		}
	if(role==1)
	{
				$http.post('/role1/allParlors').success(function(response)
		{
					$scope.parlors=response.data;
					// console.log('name',response.data);
					$scope.selected.parlor=response.data[0].parlorId;
		})



	}

	$scope.getLedger=function(){
       // console.log('hello ',$scope.item,$scope.item1)
				$scope.data={
                    month:$scope.item,
                    year: $scope.item1
				}
          //  console.log($scope.data)
			$http.post('/role3/settlementLedger',$scope.data)
			.success(function(res){
				//console.log('HI',res)
				$scope.data=res.data;
               // console.log($scope.data);
                $scope.totalAmountAdjusted=0;
                $scope.totalAmountPaid=0;
                $scope.data.monthWiseDetail.forEach(function(element) {
                    $scope.totalAmountAdjusted+=element.amountAdjustedInThisSettlement;
                    $scope.totalAmountPaid+=element.amountPaidToSalon;
                }, this);
			})
	}
  $scope.amount = '';

            


			

})