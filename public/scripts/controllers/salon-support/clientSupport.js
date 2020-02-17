angular.module('sbAdminApp')
.controller('clientSupport',function($scope,$http){
        //console.log("this is calling")
    // api to get ]var for parlors
       
     
            $scope.selectedData = "";

        $scope.sumitData=function(){
       
           // console.log($scope.selectedData);
            $http.get("/role1/getParlorVar?reportType="+ $scope.selectedData.myVar).success(function(res){
                console.log(res)
                $scope.data=res;
              //  console.log($scope.data)
           
            })
      
    }

       
        $scope.salonType=function(type){
            if(type==0)
            return "Red"
            else if(type==1)
            return "Blue"
            else if(type==2)
            return "Green"
        }
        $scope.getStyle=function(revenue,royality){
             $scope.s={};
            if(isNaN(revenue/royality)==false){
                if(royality==0 ) {
                    $scope.s = {
                        "background-color" : "white",
                        
                    }
                }
                else if(revenue/royality>=1){
                    $scope.s = {
                        "background-color" : "#D6FFD6",
                        
                    }
                }
                else if(revenue/royality<1 && revenue/royality>=.6){
                    $scope.s = {
                        "background-color" : "#FFFFBD",
                        
                    }
                }
                else if(revenue/royality<.6 ){
                    $scope.s = {
                        "background-color" : "#FFB2AE",
                        
                    }
                }
                return $scope.s
            }
            

        }

       

})