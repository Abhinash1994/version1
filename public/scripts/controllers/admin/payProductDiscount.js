angular.module('sbAdminApp',['ngCsvImport'])
.controller("payProductDiscount",function($scope,$http){

	$http({
            method: 'GET',
            url: '/role1/getThisMonthProductDiscount',
        }).success(function(response){
            // console.log(response);
            $scope.parlors=response.data;
        });

		

   var today=new Date();
        $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};
  		$scope.dateSelected=function(){
            // console.log($scope.dateRangeSelected);
		}

        $scope.updateParlorsSelected=function()
        {

        }

        $scope.apply=function(data){
            console.log("data",data);
            var finalData=[];
            data.forEach(function(element1) {
               var element= element1[0].split(',')
                finalData.push({parlorId:element[0],discountGenerated:element[1],adjustment:element[2],discountPaid:element[3],balance:element[4]})
                
            }, this);
            console.log("final data",finalData);
            $http.post('/role1/updateProductDiscountInSettlement',{data:finalData}).success(function(response){
                alert("Updated Successfully")
            })

        }

})