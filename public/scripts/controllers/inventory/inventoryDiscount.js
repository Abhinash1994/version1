
angular.module('sbAdminApp',['ui.bootstrap'])
    .controller('inventoryDiscount',['$scope','$http',function($scope, $http) {
        // console.log('inventoryMangement controller' );
        $scope.contactDetails=""
        $scope.categories=[];
        $scope.data={parlorId:"587088445c63a33c0af62727"};
        $scope.selectedSlabs={};
        $http.get('/role2/getSellerForDs')
            .success(function (result) {
                // console.log("sellerName Data",result);
                 $scope.categories=result.data;
                 $scope.selectedSlabs.sellerId = $scope.categories[0].sellerId;
                 $scope.sellerChange();

            });
        $scope.flag=false;


           $scope.sellerChange  = function(){


            $http.post('/role2/getDiscountStructure',$scope.selectedSlabs)
                .success(function (result) {

                    // console.log(result)
                    $scope.slabs=[];
                    $scope.slabs=result.data.result[0].slabs;
                     $scope.contactDetails=result.data.seller;
                    
                    $scope.slabs.forEach( function ( m ) {

                        for ( var key in m ) {
                        if(m[key]==0){
                            m[key]=undefined;
                        }

                        // if(key=='professionalDiscount' || key=='cashDiscountOnWax' || key=='cashDiscountOnWaxOil'){
                        //
                        //     if(m[key]!=undefined){
                        //         $scope.flag=false;
                        //         console.log(key,"false");
                        //     }
                        //
                        //     else if(m.professsionalDiscount==undefined || m.cashDiscountOnWax==undefined || m.cashDiscountOnWaxOil==undefined){
                        //         $scope.flag=true;
                        //         console.log(m[key],"true");
                        //     }
                        //
                        //
                        // }


                        }

                    });

                   //  console.log("-------------------")
                   // console.log("query result--------------",result);
                    // console.log( $scope.slabs);

          
            })


            }
       
    



    }]);
