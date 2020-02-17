 'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['ngCsv'])
  .controller('reorder1',function($scope, $http, NgTableParams
,Excel,$timeout) {
    console.log('reorder controller');

$scope.refresh= function(){
         $http.post("/role2/getReorder").success(function(response, status){
                
             $scope.arraydata = response.data;
             console.log($scope.arraydata);

             for(var i=0;i<$scope.arraydata.length;i++){
                 for(var j=0;j<$scope.arraydata[i].data.length;j++){
                     $scope.arraydata[i].data[j].data[0]['orderedQuantity']=0;
                 }
             }

             console.log($scope.arraydata);

             
        });


        
    }
    $scope.checkShowStatus=function(data){
        var show=false;
        data.forEach(function(element) {
            if(element.quantity<element.minimumQuantity)
            show =true;
        }, this);
        return show
    }
    
    $scope.refresh();
//      

var  sumbitFlag=false


    $scope.onSumbit = function(quantity){
           console.log(quantity)

        
           var filteredData={};
           filteredData._id=quantity._id;
       filteredData.data=quantity.data.filter(function(a){

                            return a.data[0].orderedQuantity>0
                   
        })   

        console.log(filteredData);
//     get the sum   of the product of cost price and ordered Quantity  of different orders
        var num=filteredData.data.reduce(function(sum,value){
         
                sum=sum+(value.data[0].costPrice*value.data[0].orderedQuantity);
                return sum
        },0)

        console.log(num)

        if(filteredData.data.length>0){
          var x={
                     id:quantity._id
                }
                 
          if(num<5000)  //   if  sum   of the product of cost price and ordered Quantity  of different orders
                        //  less then  5000
        {
              //  stop  from modal from closing when clicked outside
              $('#myModal').modal({
                                      backdrop: 'static',
                                    keyboard: false})
//    ----
               
                $scope.dataToBeSent=angular.copy(filteredData);
                $scope.tempid=angular.copy(x);
                $('#myModal').modal('show');
             
          
              //   else  //   if  user reject not to add  Order
              // {
              //          console.log("Rejected  By user")
              // }

        }
        //    if sum  is  greater  then     5000
       else
     {
              //   calling function  
                $scope.addOrderFunction(filteredData,x);
      }
      

      
}


else{
  console.log("its zero")
}
        
        
}
    
    
        
 $scope.exportToExcel = function (tableId) { // ex: '#my-table'
      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function () {
          location.href = exportHref;
      }, 100); // trigger download
  }
    

//      function  to be called frm onSubmit
        $scope.addOrderFunction=function(filteredData,x)
{   

        console.log(filteredData)
        console.log(x)
     
     $('#myModal').modal('hide');
                   $http.post("/role2/sellerContact", x).success(function(response1, status){
              var contactDeatils=response1.data.contactNumber;
              console.log(response1)
        console.log()

        for(var i=0;i<filteredData.data.length;i++){
                filteredData.data[i].data[0]['status']=1;
        }
         console.log("final data------->>>",filteredData);
          $http.post("/role2/addOrder", filteredData).success(function(response, status){
              console.log(response);
                var a="Dear Salon Partner,\nThanks for using Be U Salons Purchase System. You order has been placed and the PO has been emailed to the vendor.\nWe recommend you to reconfirm the order with the vendor immediately over a call for additional details for smooth order processing."+ "We request you to call the seller for confirmation. Contact Details are-"+ contactDeatils;
              alert(a)
              $scope.refresh();
          })

          })




}

$scope.Clicked=function(a)
{
          if(a==0)
        {
               $('#myModal').modal('hide');
        }
        else
        {
             
                 $scope.addOrderFunction($scope.dataToBeSent,$scope.tempid)
        }
}
    
  });
