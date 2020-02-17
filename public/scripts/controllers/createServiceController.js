'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ui.bootstrap','isteven-multi-select'])
  .controller('CreateServiceCtrl', function($scope, $position, $http, $stateParams, $state) {

        $scope.supercategories = [];
        var index = 0;
    $scope.upgradeOptions=[{"name":"Service","value":"service"},{"name":"Sub Category","value":"subCategory"},{"name":"Brand","value":"brand"}];
    $scope.upgradeServices=[];
    function init(){
      $scope.categoryName = $stateParams.categoryName;
      $scope.selectedServiceForTips = {};
      $scope.superCategory = $stateParams.superCategory;
      $scope.tipsData = {tip1 : "", tip1Url : "", tip2 : "", tip2Url : "", tip3 : "", tip3Url : "", tip4 : "", tip4Url : "", tip5 : "", tip5Url : ""};
      $scope.newName = {};
      $scope.newName.name = $stateParams.categoryName;
      $scope.newName.categoryId = $stateParams.categoryId;
      $scope.newName.sort = $stateParams.sort;
      $scope.newName.maleImage = $stateParams.maleImage;
      $scope.newName.femaleImage = $stateParams.femaleImage;
      $scope.data = {};
	  $scope.nums=[1, 2, 3, 4, 5, 6, 7, 8, 9];
      $scope.data.categoryId = $stateParams.categoryId;
      $scope.data.gender = "0";
      $scope.serviceProducts='';
      $http.get("/role1/supercategory").success(function(response, status){
        $scope.supercategories = response.data;
        $scope.newName.superCategory = $scope.superCategory;
        console.log($scope.supercategories);
    });
        $http.post("/role1/getSubCategory").success(function(response, status){
            $scope.subcategories = response.data;
            console.log( $scope.subcategories);
        });

    }
    init();
    function refreshServices(){
      $scope.services = [];
      $http.post("/role1/serviceList", {categoryId : $stateParams.categoryId}).success(function(response, status){
        $scope.services = response.data;
        console.log(response.data);
      $http.get("/role1/allServices").success(function(response, status){
          $scope.allServices = response.data;
          console.log(response);
      });
      $http.get("role1/serviceProduct").success(function(response, status){
        $scope.serviceProducts = response.data.products;
        for(var i=0;i<$scope.services.length;i++){
          for(var j=0;j<$scope.services[i].prices.length;j++){
            $scope.services[i].prices[j]['serviceProducts']=angular.copy($scope.serviceProducts);
            $scope.services[i].prices[j]['selectedServiceProducts']='';
          }
        }

      })
      });
    }
    refreshServices();
    $scope.addService = function(){
      $http.post("/role1/createService", $scope.data).success(function(response, status){
          $scope.services.push(response.data);
          $('#addService').modal('hide');
          init();
      });
    };

     $scope.tip = function(){
          $('#tip').modal('hide');
    };
      $scope.tip1 = function(){
          $('#tip').modal('show');
    };


    $scope.priceListChanged = function(){
    	var max = Math.abs($scope.currService.prices.length - $scope.currService.priceslength);
    	var d = 1;
    	if($scope.currService.prices.length < $scope.currService.priceslength) d = 0;
    	for(var i=0; i<max; i++){
    		if(d){
    			$scope.currService.prices.pop();
    		}else{
    			$scope.currService.prices.push({
    				name : '',
    			});
    		}
    	}

    };

    $scope.updateService = function(idx){
          index = idx;
          $scope.currService = angular.copy($scope.services[idx]);
          console.log($scope.currService);
          $scope.currService.upgradeServices=[];
          if($scope.currService.upgrades.length>0){
            $scope.currService.upgrades.find(function(upgradeElement){
              $scope.allServices.find(function(allServiceElement){
                if(upgradeElement==allServiceElement.serviceId){
                  $scope.currService.upgradeServices.push(allServiceElement);
                }
              })
            })
            //console.log($scope.allServices);
          }
          $scope.currService.thickness = $scope.currService.prices[0].additions.length > 0 ? true : false;
          $scope.currService.colorLength = $scope.currService.prices[0].additions.length > 0 ? true : false;
          $scope.currService.upstyling = $scope.currService.prices[0].additions.length > 0 ? true : false;
          $scope.currService.shampooLength = $scope.currService.prices[0].additions.length > 0 ? true : false;
          $scope.currService.priceslength = $scope.currService.prices.length;
          $('#updateService').modal('show');
    };

    $scope.add=function(idx){
        $('#tip').modal('show');
        $scope.updateService =false;
        $scope.selectedServiceForTips = angular.copy($scope.services[idx]);
      $scope.tipsData = {tip1 : $scope.selectedServiceForTips.tip1, tip1Url : $scope.selectedServiceForTips.tip1Url, tip2 : $scope.selectedServiceForTips.tip2, tip2Url : $scope.selectedServiceForTips.tip2Url, tip3 : $scope.selectedServiceForTips.tip3, tip3Url : $scope.selectedServiceForTips.tip3Url, tip4 : $scope.selectedServiceForTips.tip4, tip4Url : $scope.selectedServiceForTips.tip4Url, tip5 : $scope.selectedServiceForTips.tip5, tip5Url : $scope.selectedServiceForTips.tip5Url};
    };

    $scope.submitTips= function(){
      $scope.tipsData.serviceId = $scope.selectedServiceForTips.serviceId;
        $http.post("/role1/updateTips", $scope.tipsData).success(function(response, status){
          console.log(response)
        $('#tip').modal('hide');
      $scope.tipsData = {tip1 : "", tip1Url : "", tip2 : "", tip2Url : "", tip3 : "", tip3Url : "", tip4 : "", tip4Url : "", tip5 : "", tip5Url : ""};
          
      });
    };

    $scope.editCategory = function(){
          $('#editName1').modal('show');
    }


    $scope.updateServiceName = function(){
        console.log("this",$scope.currService);
        $scope.currService.upgrades=[];
        $scope.currService.upgradeServices.forEach(function(upService){
            $scope.currService.upgrades.push(upService.serviceId);
        })
        console.log("heelo",$scope.currService);
        $http.put("/role1/service", {service : $scope.currService,serviceId : $scope.currService.serviceId}).success(function(response, status){
          console.log(response)
          $('#updateService').modal('hide');
          $scope.services[index].prices[0].thickness = $scope.currService.thickness == true ? [1] : [];
          $scope.services[index].prices[0].colorLength = $scope.currService.colorLength == true ? [1] : [];
          $scope.services[index].prices[0].upstyling = $scope.currService.upstyling == true ? [1] : [];
          $scope.services[index].prices[0].shampooLength = $scope.currService.shampooLength == true ? [1] : [];
          refreshServices();
      });

    };

    $scope.editName = function(){
      $http.put("/role1/category", $scope.newName).success(function(response, status){
          $('#editName1').modal('hide');
          $scope.categoryName = $scope.newName.sort;
      });
    }
	$scope.deleteCategory = function(){
      /* $http.delete("/role1/category/" + $scope.data.categoryId , {}).success(function(response, status){
        console.log(response);
        $state.go('dashboard.services');
          $scope.categoryName = $scope.newName.name;
      });*/
    };
	$scope.deleteService = function(ser){
        /*$http.delete("/role1/service/" + $scope.currService.serviceId, {}).success(function(response, status){
        console.log(response);
          $('#updateService').modal('hide');
          $http.post("/role1/serviceList", {categoryId : $stateParams.categoryId}).success(function(response, status){
              $scope.services = response.data;
          });
      });*/

    };


    $scope.brandsModalList='';
    $scope.brandsModalListOutput='';
    $scope.currServiceObjectRequired=''
    $scope.showAddBrandsModal=function(serviceArray){
        //console.log(serviceArray);

        /*$scope.currServiceObjectRequired=angular.copy(serviceArray);*/
        $('#addBrandsModal').modal('show');
        $http.get("role1/serviceBrand").success(function(response, status){
        /*$scope.currServiceObjectRequired=angular.copy(serviceArray);*/
        $scope.brandsModalList=response.data.brands
        $http.get("role1/serviceProduct").success(function(response, status){
          for(var j=0;j<serviceArray.prices.length;j++){
            /*$scope.currServiceObjectRequired.prices[j].brand['allBrands']=angular.copy($scope.brandsModalList);*/
            serviceArray.prices[j].brand['allBrands']=angular.copy($scope.brandsModalList);
            if((serviceArray.prices[j].brand.brands)&&(serviceArray.prices[j].brand.brands.length>0)){
              for(var i=0;i<serviceArray.prices[j].brand.allBrands.length;i++){
                for(var k=0;k<serviceArray.prices[j].brand.brands.length;k++){
                    if(serviceArray.prices[j].brand.allBrands[i].brandId==serviceArray.prices[j].brand.brands[k].brandId){
                        /*$scope.currServiceObjectRequired.prices[j].brand.allBrands[i].isSelected=true;*/
                        serviceArray.prices[j].brand.allBrands[i].isSelected=true;
                    }
                }
            }

              setTimeout(function(){
                for(var i=0;i<$scope.currServiceObjectRequired.prices.length;i++){
                    $scope.currServiceObjectRequired.prices[i].brand.brands=angular.copy(serviceArray.prices[i].brand.brands)
                    console.log($scope.currServiceObjectRequired.prices[i].brand.brands)
                    $scope.serviceBrandsMultiselectClose($scope.currServiceObjectRequired.prices[i].brand,i)
                  }
                },100)
              }

            /*$scope.serviceBrandsMultiselectClose(angular.copy(serviceArray.prices[j].brand),j);*/
          }
          $scope.currServiceObjectRequired=angular.copy(serviceArray);
          //console.log(serviceArray);




        });

      });
    }
    var serviceProducts='';
    $scope.serviceBrandsMultiselectClose=function(brandsModalListOutput,indexPrice){

      console.log(angular.copy(brandsModalListOutput));

      $http.get("role1/serviceProduct").success(function(response, status){
        serviceProducts = response.data.products;
        for(var i=0;i<brandsModalListOutput.brands.length;i++){
            brandsModalListOutput.brands[i]['allProducts']=angular.copy(serviceProducts);
            if((brandsModalListOutput.brands[i].products)&&(brandsModalListOutput.brands[i].products.length>0)){
                for(var j=0;j<brandsModalListOutput.brands[i].products.length;j++){
                    for(var k=0;k<brandsModalListOutput.brands[i].allProducts.length;k++){
                        if(brandsModalListOutput.brands[i].products[j].productId==brandsModalListOutput.brands[i].allProducts[k].productId){
                            brandsModalListOutput.brands[i].allProducts[k].isSelected=true;
                      }
                    }
                }
            }
        }
       console.log(brandsModalListOutput)
      });
    }
    $scope.createdServiceProductsArray=function(priceId,productsArray){
      console.log(priceId);
      console.log(productsArray)
    }

    $scope.addBrands=function(){
      /*console.log($scope.currServiceObjectRequired);
      console.log($scope.brandsModalListOutput);*/
      var arrayToBeSent=[];
      for(var i=0;i<$scope.currServiceObjectRequired.prices.length;i++){
          var obj={priceId:'',brands:''};
          obj.priceId=$scope.currServiceObjectRequired.prices[i].priceId;
          obj.brands=$scope.currServiceObjectRequired.prices[i].brand.brands;
          arrayToBeSent.push(obj);
      };
      console.log($scope.currServiceObjectRequired.serviceId);
      console.log(arrayToBeSent);
      /*$scope.currServiceObjectRequired.prices[0].brands=$scope.brandsModalListOutput;
      console.log($scope.currServiceObjectRequired.serviceId);
      console.log($scope.currServiceObjectRequired.prices[0]);*/
      $http.put("/role1/serviceBrand", {serviceId : $scope.currServiceObjectRequired.serviceId ,prices: arrayToBeSent}).success(function(response, status){
          console.log(response);
          $scope.currServiceObjectRequired='';
          refreshServices();
          $('#addBrandsModal').modal('hide');
      });

    }
    $scope.addSubCategory=function(){
        console.log("here")
        console.log($scope.sub);
        $http.post("/role1/createSubCategory", $scope.sub).success(function(response, status){
            $('#addSubCategory').modal('hide');
            init();
        });
    }
    $scope.addService1=function(service){
        console.log(service);
        $scope.currService.upgradeServices.push({ serviceCode: service.serviceCode, name:service.name,gender:service.gender,serviceId:service.serviceId});
        console.log($scope.currService.upgradeServices);
        $scope.currService.newServ='';
    }
    $scope.removeService=function(index){
        $scope.currService.upgradeServices.splice(index,1);
    }
    $scope.typeChanged=function(){
        $scope.currService.upgrades=[];
    }

    $scope.preferredProduct=function(products,preferredProduct){
      products.forEach(function(p){
          if(p.productId==preferredProduct.productId)p.popularChoice=true;
      })

    }

  });
