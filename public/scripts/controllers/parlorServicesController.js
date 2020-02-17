
angular.module('sbAdminApp',['ui.bootstrap'])
  .controller('ParlorServicesCtrl', function($scope, $position, $http, $stateParams,$timeout,$filter) {


 $scope.services = [];

    function init(){
      initVariables();
      if(role == 2){
          $http.post("/role2/serviceList", {categoryId : $stateParams.categoryId}).success(function(response, status){
              response.data.forEach(function(s){
                populateEmployees(s.prices);
              });
              $scope.services = response.data;
          });
      }else{
          console.log("role 3");
      }
    }


    function populateEmployees(prices){
      prices.forEach(function(price){
        employees.forEach(function(e){
          var found = false;
          price.employees.forEach(function(emp){
              if(emp.userId == e.userId){
                  found = true;
                  emp.isSelected = true;
              }

          });
          if(!found)price.employees.push(getEmpObj(e));
        });
      });
    }

    function getEmpObj(e){
        return {
            userId : e.userId,
            name : e.name + " - " + e.category,
            isSelected : false,
            commission : 0,
            isSpecialist : true,
        };
    };

    function initVariables(){
        $scope.categoryName = $stateParams.categoryName;
        $scope.data = {};
        $scope.role = role;
        $scope.service = {};
        $scope.data.categoryId = $stateParams.categoryId;
        if(role!=1){
            $http.post("/role3/services").success(function(response, status){
                services = response.data;
            });
        }
    }

    init();


    $scope.openUpdateServiceModal = function(service, index){
        $scope.service = angular.copy(service);
        $scope.index = index;
        $scope.data.delete = false;
        $scope.data.serviceId = service.serviceId;
        $("#updateServiceModal").modal('show');
    };

    $scope.update = function(){
        postData();
    };

    $scope.remove = function(){
        $scope.data.delete = true;
        postData();
    };


    function postData(){
        $scope.data.prices = [];
        $scope.service.prices.forEach(function(p){
            if(p.price && p.estimatedTime){
                var newP = {priceId : p.priceId, price : p.price, estimatedTime : p.estimatedTime, employees : []};
                p.employees.forEach(function(emp){
                    if(emp.isSelected){
                        newP.employees.push({userId : emp.userId});
                    }
                });
                $scope.data.prices.push(newP);
            }
        });
         $http.post("/role2/updateService", $scope.data).success(function(response, status){
             if(!response.error) {
                 populateEmployees(response.data.prices);
                 $scope.services[$scope.index] =  response.data ;
                 initVariables();
               $('#updateServiceModal').modal('hide');
             }
         });
    }

    $scope.cancel = function(){
        $scope.service = {};
        $scope.data = {};
    };

  });
