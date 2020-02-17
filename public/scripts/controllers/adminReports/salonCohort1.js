'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker'])
.controller('salonCohort1', function($scope,$http,$timeout,Excel) {

  var table = $('#example').DataTable( {
        scrollY:        "300px",
        scrollX:        true,
        scrollCollapse: true,
        paging:         false,
        fixedColumns:   {
            leftColumns: 1
        }
    } );

});
