'use strict';

angular.module('sbAdminApp')
  .factory('employeeHomeService',['$q','$http','$log',function($q,$http,$log) {
	  
      return{

            getData: function(period){
                $log.debug("inside service");
                var deferred = $q.defer();
                $http.post("/role2/employeeHomeDetail",{"period":period}).then(_success,_error);

                function _success(data){
                    $log.debug(data);
                    deferred.resolve();
                }
                function _error(err){
                    deferred.reject(err);
                }
                return deferred.promise;
            }

      };
    

  }]);
