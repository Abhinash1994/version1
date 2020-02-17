angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('incentiveReportCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams) {

    /*/report/empIncentiveReport*/
    $scope.incentiveModels=[{"modelName":'Model A',"value":1},{"modelName":'Model B',"value":2}]
       $http({
            method: 'POST',
            url: '/role1/allParlors',
        }).success(function(response){

            // console.log(response);
            // $scope.data.payment=[{"mode":"Cash","amount":1500},{"mode":"Card","amount":600}];
        });
    $scope.incentiveModelSelected=1;
    $scope.changeIncentiveModel=function(){
        // console.log( $scope.incentiveModelSelected);
    }
    });
