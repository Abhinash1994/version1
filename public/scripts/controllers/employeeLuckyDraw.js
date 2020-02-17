'use strict';

angular.module('sbAdminApp', ['isteven-multi-select', 'ui.bootstrap', 'daterangepicker', 'ngSanitize', 'ngTable', 'ngCsv'])
  .controller('employeeLuckyDraw', function ($scope, $http, Excel, $timeout, NgTableParams, $stateParams, $window, $rootScope) {

    $scope.mytime = new Date();
    $http.get("/role1/periods").success(function (response, status) {
      $scope.periods = response.data;
      console.log($scope.periods);
      $scope.selectedPeriod = $scope.periods.length;
      console.log($scope.selectedPeriod);
      $scope.periodChanged($scope.selectedPeriod);
    });

    $scope.periodChanged = function (period) {

        var data=[];
      console.log(period);
      console.log("$scope.selectedPeriod" + period);
     $http.post("/employee/getLuckyDrawForAdminv2", {
        startDate: period.startDate,
        endDate: period.endDate
      }).success(function (response) {
        console.log(response);
        response.forEach(function(element) {
          if(element.accountNo!= "N/A" && element.ifscCode != "N/A" && element.ifsc.type!= "Buffer" ){
            element.accountNo="' "+element.accountNo+" '";
            if(element.ifsc.BRANCH){
               element.ifsc.BRANCH=element.ifsc.BRANCH.replace(/[&-\/\\#,+()$~%.'":*?<>{}]/g, '');
               element.ifsc.BANK=element.ifsc.BANK.replace(/[&-\/\\#,+()$~%.'":*?<>{}]/g, '');

            }
        
          data.push({  "Date":element.date, "Salon Name":element.parlorName, "Employee Name":element.employeeName,"Draw Amount":element.amount,"IFSC Code":element.ifscCode,"Account Number":element.accountNo,"Status":"Claimed","Bank Name":element.ifsc.BANK,"Bank Branch":element.ifsc.BRANCH}); 
          }
        })
        $scope.finalData=data;
        alert("Data Loaded Successfully")
        }, this);
      
    };
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.parlorSelected = '';
    $scope.dateSelected = '';
    $scope.dateSelected = $scope.mytime;
    $scope.redBG = {
      "background-color": "#D64541"
    };
    $scope.greenBG = {
      "background-color": "#16a085"
    };
    $scope.toggleMin = function () {
      $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.popup2 = {
      opened: false
    };
    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };
    $http.get("/employee/activeParlorList").success(function (response) {
      console.log("Parlor List", response);
      $scope.parlorList = response.data;

    });
    $scope.sendSMS=function(period){
      console.log("period enddate",period.endDate);

      $http.post("/role1/sendLuckDrawSms", {
        endDate: period.endDate
      }).success(function (response) {
        console.log(response);  
      });

    }



    $scope.selectParlor = function () {

      console.log("date selected", $scope.dateSelected);
      // console.log("parlor selected",$scope.parlorSelected);parlorId:$scope.parlorSelected._id,
      $http.post("/employee/getLuckyDrawForAdmin", {
        date: $scope.dateSelected
      }).success(function (response) {


        $scope.tableData = response;

        console.log(response);
        $scope.tableParams = new NgTableParams({
          count: 50
        }, {
          dataset: $scope.tableData
        });
        // console.log("selected parlor",$scope.parlorSelected);
        console.log($scope.tableParams)
      });
    }

    $scope.selectParlor();

    $scope.exportToExcel = function (tableId) {


      var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
      $timeout(function () {
        location.href = exportHref;
      }, 100); // trigger download


    }


    $scope.paidOrUnpaid = function (a, paid) {
      $http.post('/role1/drawPaid', {
        id: a._id,
        paid: paid
      }).success(function (res) {
        console.log(a);
        console.log(res)

        $scope.selectParlor()


      })
    }

  });