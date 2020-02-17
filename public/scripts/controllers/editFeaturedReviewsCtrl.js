            angular.module("sbAdminApp",['ngTable'])
                   .controller("editFeaturedReviewsCtrl",function($scope,$http,NgTableParams){
                        //parlor List
                            $scope.parlorList=[];
                        // selected Parlor
                            $scope.parlor={};
                                // api to get parlors
                                    $http.get('/beuApp/getParlors').success(function(res){
                                         $scope.parlorList=res.data; // assign parlors to parlorList Variable
                                    })
                                //function to parlor Reviews

                                    $scope.getParlorReviews=function(){
                                        $http.post("/role1/fetchParlorReviews",{parlorId:$scope.parlor.selectedParlor})
                                             .success(function(res){
                                                //  on Success
                                               $scope.tableParams = new NgTableParams({}, { dataset: res.data});//  for table                                                                              liberary
                                        })

                                    }


                            // function  to update record

                                    $scope.updateRecord=function(){
                                               $scope.selectedData=[]; //   data to be send to server



                                    $scope.selectedData=$scope.tableParams.data.map(function(c){ // to cut of some properties
                                                                    if(!c.review.isFeatured)
                                                                    {
                                                                        c.review.isFeatured=false;
                                                                    }
                                                                return{ _id:c._id,
                                                                isFeatured:c.review.isFeatured}})
                                                    console.log($scope.selectedData);
//                                                console.log($scope.tableParams.generatePagesArray())
                                             //    api to send Data
                                $http.post("/role1/updateFeaturedRatings",{appointments:$scope.selectedData})
                                     .success(function(res){
                                            console.log(res)
                                            //  refresh api
                                                $scope.getParlorReviews();  // after update view refresh data

                                })
                         }

                        })
