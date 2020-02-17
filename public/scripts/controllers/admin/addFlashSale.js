angular.module('sbAdminApp')
.controller('addFlashSale',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {
    

    $scope.selected={parlor:''}
    $http.post('/role1/editFlashCoupon').then(function(response){

        // console.log(response)
  
        $scope.flashSales=response.data.data

    });
    $scope.flash={};
    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };
    var today = new Date();
    $scope.starts_at = new Date(today.getFullYear(),today.getMonth(),1);
    // console.log($scope.starts_at);
    $scope.expires_at = new Date();
    $scope.row={};
    $http.post("/role1/categoryList").success(function(response, status){
        // console.log(response);
        $scope.categories = response.data;
    });
    
    $scope.categoryChanged=function(id){
        // console.log(id);
        $http.post("/role1/serviceList", {categoryId :id}).success(function(response, status){
            $scope.services = response.data;
            // console.log(response.data);
        });
    };
    $scope.serviceChanged=function(service){
        // console.log("services changed",service);
        $scope.brands=service.prices[0].brand.brands;
        $scope.ser=service
    }
    $scope.editSalons=function(index){
        // console.log("edit salons called");
        $scope.flashSaleId=$scope.flashSales[index]._id;
        $scope.salonData=$scope.flashSales[index].parlors;
    }
    $scope.addSer=function(row){
        // console.log("add ser",$scope.row)
        $scope.flash.serviceCodes=[];
        $scope.flash.serviceCodes[0]={
                        departmentId:"1", 
                        categoryId:$scope.row.categoryId, 
                        brandId:$scope.row.brand ? $scope.row.brand.brandId : null,
                        productId :$scope.row.productId  ? $scope.row.productId : null, 
                        serviceId :$scope.ser.serviceId, 
                        serviceCode:$scope.ser.serviceCode ,
                        price :$scope.flash.price,
                        serviceName:$scope.ser.nameOnApp
                }
                // console.log("add ser",$scope.flash)
    }

	$http.post('/role1/allParlors').success(function(response){
        $scope.parlors=response.data;
        console.log("parlors", $scope.parlors)
    })
    $scope.addSalon=function(parlor){
        // console.log("console.log",parlor);
        var check=false
        $scope.salonData.forEach(function(element) {
            if(parlor.parlorId==element.parlorId)check=true
        }, this);
        if(check){
            alert("Salon Already Exists in This Flash Sale")
        
        }else{
            $scope.salonData.push({currentCount:3,maximumCount:3,name:parlor.name,parlorId:parlor.parlorId})
        }
    }
    $scope.editSalonInFlash=function(){
        // console.log("edit flash sale salons")
        // console.log("salon data",$scope.salonData);
        // console.log("flashSale iD ",$scope.flashSaleId);
        $http.post('/role1/editFlashCoupon',{couponId:$scope.flashSaleId,parlors:$scope.salonData,edit:1}) 
        .success(function(res){
            // console.log(res);

        }) 
    }
    $scope.removeSalon=function(index){
        // console.log("splicing at index",index)
        $scope.salonData.splice(index, 1);
    }
    $scope.addFlashModal=function(){
        $('#addFlash').modal('show');
    }
    $scope.addFlashSale=function(rating){
        var ambience=[{"ambienceRating1":$scope.ambienceRating1},{"ambienceRating2":$scope.ambienceRating2},{"ambienceRating3":$scope.ambienceRating3},{"ambienceRating4":$scope.ambienceRating4},{"ambienceRating5":$scope.ambienceRating5}];
        $scope.flash.starts_at.setHours(0);
        $scope.flash.starts_at.setMinutes(0);
        $scope.flash.starts_at.setSeconds(0);
        $scope.flash.expires_at.setHours(23);
        $scope.flash.expires_at.setMinutes(59);
        $scope.flash.expires_at.setSeconds(59);
        $scope.flash.ambience = ambience;
        $scope.flash.cityPrice=[{cityId :1,price :$scope.flash.price},{cityId :2,price :$scope.flash.price},{cityId :3,price :$scope.flash.price}];
        console.log("flash object",$scope.flash);
        $http.post("/role1/createFlashCoupon",{'flashObj':$scope.flash}).success(function(response, status){
            // console.log(response);
            $('#addFlash').modal('hide');
            $scope.flash={};
        });
    }


});