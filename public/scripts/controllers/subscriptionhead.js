angular.module('sbAdminApp', ['isteven-multi-select','ngSanitize', 'ngCsv','daterangepicker'])
    .controller('subscriptionhead', function($scope, $http, $stateParams, $window) {
    
            $scope.selected=[{ "value": 1, "text": "Gold" }, { "value": 2, "text": "Silver" }];
         console.log("hell subscription ");
        
                $scope.t=[{'month':'January'},{'month':'February'},{'month':'March'},{'month':'April'}]
                
                    $scope.head=[{'count':'Count','redi':'Rediption','TotalRevenue':'Total Revenue'},{'count':'Count','redi':'Rediption','TotalRevenue':'Total Revenue'},
                             {'count':'Count','redi':'Rediption','TotalRevenue':'Total Revenue'},
                             {'count':'Count','redi':'Rediption','TotalRevenue':'Total Revenue'},]
    
    $scope.submit=function(selectedm){
        
        console.log( $scope.selected.selectedm)
        
        $http.post('role1/subscriptionCohort',{type:$scope.selected.selectedm}).then(function(res){
            
            console.log(res);
            $scope.data=res.data;
            console.log($scope.data)
        })
    }
    
});