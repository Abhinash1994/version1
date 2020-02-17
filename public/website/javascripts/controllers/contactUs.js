app.controller('contactUs', ['$scope','$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','$geolocation','Service',
    function($scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,$geolocation,Service) {

        $scope.result = 'hidden'
        $scope.resultMessage;
        $scope.formData; //formData is an object holding the name, email, subject, and message
        $scope.submitButtonDisabled = false;
        $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
        $scope.submit = function(contactform) {
            console.log("hi");
            $scope.submitted = true;
            $scope.submitButtonDisabled = true;
            //console.log($scope.formData)
            if ($scope.formData!=undefined) {
              $http.post('/api/contactUsMail',$scope.formData).success(function(data){

                    console.log(data);

                    if (data.success) { //success comes from the return json object

                        $scope.submitButtonDisabled = true;

                        $scope.resultMessage = data.message;

                        $scope.result='bg-success';
                        //console.log( $scope.result);

                    } else {

                        $scope.submitButtonDisabled = false;

                        $scope.resultMessage = data.message;

                        $scope.result='bg-danger';
                        //console.log($scope.result);

                    }

                });

            } else {

                $scope.submitButtonDisabled = false;
                $scope.resultMessage = 'Failed Please fill out all the fields.';
                $scope.result='bg-danger';
                //console.log($scope.resultMessage);

            }

        }


    }]);