angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('teamMemberProfileCtrl', function($scope, $http, $stateParams, $window,NgTableParams, $rootScope ) {

        $scope.userId=userId;
        $scope.userName=userName;
    });