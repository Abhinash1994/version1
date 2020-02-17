'use strict';

angular.module('sbAdminApp', ['ui.bootstrap'])
.controller('userQuestionnaire', function($scope,$http,$timeout,$state,$stateParams) {

  $scope.submitButton=function() {
     // console.log("hello")
    }
    $http.get("/role1/userQuestionAnswers").success(function(response, status){
        // console.log(response);
        $scope.questions=response.data.questions;
        $scope.answerData=response.data.answerData;
        $scope.answers=response.data;
    });
    $scope.userContacted=function(phoneNumber){
        $http.post("/role1/updateUserContacted",{phoneNumber:phoneNumber}).success(function(response, status){
            // console.log(response);
        });
    }

});
