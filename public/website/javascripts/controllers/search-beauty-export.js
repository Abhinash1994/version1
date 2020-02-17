app.controller('search-beauty-exportCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation','$q',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,salonListingSearchBoxBooleanService,$rootScope,offerPageSearchLocation,$q) {
        $scope.searchParam={};
        console.log("hello expert");
        $scope.goSearchlist=function(){
            window.scrollTo(0,0);
            $location.path( '/saerch-list' );
        };
        
        $scope.selectedItemChange=function(a){
            console.log(a) 
            if(typeof a== 'object')
            {
                var param=a._source.title
                $location.path("/saerch-list/"+param+'/'+a.text);
              
            }
        }
        
        $scope.querySearch=function(searchTxt){
            var defer=$q.defer();
                var a={'suggest':{'song-suggest':{'prefix':searchTxt,completion:{'field':'title','skip_duplicates':true,'fuzzy':{'fuzziness':5}}}}};
            
                $http.post('https://search-searchtestbeu-2hzmrnm5pepgmxinpwwzjbos6q.ap-south-1.es.amazonaws.com/blogs/title/_search?pretty',a).success(function(res){
                    console.log(res);
//                    var abc=[];
                    var abc=angular.copy(res.suggest['song-suggest'][0].options);
                    console.log(abc);
                    defer.resolve(abc);
                })
            
            return defer.promise;
                
        }
        
        $scope.goSearchlist=function(){
                
        }

        
        // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        //     (function(){
        //     var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        //     s1.async=true;
        //     s1.src='https://embed.tawk.to/5ad05c534b401e45400e97ed/default';
        //     s1.charset='UTF-8';
        //     s1.setAttribute('crossorigin','*');
        //     s0.parentNode.insertBefore(s1,s0);
        //     })();
        
    }]);
