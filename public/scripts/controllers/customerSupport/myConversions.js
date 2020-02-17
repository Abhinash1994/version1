angular.module('sbAdminApp',[ 'ngAnimate', 'ngSanitize','ui.bootstrap'])
    .controller('myConversions', function ($scope, $compile, $http, $timeout) {
        $scope.userId=userId;
        $scope.newLeadsConverted=0
        $scope.selfLeadsConverted=0
        $scope.customerCareUserType=customerCareUserType;
        $scope.months=[
            {id:0,value:'January'},
            {id:1,value:'February'},
            {id:2,value:'March'},
            {id:3,value:'April'},
            {id:4,value:'May'},
            {id:5,value:'June'},
            {id:6,value:'July'},
            {id:7,value:'August'},
            {id:8,value:'September'},
            {id:9,value:'October'},
            {id:10,value:'November'},
            {id:10,value:'December'},
            ];

            $scope.search=function(){
                var obj={'userId':$scope.userId,'phoneNumber':$scope.phonenumbersearch}
                console.log("searchdata",obj)
               
                 $http.post("/role1/facebookQueryByPhoneNumber",obj).success(function(response, status){
                        $scope.searchdata=response;
                        console.log("searc",$scope.searchdata)
                 })
            }


        $scope.submit=function(month){
            $scope.newLeadsConverted=0
            $scope.selfLeadsConverted=0
            $scope.selfLeads=0
            $scope.newLeads=0
            console.log("month",month)
            $http.post("/role1/customerCareResultByMonth",{month:month, year:2019, customerCareId:$scope.userId }).success(function(response, status){
                $scope.data=response.converted;
                console.log("data",response)
                response.count.forEach(function(element) {
                    if(element.source=="self" || element.source=="appointment taken"){
                        $scope.selfLeads+=element.count
                    }
                    if(element.source=="app download"){
                        $scope.newLeads+=element.count
                    }
                }, this);
                $scope.days=[];
                var date=''
                if($scope.customerCareUserType=='2'){
                    $scope.data.forEach(function(conversion) {
                       date= conversion.subscriptionSoldTime.split('T')[0];
                       if($scope.days.indexOf(date)<0){
                        $scope.days.push(date)
                       }
                       if(conversion.source== "app download")$scope.newLeadsConverted++
                       else if(conversion.source=="self" || conversion.source=="appointment taken") $scope.selfLeadsConverted++
                    }, this);
                    var date1='';
                    console.log("days array",$scope.days)
                    $scope.finalArray=[];
                    var singleDay={};
                        $scope.days.forEach(function(day) {
                            singleDay={date:day,data:[]};
                            $scope.data.forEach(function(conversion) {
                            date1= conversion.subscriptionSoldTime.split('T')[0];
                            if(day==date1){
                                singleDay.data.push(conversion)
                            }
                        }, this);
                        $scope.finalArray.push(singleDay)
                     }, this);
                     console.log("final array",$scope.finalArray)
                }
                else if($scope.customerCareUserType=='3'){
                    $scope.data.forEach(function(conversion) {
                       date= conversion.appointmentDate.split('T')[0];
                       if($scope.days.indexOf(date)<0){
                        $scope.days.push(date)
                       }
                       if(conversion.source== "facebook")$scope.newLeadsConverted++
                       else if(conversion.source=="self"  || conversion.source=="appointment taken") $scope.selfLeadsConverted++
                    }, this);
                    var date1='';
                    console.log("days array",$scope.days)
                    $scope.finalArray=[];
                    var singleDay={};
                        $scope.days.forEach(function(day) {
                            singleDay={date:day,data:[]};
                            $scope.data.forEach(function(conversion) {
                            date1= conversion.appointmentDate.split('T')[0];
                            if(day==date1){
                                singleDay.data.push(conversion)
                            }
                        }, this);
                        $scope.finalArray.push(singleDay)
                     }, this);
                     console.log("final array",$scope.finalArray)
                }
               
          
            });
        }    
        
    


    });

