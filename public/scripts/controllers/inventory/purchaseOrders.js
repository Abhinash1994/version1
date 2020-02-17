angular.module('sbAdminApp', ['ui.bootstrap', 'ngCsv', 'daterangepicker'])

.controller('purchaseOrders', function($scope, $http) {
    /*--------------------------------------------------VAriables*/

    $scope.edit = false;
    var today = new Date();
    $scope.receiveBtn = true
    $scope.filter = {};
    $scope.filter['date'] = { startDate: moment().startOf('month'), endDate: moment() };
    $scope.data = '';
    console.log($scope.filter.date)
    $scope.editModelData = '';
    var dataForEditItems = {
        "orderId": '',
        "itemIds": []
    }
    var dataForReceiveItems = {
        "orderId": '',
        "itemIds": []
    }


    $scope.modalObject = [];

    $scope.plusit = function(x, quantity,data) {

        quantity.orderedQuantity++;
        $scope.totalAmount(data)
    }

    $scope.minus = function(quantity,data) {
        quantity.orderedQuantity--;
        $scope.totalAmount(data)
    }
    $scope.sellingPriceChanged=function(data){
        $scope.totalAmount(data)
    }


    $scope.openModal = function(data) {
        $scope.modalObject = []
        // console.log(data);
        data.items.forEach(function(element) {
            $scope.modalObject.push(element);
        })
        // console.log($scope.modalObject);
    }

    var alignFillDate = new Date("2015-06-09");

    var pickUpDate = new Date("2015-05-10");


    var a = alignFillDate - pickUpDate;
    // console.log(a);
    /*-------------------------------------------------functions*/
    function callApi() {
        $http.post("/role2/getPurchaseHistory", { startDate: today, endDate: today.toJSON() }).success(function(response, status) {
            // console.log(response)
            $scope.data = response.data;

        });
    }
    callApi();

    $scope.showEditPopUp = function(list) {

        dataForEditItems = {
            "orderId": list.orderId,
            "itemIds": [],
            "sellerId": list.sellerId,
            "parlorId": list.parlorId
        }
        $scope.editModelData = list.items;
        $scope.editModelData[0]['categorySum'] = list.categorySum;
        $scope.editModelData[0]['categoryName'] = list.productCategoryName;


        // console.log("-----888888888888888888888888888888", $scope.editModelData)

        for (var i = 0; i < $scope.editModelData.length; i++) {
            $scope.editModelData[i]['disableFlag'] = true;
        }
        $scope.edit = true;
        $scope.edit = true;
        $('#editOrderPopUp').modal('show');
    }
    $scope.editModelFlagChange = function(index) {
        $scope.editModelData[index].disableFlag = false;
    }

    $scope.submitEdittedItems = function() {
        for (var i = 0; i < $scope.editModelData.length; i++) {
            if ($scope.editModelData[i].disableFlag == false) {
                var itemArray = {
                    "name": '',
                    "editId": '',
                    "quantity": '',
                    "currentItem": '',
                    "orderedQuantity": '',
                    'itemId': '',
                    'sellerId': '',
                    'parlorId': ''

                }

                itemArray.editId = $scope.editModelData[i].editId;
                itemArray.categoryName = $scope.editModelData[i].productCategoryName;
                itemArray.quantity = parseInt($scope.editModelData[i].actualQuantity);
                itemArray.currentItem = parseInt($scope.editModelData[i].currentItem);
                itemArray.name = $scope.editModelData[i].itemName;
                itemArray.itemId = $scope.editModelData[i].itemId;
                itemArray.orderedQuantity = $scope.editModelData[i].orderedQuantity;
                dataForEditItems.itemIds.push(itemArray);
            }
            // console.log($scope.editModelData[i]);
        }
        // console.log(dataForEditItems);
        $http.post("/role2/editPurchase", dataForEditItems).success(function(response, status) {
            // console.log(response)
            callApi();
        });
        $('#editOrderPopUp').modal('hide');
        // console.log($scope.editModelData.orderedQuantity)
    }

    var allIds = [];
    $scope.viewBill=function(images){
        // console.log("view bills called");
        $scope.images=images;
        // console.log($scope.images)
        $('#showBills').modal('show');
    }

    $scope.showReceivePopUp = function(list) {
        // console.log(list)
            // console.log("for api",list)
            // console.log("items list for price list",list)
        $scope.directDiscount=list.directDiscount;
        $scope.id = [];
        $scope.sendId = {};

        list.items.forEach(function(m) {

            $scope.id.push(m.itemId)
        })

        // console.log("all ids", $scope.id)
            // $scope.id={itemId:list.items[0].itemId};

        $scope.sendId = { itemsIds: $scope.id }

        $http.post('/role2/getPriceList', $scope.sendId).success(function(response) {

                // console.log(response)

            response.data.forEach(function(e) {
                e.sellingPrices.forEach(function(m) {
                    allIds.push(m.itemId)
                })
            })

            // console.log(allIds)
            var index = 0;
            while (index < list.items.length) {
                for (var i = 0; i < response.data.length; i++) {
                    if (list.items[index].productCategoryId == response.data[i]._id) {
                        // console.log("match");
                        list.items[index]['sellingPrices'] = angular.copy(response.data[i].sellingPrices);
                        list.items[index]['sellingPrice'] = angular.copy(response.data[i].sellingPrices[0]);
                    }
                }
                index++;
            }

            // console.log(list);
            $scope.differentsPrices = response.data[0].sellingPrices;
        })

        dataForReceiveItems = {
            "orderId": list.orderId,
            "itemIds": []
        }
        $scope.receiveModelData = list.items;
        $scope.receiveModelData[0]['categoryName'] = list.categoryName;
        for (var i = 0; i < $scope.receiveModelData.length; i++) {
            $scope.receiveModelData[i]['disableFlag'] = true;
            $scope.receiveModelData[i]['recieveQuantity'] = $scope.receiveModelData[i].actualQuantity;
        }
        $('#receiveOrderPopUp').modal('show');
    }
    $scope.receiveEditClickFlag = false;
    $scope.receiveModelFlagChange = function(index) {
        $scope.receiveModelData[index].disableFlag = false;
        $scope.receiveEditClickFlag = true;
    }
    $scope.submitReceivedItems = function() {
        for (var i = 0; i < $scope.receiveModelData.length; i++) {
            if ($scope.receiveEditClickFlag) {
                if ($scope.receiveModelData[i].disableFlag == false) {
                    var itemArray = {
                        "editId": '',
                        "quantity": '',
                        "currentItem": '',
                        "recieveQuantity": '',
                        "orderedQuantity": '',
                        'itemId': ''
                    }
                    itemArray.editId = $scope.receiveModelData[i].editId;
                    itemArray.itemId = $scope.receiveModelData[i].itemId.itemId;
                    itemArray.sellingPrice = $scope.receiveModelData[i].itemId.sellingPrice;
                    itemArray.quantity = parseInt($scope.receiveModelData[i].actualQuantity);
                    itemArray.currentItem = parseInt($scope.receiveModelData[i].currentItem);
                    itemArray.recieveQuantity = parseInt($scope.receiveModelData[i].recieveQuantity);
                    itemArray.orderedQuantity = $scope.receiveModelData[i].orderedQuantity;
                    dataForReceiveItems.itemIds.push(itemArray);
                }
            } else {
                var itemArray = {
                    "editId": '',
                    "quantity": '',
                    "currentItem": '',
                    "recieveQuantity": '',
                    "orderedQuantity": '',
                    'itemId': ''
                }
                itemArray.editId = $scope.receiveModelData[i].editId;
                itemArray.itemId = $scope.receiveModelData[i].itemId.itemId;
                itemArray.sellingPrice = $scope.receiveModelData[i].itemId.sellingPrice;
                itemArray.quantity = parseInt($scope.receiveModelData[i].actualQuantity);
                itemArray.currentItem = parseInt($scope.receiveModelData[i].currentItem);
                itemArray.recieveQuantity = parseInt($scope.receiveModelData[i].recieveQuantity);
                itemArray.orderedQuantity = $scope.receiveModelData[i].orderedQuantity;
                dataForReceiveItems.itemIds.push(itemArray);

            }


        }
        // console.log(dataForReceiveItems);
        var totalx = 0;
        // console.log(dataForReceiveItems.itemIds)
        dataForReceiveItems.itemIds.forEach(function(rec) {
            totalx += rec.sellingPrice * rec.orderedQuantity;
        })
        
        dataForReceiveItems['total'] = totalx;
        dataForReceiveItems['allId'] = allIds;
        // console.log(isNaN(dataForReceiveItems.total))

        if (isNaN(dataForReceiveItems.total)) {

            alert("Select all Fields")
        } else {


            $http.post("/role2/recievePurchase", dataForReceiveItems).success(function(response, status) {
                // console.log(response)
                if (response.success) {

                    $scope.receiveBtn = false
                }
                $http.get("/role2/inventory").success(function(response, status) {
                    inventoryItems = response.data;
                });

                $scope.receiveEditClickFlag = false;
                callApi();

            });

        }

        $('#receiveOrderPopUp').modal('hide');

    }

    $scope.addItemsonSubmit = function() {
        var sellerId = $scope.temporary.selectedItems[0].sellerId;
        // console.log($scope.temporary);
        $http.post('/role2/addItemToOrder', { data: $scope.temporary.selectedItems, orderId: $scope.temporary.orderId, sellerId: sellerId }).then(function(resp) {
                 $('#editOrderPopUp').modal('hide');
                 $scope.filterApplied();

        })
    }


    $scope.filterApplied = function() {
        // console.log($scope.filter.date.startDate._d);
        // console.log($scope.filter.date.endDate._d);
        $http.post("/role2/getPurchaseHistory", { startDate: $scope.filter.date.startDate._d.toJSON(), endDate: $scope.filter.date.endDate._d.toJSON() }).success(function(response, status) {

            $scope.data = response.data;
            // console.log($scope.data)

        });
    }

    $scope.submitItems = function() {

    }
    $scope.submitItNow = function() {
        if ($scope.temporary.selected != undefined) {
            var index = $scope.temp.findIndex(function(c) {
                return c.data[0].itemId == $scope.temporary.selected.itemId;
            })
            $scope.temporary.selected.sum = angular.copy($scope.temp[index].sum);
            $scope.temporary.selectedItems.push($scope.temporary.selected);
            $scope.temporary.selected = undefined;
            $scope.temp[index].data[0].selected = true;
        }

    }

    $scope.getItemsToAdd = function(list) {
        $scope.edit = false;
        $http.post('/role2/getItemsToAdd', { sellerId: list.sellerId })
            .success(function(res) {
                $scope.temporary = {};
                $scope.temporary.orderId = list.orderId;
                $scope.temporary.selectedItems = []
                // console.log(res);
                if (res.data.length > 0) {
                    $scope.temp = res.data;
                    $('#editOrderPopUp').modal('show');

                }
            })
    }

    $scope.addtoitemDropdownChanged = function() {
           // console.log($scope.temporary);

        }
        /*  $scope.editModelData,currentItem,editId,quantity*/
        $scope.totalAmount=function(data){
           // console.log("function chala",data)
            var total=0;
            data.forEach(function(item){
                total+=(item.orderedQuantity*item.itemId.sellingPrice)
            })
            $scope.orderAmmountToBePaid=Math.round(total*(1-$scope.directDiscount/100))

        }
});