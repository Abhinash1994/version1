app.controller('search-listCtrl', ['$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service','salonListingSearchBoxBooleanService','$rootScope','offerPageSearchLocation','$q',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service,salonListingSearchBoxBooleanService,$rootScope,offerPageSearchLocation,$q) {
 $scope.getListofSearches=searchListFunction;
//console.log("ths is search list pages");
     //console.log($routeParams);
        $scope.searchQuery={};
        var abc=$routeParams.param;
     if(abc)
    {
       $scope.getListofSearches(abc);
        
          
    }

        
        $scope.querySearch=function(searchTxt){
              var defer=$q.defer();
                var a={'suggest':{'song-suggest':{'prefix':searchTxt,completion:{'field':'suggest','fuzzy':{'fuzziness':5}}}}};
            
                $http.post('https://search-searchtestbeu-2hzmrnm5pepgmxinpwwzjbos6q.ap-south-1.es.amazonaws.com/blogs/_search?pretty',a).success(function(res){
                    //console.log(res);
                    var abc=angular.copy(res.suggest['song-suggest'][0].options);
                    defer.resolve(abc);
                })
            
            return defer.promise;
        }
        
  $scope.selectedItemChange=function(acd){
      //console.log(acd)
      if(typeof acd=='object')
    {
         $location.path("/saerch-list/"+acd._source.title+'/'+acd.text);
       $scope.getListofSearches(acd._source.title); 
    }
      else{
//          alert('you have entered it manually')
      }
      
  }
        
        
        
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/5ad05c534b401e45400e97ed/default';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();

   function searchListFunction(abc){
     //console.log(abc)
     if($routeParams.text)abc=$routeParams.text;
        var queryParam={
            "query": {
                "match" : {
                    "title" : abc
                }
            }
         };
        $http.post('https://search-searchtestbeu-2hzmrnm5pepgmxinpwwzjbos6q.ap-south-1.es.amazonaws.com/contents/_search',queryParam).success(function(res){
                                //console.log(res)
                        $scope.combinationObject=angular.copy(res.hits.hits);
                                //console.log($scope.combinationObject)
                    })
   }     
        
        
   $scope.goSearchList=function(){
             $scope.selectedItemChange($scope.searchQuery.selectedItem);
        }
        


    }]);
  











