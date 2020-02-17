app.controller('salonServices',['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q','$timeout',
  function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q,$timeout) {

    $scope.gend='F';
    $scope.tabNames=[];
    // $scope.departmentClicked=false;
    $scope.tabLabel="";
    $scope.loader=true;
    $scope.selectedDepartmentIndex=0;
    $scope.departmentFemale=[
      {
        "name":"Hair",
        "image":"/images/hairFemaleUnselected.png",
        "imageSelected":"/images/hairFemaleSelected.png"
      },
      {
        "name":"Beauty",
        "image":"/images/beautyFemaleUnselected.png",
        "imageSelected":"/images/beautyFemaleSelected.png"
      },
      {
        "name":"Hand and Feet",
        "image":"/images/handNFeetFemaleUnselected.png",
        "imageSelected":"/images/handNFeetFemaleSelected.png"
      },
      {
        "name":"Makeup",
        "image":"/images/makeupUnselected.png",
        "imageSelected":"/images/makeupSelected.png"
      },
      {
        "name":"Spa",
        "image":"/images/spaUnselected.png",
        "imageSelected":"/images/spaSelected.png"
      }
    ]

    $scope.departmentMale=[
      {
        "name":"Hair",
        "image":"/images/hairMaleUnselected.png",
        "imageSelected":"/images/hairMaleSelected.png"
      },
      {
        "name":"Beauty",
        "image":"/images/beautyMaleUnselected.png",
        "imageSelected":"/images/beautyMaleSelected.png"
      },
      {
        "name":"Hand and Feet",
        "image":"/images/handNFeetMaleUnselected.png",
        "imageSelected":"/images/handNFeetMaleSelected.png"
      },
      {
        "name":"Spa",
        "image":"/images/spaUnselected.png",
        "imageSelected":"/images/spaSelected.png"
      }
    ]

    $http.get("api/dealsDepartment").success(function(response) {
      console.log(response);
      $scope.deptData=response.data.deals;

      if($scope.gend=='F'){
        $scope.deptDataGenderWise=response.data.deals[0];
      }
      if($scope.gend=='M'){
        $scope.deptDataGenderWise=response.data.deals[1];
      }
      console.log($scope.deptData);
    })
    $http.get("api/dealsDepartmentWise?departmentId=58707ed90901cc46c44af26f"+"&gender="+$scope.gend).success(function(response){
      $scope.loader=false;
      $scope.descriptionData=response.data.categories
      console.log("response hair",response);
      console.log("dealsDepartmentWise api",$scope.descriptionData);
      $scope.selectedTab=0;
      if ($scope.descriptionData!=undefined) {
        var pos = $scope.selectedTab;
        console.log(pos);
        $scope.tabCategories=$scope.deptDataGenderWise.departments[pos].categories;
        console.log($scope.tabCategories);
        $scope.tabInfo=$scope.descriptionData[pos].deals;
        console.log("$scope.tabInfo",$scope.tabInfo);
      }
    })

        $scope.genderFilter=function(){
          $scope.selectedTab=0;
          $scope.tabNames=[];
          $scope.tabInfo=[];
          $scope.loader=true;
          $scope.selectedDepartmentIndex=0;

          var pos=$scope.selectedTab;
          if($scope.gend=='F'){
            $scope.deptDataGenderWise=$scope.deptData[0];
            $http.get("api/dealsDepartmentWise?departmentId=58707ed90901cc46c44af26f"+"&gender="+$scope.gend).success(function(response){
              $scope.loader=false;
              $scope.descriptionData=response.data.categories
              console.log("dealsDepartmentWise api",$scope.descriptionData);
              console.log(pos);
              $scope.tabCategories=$scope.deptDataGenderWise.departments[pos].categories;
              $scope.tabInfo=$scope.descriptionData[pos].deals;
              console.log("$scope.tabInfo",$scope.tabInfo);

            })

          }
          if($scope.gend=='M'){
            $scope.deptDataGenderWise=$scope.deptData[1];
            $http.get("api/dealsDepartmentWise?departmentId=58707ed90901cc46c44af26f"+"&gender="+$scope.gend).success(function(response){
              $scope.loader=false;
              $scope.descriptionData=response.data.categories
              console.log("dealsDepartmentWise api",$scope.descriptionData);
              if ($scope.descriptionData!=undefined) {
                var pos = $scope.selectedTab;
                console.log(pos);
                $scope.tabCategories=$scope.deptDataGenderWise.departments[pos].categories;
                $scope.tabInfo=$scope.descriptionData[pos].deals;
                console.log("$scope.tabInfo",$scope.tabInfo);
              }
            })
          }

          console.log($scope.deptDataGenderWise);

        }

    $scope.departmentSelection=function(index) {
        $scope.loader=false;
        $scope.selectedDepartmentIndex=index;
        $scope.tabNames=[];
        $scope.descriptionData=undefined;
        $scope.tabInfo=[];
        if($scope.gend=='F'){
          $scope.selectedDepartment=$scope.departmentFemale[index];
        }
        if($scope.gend=='M'){
          $scope.selectedDepartment=$scope.departmentMale[index];
        }
        console.log('$scope.deptDataGenderWise',$scope.deptDataGenderWise);
        $scope.tabCategories=$scope.deptDataGenderWise.departments[index].categories;
        console.log($scope.tabCategories);
        console.log("$scope.deptDataGenderWise.departments[index]",$scope.deptDataGenderWise.departments[index]);
        $http.get("api/dealsDepartmentWise?departmentId="+$scope.deptDataGenderWise.departments[index].departmentId+"&gender="+$scope.gend).success(function(response){
          $scope.loader=false;
          $scope.descriptionData=response.data.categories
          console.log("dealsDepartmentWise api",$scope.descriptionData);
        })

    }
    $scope.tabclicked=function(label,index){
      $scope.selectedTab=index;
        if($scope.descriptionData==undefined){
          $scope.loader=true;
        }
        if ($scope.descriptionData!=undefined) {
          var pos = $scope.descriptionData.map(function(e) { return e.name; }).indexOf(label);
          console.log(pos);
          $scope.tabInfo=$scope.descriptionData[pos].deals;
        }
    console.log("  $scope.tabInfo",  $scope.tabInfo);
    }

}]);
