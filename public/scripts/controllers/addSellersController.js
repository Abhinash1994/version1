'use strict';
/**\
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select','daterangepicker'])

    .controller('addSellersCtrl',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {
//
            $scope.editObjects={}
            $scope.editObjs={};
            $scope.temp=[];
            $scope.tempsForCC=[];
            $scope.tempPhoneNumbers=[];
        /*------------------Variables------------------------*/
        $scope.setParlorId ='';
        $scope.setSellerId ='';
        $scope.refreshFlag=true;
        $scope.seller={};
        $scope.region='';

        $scope.parlorType={
            type:[
                {id:0,name:"Red"},
                {id:1,name:"Blue"},
                {id:2,name:"Green"},
                {id:3,name:"All"}
                ]
            ,
            createdArray:[]
        }

        $scope.sellerObject={
            'sellerName':'',
            'emailId':[],
            'emailIdcc':[],
            'contactNumber':[],
            'sellerContactNumber':'',
            'region':'',
            'sellerPoNumber':'',
            'sellerTinNumber':'',
            'sellerAddress':"",
            'createdArray':[],
            'itemsArray':[],
            'itemsArrayCopy':[],
            'sellers':'',
            'editSellerIndex':''
        };


        var dataSeller={
            "emailId":[],
            "emailIdcc":[],
                "name":'',
                "contactNumber":'',
                "address":'',
                "poNumber":'',
                "tinNumber":'',

            items:[]
        }
        var editSellerObject={
            "name":'',
            "emailId":'',
            itemIds:[]
        }
        $scope.city = [{
          id: 1,
          label: 'Delhi/NCR'
        }, {
          id: 2,
          label: 'Banglore'
        }, {
          id: 3,
          label: 'Pune'
        }, {
            id: 4,
            label: 'Patna'
          }, {
            id: 5,
            label: 'Dehradun'
          }];
        $scope.selctedVal=function(selectedValue,i,selected) {
            $scope.selectedCity=selectedValue;
            console.log(selectedValue);
           
            
        }
        $scope.selectedEmailIdsTOEdit=function(selectedValue,i,selected){
             $scope.emailId=false;
          $scope.emailIdFlag=true;
            for(var index0=0;index0<$scope.sellerObject.sellers[i].emailId.length;index0++)
                {
                    if($scope.sellerObject.sellers[i].emailId[index0].city==selected.label){
                                        console.log("hdsjghfd")
                                    $scope.emailIdFlag=false;
                                }
                    
                }
            
            
            
        }
        
         
        
        
        $scope.addPhoneNumber=function(a,b) {
                    if(b){
               
                var phone=b
                
                
                if($scope.sellerObject.contactNumber.length>0)
                {
                    $scope.mn=true;
                    
                    
                    
                  $scope.sellerObject.contactNumber.forEach(function(m,n){
                        if(m.cityId==a.id){
                            console.log("hejkjdskjd")
                            m.phoneNumbers.push(b)
                            $scope.mn=false
                        }
                    })
                    
                    if($scope.mn){
                          var phoneNum=[];
                        console.log("hjhdjhjhs")
                        phoneNum.push(b);
                         $scope.sellerObject.contactNumber.push({cityId:a.id,city:a.label,phoneNumbers:phoneNum})
                    }
                }
                
                else{
                    var phoneNum=[];
                        phoneNum.push(b);
                      $scope.sellerObject.contactNumber.push({cityId:a.id,city:a.label,phoneNumbers:phoneNum})
                }
                        
                         console.log($scope.sellerObject.contactNumber)
            }
        }
        $scope.addEmail=function(){
          console.log($scope.seller.sellerEmailId);

          if($scope.sellerObject.emailId.length==0){
            $scope.sellerObject.emailId.push({
              cityId:$scope.selectedCity.id,
              city:$scope.selectedCity.label,
              ids:[]
            });
              $scope.sellerObject.emailId[0].ids.push($scope.seller.sellerEmailId);
          }
          else {
            var isNotThere = true;
            for (var i = 0; i < $scope.sellerObject.emailId.length; i++) {
              if ($scope.sellerObject.emailId[i].cityId==$scope.selectedCity.id) {
                if ($scope.sellerObject.emailId[i].ids.indexOf($scope.seller.sellerEmailId)<=-1 && ($scope.seller.sellerEmailId).trim() != "" && $scope.seller.sellerEmailId !== undefined) {
                  $scope.sellerObject.emailId[i].ids.push($scope.seller.sellerEmailId);
                }
                 isNotThere =false;
                break;
              }
            }
            if(isNotThere){
              $scope.sellerObject.emailId.push({
                cityId:$scope.selectedCity.id,
                city:$scope.selectedCity.label,
                ids:[]
              });
            for (var i = 0; i < $scope.sellerObject.emailId.length; i++) {
              if ($scope.sellerObject.emailId[i].cityId==$scope.selectedCity.id) {
                if ($scope.sellerObject.emailId[i].ids.indexOf($scope.seller.sellerEmailId)<=-1  && ($scope.seller.sellerEmailId).trim() != ""  && $scope.seller.sellerEmailId !== undefined)  {
                  $scope.sellerObject.emailId[i].ids.push($scope.seller.sellerEmailId);
                }
                isNotThere = true;
                break;
              }
            }
          }
        }

            $scope.seller.sellerEmailId=''
            console.log($scope.sellerObject);
          }
        $scope.addEmailCc=function(){

          if($scope.sellerObject.emailIdcc.length==0){
            $scope.sellerObject.emailIdcc.push({
              cityId:$scope.selectedCity.id,
              city:$scope.selectedCity.label,
              ids:[]
            });
              $scope.sellerObject.emailIdcc[0].ids.push($scope.seller.sellerEmailIdcc);
          }
          else {
            var isNotThere = true;
            for (var i = 0; i < $scope.sellerObject.emailIdcc.length; i++) {
              if ($scope.sellerObject.emailIdcc[i].cityId==$scope.selectedCity.id) {
                if ($scope.sellerObject.emailIdcc[i].ids.indexOf($scope.seller.sellerEmailIdcc)<=-1 && ($scope.seller.sellerEmailIdcc).trim() != ""  && $scope.seller.sellerEmailIdcc != undefined) {
                  $scope.sellerObject.emailIdcc[i].ids.push($scope.seller.sellerEmailIdcc);
                }
                 isNotThere =false;
                break;
              }
            }
            if(isNotThere){
              $scope.sellerObject.emailIdcc.push({
                cityId:$scope.selectedCity.id,
                city:$scope.selectedCity.label,
                ids:[]
              });
            for (var i = 0; i < $scope.sellerObject.emailIdcc.length; i++) {
              if ($scope.sellerObject.emailIdcc[i].cityId==$scope.selectedCity.id) {
                if($scope.sellerObject.emailIdcc[i].ids.indexOf($scope.seller.sellerEmailIdcc)<=-1  && ($scope.seller.sellerEmailIdcc).trim() != ""   && $scope.seller.sellerEmailIdcc != undefined) {
                $scope.sellerObject.emailIdcc[i].ids.push($scope.seller.sellerEmailIdcc);
              }
                isNotThere = true;
                break;
              }
            }
          }
        }
            console.log($scope.sellerObject);
            $scope.seller.sellerEmailIdcc=''
        }
        $scope.editedArrayOfSellersItems={'editedArrayOfSellersItems':[]};
        /*---------------------Functions-----------------------*/
        function callApi(){
            $http.post("/role1/getSellerAndItems").success(function (response, status) {
                console.log(response);
                $scope.sellerObject.sellers=response.data;
                console.log($scope.sellerObject.sellers);
                /*$scope.itemsArray=response.data.items;
                $scope.itemsArrayCopy=angular.copy($scope.itemsArray);
                console.log($scope.itemsArray)*/
            });
            $http.post("/role1/getInventoryItems").success(function (response) {
                console.log(response);
                $scope.sellerObject.itemsArray=response.data;
                $scope.sellerObject.itemsArrayCopy=angular.copy($scope.sellerObject.itemsArray);
                console.log($scope.sellerObject.itemsArray)

            });
        }
        callApi();
        $scope.showAddSellerPopUp=function(){
            $scope.dataSeller={
                "emailId":[],
                "emailIdcc":[],
                "name":'',
                "contactNumber":'',
                'address':'',
                "items":[]
            }
            $scope.sellerObject.emailId=[];
                $scope.sellerObject.emailIdcc=[];
                $scope.sellerObject.sellerName=undefined;
                $scope.sellerObject.contactNumber=[];
                $scope.sellerObject.sellerAddress=undefined;
                $scope.sellerObject.createdArray=[];
            $scope.sellerObject.sellerContactNumber=""
            $scope.sellerObject.itemsArrayCopy.forEach(function(a){
                if(a.isSelected)
                {
                    a.isSelected=false;
                }
            })
                $('#addSellerModel').modal('show');
        };
        $scope.itemsSelected=function(){
            console.log($scope.parlorType.createdArray);
            for(var i = 0; i < $scope.sellerObject.createdArray.length; i++){
                $scope.sellerObject.createdArray[i].itemId = $scope.sellerObject.createdArray[i]['_id'];
                delete $scope.sellerObject.createdArray[i]._id;

            }
        }
        $scope.showEditSellerPopUp=function(index){
            $scope.editObjects={};
            $scope.editObjs={};
            $scope.selectedcityForPhoneNum=undefined;
            $scope.phoneNumbersFlag=false;
            $scope.emailIdFlag=false;
            $scope.emailIdFlagcc=false;
            $scope.selectedCC=undefined;
            $scope.selected=undefined;
            console.log($scope.selected);
            
            $scope.sellerObject.editSellerIndex=index;
            $('#editSeller').modal('show');
        }

        $scope.addSeller=function(){
            
            if($scope.sellerObject.sellerName){
                 $scope.refreshFlag=true;
            console.log("hello")
            console.log($scope.sellerObject);

            $scope.dataSeller={
                "emailId":$scope.sellerObject.emailId,
                "emailIdcc":$scope.sellerObject.emailIdcc,
                "name":$scope.sellerObject.sellerName,
                "contactNumber":$scope.sellerObject.contactNumber,
                "address":$scope.sellerObject.sellerAddress,
                items:$scope.sellerObject.createdArray
            }
            console.log($scope.dataSeller);
            $http.post("/role1/createSellers",$scope.dataSeller).success(function (response, status) {
                console.log(response);
                if(response.success)
                {
                    alert(" Seller Added Successfully");
                }
              
                callApi();
                 $('#addSellerModel').modal('hide');
            });
            console.log(dataSeller);
            $scope.sellerObject.createdArray=[];
             $scope.sellerObject.sellerName='';
            $scope.sellerObject.sellerEmailId=[];
            $scope.sellerObject.sellerEmailIdcc=[];
            $scope.sellerObject.address='';

            $scope.sellerObject.sellerContactNumber='';
            // $scope.sellerObject.sellerPoNumber='';
            // $scope.sellerObject.sellerTinNumber='';

            console.log($scope.sellerObject.itemsArrayCopy);
            for(var i=0;i<$scope.sellerObject.itemsArrayCopy.length;i++){
                $scope.sellerObject.itemsArrayCopy[i].isSelected=false;
            }
             }
            else{
                alert("Please Enter Seller Name First")
            }
           
        }

        $scope.updateSeller=function(id,name,emailId,emailIdcc,itemsArray,address,contactnumber){
                    
            console.log(itemsArray)
            editSellerObject={
                "name":name,
                "emailId":emailId,
                "emailIdcc":emailIdcc,
                sellerId:id,
                itemIds:$scope.editedArrayOfSellersItems.editedArrayOfSellersItems,
                address:address,
                contactNumber:contactnumber
            }

            console.log(editSellerObject);
            $http.post("/role1/editItemsToSellers",editSellerObject).success(function (response, status) {
                if(response.success){
                    alert("Successfully Edited");
                }
                 callApi();
             });
            $scope.editedArrayOfSellersItems.editedArrayOfSellersItems=[];
            console.log(editSellerObject);
        }

           //pradeep

           //pradeep
         $scope.change123 = false;
         $scope.submitbtn = true;
         $scope.changeSeller=false;
         $scope.changeParlorName=false;
         $scope.sellerData = {};
         $scope.sellerData1 = {};
         $scope.newArray={};
         $scope.filledData = [];
         $scope.filledData1 = [];
         $scope.editData={};
         $scope.categories=[];
         $scope.selectedSlabs={};
         $scope.submitSellerButton = false;



            $scope.addNewseller = function(){
                $scope.sellerData.totalProffessional=$scope.sellerData.beUPurchaseScheme+$scope.sellerData.professionalDiscount;
                $scope.sellerData.totalRevenue=$scope.sellerData.beUPurchaseScheme+$scope.sellerData.retailDiscount;
                $scope.sellerData.totalDiscountOnWax=$scope.sellerData.beUPurchaseScheme+$scope.sellerData.cashDiscountOnWax;
                $scope.sellerData.totalCashDiscountOnOil=$scope.sellerData.beUPurchaseScheme+$scope.sellerData.cashDiscountOnWaxOil;
                $scope.sellerData.totalDiscount=$scope.sellerData.beUPurchaseScheme+$scope.sellerData.professionalDiscount+$scope.sellerData.retailDiscount+$scope.sellerData.cashDiscountOnWax+$scope.sellerData.cashDiscountOnWaxOil+$scope.sellerData.merchandising+$scope.sellerData.directDiscount+$scope.sellerData.educationTraining+$scope.sellerData.directBilling+$scope.sellerData.yearBenefit+$scope.sellerData.cashDiscount;
                $scope.filledData.push($scope.sellerData);
                console.log( $scope.sellerData);
                $scope.sellerData= {beUPurchaseScheme:0,professionalDiscount:0,retailDiscount:0,cashDiscountOnWax:0,cashDiscountOnWaxOil:0,merchandising:0,directDiscount:0,educationTraining:0,directBilling:0,yearBenefit:0,cashDiscount:0};

            }

            $scope.submitSeller = function(){
                     $scope.refreshFlag=true;

        $scope.tempSalonType=[]
                $scope.parlorType.createdArray.forEach(function(element){
                    $scope.tempSalonType.push(element.id)
                }),

                   $scope.newArray={
                    sellerId:$scope.sellerData1.sellerId,
                    parlorId: $scope.sellerData1.parlorId,
                    salonType:$scope.tempSalonType,
                    slabs:$scope.filledData
                }
                 $scope.filledData1.push($scope.newArray);
                console.log("submit",$scope.filledData1);

               $http.post("/role1/createDiscountStructure",$scope.filledData1).success(function (response, status) {
                console.log(response);
                $scope.filledData1 = [];
                $scope.filledData  = [];
                    $scope.sellerData1.parlorId=$scope.setParlorId;
                $scope.sellerData1.sellerId=$scope.setSellerId ;
                   alert("Successfully Submitted");
            });
            }
           $scope.editNewseller = function(i, obj){
               $scope.sellerData = obj;
               var a = $scope.filledData.splice(i, 1);
               console.log(a);

           }
             //Edit Discount


           $scope.sellerChange  = function(){
            console.log( $scope.selectedSlabs);

            $http.post('/role1/getDiscountStructure',$scope.selectedSlabs)
                .success(function (result) {
                    console.log( "oyeeeeeeeeeeeeeeeeeee",result.data[0]);
                    if(result) {
                        $scope.slabs = result.data;
                        console.log("query result", result);
                    }
            })

            }
           $scope.editDiscountModelClick = function(selctedObj){
               $scope.editData = selctedObj ;
               console.log($scope.editData )
           }
           $scope.updatedDiscountModel = function(){
                $scope.sendDataModel={
                    "sellerId":$scope.selectedSlabs.sellerId,
                    "slabs":[]
                }




                        $scope.totalD=0
                for(var a in $scope.editData){
                        if(angular.isNumber($scope.editData[a])){
                                     if(a!="totalDiscount"){
                                        $scope.totalD+= $scope.editData[a];
                        }

                        }




                }

                        $scope.editData.totalDiscount=$scope.totalD

                         console.log($scope.editData);
               $scope.sendDataModel.slabs.push($scope.editData)


                console.log("final data pushed",$scope.sendDataModel)

               $http.post('/role1/editDiscountStructure',$scope.sendDataModel )
                   .success(function (result) {
                       console.log("done")
                   })
               console.log($scope.editData)
               $('#editDiscountModel').modal('hide');
           }

        $scope.refreshSellerSelector = function(){
            console.log("calling")
            // if($scope.refreshFlag){

           if($scope.selectedSlabs.salonType!=undefined){
               $scope.sellerChange();

           }
         $http.post("/role1/parlorList").success(function(response, status){
             $scope.parlors = response.data;
                  $scope.sellerData1.parlorId  = $scope.parlors[0].parlorId;
            $scope.setParlorId  = $scope.parlors[0].parlorId;
          });
         $http.post('/role1/getSeller')
                .success(function (result) {
                    console.log(result)
                     $scope.categories=result.data;
                     $scope.sellerData1.sellerId = $scope.categories[0].sellerId;
                     $scope.setSellerId = $scope.categories[0].sellerId;
                    $scope.refreshFlag=false;
           });
        // }

       }
