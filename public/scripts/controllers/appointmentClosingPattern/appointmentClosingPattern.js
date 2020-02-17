angular.module('sbAdminApp', [
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3','ngTable'
]).controller("appointmentClosingPatternCtrl",function($scope,$http,NgTableParams){

  $scope.parlorIdsToBeSent=[]
  $scope.parlorAppointment=[]

 var today = new Date();
     $scope.dates={}
    $scope.dates.date = {
        startDate: {
            '_d': new Date(today.getFullYear(), today.getMonth(), 1)
        },
        endDate: {
            '_d': new Date()
        }
    };

     $scope.popup1 = {
        opened: false
    };

   
    $scope.open1 = function() {
      // console.log($scope.dts)
        $scope.popup1.opened = true;
    };
     $scope.dates.date = {
            startDate: {
                '_d': new Date(today.getFullYear(), today.getMonth(), 1)
            },
            endDate: {
                '_d': new Date()
            },
        };


    var today = new Date();
    $scope.dts = new Date(today.getFullYear(),today.getMonth(),1);
    // console.log($scope.dts);



  $http.get("/graphs/getParlorList").success(function(data){
        // console.log(data);
        data.forEach(function(element){
            $scope.multisalonsObject.multisalons.push(element);
        })
    })
		  
    $scope.multisalonsObject={
        multisalons:[],
        multi:[]
    }
    

    $scope.getData=function(){
$scope.parlorIdsToBeSent=[];


     if($scope.multisalonsObject.multi.length>0){
                $scope.multisalonsObject.multi.forEach(function(a)
        {
      
                      $scope.parlorIdsToBeSent.push(a.id);
       })
     }
 
      $scope.data={
                    parlorIds:$scope.parlorIdsToBeSent,
                   startDate:$scope.dates.date.startDate._d,
                   endDate:$scope.dates.date.endDate._d
      }

      // console.log($scope.data);

      $http.post('/role1/appointmentClosingPattern',$scope.data).success(function(res){
          $scope.parlorAppointment=[]
          // console.log(res)
          res.data.forEach(function(a){
                  $scope.parlorAppointment.push(a);

          })
                $scope.tableParams = new NgTableParams({}, { dataset:   $scope.parlorAppointment});

      })
  }



  $scope.getData()

			



})