'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap', 'isteven-multi-select', 'daterangepicker'])
    .controller('addInventoryItemsCtrl', ['$scope', '$position', '$http', '$state', 'NgTableParams', 'Excel', '$timeout', function($scope, $position, $http, $state, NgTableParams, Excel, $timeout) {

        $scope.editItemsobj = {};
        $scope.item = {}
        $scope.selectFilter = '';
        $scope.cat = {};
        $scope.selectCheck = {}
        $scope.refreshFlag = true;
        $scope.catFlag = true;
        $scope.filledData = [];

        $scope.changeStatus = function(i) {
            console.log(i)

            $http.post('/role2/changeItemStatus', i).then(function(response) {
                console.log(response);

            })



        };

        $scope.refresh = function() {
            if ($scope.refreshFlag) {
                $http.get("/role1/inventory").success(function(response, status) {
                    $scope.items = response.data;
                    console.log(response);
                    $scope.refreshFlag = false;
                    $http.get("/role1/getCategories").success(function(response, status) {
                        $scope.cats = response.data;
                        console.log(response);
                        callSalonTypeApi($scope.cats)
                    });
                });
            }
        }

        $scope.refresh();
        $scope.salonTypeArray = [];
        $scope.selectedSalonType1 = { 'data': [] };

        function callSalonTypeApi(arrayPassed) {
            $http.get("/role1/getSalonType").success(function(response, status) {
                console.log(response);
                if (arrayPassed != null) {
                    arrayPassed.find(function(element) {
                        var salonTypesArray = [];
                        angular.copy(response.data).find(function(subElement) {
                            var obj = { 'name': '', 'id': '' };
                            if (subElement == 0) {
                                obj.name = 'Red';
                                obj.id = subElement;
                            } else if (subElement == 1) {
                                obj.name = 'Blue';
                                obj.id = subElement;
                            } else if (subElement == 2) {
                                obj.name = 'Green';
                                obj.id = subElement;
                            } else if (subElement == 3) {
                                obj.name = 'All';
                                obj.id = subElement;
                            }
                            salonTypesArray.push(obj);
                        })
                        element.allSalonTypes = angular.copy(salonTypesArray);
                    })
                } else {
                    response.data.find(function(element) {
                        console.log(element)
                        var obj = { 'name': '', 'id': '' };
                        if (element == 0) {
                            obj.name = 'Red';
                            obj.id = element;
                        } else if (element == 1) {
                            obj.name = 'Blue';
                            obj.id = element;
                        } else if (element == 2) {
                            obj.name = 'Green';
                            obj.id = element;
                        } else if (element == 3) {
                            obj.name = 'All';
                            obj.id = element;
                        }

                        $scope.salonTypeArray.push(obj);
                    })
                }
                console.log($scope.salonTypeArray);

            })
        };
        callSalonTypeApi(null);


        $scope.addCustomer = function() {


            if ($scope.item.categoriesId == undefined) {
                alert("Select all Fields")

            } else {

                console.log("kgsdf------------", $scope.item);

                $http.post("/role1/inventory", $scope.item).success(function(response, status) {
                    console.log("db", response)
                    $('#addInventoryItem').modal('hide');
                    if (!response.success) {
                        alert("Item already exist", $scope.item.categoriesId)
                    }


                    $scope.sendData = { Id: response.data._id, categoriesId: $scope.item.categoriesId }
                    $http.get("/role1/inventory").success(function(response, status) {
                        $scope.items = response.data;
                        console.log(response);
                        $scope.refreshFlag = false;
                        $http.get("/role1/getCategories").success(function(response, status) {
                            $scope.cats = response.data;
                            console.log(response);
                            callSalonTypeApi($scope.cats)
                        });
                    });

                    // >>>>>>> 037bf9e3c548b093a9f4fdb82b6d2761a8e64849
                })


            }


        }
        $scope.cancel = function() {
            $scope.item = {};
            $('#addInventoryItem').modal('hide');
        };

        $scope.editOnItem = function(itemsobj) {
            $scope.editItemsobj = itemsobj;
        }
        $scope.UpdateOnItem = function(itemsobj) {
            $('#editInventoryItem').modal('hide');
            console.log("$scope.editItemsobj", $scope.editItemsobj);
            $http.post("/role1/updateCategories", $scope.editItemsobj).success(function(response, status) {
                console.log("response", response)
                $scope.refreshFlag = true;
                $scope.refresh();
            })
        }


        $scope.showCategories = function() {
            // if($scope.catFlag){
            $http.get("/role1/getCategories").success(function(response, status) {
                $scope.filledData = response.data;
                callSalonTypeApi($scope.filledData)
                console.log(response);
                $scope.catFlag = false;
                $scope.salonTypeArray = [];
                $scope.selectedSalonType1 = { 'data': [] };
                callSalonTypeApi(null);
            });
            // }

        }

        $scope.addNewCategory = function() {

            console.log($scope.selectedSalonType1)
            var arraySelectedSalonType = [];
            $scope.selectedSalonType1.data.find(function(element) {
                arraySelectedSalonType.push(element.id);
            });
            $scope.cat.salonType = arraySelectedSalonType;
            console.log($scope.cat);
            $http.post("/role1/addCategories", $scope.cat).success(function(response, status) {
                $scope.cat.name = '';
                $('#addCategory').modal('hide');
                $scope.catFlag = true;
                $scope.showCategories();
                console.log(response);
                $scope.refreshFlag = true;


            });

        }

        $scope.showRemoveCategoryPopUp = function(index) {
            $scope.indexFillData = index;
            console.log($scope.indexFillData)
            $('#removeCategoryPopUp').modal('show');
        }
        $scope.removeCategory = function(i) {
            console.log(i);
            console.log($scope.filledData[i]._id)
            $scope.myData = { Id: $scope.filledData[i]._id }

            $http.post("/role1/deleteCategories", $scope.myData).success(function(response, status) {
                $scope.catFlag = true;
                $scope.showCategories();
                $('#removeCategoryPopUp').modal('hide');
                console.log(response);
            });

        }

        $scope.showEditCategoryModal = function(objectPassed) {
            $('#editCategory').modal('show');
            $scope.editCategorySelectedSalon = '';
            $scope.editCategoryModalObject = objectPassed;
            $scope.selectedSalonType = { 'data': '' };
            for (var i = 0; i < $scope.editCategoryModalObject.allSalonTypes.length; i++) {
                $scope.editCategoryModalObject.salonType.find(function(element) {
                    if (element == $scope.editCategoryModalObject.allSalonTypes[i].id) {
                        $scope.editCategoryModalObject.allSalonTypes[i].isSelected = true;
                    }
                })
            }
        }

        $scope.editCategory = function() {
            console.log($scope.selectedSalonType)
            var arraySelectedSalonType = [];
            $scope.selectedSalonType.data.find(function(element) {
                arraySelectedSalonType.push(element.id);
            });
            var editCategoryObject = {
                'categoriesId': '',
                'salonType': '',
                'name': ''
            };
            editCategoryObject.categoriesId = $scope.editCategoryModalObject._id;
            editCategoryObject.salonType = arraySelectedSalonType;
            editCategoryObject.name = $scope.editCategoryModalObject.name;
            console.log(editCategoryObject);
            $http.post("/role1/editCategories", editCategoryObject).success(function(response, status) {
                $('#editCategory').modal('hide');
                console.log(response);
                $scope.showCategories();
            });

        }

        $scope.refreshAddCategorArray = function() {

            $scope.selectedSalonType1 = { 'data': [] };
        }
        $scope.exportToExcel = function(tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function() {
                location.href = exportHref;
            }, 100); // trigger download
        }

        $scope.getSalonTypeName = function(element) {
            if (element == 0) {
                return 'Red'
            } else if (element == 1) {
                return 'Blue'
            } else if (element == 2) {
                return 'Green'
            } else if (element == 3) {
                return 'All'
            }
        }
    }]);