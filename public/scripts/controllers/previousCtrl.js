    'use strict'

    var app = angular.module('sbAdminApp', ['ngTable']);
app.controller('previousCtrl', ['$scope', '$http','ngTableParams' ,
    function ($scope, $http, ngTableParams) {
    var tableData = []
    //Table configuration
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 11
    },{
        total:tableData.length,
        //Returns the data for rendering
        getData : function($defer,params){
            $http.get('scripts/controllers/data.json').then(function(response) {
                tableData = response.data.dhinchek;
                $defer.resolve(tableData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(tableData.length);
            });  
        }
    });
}]);
           