'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('couponRedemption', function($scope,$http,$timeout,$state){
  $scope.disablestatus=true;
  $scope.hideTextarea=null;
    $scope.count=0;
    $scope.status={
      "0":"In Cart",
      "1":"Booked",
      "2":"Cancelled",
      "3":"Completed"
    }
    $scope.couponCode={
      "0":"APPBOOK10",
      "1":"APP10",
      "2":"OC",
      "3":"BULF",
      "4":"SPBU",
      "5":"IC",
      "6":"NY10"
    };
    $scope.selectedStatus='';
    $scope.oldSelected=true;
    $scope.newSelected=false;
    $scope.selectedNewCouponCode="";
    $scope.newCouponCount="0";
    $scope.disableNewStatus=true;
    $scope.selectedStatusNew='';
    if($scope.selectedStatus==''){
      $scope.disablestatus=true;
    }
    $http.get("/beuApp/loggedInCustomerCare").success(function(response) {
      $scope.customerCareId=response.data.userId;
      $scope.customerCareName=response.data.userName;
    });
    $scope.categoryButton=function(selectedCategory) {
      if(selectedCategory=="Old Coupons"){
        $scope.oldSelected=true;
        $scope.newSelected=false;
        $scope.filterData=[];
        $scope.disablestatus=true;
        $scope.selectedStatus='';
        $scope.count=0;

      }
      else {
        $scope.newSelected=true;
        $scope.oldSelected=false;
        $scope.filterDataNew=[];
        $scope.newCouponCount=0;
        $http.get("/role1/couponCodeList").success(function(response) {
          // console.log("new api",response);
          $scope.newCouponCode=response;

        })

      }
    }
    // console.log($scope.selectedStatus);
    $scope.statusChanged=function(selectedStatus) {
      $scope.filterData=$scope.couponData;
      $scope.selectedStatus=selectedStatus;
      // console.log(selectedStatus);
      // console.log($scope.couponData);
        $scope.statusFilter=$scope.couponData.filter(function(d) {
          var k = "0";
          for(var key in $scope.status){
            if($scope.status[key] == $scope.selectedStatus){
              k = key
            }
          }
          if(parseInt(k) == 1 || parseInt(k)== 4){
            return d.apptStatus == 1 || d.apptStatus == 4;
          }else{
            return d.apptStatus==parseInt(k);
          }
        })
        // console.log("statfil",$scope.statusFilter)
        $scope.filterData=$scope.statusFilter;
        $scope.count=$scope.filterData.length;
        // console.log($scope.couponData);
    }
    $scope.couponCodeSelected=function(selectedCode) {
      // console.log(selectedCode);
      // console.log($scope.selectedStatus);
      $http.post("/role1/getCouponClients",{code:selectedCode}).success(function(response) {
        // console.log(response);
        $scope.couponData=response;
        $scope.filterData=$scope.couponData;
        $scope.count=$scope.couponData.length;
        // console.log($scope.count);
        $scope.disablestatus=false;
        $scope.selectedStatus='';
        // console.log($scope.selectedStatus);
      });

    }
    $scope.edit=function(index) {
      $scope.hideTextarea=index;
      $scope.editRow=$scope.couponData[index];
      // console.log($scope.editRow);

    }

    $scope.save=function(index) {
      $scope.hideTextarea=null;
      // console.log($scope.editRow.agentResponse);
      var query={
        customerCareId : $scope.customerCareId,
        customerCareName : $scope.customerCareName,
        remark : $scope.editRow.agentResponse,
        clientPhoneNumber : $scope.editRow.phoneNumber,
        clientName : $scope.editRow.firstName
      }
      // console.log(query);
      $http.post('/beuApp/couponContact',query).success(function(res){
        // console.log(res);
        if(res.success==false){
                  $scope.editRow.agentResponse='';
                  alert("Server Error")
                }
        else {
          alert("Updated Successfully")
        }
      })

    }
    $scope.newCouponCodeSelected=function(selectedVal) {
      // console.log("selectedVals",selectedVal);
      $scope.newCouponCount=0;

      $http.post("/role1/newCoupons",{code:selectedVal}).success(function(res) {
        $scope.newCouponData=res;
        // console.log($scope.newCouponData);
        $scope.filterDataNew=$scope.newCouponData;
        $scope.newCouponCount=$scope.filterDataNew.length;
        $scope.disableNewStatus=false;
            // console.log("sorted",$scope.newCouponData);
      })
    }

    $scope.newCouponStatusChanged=function(selectedStatus) {
      $scope.filterDataNew=$scope.newCouponData;
      $scope.disablestatus=false;
      $scope.selectedStatus=selectedStatus;
      // console.log(selectedStatus);
        $scope.statusFilter=$scope.newCouponData.filter(function(d) {
          var k = "0";
          for(var key in $scope.status){
            if($scope.status[key] == $scope.selectedStatus){
              k = key
            }
          }
          if(parseInt(k) == 1 || parseInt(k)== 4){
            return d.status == 1 || d.sStatus == 4;
          }else{
            return d.status==parseInt(k);
          }
        })
        // console.log("statfil",$scope.statusFilter)
        $scope.filterDataNew=$scope.statusFilter;
        $scope.newCouponCount=$scope.filterDataNew.length;

    }
    $scope.editNew=function(index) {
      $scope.hideTextarea=index;
      $scope.editRow=$scope.filterDataNew[index];
      // console.log($scope.editRow);
    }

    $scope.saveNew=function(index) {
      $scope.hideTextarea=null;
      // console.log($scope.editRow.agentResponse);
      var query={
        customerCareId : $scope.customerCareId,
        customerCareName : $scope.customerCareName,
        remark : $scope.editRow.agentResponse,
        clientPhoneNumber : $scope.editRow.client.phoneNumber,
        clientName : $scope.editRow.client.name
      }
      // console.log(query);
      $http.post('/beuApp/couponContact',query).success(function(res){
        // console.log(res);
        if(res.success==false){
          $scope.editRow.agentResponse='';
          alert("Server Error")

        }
        else {
          alert("Updated Successfully")
        }
      })
    }
});
