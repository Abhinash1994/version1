angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('dealMenuCtrl', function ($scope,$state, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$parse, $timeout,$q,dealMenuContent) {



	$scope.categories='';
	$scope.selectedCat1='';
	$scope.selectedCat2='';
	$scope.selectedCat3='';
	$scope.selectedCat4='';
	$scope.removeAddTaxFlag=false;
	$scope.taxFlag=false;



	$scope.hairCat1='';
	var categoriesCopy='';
	/*$scope.rewindObject=[];*/
	$scope.urlHomeSliderImages="/api/parlorDeals?parlorId="+parlorId;
        $http.get($scope.urlHomeSliderImages,{cache:false}).then(function(response) {
            console.log(response);
			$scope.categories=response.data.data;
			for(var i=0;i<$scope.categories.length;i++){
				$scope.categories[i]['isSelected']=false;
			}
			console.log($scope.categories);
			categoriesCopy=angular.copy($scope.categories);
		      $http.get("/role2/createDealJpeg").then(function(response) {
            console.log(response);
            var taxToBeMultiPliedInitially=1;
            if(response.data.taxFlag){
            	$scope.removeAddTaxFlag=response.data.taxFlag
            	$scope.taxFlag=$scope.removeAddTaxFlag
            	taxToBeMultiPliedInitially=1.18;
            	for(var i=0;i<$scope.categories.length;i++){
            		for(var j=0;j<$scope.categories[i].services.length;j++){
            			$scope.categories[i].services[j].dealPrice=Math.round($scope.categories[i].services[j].dealPrice*taxToBeMultiPliedInitially)
            		}
            	}
            }
			$scope.rewindObject=response.data;
			if(!response.data){
				$scope.rewindObject.taxFlag=false;
			}
			for(var i=0;i<$scope.categories.length;i++){

				 if($scope.categories[i].name==$scope.rewindObject.hair.hairCat11.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat11.selectedServices','rewindObject.hair.hairCat11.services');
				}else if($scope.categories[i].name==$scope.rewindObject.hair.hairCat12.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat12.selectedServices','rewindObject.hair.hairCat12.services');
				}else if($scope.categories[i].name==$scope.rewindObject.hair.hairCat21.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat21.selectedServices','rewindObject.hair.hairCat21.services');
				}else if($scope.categories[i].name==$scope.rewindObject.hair.hairCat22.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat22.selectedServices','rewindObject.hair.hairCat22.services');
				}else if($scope.categories[i].name==$scope.rewindObject.hair.hairCat31.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat31.selectedServices','rewindObject.hair.hairCat31.services');
				}else if($scope.categories[i].name==$scope.rewindObject.hair.hairCat32.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.hair.hairCat32.selectedServices','rewindObject.hair.hairCat32.services');
				}else if($scope.categories[i].name==$scope.rewindObject.beauty.beautyCat11.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.beauty.beautyCat11.selectedServices','rewindObject.beauty.beautyCat11.services');
				}else if($scope.categories[i].name==$scope.rewindObject.beauty.beautyCat21.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.beauty.beautyCat21.selectedServices','rewindObject.beauty.beautyCat21.services');
				}else if($scope.categories[i].name==$scope.rewindObject.beauty.beautyCat22.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.beauty.beautyCat22.selectedServices','rewindObject.beauty.beautyCat22.services');
				}else if($scope.categories[i].name==$scope.rewindObject.makeUp.makeUpCat11.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.makeUp.makeUpCat11.selectedServices','rewindObject.makeUp.makeUpCat11.services');
				}else if($scope.categories[i].name==$scope.rewindObject.spa.spaCat11.name){
					$scope.categories[i]['isSelected']=true;
					$scope.refreshPrices(i,'rewindObject.spa.spaCat11.selectedServices','rewindObject.spa.spaCat11.services');
				}

			}


        });
        });

        $scope.refreshPrices=function(index,selectedServicesString,servicesString){
        	console.log("refresh")
			var valOfSelectedServices=$scope.$eval(selectedServicesString);
			var valOfServicesString=$scope.$eval(servicesString);
			console.log(valOfSelectedServices)
			console.log(valOfServicesString)
			valOfServicesString=$scope.categories[index].services;
					for(var j=0;j<valOfServicesString.length;j++){
						for(k=0;k<valOfSelectedServices.length;k++){
							if(valOfServicesString[j].name==valOfSelectedServices[k].name){
								valOfServicesString[j]['isSelected']=true;
								console.log('match');
								valOfSelectedServices[k].dealPrice=valOfServicesString[j].dealPrice
								valOfSelectedServices[k].dealType=valOfServicesString[j].dealType;
								valOfSelectedServices[k].menuPrice=valOfServicesString[j].menuPrice;
							}
						}
					}
			var model = $parse(selectedServicesString);
			model.assign($scope,valOfSelectedServices);
			var model1 = $parse(servicesString);
			model1.assign($scope,valOfServicesString);
        }
    	$scope.categorySelected=function(departmentType,string,name,serviceString){
    	console.log(departmentType);
    	console.log(string);
    	console.log(name);
    	console.log(serviceString);
    	var a=name;
    	/*var categorySelected=categoryObjSelected.name;
    	console.log(departmentType);
    	console.log(categorySelected);*/
    	var the_string = string;

		// Get the model
		var model = $parse(the_string);

		// Assigns a value to it
		if(a!=null){
			model.assign($scope, a);
			for(var i=0;i<$scope.categories.length;i++){
    			if($scope.categories[i].name==name){
    				$scope.categories[i].isSelected=true;
    				var the_ser_string = serviceString;
    				var serModel=$parse(the_ser_string);
    				serModel.assign($scope, $scope.categories[i].services);
    			}
    		}

    		console.log($scope.rewindObject)
		}

    }

	$scope.edit=function(string){
		var the_string = string;

		var yourVar=$scope.$eval(string);
		for(var i=0;i<$scope.categories.length;i++){
    			if($scope.categories[i].name==yourVar.toString()){

    				$scope.categories[i].isSelected=false	;
    				var model = $parse(the_string);
    				model.assign($scope, '');
    			}
    	}
		console.log(yourVar);

		if($scope.removeAddTaxFlag){
					for(var i=0;i<$scope.categories.length;i++){
						for(j=0;j<$scope.categories[i].services.length;j++){
							$scope.categories[i].services[j].dealPrice=Math.round(categoriesCopy[i].services[j].dealPrice*1.18);
						}
					}
				}else if($scope.removeAddTaxFlag==false){
					for(var i=0;i<$scope.categories.length;i++){
						for(j=0;j<$scope.categories[i].services.length;j++){
							$scope.categories[i].services[j].dealPrice=categoriesCopy[i].services[j].dealPrice
						}
					}
				}

	}

	$scope.generateJpeg=function(){
		$scope.rewindObject.taxFlag=$scope.removeAddTaxFlag;
		//console.log(angular.toJson($scope.rewindObject))
        $http.post("/role2/createDealJpeg",{data:angular.toJson($scope.rewindObject)}).then(function(response) {
            console.log(response.config.data);
			dealMenuContent.dealObject=response.config.data;
			console.log('123',dealMenuContent.dealObject.data);
			 $state.go('dashboard.createdJpeg');

       	 });

		}
	$scope.showTaxCheckModal=function(){
		$("#taxModal").modal('show');
	}
	$scope.taxChk=function(taxCheck){
		console.log(taxCheck);
		$scope.removeAddTaxFlag=!$scope.removeAddTaxFlag;
	}
	$scope.addTax=function(){
		console.log($scope.categories)
		console.log($scope.rewindObject)
		console.log("$scope.removeAddTaxFlag "+$scope.removeAddTaxFlag);
		console.log("$scope.rewindObject.taxFlag "+$scope.rewindObject.taxFlag);
				if($scope.removeAddTaxFlag==true && $scope.rewindObject.taxFlag==false){
					$scope.rewindObject.taxFlag=true;
					var removeAddTax=1.18

				}else if($scope.removeAddTaxFlag==false && $scope.rewindObject.taxFlag==true){
					$scope.rewindObject.taxFlag=false;
					var removeAddTax=1/1.18

				}else{
					var removeAddTax=1
				}

				console.log(removeAddTax)
				if($scope.rewindObject.hair.hairCat11.flag){
					console.log(angular.copy($scope.rewindObject.hair.hairCat11.selectedServices))
					for(var i=0;i<$scope.rewindObject.hair.hairCat11.selectedServices.length;i++){
						$scope.rewindObject.hair.hairCat11.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat11.selectedServices[i].dealPrice*removeAddTax);
					}
					console.log(angular.copy($scope.rewindObject.hair.hairCat11.selectedServices))
					for(var i=0;i<$scope.rewindObject.hair.hairCat11.services.length;i++){
						$scope.rewindObject.hair.hairCat11.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat11.services[i].dealPrice*removeAddTax);
					}
				}

				if($scope.rewindObject.hair.hairCat12.flag){
					for(var i=0;i<$scope.rewindObject.hair.hairCat12.selectedServices.length;i++){
					$scope.rewindObject.hair.hairCat12.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat12.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.hair.hairCat12.services.length;i++){
					$scope.rewindObject.hair.hairCat12.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat12.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.hair.hairCat21.flag){
					for(var i=0;i<$scope.rewindObject.hair.hairCat21.selectedServices.length;i++){
					$scope.rewindObject.hair.hairCat21.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat21.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.hair.hairCat21.services.length;i++){
					$scope.rewindObject.hair.hairCat21.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat21.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.hair.hairCat22.flag){
					for(var i=0;i<$scope.rewindObject.hair.hairCat22.selectedServices.length;i++){
					$scope.rewindObject.hair.hairCat22.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat22.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.hair.hairCat22.services.length;i++){
					$scope.rewindObject.hair.hairCat22.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat22.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.hair.hairCat31.flag){
					for(var i=0;i<$scope.rewindObject.hair.hairCat31.selectedServices.length;i++){
					$scope.rewindObject.hair.hairCat31.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat31.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.hair.hairCat31.services.length;i++){
					$scope.rewindObject.hair.hairCat31.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat31.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.hair.hairCat32.flag){
					for(var i=0;i<$scope.rewindObject.hair.hairCat32.selectedServices.length;i++){
					$scope.rewindObject.hair.hairCat32.selectedServices[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat32.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.hair.hairCat32.services.length;i++){
					$scope.rewindObject.hair.hairCat32.services[i].dealPrice=Math.round($scope.rewindObject.hair.hairCat32.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.beauty.beautyCat11.flag){
					for(var i=0;i<$scope.rewindObject.beauty.beautyCat11.selectedServices.length;i++){
					$scope.rewindObject.beauty.beautyCat11.selectedServices[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat11.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.beauty.beautyCat11.services.length;i++){
					$scope.rewindObject.beauty.beautyCat11.services[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat11.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.beauty.beautyCat21.flag){
					for(var i=0;i<$scope.rewindObject.beauty.beautyCat21.selectedServices.length;i++){
					$scope.rewindObject.beauty.beautyCat21.selectedServices[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat21.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.beauty.beautyCat21.services.length;i++){
					$scope.rewindObject.beauty.beautyCat21.services[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat21.services[i].dealPrice*removeAddTax);

				}
				}

				if($scope.rewindObject.beauty.beautyCat22.flag){
				for(var i=0;i<$scope.rewindObject.beauty.beautyCat22.selectedServices.length;i++){
					$scope.rewindObject.beauty.beautyCat22.selectedServices[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat22.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.beauty.beautyCat22.services.length;i++){
					$scope.rewindObject.beauty.beautyCat22.services[i].dealPrice=Math.round($scope.rewindObject.beauty.beautyCat22.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.makeUp.makeUpCat11.flag){
					for(var i=0;i<$scope.rewindObject.makeUp.makeUpCat11.selectedServices.length;i++){
					$scope.rewindObject.makeUp.makeUpCat11.selectedServices[i].dealPrice=Math.round($scope.rewindObject.makeUp.makeUpCat11.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.makeUp.makeUpCat11.services.length;i++){
					$scope.rewindObject.makeUp.makeUpCat11.services[i].dealPrice=Math.round($scope.rewindObject.makeUp.makeUpCat11.services[i].dealPrice*removeAddTax);
				}
				}

				if($scope.rewindObject.spa.spaCat11.flag){
					for(var i=0;i<$scope.rewindObject.spa.spaCat11.selectedServices.length;i++){
					$scope.rewindObject.spa.spaCat11.selectedServices[i].dealPrice=Math.round($scope.rewindObject.spa.spaCat11.selectedServices[i].dealPrice*removeAddTax);
				}
				for(var i=0;i<$scope.rewindObject.spa.spaCat11.services.length;i++){
					$scope.rewindObject.spa.spaCat11.services[i].dealPrice=Math.round($scope.rewindObject.spa.spaCat11.services[i].dealPrice*removeAddTax);
				}
				}




	}

	});