$scope.addEmailTo=function(index,city,id){
    console.log(id)
    $scope.sellerObject.sellers[index].emailId.push({cityId:city.id,city:city.label});
    $scope.sellerObject.sellers[index].emailId.forEach(function(a,i){
        if(a.city==city.label)
        {
            var idsc=[];
            idsc=angular.copy(id)
             $scope.sellerObject.sellers[index].emailId[i].ids=idsc;
            $scope.emailIdFlag=false;
            $scope.temp=[];
        }
        
    })
//    $scope.temp=""
    console.log( $scope.sellerObject.sellers)
    
}

$scope.addEmailCCTo=function(index,city,id){
    console.log(id)
    $scope.sellerObject.sellers[index].emailIdcc.push({cityId:city.id,city:city.label});
    $scope.sellerObject.sellers[index].emailIdcc.forEach(function(a,i){
        if(a.city==city.label)
        {
            var idsc=[];
            idsc=angular.copy(id)
             $scope.sellerObject.sellers[index].emailIdcc[i].ids=idsc;
            $scope.emailIdFlagcc=false;
            $scope.tempsForCC=[];
        }
        
    })
//    $scope.temp=""
    console.log( $scope.sellerObject.sellers)
    
    
}

$scope.selctedValforCC=function(selectedValue,i,selected){
     $scope.selectedCity=selectedValue;
            console.log(selectedValue);
            
          
            $scope.emailIdFlagcc=true;
            for(var index0=0;index0<$scope.sellerObject.sellers[i].emailIdcc.length;index0++)
                {
                                if($scope.sellerObject.sellers[i].emailIdcc[index0].city==selected.label)
                                {
                                        
                                    $scope.emailIdFlagcc=false;
                                }
                    
                }
            
    
    
}

$scope.selectCityForPhone=function(selectedValue,i,selected){
      $scope.selectedCity=selectedValue;
            console.log(selectedValue);
            
          
            $scope.phoneNumbersFlag=true;
            for(var index0=0;index0<$scope.sellerObject.sellers[i].contactNumber.length;index0++)
                {
                                if($scope.sellerObject.sellers[i].contactNumber[index0].city==selected.label)
                                {
                                        
                                    $scope.phoneNumbersFlag=false;
                                }
                    
                }
            
    
    
}

$scope.addPhoneNmbers=function(index,city,id){
    
    $scope.sellerObject.sellers[index].contactNumber.push({cityId:city.id,city:city.label});
    $scope.sellerObject.sellers[index].contactNumber.forEach(function(a,i){
        if(a.city==city.label)
        {
            var idsc=[];
            idsc=angular.copy(id)
             $scope.sellerObject.sellers[index].contactNumber[i].phoneNumbers=idsc;
            $scope.phoneNumbersFlag=false;
            $scope.tempPhoneNumbers=[];
        }
        
    })
    
    
//    $scope.temp=""
    console.log( $scope.sellerObject.sellers)
    
    
}



    }]);
