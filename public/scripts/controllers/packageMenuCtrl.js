angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('packageMenuCtrl', function ($scope,$state, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$parse, $timeout,$q,PackageMenuContent) {
  
    
    
	$scope.package={

    }
    
    $scope.data={};
    
        $scope.taxFlag=false;
        $scope.removeAddTaxFlag=0;
    $scope.rewindObject1={};
    var globalCategories=[];

	$scope.hairCat1='';
	var categoriesCopy='';
	/*$scope.rewindObject=[];*/
	$scope.urlHomeSliderImages="/api/parlorDeals?parlorId="+parlorId;
        $http.get($scope.urlHomeSliderImages,{cache:false}).then(function(response) {
            console.log("hello",response);
            for(var i=0;i<response.data.data.length;i++){
                if(response.data.data[i].name=='Package'){
                    $scope.categories=response.data.data[i].services;
                    console.log($scope.categories)
                   
                    
                    break;
                }
                
            
            }


           $scope.description=response.data.data[6].services[0].description;
            console.log($scope.description);

			for(var i=0;i<$scope.categories.length;i++){
				$scope.categories[i]['isSelected']=false;
			}
			console.log($scope.categories);
			categoriesCopy=angular.copy($scope.categories);
		      $http.get("/role2/createDealJpeg").then(function(response) {
                     $scope.taxFlag=response.data.taxFlag;
                        for(i=1;i<=25;i++)
                {
                    if(response.data['update'+i]!=undefined)
                {
                                $scope.data['update'+i]=response.data['update'+i].dealId;
                                $scope.initializeCategory(i);
//                    $scope.categorySelected(i);
//                    $scope.rewindObject1['update'+i]=angular.copy(response.data['update'+i]);
                    
                }
                    
                    else{
                        $scope.data['update'+i]=""
                        $scope.rewindObject1['update'+i]={}
                    }
                    
                }
                  for(i=1;i<=25;i++)
                {
                                if($scope.rewindObject1['update'+i])
                        {
                             $scope.rewindObject1['update'+i].check="true";
                        }
                    
                            else{
                                 $scope.rewindObject1['update'+i]={}
                            }
                           
//                    $scope.categorySelected($scope.rewindObject1['update'+i])
                }
                  
                    $scope.addTax();
        });
            
           
        })
        
    	$scope.categorySelected=function(a)
        {
                        if($scope.data['update'+a]!=undefined)
                        {
                                    for(i=0;i<$scope.categories.length;i++)
                                    {
                                        if($scope.data['update'+a]==$scope.categories[i].dealId)
                                        {
                                            $scope.rewindObject1['update'+a]=angular.copy($scope.categories[i]);
                                            $scope.addTax();
                                            break;
                                        }
                                    }
                        }
        }
        
        
        $scope.disableSelectedBefore=function(a){
           $scope.data['update'+a]='';
            $scope.rewindObject1['update'+a]={};
        }
        
      
        
        
        

           $scope.generateJpeg=function()
        {  
                $scope.rewindObject1.taxFlag=$scope.taxFlag;
               console.log($scope.rewindObject1);
                $http.post("/role2/createDealJpeg",{data:angular.toJson($scope.rewindObject1)}).then(function(response) 
            {
                        PackageMenuContent.dealObject=response.config.data;
			            console.log('hi',JSON.parse(PackageMenuContent.dealObject.data));
			           $state.go('dashboard.createdPackageJpeg');
                        console.log(response);
                        $scope.rewindObject1=response.data;
                if(!response.data)
                {
				        $scope.rewindObject1.taxFlag=false;
			     }
            })
     }
         
//                function  started when the   advance clicked 
           
            $scope.update=function()
    {
     
                $("#taxModal").modal("show");
              
    
    }
           
//            $scope.taxChk=function(taxCheck){
//		console.log(taxCheck);
//		
//	}
            
        
            
            
$scope.initializeCategory=function(a)
{
    $scope.categories.forEach(function(d)
    {
                    if(d.dealId==$scope.data['update'+a])
                    {
                        $scope.rewindObject1['update'+a]=angular.copy(d);
                    }
    })
}
            
            
            
            
            
            
//             function to update prices according to taxes
            $scope.addTax=function(){
            
                if($scope.taxFlag)
            {   
                console.log("hello")
                
                console.log($scope.categories)
                var a=1.18;
               for(i=1;i<=25;i++)
                {
                     $scope.categories.forEach(function(c){
                            if(c.dealId==$scope.rewindObject1['update'+i].dealId)
                            {
                                
                                if(c.dealPrice==$scope.rewindObject1['update'+i].dealPrice)
                                    {
                                        $scope.rewindObject1['update'+i].dealPrice=Math.round( $scope.rewindObject1['update'+i].dealPrice*a)  ;
                                }
                                if(c.menuPrice==$scope.rewindObject1['update'+i].menuPrice)
                                {
                                     $scope.rewindObject1['update'+i].menuPrice=Math.round( $scope.rewindObject1['update'+i].menuPrice*a);
                                }
                                
                            }
                     })           
                }
            }
                else
            {
                    var a=1/1.18;
                
                for(i=1;i<=25;i++)
                {
                    $scope.categories.forEach(function(c){
                            if(c.dealId==$scope.rewindObject1['update'+i].dealId)
                {
                                if(c.dealPrice!=$scope.rewindObject1['update'+i].dealPrice)
                    {
                        $scope.rewindObject1['update'+i].dealPrice=Math.round( $scope.rewindObject1['update'+i].dealPrice*a);
                        
                        
                    }
                    
                            if(c.menuPrice!=$scope.rewindObject1['update'+i].menuPrice)
                            {
                              $scope.rewindObject1['update'+i].menuPrice=Math.round( $scope.rewindObject1['update'+i].menuPrice*a);   
                            }
                }
                     })  
                    
                }
                
            }
                
                

                  $("#taxModal").modal("hide");
                
            }
           
            
            
})
