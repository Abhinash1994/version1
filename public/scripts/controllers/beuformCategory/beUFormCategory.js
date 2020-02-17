angular.module('sbAdminApp', ["ngJsonExportExcel",
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3'
]).controller('beUformCtrl',function($scope,$http){
          $scope.category={categoryName:""
                           };
          $scope.subCategory={subCategoryName:"",categoryId:""};

          $scope.cat={select:''};
               $scope.categories=[];

               $scope.getCategories=function(){
                $scope.category={}
                
                                 $http.get("/beuApp/listBeuFormCategories").success(function(response){
                                          $scope.categories=[];
                                          // console.log(response)
                    response.data.forEach(function(d){
                        $scope.categories.push(d);
                    })

                })

               }


               $scope.getCategories();


            $scope.createCategory=function(){
                        if($scope.category.categoryName.length>0){
                            $http.post("/beuApp/createBeuFormCategory",$scope.category).then(function(response){
                                        // console.log(response);
                                        $scope.getCategories();
                            })
                        }
            }



            $scope.changing=function(){
                // console.log($scope.cat.select);
            }

            $scope.submitsubCategory=function(){
                $scope.subCategory.categoryId=$scope.cat.select._id;
                // console.log($scope.subCategory);

                $http.post("/beuApp/createBeuFormSubCategory",$scope.subCategory).success(function(res){
                        // console.log($scope.subCategory);

                })
            }


            $scope.deleteCategory=function(c){


                    $http.post('/beuApp/deleteCategory',{categoryId:c._id}).success(function(res){
                           
                           $scope.getCategories();
                    })

            }

})
