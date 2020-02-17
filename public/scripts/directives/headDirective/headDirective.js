/**
 * Created by Manisha on 7/21/2017.
 */
angular.module('sbAdminApp')
    .directive('headDirective',function(){
        return {
            templateUrl:'scripts/directives/headDirective/head_directive.html',
            scope: {
                data : '=',
                output:'=',
                date:'='
            },
            restrict: 'E',
            replace: true,
        }
    });