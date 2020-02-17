angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('editReviewCtrl', function($scope, $http, Excel, $timeout) {
    // console.log("timeWiseReport ");
   
    $scope.reviewUpdate = {}
    $scope.selectedParlor=[];
    $scope.previousRating = '';
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/parlorList").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
    $scope.changeParlor=function(){
        $scope.parlorIdsToBeSent=[];
            for(var i=0;i<$scope.selectedParlor.length;i++){
                $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
                }

            }
    $scope.load = function(){
     $http.post("/role1/listReviews").success(function(response){
     $scope.datas = response.data;
        // console.log(response);
         $scope.datas.forEach(function(rev){ 
            rev['showUpdateBtn']=false;
         })
    });
    }
    
     $scope.load();
    
     $scope.applyFilter=function(){
      
            // console.log($scope.parlorIdsToBeSent);        
         
          $http.post("/role1/listReviews", {'parlorId': $scope.parlorIdsToBeSent}).success(function(response){
                $scope.datas = response.data;
                    // console.log(response);
                }); 
     }
     
     $scope.editReview = function(arg){
         arg.showUpdateBtn=true;
         $scope.previousRating = arg.review.rating;
         // console.log(arg);
     }
     
     $scope.newReview = function(info){
         if(info.review.rating == undefined)
            alert('Rating should be between 1 to 5');
         else{ 
             if(info.review.rating == $scope.previousRating){
                 info.showUpdateBtn=false;
             }
             else{
                 $scope.reviewUpdate.clientNo = info.client.phoneNumber;
                 $scope.reviewUpdate.apptId  = info._id;
                 $scope.reviewUpdate.rating  = info.review.rating;
                 // console.log("click", $scope.reviewUpdate);

                 $http.post("/role1/editReviews",$scope.reviewUpdate).success(function(response, status){
                    // console.log(response);
                    alert('Successfully Updated');
                    $scope.load();
                    });
                  alert('Successfully Updated '+info.client.name+"'s review");
                    $scope.load();
                }
            }
        }
  
})