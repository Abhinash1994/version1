angular.module('sbAdminApp')
		.controller('reopenAppointmentCtrl',function($scope,$http){

    $scope.client={};
     $scope.mytime =  new Date();
    




    $scope.searchTextId = '';
    $scope.selectedParlorId = '';
    $scope.show=false;
    $scope.modalPopUpObject='';
    $scope.statusChanged='';
    $scope.showPay=false;
    $scope.paymentMethodsSelected='';
    $scope.paymentMethodsOld= '';
    
    
     $scope.hstep = 1;
  $scope.mstep = 1;
        

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };


  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
   
    
  };
     $scope.popup2 = {
                opened: false
             };
            $scope.open2 = function() {
                $scope.popup2.opened = true;
            };
    $scope.statusOfAppointment=[{'value':1,'name':'ongoing'},{'value':2,'name':'cancelled'}];
    $scope.searchId = function( searchId){
    	console.log(searchId)
        // $scope.searchTextId = searchId;
             $http.post('/role1/reopenAppointments',{'phoneNumber':  searchId}).success(function(response){
				 // $scope.datas=response.message;
				 $scope.datas=[];
                 console.log(response);
                 $scope.datas=angular.copy(response.data);
             	 if($scope.datas.length == 0){
                    				alert('Check Phone Number');}
       	 });
    }
    $scope.objectToBePicked=function(dummy){
      $http.post('/role1/reopenAppointments',{'appointmentId': dummy._id}).success(function(response){
                 console.log(response);
                 alert(response.data)
             	$scope.searchId($scope.client.phoneNumber);
        });
    }
    $scope.valueOfStatus=function(){
         console.log($scope.statusChanged);
        if($scope.statusChanged == 1 || $scope.statusChanged== 3)
            {
               // alert("Status can be 'Cancelled' only")
               // $scope.statusChanged = $scope.statusPre;
            }
    }

    $scope.finalPaymentMethodsList=function(){
        //console.log($scope.paymentMethodsSelected);
    }


    
   
 

   
   
		})