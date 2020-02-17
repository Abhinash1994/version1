'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ngCsv', 'ui.bootstrap'])
    .controller('reorderByBrand', function ($scope, $http, NgTableParams, Excel, $timeout) {
           // console.log('reorder by brand controller');
            $scope.products = inventoryItems.filter(function(el) {
                return (el.quantity==undefined  && el.active==true) ;
            });
            $scope.activeTab=0
            $http.post("/role2/getReorder").success(function (response, status) {

                $scope.arraydata = response.data;
               // console.log($scope.arraydata);

                for (var i = 0; i < $scope.arraydata.length; i++) {
                    for (var j = 0; j < $scope.arraydata[i].data.length; j++) {
                        $scope.arraydata[i].data[j].data[0]['orderedQuantity'] = 0;
                    }
                }

               // console.log($scope.arraydata);


            });
            //    $scope.checkShowStatus=function(data){
            //     var show=false;
            //     data.forEach(function(element) {
            //         if(element.quantity<element.minimumQuantity)
            //         show =true;
            //     }, this);
            //     return show
            // }
            $scope.onSumbit = function (quantity) {
               // console.log(quantity)
                var filteredData = {};
                filteredData._id = quantity._id;
                filteredData.data = quantity.data.filter(function (a) {

                    return a.data[0].orderedQuantity > 0

                })

               // console.log(filteredData);
                //     get the sum   of the product of cost price and ordered Quantity  of different orders
                var num = filteredData.data.reduce(function (sum, value) {

                    sum = sum + (value.data[0].costPrice * value.data[0].orderedQuantity);
                    return sum
                }, 0)

               // console.log(num)

                if (filteredData.data.length > 0) {
                    var x = {
                        id: quantity._id
                    }

                    if (num < 5000) //   if  sum   of the product of cost price and ordered Quantity  of different orders
                    //  less then  5000
                    {
                        //  stop  from modal from closing when clicked outside
                        $('#myModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        })
                        //    ----

                        $scope.dataToBeSent = angular.copy(filteredData);
                        $scope.tempid = angular.copy(x);
                        $('#myModal').modal('show');


                        //   else  //   if  user reject not to add  Order
                        // {
                        //          console.log("Rejected  By user")
                        // }

                    }
                    //    if sum  is  greater  then     5000
                    else {
                        //   calling function  
                        $scope.addOrderFunction(filteredData, x);
                    }



                }else{
                   // console.log("its zero")
                  }
                          
                          
                  }
                $scope.Clicked = function (a) {
                    if (a == 0) {
                        $('#myModal').modal('hide');
                    } else {

                        $scope.addOrderFunction($scope.dataToBeSent, $scope.tempid)
                    }
                }
                $scope.productNameChanged = function(item) {
                // console.log("Product selected",item);
                 $scope.currProduct={
                    name:item.name,
                    itemId:item.itemId,
                    itemIdd:item.itemId,
                    minimumQuantity:5,
                    sum:0,
                    quantity:0,
                    productCategoryId : item.categoriesId,
                    status:0,
                    sellingPrice:item.sellingPrice,
                    costPrice:item.sellingPrice*.9,
                    manufactureMonth:new Date(),
                    commission:0,
                    orderedQuantity:1,
                 };
                // console.log("Product selected",$scope.currProduct);
                };
                $scope.alertMe =function(i) {
                    $scope.arraydata[i]._id;
                    $scope.activeTab=i;
                    $scope.products = inventoryItems.filter(function(el) {
                        return (el.quantity==undefined  && el.active==true && el.sellerId==$scope.arraydata[i]._id) ;
                    });
                   // console.log("alert me")
                };
                $scope.addOrderFunction = function (filteredData, x) {

                    // console.log(filteredData)
                    // console.log(x)

                    $('#myModal').modal('hide');
                    $http.post("/role2/sellerContact", x).success(function (response1, status) {
                        var contactDeatils = response1.data.contactNumber;
                        // console.log(response1)
                        // console.log()

                        for (var i = 0; i < filteredData.data.length; i++) {
                            filteredData.data[i].data[0]['status'] = 1;
                        }
                        console.log("final data------->>>", filteredData);
                        $http.post("/role2/addOrder", filteredData).success(function (response, status) {
                            // console.log(response);
                            var a = "Dear Salon Partner,\nThanks for using Be U Salons Purchase System. You order has been placed and the PO has been emailed to the vendor.\nWe recommend you to reconfirm the order with the vendor immediately over a call for additional details for smooth order processing." + "We request you to call the seller for confirmation. Contact Details are-" + contactDeatils;
                            alert(a)
                            $scope.refresh();
                        })

                    })
                }
                $scope.addProduct = function(item){
                    // console.log(item);
                    // console.log("$scope.currProduct------" , $scope.currProduct)
                    var newItem=angular.copy($scope.currProduct);
                    // console.log(newItem);
                    newItem.quantity=0;
                    newItem.orderedQuantity=parseInt(item.orderedQuantity);
                    newItem.productCategoryId= $scope.currProduct.productCategoryId;  
                    newItem.productCategoryName= $scope.currProduct.name;
                    newItem.sellerId=item.sellerId
                    newItem.sum=0;
                    // console.log(newItem);
                    $http.post("/role2/inventory", newItem).success(function(response, status){
                        newItem.data=[]
                        newItem.itemId=(item.Id);
                        // console.log("response is ",response)
                        newItem.data[0]=angular.copy(newItem);
                        // console.log("new item  is ",newItem)
                        $scope.arraydata[$scope.activeTab].data.push(newItem);
                        $scope.currProduct = {};
                      });
                };
                
            });