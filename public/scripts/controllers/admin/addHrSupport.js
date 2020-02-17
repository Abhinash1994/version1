angular.module('sbAdminApp')
    .controller('addHrSupport',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {
    	
        // console.log("Hi")
        $scope.month=[
                  {id:0,value:'January'},
                  {id:1,value:'February'},
                  {id:2,value:'March'},
                  {id:3,value:'April'},
                  {id:4,value:'May'},
                  {id:5,value:'June'},
                  {id:6,value:'July'},
                  {id:7,value:'August'},
                  {id:8,value:'September'},
                  {id:9,value:'October'},
                  {id:10,value:'November'},
                  {id:10,value:'December'},
                  ];
         $scope.data={}
          $http.post("/role1/parlorList").success(function(response, status) {

                        // console.log(response);
                         $scope.parlors = response.data;
                })
          $scope.addHrSupport=function(){
                // console.log($scope.data)
                $http.post("/role1/createHrSupportData",$scope.data).success(function(res){

                        // console.log(res);
                        alert(res.data)


                })

          }

    });