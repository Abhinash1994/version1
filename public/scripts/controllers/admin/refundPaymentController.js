'use strict'

angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])
    .controller('refundPaymentCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$rootScope) {
        // console.log('inside refund payment controller ');

        $scope.cancelledAppointments='';
        function cancelledAppointments() {
            $http.post("/role1/onlinePaymentCancelledAppointment").success(function(response, status){
                // console.log(response);
                $scope.cancelledAppointments=response.data;
            });
        }
        
        cancelledAppointments();
       /* $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }*/
        var appointmentId='';
        $scope.confirmObject='';
        $scope.showRefundPopUp=function(appointmentObject){
            $scope.confirmObject=appointmentObject;
            $('#refundPaymentPopUp').modal('show');
            appointmentId=appointmentObject.appointmentId;
             // console.log(appointmentId);
        }

        $scope.conirmRefundPayment=function(){
            console.log(appointmentId);
            $http.post("/role1/refundPayment",{'appointmentId':appointmentId}).success(function(response, status){
                // console.log(response);
                $('#refundPaymentPopUp').modal('hide');
                cancelledAppointments();
            });
            
        }
    });