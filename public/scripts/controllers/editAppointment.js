angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngAnimate'])
    .controller('editApptCtrl', function($scope, $http, $stateParams, $window,NgTableParams, $rootScope ) {
    


     $scope.mytime =  new Date();



     $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
  $scope.maxDate = new Date(2020, 5, 22);
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
        $scope.searchTextId = searchId;
             $http({
            method: 'POST',
            url: '/role1/selectAppointment',
            data:{
                'parlorAppointmentId':  searchId
            }
        }).success(function(response){

            $scope.datas=response.data;
            console.log($scope.datas);
            $scope.minDate=new Date(response.data[0].settlementDate);
            $scope.minDate.setTime($scope.minDate.getTime() + (1*60*60*1000)); 
            console.log($scope.minDate);
             if($scope.datas.length == 0){
                    alert('Check Phone Number');
                }
        });
    }
    $scope.objectToBePicked=function(apptId){
        $scope.modalPopUpObject='';
        $scope.show=false;
        console.log(apptId);
        $scope.selectedParlorId = apptId;
         $http({
            method: 'POST',
            url: '/role1/selectParlor',
            data:{
                'appointmentId':  apptId
            }
        }).success(function(response){
             $scope.MemPaymentOptions=[{"value":1,"name":"Cash","isSelected":false},{"value":2,"name":"Card","isSelected":false},{"value":3,"name":"Advance Cash","isSelected":false},
{"value":4,"name":"Advance Online","isSelected":false},{"value":8,"name":"MX Debit Card","isSelected":false},{"value":9,"name":"MX Credit Card","isSelected":false},{"value":11,"name":"Nearbuy","isSelected":false}];
              //,{"value":10,"name":"beu","isSelected":false} this is removed
              $scope.modalPopUpObject = response.data;
             console.log(response);
              console.log($scope.modalPopUpObject);
              $scope.paymentMethodsOld = $scope.modalPopUpObject.allPaymentMethods;
              $scope.date = new Date($scope.modalPopUpObject.appointmentStartTime);
              $scope.statusChanged = $scope.modalPopUpObject.status;
              if( $scope.statusChanged==3){
                $scope.statusChanged=1
              }
              $scope.totalAmt = $scope.modalPopUpObject.payableAmount;
              $scope.payableAmount1 =$scope.modalPopUpObject.payableAmount;
              $scope.statusPre = $scope.modalPopUpObject.status;
              var index=0;

              while(index<$scope.modalPopUpObject.allPaymentMethods.length){
               for(var i=0;i<$scope.MemPaymentOptions.length;i++){
                if($scope.MemPaymentOptions[i].value==$scope.modalPopUpObject.allPaymentMethods[index].value){
                    $scope.MemPaymentOptions[i].isSelected=true;
                     $scope.MemPaymentOptions[i]['amount'] =  $scope.modalPopUpObject.allPaymentMethods[index].amount;
                    
                }

            }
            index++;
        }
        });

    }
    $scope.valueOfStatus=function(){
         console.log($scope.statusChanged);
    }

    $scope.finalPaymentMethodsList=function(){
        //console.log($scope.paymentMethodsSelected);
    }

   $scope.editAppointment = function(){


    console.log($scope.date)
        $scope.msg='';
        var d = $scope.date;
        var t = $scope.mytime;
        $scope.newTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes(), 0);
       console.log($scope.newTime)
       var total = 0; 
       $scope.paymentMethodsSelected.forEach(function(amt){
                  total   += amt.amount;
             })
            console.log(total);
           // if( total == $scope.totalAmt)
           //  {  
                //$scope.msg="Successfully Updated";
                 $('#editAppt').modal('hide');
                
           console.log($scope.statusChanged);
           console.log($scope.selectedParlorId);
           console.log($scope.date);
           console.log( $scope.paymentMethodsSelected);
           console.log($scope.paymentMethodsOld);
           console.log($scope.payableAmount1);
           if($scope.paymentMethodsSelected.length==0){
            $scope.paymentMethodsSelected=$scope.paymentMethodsOld
           }
              console.log("final data",{
                'appointmentId':  $scope.selectedParlorId,
                'statusChanged':   $scope.statusChanged,
                'dateChanged':  $scope.date ,
                'paymentMethodsOld':$scope.paymentMethodsOld,
                'paymentMethodsSelected': $scope.paymentMethodsSelected
            })  
             $http({
                    method: 'POST',
                    url: '/role1/updateEditedAppointment',
                    data:{
                        'appointmentId':  $scope.selectedParlorId,
                        'statusChanged':   $scope.statusChanged,
                        'dateChanged':  $scope.date ,
                        'paymentMethodsOld':$scope.paymentMethodsOld,
                        'paymentMethodsSelected': $scope.paymentMethodsSelected
                    }   
                    }).success(function(response){
                        console.log(response);
                        $scope.searchId($scope.searchTextId);
                 
                    });              
            // }
       
       // else{
       //     //alert("Amount is not equal as Total Amount");
       //       $scope.show = true;
       //      //$scope.msg="Check Payment Distribution or Amount is not equal as Total Amount";
       //      $scope.msg="Payment Mode Amount is not equal as Payable Amount";
        
       //     }
   }
   console.log($scope.date)

   
    console.log($scope.mytime)
    
   
 

   
   
   
});