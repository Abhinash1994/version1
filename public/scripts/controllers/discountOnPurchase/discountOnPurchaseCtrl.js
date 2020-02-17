
angular.module('sbAdminApp',['isteven-multi-select']).controller('discountOnPurchaseCtrl',function($scope,$http,Excel,$timeout){

	$scope.parlors=[]
	$scope.copied={selectedParlor:[]}
	$scope.parlor={selected:''}
	$scope.discountOnPurchase=[];
	// console.log(role);

	$scope.year=["2017","2018","2019","2020","2021","2022","2023","2024","2025"];
	$scope.years=$scope.year[0];
	$scope.user=role;
	$scope.paidButton='Paid';

	
$scope.paidUnpaidButtonClick=function(id,paid) {
$http.post('/role1/dopPaid',{id:id,paid:paid}).success(function(response) {
	// console.log(response)
	$scope.refreshMe()

})
};
	
	$scope.loadData = function () {  
			  $http.get('/role1/discountOnPurchaseAllSalonMontly?month='+$scope.month+'&year='+$scope.years).success(function(response) {
				$scope.discountData=response.data;
				console.log("final",$scope.discountData)
				
		 }) 
		  
	};
		

        $scope.exportToExcel = function (tableId) {
         var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download


      }

$scope.checkPurchaseandSeller=function(a,b){

			if(a==undefined && b!=undefined){
				return "changeColor";
			}

			else  if(a==undefined && b==undefined){
				return "changeSeller";
			}

			else{
				return  "no";
			}


}







$scope.refreshMe=function(){

		if( userType=="0" && (role==2 || role==7)){
						$http.get('/role3/discountOnPurchase').success(function(response){
								// console.log("parlor logged In");
					$scope.discountOnPurchase=response.data;
												// console.log($scope.discountOnPurchase)

		})

		}
	if(role!=7){
	$http.post('/role3/allParlors').success(function(response){
						$scope.parlors=response.data;
		})
	}

if(role==1||role==11 ||role==3){
$http.post('/role1/allParlors').success(function(response){
					$scope.parlors=response.data;
	})
}



	$scope.check=function(){
		$scope.discountOnPurchase=[];

		// console.log($scope.parlor.selected);
		$http.post('/role1/discountOnPurchase',{parlorId:$scope.parlor.selected}).success(function(response){
			// console.log(response);
					$scope.discountOnPurchase=response.data;
		})
	}
$scope.check();

}

$scope.refreshMe()


})
