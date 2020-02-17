'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['isteven-multi-select','ui.bootstrap'])
    .controller('teamMemberDetailCtrl', function($scope,$position, $http, $stateParams, $timeout,NgTableParams,$log,$filter) {
        // console.log("inside controller");
        $scope.toDate=new Date();
        $scope.fromDate=new Date( $scope.toDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        $scope.s = {};
        $scope.employeeWorkingHours=new Date('2017-02-20T07:00:00+00:00');//this is a benchmark for employees working hours
       /* $scope.employeeAttendanceArray=[
            {"date":'2017-02-19T11:35:56+00:00',"shifts":[{"from":'2017-02-04T09:35:56+00:00',"to":'2017-02-04T11:35:56+00:00'},{"from":'2017-02-04T13:35:56+00:00',"to":'2017-02-04T17:35:56+00:00'},{"from":'2017-02-04T19:35:56+00:00',"to":'2017-02-04T20:35:56+00:00'}]},
            {"date":'2017-02-20T11:35:56+00:00',"shifts":[{"from":'2017-02-10T07:35:56+00:00',"to":'2017-02-10T09:35:56+00:00'},{"from":'2017-02-10T11:35:56+00:00',"to":'2017-02-10T13:35:56+00:00'},{"from":'2017-02-10T14:35:56+00:00',"to":'2017-02-10T16:35:56+00:00'}]},
            {"date":'2017-02-04T11:35:56+00:00',"shifts":[{"from":'2017-02-04T09:35:56+00:00',"to":'2017-02-04T11:35:56+00:00'},{"from":'2017-02-04T13:35:56+00:00',"to":'2017-02-04T17:35:56+00:00'},{"from":'2017-02-04T19:35:56+00:00',"to":'2017-02-04T20:35:56+00:00'}]},
            {"date":'2017-02-05T11:35:56+00:00',"shifts":[{"from":'2017-02-20T10:13:00+00:00',"to":'2017-02-20T14:18:00+00:00'}]}
        ];*/
       function callApi(startDate,endDate,userId){
           // console.log(startDate.toJSON());
           // console.log(endDate.toJSON());
           // console.log(userId);
           $http({
               url: '/role1/report/empAttendance',
               method: 'POST',
               data:{startDate:startDate.toJSON(),endDate:endDate.toJSON(),eId:userId}
           }).then(function(response) {
               // console.log("worked");
               // console.log(response);
               $scope.employeeAttendanceArray=response.data;
               var maxShiftLength=0;
               for(var i=0;i<$scope.employeeAttendanceArray.length;i++){              //here firstly the dateFlag is created so that with the help of it
                   $scope.employeeAttendanceArray[i]['dateFlag']=false;              // it can be detected which date lies in the selected interval
                   var obj={};
                   if(maxShiftLength<$scope.employeeAttendanceArray[i].shifts.length){ //this loop is made to ge the max shift columns
                       maxShiftLength=$scope.employeeAttendanceArray[i].shifts.length;
                   }
                   for(var j=0;j<$scope.employeeAttendanceArray[i].shifts.length;j++) { //this loop is made to get the shift1 shift2 arrays from the main shift array
                       var shiftIndex = 1 + j;
                       $scope.employeeAttendanceArray[i]['shift' + shiftIndex] = $scope.employeeAttendanceArray[i].shifts[j]; //dynamic creation of the properties like shift1 etc
                   }
               }
               $scope.columns=[{title:'Date',field:'date',visible:true}]; //this is the most imp part of ng table with the help of which we can create the dynamic columns
               for(var i=1;i<=maxShiftLength;i++){                        // and these consists of fields subfields titles visible .These properties are used like MainArray[column.field] just like in ng repeat we use list.someProperty
                   var obj={                                             //so here dynamic shifts headers are created with the seen properties according to teh maxShift length or mx number of shifts columns required to be displayed
                       'title':'',
                       'field':'',
                       'visible':'',
                       'subfield1':'',
                       'subfield2':'',
                       'centerName':''
                   };
                   obj.title='Shift'+i;
                   obj.field='shift'+i;
                   obj.visible=true;
                   obj.subfield1='from';
                   obj.subfield2='to';
                   obj.subfield3='centerName';
                   $scope.columns.push(obj);
               }
               for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                   var employeeWorkingHoursStart = 8;                    //Thses are th housrs calculate  the hours they worked for inshort these are benchmark hours
                   var employeeWorkingHoursEnd = 0;
                   $scope.employeeAttendanceArray[i]['dateFlag']=false;
                   var obj={};
                   var employeeTotalHours=0;                           //FOR EVERY LOOP THE THE housr for which the employee worked will be calculated in minutes and hours and will be 0 in beg
                   var employeeTotalMinutes=0;
                   for(var j=0;j<$scope.employeeAttendanceArray[i].shifts.length;j++) { //this loop is their to assign the values for shift1 shift2 shift3 and so on dynamically
                       if($scope.employeeAttendanceArray[i].shifts[j].from!=''&&$scope.employeeAttendanceArray[i].shifts[j].to!=''){
                           var shiftIndex = 1 + j;
                           $scope.employeeAttendanceArray[i]['shift' + shiftIndex] = $scope.employeeAttendanceArray[i].shifts[j];
                           var from=new Date( $scope.employeeAttendanceArray[i].shifts[j].from);  // for each from and to time we get a variable is created employeeTotalHours
                           //console.log(from);
                           var to=new Date( $scope.employeeAttendanceArray[i].shifts[j].to);     // which calculates the sum of shift1 2 3 and so on for single shift array of a particular day
                           //console.log(to);
                           var startTime = moment(from.toLocaleTimeString(), 'hh:mm:ss a');      //  and so is the same for employeeTotalMinutes
                           var endTime = moment(to.toLocaleTimeString(), 'hh:mm:ss a');          //after all this $scope.employeeAttendanceArray[i]['workingHours'] variable is created which is shown in the TOTAL WORKING hours table heading
                           var totalHours = (endTime.diff(startTime, 'hours'));                  //   $scope.employeeAttendanceArray[i]['hoursDifference'] is calculated using benchmark hours
                           employeeTotalHours=Math.abs(employeeTotalHours+totalHours);                     //
                           var totalMinutes = endTime.diff(startTime, 'minutes');                //
                           var clearMinutes = totalMinutes % 60;
                           employeeTotalMinutes=Math.abs(employeeTotalMinutes+clearMinutes);
                       }

                   }
                   $scope.employeeAttendanceArray[i]['workingHours']=Math.abs(employeeTotalHours) + " hours and " + Math.abs(employeeTotalMinutes) + " minutes";
                  // console.log(employeeWorkingHoursStart*60+' '+((employeeTotalHours*60)+employeeTotalMinutes));
                   var differenceOfThem=employeeWorkingHoursStart*60-((employeeTotalHours*60)+employeeTotalMinutes);
                   //console.log(differenceOfThem);
                   var hours=Math.abs(parseInt(differenceOfThem/60));
                   var minutes=Math.abs(parseInt(differenceOfThem%60));
                   $scope.employeeAttendanceArray[i]['hoursDifference']= hours+"hours and "+minutes+" minutes";
                   if(differenceOfThem>0){
                       $scope.employeeAttendanceArray[i]['rowColor']='#d2232a';   //red
                   }else if(differenceOfThem<0){
                       $scope.employeeAttendanceArray[i]['rowColor']='#148F76';   //green
                   }else if(differenceOfThem==0){
                       $scope.employeeAttendanceArray[i]['rowColor']=' #ffcc33 '; //yellow
                   }                                                             //here color assigning is done :if work > benchmark then green else red and if equal then yello
               }
               for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                   delete $scope.employeeAttendanceArray[i].shifts;
               }
              // console.log( $scope.columns);
              // console.log( $scope.employeeAttendanceArray);
               var data = $scope.employeeAttendanceArray;
               $scope.tableParams1 = new NgTableParams({
                   page: 1,            // show first page
                   count: 10,          // count per page
                   filter: {
                       name: 'M'       // initial filter
                   }
               }, {
                   total: data.length, // length of data
                   getData: function(params) {
                       // use build-in angular filter
                       var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                       return orderedData;
                   }
               });
           });
       }

        callApi($scope.toDate,$scope.toDate,$stateParams.userId);
        /*===============Employee Attendance Table work =====================+++++++++++++=========================================*/


        $scope.updateFromTime=function(){
            this.a = moment(new Date($scope.fromDate));
            this.b = moment(new Date($scope.toDate));
            this.months = this.a.diff(this.b, 'months');
            if(Math.abs(this.months)<=2){               //this is done to calculate the the max  interval of 2 months
                callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
                /*console.log(  $scope.employeeAttendanceArray)
                for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                    if(moment($scope.employeeAttendanceArray[i].date).isBetween($scope.fromDate, $scope.toDate)){
                        $scope.employeeAttendanceArray[i].dateFlag=true;  // thus the record of those days will be shown
                                                                          //Maths.abs is domne to remove the negative sign or take the absolute value
                    }else{
                        $scope.employeeAttendanceArray[i].dateFlag=false;
                    }
                }*/
            }else if(Math.abs(this.months)>2){
                alert("You cannot select the interval for more than two months");
                $scope.fromDate='';
            }


        }
        $scope.updateFromTime();
        $scope.updateToTime=function(){
            this.a = moment(new Date($scope.fromDate));
            this.b = moment(new Date($scope.toDate));
            this.months = this.a.diff(this.b, 'months');
            if(Math.abs(this.months)<=2){
                callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
                /*for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                    if(moment($scope.employeeAttendanceArray[i].date).isBetween($scope.fromDate, $scope.toDate)){
                        $scope.employeeAttendanceArray[i].dateFlag=true;
                    }else{
                        $scope.employeeAttendanceArray[i].dateFlag=false;
                    }
                }*/
            }else if(Math.abs(this.months)>2){
                alert("You cannot select the interval for more than two months");
                $scope.toDate='';
            }

            //alert(moment('2017-02-19T11:35:56+00:00').isBetween($scope.fromDate, $scope.toDate))
        }
        /*===============Employee Attendance Table work =====================+++++++++++++=========================================*/

        /*==========================Date Selection==========+++++++========================*/
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.popup1 = {
            open1: false
        };
        $scope.popup2 = {
            open2: false
        };
        $scope.open1 = function() {
            $scope.popup1.open1 = true;
            // console.log("button pressed");
        };
        $scope.open2 = function() {
            $scope.popup2.open2 = true;
            // console.log("button pressed");
        };
        /*==========================Date Selection==========---------========================*/
        function getEmployee(){
            $http.get("/role2/employeeDetail?userId="+$stateParams.userId).success(function(response, status){
                $scope.newUser = {};
                $scope.employeeData = response.data.employee;
                $scope.s.hair = $scope.employeeData.hairPost;
                $scope.s.makeup = $scope.employeeData.makeupPost;
                $scope.appointments = response.data.appointments;
                $log.debug($scope.employeeData);
                // console.log(response);
                var len = $scope.employeeData.commission.length;
                if(len == 0){
                    $scope.commission = response.data.totalComission;
                }
                else{
                    for(var i=0; i<len; i++){
                        $scope.commission += $scope.employeeData.commission.ammount;
                    }
                }
                $scope.totalSalary = $scope.commission + $scope.employeeData.salary;

                if($scope.employeeData.holidays.length == 0){
                    $scope.leaveCount = 0;
                }
            });
        }




        $scope.hair="";
        $scope.makeup="";
        $scope.serv=[];
        // console.log($scope.cat);
        $scope.selectedCat=[];


        $scope.categories = [];
        $scope.userId = $stateParams.userId;
        $scope.userName = $stateParams.userName;
        var numbers = [];
        for(var i=0; i<31; i++)numbers.push(i+1);
        $scope.line = {
            labels: numbers,
            series: ['Hours', 'Revenue in thousands'],
            data: [
                [10, 12, 12, 3, 4, 1, 0],
                [4, 4, 1, 23, 6, 3.2, 0],
            ],
            onClick: function (points, evt) {
                // console.log(points, evt);
            }
        };

        $scope.donut = {
            labels: ["Hrs spend by other employee", "Hrs spend by "+ $scope.userName],
            data: [1000, 200]
        };
        $scope.revenue = {
            labels: ["Revenue generated by other employee(in thousands)", "Revenue generated by "+ $scope.userName],
            data: [1000, 10]
        };



        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);

        //$log.debug('Params : ',$scope.tableParams);

       /* $http.post("/role2/reports/memberServicesDetail", {userId : $stateParams.userId}).success(function(response, status){
            $scope.empServices = response.data;
            /!* $scope.categories.forEach(function(category){
             category.services.forEach(function(service){
             data.forEach(function(d){
             if(d.serviceId == service.serviceId) {
             service.isAssigned = true;
             if(d.isSpecialist)service.isSpecialist = true;
             else service.isSpecialist = false;
             }
             });
             });*!/
        });*/





    });

