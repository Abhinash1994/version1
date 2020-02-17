angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

.controller('conversionSummary', function($scope, $http, $stateParams, $window,NgTableParams) { 

    console.log("Conversion Summary", customerCareTeamMembers);
    if(role!=1){
        customerCareTeamMembers.push({userId:userId,name:userName})
    }
    $scope.teamMembers=customerCareTeamMembers;
    $scope.dateRangeSelected = { startDate: moment().startOf('month'), endDate: moment()};
    $scope.data={};
    $scope.teamMembersSelected=function(selectedMembers){
        $scope.dataAttemptedIds=selectedMembers
        console.log("Team members selected",$scope.dataAttemptedIds)
    }
    $scope.dataAttempted=function(){
        var ids=[];
        $scope.dataAttemptedIds.forEach(function(element) {
            ids.push(element.userId)
        }, this);
        var sdate=$scope.dateRangeSelected.startDate._d.getFullYear()+","+($scope.dateRangeSelected.startDate._d.getMonth()+1)+","+$scope.dateRangeSelected.startDate._d.getDate()
        var edate=$scope.dateRangeSelected.endDate._d.getFullYear()+","+($scope.dateRangeSelected.endDate._d.getMonth()+1)+","+$scope.dateRangeSelected.endDate._d.getDate()
        console.log("data attempted function",{'sdate':sdate,'edate':edate,customerCareId:userId,customerCareIds:ids});
        $http.post('/role1/customerCareAttemptReport',{ 'sdate':sdate,
        'edate':edate,customerCareId:userId,customerCareIds:ids}).then(function(res){
          console.log("api response",res);
            $scope.attemptedData=res.data

        })
    }
    $scope.attemptReport=function(){
        var ids=[];
        ids[0]=$scope.data.selectedOption
        var sdate=$scope.dateRangeSelected.startDate._d.getFullYear()+","+($scope.dateRangeSelected.startDate._d.getMonth()+1)+","+$scope.dateRangeSelected.startDate._d.getDate()
        var edate=$scope.dateRangeSelected.endDate._d.getFullYear()+","+($scope.dateRangeSelected.endDate._d.getMonth()+1)+","+$scope.dateRangeSelected.endDate._d.getDate()
        console.log("data attempted function",{'sdate':sdate,'edate':edate,customerCareId:userId,customerCareIds:ids});
        $http.post('/role1/customerCareConversionReport',{ 'sdate':sdate,
        'edate':edate,customerCareId:userId,customerCareIds:ids}).then(function(res){
            console.log("api response",res);
            $scope.conversionData=res.data;
            $scope.middleLayer=[];
            for(var i=0;i<$scope.conversionData.length;i++){
                $scope.middleLayer.push("Attempted")
                $scope.middleLayer.push("Link Sent")
                $scope.middleLayer.push("Converted")
            }

        })
    }


});