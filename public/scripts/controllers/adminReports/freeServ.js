angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize'])
    .controller('freeServCtrl', function($scope, $http, Excel, $timeout) {

    
        $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/allParlors").success(function(response, status){
    $scope.parlors = response.data;
        // console.log($scope.parlors);
    });
    $scope.changeParlor=function(){
    $scope.parlorIdsToBeSent=[];
        for(var i=0;i<$scope.selectedParlor.length;i++){
            $scope.parlorIdsToBeSent.push($scope.selectedParlor[i].parlorId);
            }
          
            }
    
    var today=new Date();
    
    $scope.dateRangeSelected = {startDate: moment().startOf('month'), endDate: moment()};

            // console.log( $scope.dateRangeSelected);
    
     $http.post("/role1/freeServiceReport",{"startDate":$scope.dateRangeSelected.startDate._d,"endDate":$scope.dateRangeSelected.endDate._d}).success(function(response){
    $scope.datas = response;
        // console.log(response);
           $scope.fixedHeaderMethod();
    });
    
     $scope.applyFilter=function(){
            // console.log("Change function called");
            // console.log($scope.parlorIdsToBeSent);
            // console.log($scope.dateRangeSelected.startDate._d);
            // console.log($scope.dateRangeSelected.endDate._d);
            $('#tableToExport').fixedHeaderTable("destroy");
            $http({
                    method: 'POST',
                    url: '/role1/freeServiceReport',
                    data:{
                        'parlorIds':   $scope.parlorIdsToBeSent,
                        'startDate':   $scope.dateRangeSelected.startDate._d,
                        'endDate':  $scope.dateRangeSelected.endDate._d
                    }   
                    }).success(function(response){
                        $scope.datas = response;
                        // console.log(response);
                          $scope.fixedHeaderMethod();
                    }); 
      
     }
     
        $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#tableToExport').fixedHeaderTable();
                    var myTable = document.getElementById('firstRowFirstCell');
                    // console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                    document.getElementById('firstRowFirstCell').style.height=document.getElementById('firstRowSecondCell').offsetHeight+'px';
                    // console.log(document.getElementsByClassName("fht-cell"));
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
});