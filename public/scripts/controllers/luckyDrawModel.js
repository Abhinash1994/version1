angular.module('sbAdminApp',['isteven-multi-select']).controller('luckyDrawModelCtrl',function($scope,$http){

	$scope.parlorList={};
	$scope.parlorList.parlors=[];
	$scope.selectedParlorList={};
	$scope.selectedParlorList.list=[];
	$scope.editparlorList=[];
	$scope.editparlor={selected:''};
	$scope.parlor={selected:''};
	$scope.salon={appTransaction:{},salonTransaction:{},customerReview:{},billValue:{},billServices:{},incentiveTargets:[],membershipSold:{},retailProduct:{},sharedBillRatio:{},bestRatedEmployee:{}};
		$scope.editsalon={appTransaction:{},salonTransaction:{},customerReview:{},billValue:{},billServices:{}};
		$scope.show=false;



	$http.get('/graphs/getParlorList').success(function(response){
		console.log(response)
				$scope.parlorList.parlors=response;
				$scope.editparlorList=response;
	})



$scope.call=function(){
								$scope.show=false;
					$http.post('/employee/getParlorModelDraw',{parlorId:$scope.editparlor.selected}).success(function(res){

														if(res.data!=null){
															console.log("-----------",res.data);
															$scope.show=true;
															$scope.editsalon=res.data;
														}
															

					})
}

$scope.call()
$scope.edit=function(){
console.log($scope.editsalon)

			$http.post('/employee/editParlorModelDraw',$scope.editsalon).success(function(res)
            {
                            console.log(res);
                            if(res.success)
                            {
                                alert("Successfully Edited");
                                $scope.show=false;
							     $scope.editparlor.selected='';
                            }
                            
            })

}

    $scope.submit=function()
    {
				var b=[];
$scope.selectedParlorList.list.forEach(function(a){
							b.push(a.id);
				})
				console.log({data:$scope.salon,parlorIds:b});

		$http.post('/employee/createParlorModelDraw',{data:$scope.salon,parlorIds:b}).success(function(res){

					console.log(res);
                if(res.success)
                {
                        //                    $scope.salon={};
                    alert("Lucky Draw model Successfully created")
                }
                    
	})

	}

})
