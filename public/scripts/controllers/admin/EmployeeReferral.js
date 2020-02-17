angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','vsGoogleAutocomplete'])
    .controller('EmployeeReferral', function($scope, $http, $stateParams, $window,NgTableParams,Excel, $timeout) {
        // $scope.department=['Beautician','Makeup Artist','Admin','Pedicurist']







        $scope.empReferralContact={
            address:$scope.address,
            distance:$scope.distance,
            area:$scope.area,
            city:$scope.city,
            salaryMin:$scope.salaryMin,
            salaryMax:$scope.salaryMax,
            experience:$scope.experience,
            department:$scope.department,
            long:$scope.long,
            lat:$scope.lat,
            _id:$scope._id
        }
        $scope.options = {
            componentRestrictions: { country: 'IN' }
            }
         $scope.options1 = {
            types: ['(cities)'],
            componentRestrictions: { country: 'IN' }
            }
        // console.log($scope.empReferralContact)
        $scope.empReferralContact={}
       // console.log("send data",$scope.empReferralContact)
        $scope.getData=[];
        $http.get("/role1/employeeReferral").then(function (res) {
            // console.log("result",res);
            $scope.getData=res.data;
            // console.log("hello",$scope.getData)
//            if($scope.getData.address!=0 || $scope.getData.distance!=0 || $scope.getData.department!=0 || $scope.getData.city!=0 || $scope.getData.experience!=0 || $scope.getData.salaryMin!=0 || $scope.getData.salaryMax!=0){
//                 d.visible=true
//                console.log("hello")
//            }else{
//                $scope.visible=false 
//                console.log('hi')
//            }
            
            // console.log($scope.getData);
            $scope.getData.forEach(function(element){
                
            if(element.address=='' && element.city=='' && element.department=='' && element.experience==''){
                element.visible=false;
            }  
                
                else{
                    element.visible=true;
                }
             
            })
            
            // console.log($scope.getData);


       $scope.fixedHeaderMethod()
              
            
       
          
        })
        $scope.visible=false
        $scope.Sendsave=function(d){
            
            if(d.address!='' && d.city!='' && d.department!='' && d.experience!=''){
                 $scope.empReferralContact=d;
            d.visible=true;
            //      console.log(d.address);
            // console.log($scope.empReferralContact);
            $http.post("/role1/employeeReferral",$scope.empReferralContact).then(function (res) {
               
                // console.log("hi",res)
                
               
            })
            $scope.visible=true
                
            }
            
            else{
                alert("Please Fill the fields properly");
            }
           
            // console.log($scope.empReferralContact)
            
        }
        $scope.edit=function(d){
        
            d.visible=false
            $scope.submitcheck=true
        }

 $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable({fixedColumn: true});
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length-1)/2
                    for(var i=1;i<=mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                            console.log(i+" "+(i+mid));
                        }
                }
             );
        } 

 
    


  

})