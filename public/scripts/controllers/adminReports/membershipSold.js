angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('membershipSoldCtrl', function($scope, $compile, $http, $timeout, $window,$rootScope, $log,NgTableParams,Excel, $timeout) {
    $scope.showMe=true;
    $scope.role=role;
    // console.log("membershipSold");
    $scope.myObj ='';
        $scope.selectedParlor=[];
        $scope.parlor={};
        $scope.parlorTax = $rootScope.parlorTax
    $scope.parlorIdsToBeSent=[];
        if($scope.role!=1)
        {
            // console.log(parlorId)
            $scope.parlorIdsToBeSent.push(parlorId);
        }  
    
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
   

        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;
        $scope.changeParlorId = function(pId){
        $scope.selectedParlorId = pId;
         $scope.parlorIdsToBeSent = [pId];
      };

   
    $scope.changeParlor=function(){

             $scope.parlorIdsToBeSent=[];
        for(var i=0;i<$scope.parlor.selectedParlor.length;i++){
            $scope.parlorIdsToBeSent.push($scope.parlor.selectedParlor[i].parlorId);
            }
    }

            // console.log($scope.parlorIdsToBeSent)
    
    var today=new Date();
    
    $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

     $http.post("/role3/report/membershipSold",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d,parlorIds:  $scope.parlorIdsToBeSent})
     .success(function(response, status){
          console.log(response);
         $scope.datas = response;
            var a={credits:0};
                       
                                    // console.log($scope.total)
                 
          $scope.total=$scope.datas.reduce(function(sum,val){
                                    sum.credits+=val.credits;
                                    return sum;
                        },a)
       
    });
    

     $scope.applyFilter=function(){
            // console.log("Change function called");
            
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.parlor.selectedParlor);
        //     $scope.parlorIdsToBeSent=[];
        // for(var i=0;i<$scope.parlor.selectedParlor.length;i++){
        //     $scope.parlorIdsToBeSent.push($scope.parlor.selectedParlor[i].parlorId);
        //     }

             // console.log($scope.parlorIdsToBeSent)
        
            
                $scope.datas=[];
          $http({
                    method: 'POST',
                    url: '/role3/report/membershipSold',
                    data:{
                        'parlorIds':   $scope.parlorIdsToBeSent,
                        'startDate':   $scope.dateRangeSelected.startDate._d,
                        'endDate':  $scope.dateRangeSelected.endDate._d
                    }   
                    }).success(function(response){
                         console.log(response);

                        $scope.datas = response;
                          var a={credits:0};
                       
                                   
                                       $scope.total=$scope.datas.reduce(function(sum,val){
                                    sum.credits+=val.credits;
                                    return sum;
                        },a)
                                        // console.log($scope.total)
                    }); 
       
                     
      
     }
        $scope.changeSortType=function(valuePassedForSorting){
            if($scope.sortType!=valuePassedForSorting){
                $scope.sortType=valuePassedForSorting;
                $scope.sortFlag=true;
            }else{
                $scope.sortType='-'+valuePassedForSorting;
            }
        }
        
       $scope.printMembership=function(data){

        var printData = "<div style='text-align: center'><br><b>Membership Invoice</b></div><hr><br>";
        printData += `<table border="1" style='width: 100%; border-collapse: collapse'>
<tr>
<b>Membership Name:</b> ` + data.membershipName + `

</tr>
<tr>
<td><b>Membership Price:</b> ` +  Math.round(data.price * (1+($scope.parlorTax/100))) + `</td>
<td><b>Valid For(Months): </b>` + data.expiryDate + " Months"+ `</td>
</tr>
</table><br>`;
        printData += "<h4><b>Client Details:</b></h4>";
        printData += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center'>";
        printData += `<tr>
<th>Name</th>
<th>Phone No.</th>
</tr>`;
        printData += "<tr>";
        printData += `<td>` + data.clientName + `</td>
<td>` + data.clientNo + `</td>`;
        printData += "</tr></table><br>";
        printData += "<h4><b>Billing Details:</b></h4>";
        printData += "<table border='1' style='width: 100%; border-collapse: collapse;'>";
        printData += `<tr><td> Membership Price: </td><td> Rs.` + data.price + `</td></tr>
<tr><td> (+) GST: </td><td>Rs.` + Math.round(data.price * ($scope.parlorTax/100)) + `</td></tr>
<tr><td> Payable Amount: </td><td>Rs.` + Math.round(data.price * (1+($scope.parlorTax/100))) + `</td></tr>
</table>`;

        var w = window.open();
        w.document.write(printData);
        w.print();
        w.close();
       } 
       
$scope.openModal=function(mem){
            // console.log(mem)
            if(mem.appointmentData.length>0){
                $("#myModal").modal("show"); 
                $scope.temp=angular.copy(mem.appointmentData);
            }
            else{
                alert("No appointment Data")
            }
}

})