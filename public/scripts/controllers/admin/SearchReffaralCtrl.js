angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','vsGoogleAutocomplete'])
    .controller('SearchReffaralCtrl', function($scope, $http, Excel, $timeout) {
        $scope.table=false;
        $scope.empReferralSearch={}
        $scope.tableSearch=[]
        // console.log($scope.user)
        $scope.search=function () {
        // console.log($scope.empReferralSearch)
        $http.post("/role1/searchReferrals",$scope.empReferralSearch).then(function (res) {
             $scope.tableSearch=res.data
             $scope.table=true;
            // console.log('result',$scope.tableSearch)
            $scope.empReferralSearch={}

        })
 }

})