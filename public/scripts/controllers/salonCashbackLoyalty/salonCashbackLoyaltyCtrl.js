angular.module('sbAdminApp', ["ngJsonExportExcel",
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3'
]).controller("salonCashbackLoyaltyCtrl",function($scope,$http){

        $scope.totalItems=0;
        $scope.currentPage=1;
     $scope.itemsPerPage = 15;
     $scope.parlors=[];
      $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];

    $scope.data={
                        periods:[],
                        copiedPeriods:[]
    }
    $scope.loyaltyCashback=[];
$scope.sendsData={period:[]};

$http.post('/role1/allParlors').success(function(response){
          $scope.parlors = response.data;
        // console.log($scope.parlors);
})


$http.get("/role1/periods").success(function(response){

    response.data.forEach(function(d){
                $scope.data.periods.push(d);
    })


})

  $scope.onselectAll=function(){
      $scope.data.copiedPeriods=[];
    $scope.data.periods.forEach(function(e){
        $scope.data.copiedPeriods.push(e);
    })
      $scope.itemsSelected();
  }

  $scope.selectNone=function(){
      $scope.data.copiedPeriods=[];

      $scope.itemsSelected();
  }


    $scope.itemsSelected=function(){

        $scope.sendsData.period=[];
            // console.log($scope.selectedParlor)

        if($scope.selectedParlor.length>0)
        {
            $scope.sendsData.parlorIds=[];
            $scope.selectedParlor.forEach(function(data){
                $scope.sendsData.parlorIds.push(data.parlorId);
            });
        }

        for(i=0;i<$scope.data.copiedPeriods.length;i++){
            $scope.sendsData.period.push($scope.data.copiedPeriods[i].value);
        }

        $http.post("/role1/salonCashbackFreebies",$scope.sendsData).success(function(response){
            $scope.loyaltyCashback=[];
            // console.log(response.data);
           response.data.forEach(function(e){
                    $scope.loyaltyCashback.push(e);
           })
            $scope.totalItems=$scope.loyaltyCashback.length;

        })
    }



})
