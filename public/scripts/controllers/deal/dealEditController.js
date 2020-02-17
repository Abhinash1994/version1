'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ui.bootstrap','isteven-multi-select','ngSanitize'])
    .controller('dealCtrl', function($rootScope,$scope,$position, $http,$state,$stateParams) {
    $scope.dealIdParlor = $stateParams.dealIdParlor;
    console.log($scope.dealIdParlor);
    $scope.comboServices=[];
    $scope.dealTypes=[{"name":"Flat Price","value":"chooseOne"},{"name":"Percentage Discount","value":"chooseOnePer"},{"name":"Frequency","value":"frequency"},{"name":"Combo","value":"combo"},{"name":"Flat Price","value":"dealPrice"},{"name":"New Combo","value":"newCombo"}];
    $scope.weeks=[{"name":"All Day","value":1},{"name":"Weekday","value":2},{"name":"Weekend","value":3}];
    $scope.newComboServiceType=[{"value":"service","name":"Service"},{"value":"subCategory","name":"Sub Category"},{"value":"category","name":"Category"}];
    $http.post("/role1/categoryList").success(function(response, status){
        console.log(response);
        $scope.categories = response.data;
    });
    $scope.checkingDate=new Date();
    $http.get("/role1/deals").success(function(response, status){
        $scope.deals = response.data;
        console.log($scope.deals);
        $scope.dealCategories=[];
        $scope.deals.forEach(function(deal){
            if($scope.dealCategories.indexOf(deal.category)<0){
                $scope.dealCategories.push(deal.category);
            }
        });
        console.log($scope.dealCategories);
    });
    $scope.newServ=[];
    $scope.deal={};
    $scope.deal.services=[];
    $scope.deal.newCombo=[];
    $scope.deal.products=[];
    $scope.selectedServiceProducts='';
    $scope.allCategoriesList='';
    $scope.selectedCatInCatList='';
    $scope.genderList=[{'name':'Male','genderId':'M'},{'name':'Female','genderId':'F'}];
    $scope.parlorList=[{'name':'Red Salon','type':0}, {'name':'Blue Salon','type':1}, {'name':'Green Salon','type':2}];
    $scope.genderSelectedList='';
    $scope.parlorSelectedList='';
    $scope.removeService=function(index){
        $scope.deal.services.splice(index,1);
    }
    
    $http.get("/role1/allServices").success(function(response, status){
        $scope.services = response.data;
        console.log(response);
    });
    $http.post("/role1/categoryList").success(function(response, status){
        console.log(response);
        $scope.categories = response.data;
    });

    $scope.addService=function(service){
        $scope.deal.services.push(service);
        $scope.newServ={};
        console.log(service);
    }
    $scope.serviceBrandsList='';
    $scope.brandsObjectToBeSent={};
    $scope.serviceProductsList='';
   $scope.newParlorList=[]; 
   function refreshDeals(){
    $scope.newParlorList=[];
        $http.get("/api/allParlorsWithActiveInactive").success(function(response, status){
            $scope.salons = angular.copy(response.data);
            console.log(response);
     if(parseInt($scope.dealIdParlor)){
        console.log($scope.dealIdParlor);
        console.log("sdasda");
        $http.get("/role1/deal?dealId=" + $scope.dealIdParlor).success(function(response, status){
                console.log($scope.deal);
                console.log(response);
                $scope.deal = response.data;
                console.log($scope.deal);
                 $scope.parlorIds=[];
                $scope.deal.active=$scope.deal.active ? true: false;
                $scope.deal.parlors.forEach(function(p){
                    p.startDate=new Date(p.startDate);
                    p.endDate=new Date(p.endDate);
                    $scope.parlorIds.push(p.parlorId)
                    p.name = getParlorName(p.parlorId);
                    
                });
                for(var k=0;k<$scope.salons.length;k++){
                    if(!$scope.deal.parlors.filter(function (ar) {return ar.parlorId == $scope.salons[k].parlorId;})[0]){
                        $scope.newParlorList.push($scope.salons[k]);
                    }
                }// finds out the salon which does not have a deal 
                 console.log($scope.newParlorList)
                $http.get("role1/serviceBrand").success(function(response, status){
                    console.log(response);
                    $scope.serviceBrandsList=response.data.brands;
                    for(var i=0;i<$scope.serviceBrandsList.length;i++){
                        $scope.deal.brands.find(function(element){
                            if(element.name == $scope.serviceBrandsList[i].name) {
                                console.log($scope.serviceBrandsList[i].name)
                                $scope.serviceBrandsList[i].isSelected=true;
                            }
                        })
                           
                    }
                });
                $http.post("/role1/categoryList").success(function(response, status){
                    console.log(response);
                    $scope.allCategoriesList=response.data;
                    $scope.deal.categoryIds.find(function(element){
                        $scope.allCategoriesList.find(function(subElement){
                            if(subElement.categoryId==element){
                                subElement.isSelected=true;
                            }
                        })
                    });
                    console.log($scope.deal.parlorTypes);
                    console.log($scope.deal.genders);
                    $scope.deal.genders.find(function(element){
                        $scope.genderList.find(function(subElement){
                            if(element==subElement.genderId){
                                subElement.isSelected=true;
                            }
                        })
                    });

                    $scope.deal.parlorTypes.find(function(element){
                        $scope.parlorList.find(function(subElement){
                            console.log(element);
                            console.log("-----------------");
                            if(element==subElement.type){
                                subElement.isSelected=true;
                            }
                        })
                    })
                });
                
        });
    }

    });
   }

   refreshDeals();
    $scope.modalRatioList='';
    $scope.openEditParlorRatioModal=function(brandsPassed){
        console.log(brandsPassed)
        $scope.modalRatioList=brandsPassed;
        $('#editRatioModal').modal('show');
    }

    function getParlorName(parlorId){
        var parlorName = "";
        $scope.salons.forEach(function(s){
            if(s.parlorId == parlorId)parlorName = s.name+"-" + s.address1;
        });
        return parlorName;
    }
    $scope.checkDealByParlor=function(salon){
        console.log(salon);
        $http.post("/role1/checkServiceDeal",{'dealId':salon.dealId}).success(function(response, status){
            console.log(response);
            salon.checkPassed=response.data.checkPassed;
            salon.checkMessage=response.data.checkMessage;
            /*$scope.deal.parlors.find(function(parlorsElement){
                if(parlorsElement.dealId==salon.dealId){
                    console.log(parlorsElement);
                    salon.checkPassed=parlorsElement.checkPassed;
                }
            })*/
        });
    }
    $scope.updateDealByParlor = function(salon){
        console.log(salon);
        $http.put("/role1/deal", salon).success(function(response, status){
            $scope.services = response.data;
            console.log(response);
        });
    };

     $scope.deleteDealByParlor = function(salon){
        console.log(salon);
        $http.post("/role1/deletedeal", salon).success(function(response, status){
            // $scope.services = response.data;
            refreshDeals();
            console.log(response);
        });
    };
    $scope.dropDown=function (salons) {
        console.log(salons);
        if($scope.dealIdParlor!=0){
        salons.forEach(function(salon){
            if( $scope.parlorIds.indexOf(salon.parlorId)<0){
                $scope.deal.parlors.push(salon)
            }
        });
        }else{
            $scope.deal.parlors=salons;
        }
        console.log($scope.deal);
    }
    $scope.submitDeal=function(){
        console.log($scope.deal);
        if($scope.dealIdParlor == 0){
            console.log($scope.deal)
            $http.post("/role1/deal", $scope.deal).success(function(response, status){
                $scope.services = response.data;
                console.log(response);
            });
            console.log($scope.deal);
        }else{
            var data3 = {
                dealId : $scope.dealIdParlor,
                name : $scope.deal.name,
                description : $scope.deal.description,
                shortDescription : $scope.deal.shortDescription,
                category : $scope.deal.category,
                sort : $scope.deal.sort,
                weekDay : $scope.deal.weekDay,
                dealSort: parseInt($scope.deal.dealSort),
                services : $scope.deal.services,
                brands : $scope.deal.brands,
                categoryIds: $scope.deal.categoryIds,
                isDeleted:$scope.deal.isDeleted,
                active:$scope.deal.active ? 1 :0,
                parlorTypesDetail:$scope.deal.parlorTypesDetail,
                genders:$scope.deal.genders,
                allHairLength:$scope.deal.allHairLength,
                parlorTypes:$scope.deal.parlorTypes,
            };
            console.log(data3);
            $http.post("/role1/deals", {data : data3}).success(function(response, status){
                $scope.services = response.data;
                console.log(response);
                refreshDeals();
            });
        }
    }

    
    $scope.serviceBrandsSelectedFn=function(brandsList){

        if($scope.brandsObjectToBeSent.length>0){
                $scope.brandsObjectToBeSent=brandsList;
                $http.get("role1/serviceProduct").success(function(response, status){
                    for(var i=0;i<$scope.brandsObjectToBeSent.length;i++){
                        $scope.brandsObjectToBeSent[i].allProducts=angular.copy(response.data.products);
                    }
                    console.log(brandsList);
                    if(($scope.deal.brands)&&($scope.deal.brands.length>0)){
                            for(var i=0;i<$scope.brandsObjectToBeSent.length;i++){
                                $scope.deal.brands.find(function(element){
                                    if(element.name == $scope.brandsObjectToBeSent[i].name) {
                                        for(var j=0;j<$scope.brandsObjectToBeSent[i].allProducts.length;j++){
                                            element.products.find(function(subElement){
                                                if($scope.brandsObjectToBeSent[i].allProducts[j].productId==subElement.productId){
                                                        $scope.brandsObjectToBeSent[i].allProducts[j].isSelected=true;
                                                        $scope.brandsObjectToBeSent[i].allProducts[j].ratio=subElement.ratio;     
                                                }
                                            })
                                        }
                                        console.log($scope.serviceBrandsList[i].name)
                                        $scope.brandsObjectToBeSent[i].ratio=element.ratio;

                                    }
                            })
                                          
                        }
                    } 
                    $('#serviceBrandsModal').modal('show'); 
                });

        }else{
            $scope.deal.brands=$scope.brandsObjectToBeSent;
        }
        
        
    }
    $scope.serviceProductsSelectedFn=function(productsSelectedList){
        console.log(productsSelectedList);
    }
    $scope.addBrandsObject=function(){
        console.log($scope.brandsObjectToBeSent)
        $scope.deal.brands=$scope.brandsObjectToBeSent;
        console.log($scope.deal);
       var data3 = {
                dealId : $scope.dealIdParlor,
                name : $scope.deal.name,
                description : $scope.deal.description,
                category : $scope.deal.category,
                sort : $scope.deal.sort,
                weekDay : $scope.deal.weekDay,
                dealSort: parseInt($scope.deal.dealSort),
                services : $scope.deal.services,
                brands : $scope.deal.brands,
                categoryIds: $scope.deal.categoryIds,
                isDeleted:$scope.deal.isDeleted,
                active:$scope.deal.active ? 1 :0,
                
                genders:$scope.deal.genders,
                parlorTypes : $scope.deal.parlorTypes,
            };
            console.log(data3);
            $http.post("role1/dealsBrand", {data : data3}).success(function(response, status){
                console.log(response);
                refreshDeals();
            });
        //to check if brands is added in deals or not check console of 57 line where /role1/deal is the api
    }

    $scope.categoriesSelected=function(selectedCats){
        console.log(selectedCats);
        $scope.deal.categoryIds=[];
        selectedCats.find(function(element){
            $scope.deal.categoryIds.push(element.categoryId);
        });
        console.log($scope.deal.categoryIds)
    }

    $scope.genderSelected=function(genderSelected){
        console.log(genderSelected);
        $scope.deal.genders=[];
        genderSelected.find(function(element){
            $scope.deal.genders.push(element.genderId);
        });
    }

    $scope.parlorSelected=function(parlorSelected){
        console.log(parlorSelected);
        $scope.deal.parlorTypes=[];
        parlorSelected.find(function(element){
            $scope.deal.parlorTypes.push(element.type);
        });
    }

    $scope.categoryChanged=function(id){
        console.log(id);
        $http.post("/role1/serviceList", {categoryId :id}).success(function(response, status){
            $scope.services = response.data;
            console.log(response.data);
    }
                                                                   
    )};
    $scope.addNewComboService=function(record){
        console.log(record);
        var serviceIds=[];
        var gender=[];
        var serviceName=[];
        record.serviceId.forEach(function(sids) {
            serviceIds.push(sids.serviceId)
            
        });
        $scope.deal.newCombo.push({ categoryId: record.categoryId, serviceIds: serviceIds,type:record.type,title:record.title});
        console.log($scope.deal.newCombo);
    }

    /*//////////////////////////////add new parlor work \\\\\\\\\\\\\\\\\\\\\\\starts\\\\\\\\\\\\\\\\\\\\\\\*/
    $scope.addNewParlorObj={};
    $scope.showAddNewParlorModal=function(){
         $scope.addNewParlorObj={};
        $('#addNewParlor').modal('show');
        console.log($stateParams.dealIdParlor);
    };
    $scope.newParlorSelected=function(parlorSelected){
        console.log(parlorSelected)
        $scope.addNewParlorObj.parlorId=parlorSelected;
        //$scope.addNewParlorObj.name=parlorSelected.name;
    }
    $scope.submitNewParlor=function(){
        $scope.addNewParlorObj.dealParlorId=$stateParams.dealIdParlor;
        $scope.addNewParlorObj.brands=$scope.deal.parlors[0].brands;
        console.log($scope.addNewParlorObj);
        $http.put("/role1/deal", $scope.addNewParlorObj).success(function(response, status){
            $scope.services = response.data;
            console.log(response);
            $('#addNewParlor').modal('hide');
             refreshDeals();
        });
        
    };
    $scope.editAppPageModalOpen=function(){
        $('#editAppPage').modal('show');
        console.log($stateParams.dealIdParlor);
    }
    $scope.editAppPage=function(){
        $('#editAppPage').modal('hide');
        console.log($scope.deal);
    }
    $scope.checkSalonType=function(type){
        if(type==0)return "Red"
        else if(type==1)return "Blue"
        else if(type==2)return "Green"
    }
    /*//////////////////////////////add new parlor work \\\\\\\\\\\\\\\\\\stops\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/
});
