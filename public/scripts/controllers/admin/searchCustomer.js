angular.module('sbAdminApp')
    .controller('searchCustomerCtrl', function($scope, $http, Excel, $timeout) {
    // console.log("searchCustomerCtrl ");
  
  $scope.flag1=false;
  
 
  
  
	$scope.dataSent = {};
	$scope.datas = [];
	 $scope.apptDatas= [];
	$scope.dataSent.key = 'name';
    $scope.values=[{'name': 'Name','val':'name'}, 
    {'name': 'E-mail','val':'emailId'},{'name': 'Mobile No.','val':'phoneNumber'}];


// $scope.freeService={
//   true:'true',
//   false:'false'

// }
$scope.addFreeService=function(i){


// console.log($scope.datas[i].gender)


 $http.post("/role1/googleReviewFreebies",{gender:$scope.datas[i].gender,freeService:'true'}).success(function(res){
  // console.log(res)
  alert('You want add free service');

 $scope.searchCustomer();
 })

  // console.log('hi');
}

$scope.updateAppointment=function(data){
  console.log("daaa",data)
   $http.post("/role1/updateAppointmentLatLongAndType",{"appointmentId":data}).success(function(res){
     console.log("final",res)
   
   })

}
    $scope.searchCustomer = function(){
      // console.log($scope.dataSent)
      var data={
      [$scope.dataSent.key]:$scope.dataSent.value
    }
    
   // console.log(data)
    $http.post("/role3/searchUserForReviews", data).success(function(response, status){
		    $scope.datas = response.data;
		        console.log("final",response);
		    });


}

$scope.freehairCutzero=function(a){

  $http.post("/role1/changeFreeBarToZero",{phoneNumber:a}).success(function(res){
      // console.log(res)
        if(res.success)
        {
          alert(res.data);
          $scope.searchCustomer();
        }
  })
}
$scope.freehairCuthundred=function(a){

  $http.post("/role1/changeFreeBarToHundred",{phoneNumber:a}).success(function(res){
      // console.log(res)
        if(res.success)
        {

          alert(res.data);
          $scope.searchCustomer();
        }
  })
}


$scope.getDetails=function(s){
$scope.temps=[]
  var promise=  $http.post("/role1/viewReferalDetails",{phoneNumber:s.clientNumber}).success(function(a){
        // console.log(a)
       
        $scope.temps=a;
        

       
    })  

  promise.then(function(){
     $("#myModal").modal('show');
  })
}



    $scope.calledApptTable= function(clientNo){   	
    	// console.log(clientNo);
    	  $http.post("/role3/appointmentSearchUser",{"apptPhoneNumber":clientNo}).success(function(response, status){
		    $scope.apptDatas = response.data;
		         console.log("--------------------",response);
                // $scope.apptDatas.forEach(function(element){
		        	// 			if(element.cashBack==undefined){
		        	// 				element.cashBack='0';
				// 				}
				// })
		    });


    }


  
    $scope.addOneMonth=function(a){
    $http.post("/role1/addSubscriptionValidity",{phoneNumber:a}).success(function(res){
      console.log(res)
          if(res.success)
          {

            alert(res.data);
            
          }else alert(res.message);
    })
}

$scope.changeGender=function(a){
    $http.post("/role1/changeGenderAndFreeService",{phoneNumber:a}).success(function(res){
      console.log(res)
          if(res.success)
          {

            alert(res.data);
            
          }else alert(res.message);
    })
}


    $scope.getstatus= function(status){
// console.log(status)
    	if(status==1) return "Appointment Pending";
    	else if(status==2) return "Cancelled";
    	else if(status==3) return "Finished";
    	else if(status==4) return "Started";

    }

    $scope.addFreeBies=function(i){
          var c=$scope.datas[i]
            // console.log(c)
            if(c.amount){
                             $http.post("/role1/googleReviewFreebies",{amount:c.amount,phoneNumber:c.clientNumber,loyalityPoints:c.loyaltyPoints}).success(function(res){
                // console.log(res)
                $scope.datas[i].check=false;
                alert(res);
                   $scope.searchCustomer();
          })
     }
            else{
                        alert("Please Enter amount first");
            }
         
    }

  $scope.verifyCorporate=function(i){
          var c=$scope.datas[i];
            // console.log(c)
          if(c.corporateEmail){
                             $http.post("role1/makeCorporateUser",{phoneNumber:c.clientNumber,corporateEmailId:c.corporateEmail}).success(function(res){
                
                    $scope.datas[i].check2=false;
                    // console.log(res)
                       alert(res);
                    $scope.searchCustomer();
          })
          }
          else{
                      alert("please Enter first Corporate Email");
          }
         
  }
  
  $scope.subscriptionHis=function(){
    $scope.flag1=true;
    // console.log($scope.flag1)
    
    
  }
  
  
  
  
  
  
  
})