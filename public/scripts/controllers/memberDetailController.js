'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['isteven-multi-select','ui.bootstrap','angular-clipboard'])
  .controller('MemberDetailCtrl', function($scope,$position, $http, $stateParams, $timeout,NgTableParams,$log,$filter,Excel,Upload) {
      console.log("inside controller");
      $scope.toDate=new Date();
      $scope.fromDate=new Date( $scope.toDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      $scope.s = {};
      getEmployee();
      console.log($scope.fromDate+","+$scope.toDate+","+$stateParams.userId);
       function callApi(startDate,endDate,userId){
           console.log(startDate);
           console.log(endDate);
           console.log(userId);
           $http({
               url: '/role3/report/empAttendance',
               method: 'POST',
               data:{startDate:startDate,endDate:endDate,eId:userId}
           }).then(function(response) {
              // console.log("worked");
               console.log(response);
               /*$scope.employeeAttendanceArray=angular.copy(response.data.data);*/
               $scope.employeeAttendanceArray=response.data.data;
            
                  /*===============Employee Attendance Table work =====================+++++++++++++=========================================*/
               if($scope.employeeAttendanceArray  && $scope.employeeAttendanceArray.length>0){
                $scope.employeeWorkingHours=new Date('2017-02-20T07:00:00+00:00');//this is a benchmark for employees working hours
      /*$scope.employeeAttendanceArray=[
          {"date":'2017-02-19T11:35:56+00:00',"shifts":[{"from":'2017-02-04T09:35:56+00:00',"to":'2017-02-04T11:35:56+00:00'},{"from":'2017-02-04T13:35:56+00:00',"to":'2017-02-04T17:35:56+00:00'},{"from":'2017-02-04T19:35:56+00:00',"to":'2017-02-04T20:35:56+00:00'}]},
          {"date":'2017-02-20T11:35:56+00:00',"shifts":[{"from":'2017-02-10T07:35:56+00:00',"to":'2017-02-10T09:35:56+00:00'},{"from":'2017-02-10T11:35:56+00:00',"to":'2017-02-10T13:35:56+00:00'},{"from":'2017-02-10T14:35:56+00:00',"to":'2017-02-10T16:35:56+00:00'}]},
          {"date":'2017-02-04T11:35:56+00:00',"shifts":[{"from":'2017-02-04T09:35:56+00:00',"to":'2017-02-04T11:35:56+00:00'},{"from":'2017-02-04T13:35:56+00:00',"to":'2017-02-04T17:35:56+00:00'},{"from":'2017-02-04T19:35:56+00:00',"to":'2017-02-04T20:35:56+00:00'}]},
          {"date":'2017-02-05T11:35:56+00:00',"shifts":[{"from":'2017-02-20T10:13:00+00:00',"to":'2017-02-20T14:18:00+00:00'}]}
      ];*/
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
          };
          obj.title='Shift'+i;
          obj.field='shift'+i;
          obj.visible=true;
          obj.subfield1='from';
          obj.subfield2='to';
          $scope.columns.push(obj);
        }
      for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
          var employeeWorkingHoursStart = 9;                    //Thses are th housrs calculate  the hours they worked for inshort these are benchmark hours
          var employeeWorkingHoursEnd = 0;
          $scope.employeeAttendanceArray[i]['dateFlag']=false;
            var obj={};
            var employeeTotalHours=0;                           //FOR EVERY LOOP THE THE housr for which the employee worked will be calculated in minutes and hours and will be 0 in beg
            var employeeTotalMinutes=0;
          for(var j=0;j<$scope.employeeAttendanceArray[i].shifts.length;j++) { //this loop is their to assign the values for shift1 shift2 shift3 and so on dynamically
              var shiftIndex = 1 + j;
              $scope.employeeAttendanceArray[i]['shift' + shiftIndex] = $scope.employeeAttendanceArray[i].shifts[j];
              var from=new Date( $scope.employeeAttendanceArray[i].shifts[j].from);  // for each from and to time we get a variable is created employeeTotalHours
              var to=new Date( $scope.employeeAttendanceArray[i].shifts[j].to);     // which calculates the sum of shift1 2 3 and so on for single shift array of a particular day
              var startTime = moment(from.toLocaleTimeString(), 'hh:mm:ss a');      //  and so is the same for employeeTotalMinutes
              var endTime = moment(to.toLocaleTimeString(), 'hh:mm:ss a');          //after all this $scope.employeeAttendanceArray[i]['workingHours'] variable is created which is shown in the TOTAL WORKING hours table heading
              var totalHours = (endTime.diff(startTime, 'hours'));                  //   $scope.employeeAttendanceArray[i]['hoursDifference'] is calculated using benchmark hours
              employeeTotalHours=employeeTotalHours+totalHours;                     //
              var totalMinutes = endTime.diff(startTime, 'minutes');                //
              var clearMinutes = totalMinutes % 60;
              employeeTotalMinutes=employeeTotalMinutes+clearMinutes;
          }
         //console.log(employeeTotalHours + " hours and " + employeeTotalMinutes + " minutes");
          $scope.employeeAttendanceArray[i]['workingHours']=Math.abs(employeeTotalHours) + " hours and " + Math.abs(employeeTotalMinutes) + " minutes";
          $scope.employeeAttendanceArray[i]['hoursDifference']=Math.abs(employeeWorkingHoursStart-employeeTotalHours)+" hours and "+Math.abs(employeeWorkingHoursEnd-employeeTotalMinutes)+" minutes";
          if(employeeTotalMinutes<10){
              employeeTotalMinutes=0+''+employeeTotalMinutes;
          }
          if(employeeWorkingHoursEnd<10){
              employeeWorkingHoursEnd=0+''+employeeWorkingHoursEnd;
          }
          if((parseInt(employeeWorkingHoursStart+''+employeeWorkingHoursEnd))>(parseInt(employeeTotalHours+''+employeeTotalMinutes))){
              $scope.employeeAttendanceArray[i]['rowColor']='#d2232a';   //red
          }else if((parseInt(employeeWorkingHoursStart+''+employeeWorkingHoursEnd))<(parseInt(employeeTotalHours+''+employeeTotalMinutes))){
              $scope.employeeAttendanceArray[i]['rowColor']='#148F76';   //green
          }else if((parseInt(employeeWorkingHoursStart+''+employeeWorkingHoursEnd))==(parseInt(employeeTotalHours+''+employeeTotalMinutes))){
              $scope.employeeAttendanceArray[i]['rowColor']=' #ffcc33 '; //yellow
          }                                                             //here color assigning is done :if work > benchmark then green else red and if equal then yello
      }
      for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
          delete $scope.employeeAttendanceArray[i].shifts;
      }
      var a=angular.copy($scope.fromDate)
      for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                 $scope.employeeAttendanceArray[i].dateFlag=true;
              }
      //console.log( $scope.columns);
      //console.log( $scope.employeeAttendanceArray);
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
               }
      /*$scope.updateFromTime();*/
            });
       }

        callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
    
      $scope.updateFromTime=function(x){
        if($scope.employeeAttendanceArray  && $scope.employeeAttendanceArray.length>0){
          console.log("$scope.fromDate"+' '+$scope.fromDate)
          console.log("$scope.fromDate"+' '+$scope.toDate)
          this.a = moment(new Date($scope.fromDate));
          this.b = moment(new Date($scope.toDate));
          this.months = this.a.diff(this.b, 'months');
           console.log("this.months"+' '+this.months)
          if(Math.abs(this.months)<=2){               //this is done to calculate the the max  interval of 2 months
              console.log(  $scope.employeeAttendanceArray)
              for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                  
                      $scope.employeeAttendanceArray[i].dateFlag=true;
              }
              callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
          }else if(Math.abs(this.months)>2){
              alert("You cannot select the interval for more than two months");
              $scope.fromDate='';
          }
        } else{
          callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
        }
         


      }
      $scope.updateToTime=function(){
        if($scope.employeeAttendanceArray  && $scope.employeeAttendanceArray.length>0){
          console.log("$scope.fromDate"+' '+$scope.fromDate)
          console.log("$scope.fromDate"+' '+$scope.toDate)

          this.a = moment(new Date($scope.fromDate));
          this.b = moment(new Date($scope.toDate));
          this.months = this.a.diff(this.b, 'months');
          console.log("this.months"+' '+this.months)
          if(Math.abs(this.months)<=2){
              for(var i=0;i<$scope.employeeAttendanceArray.length;i++){
                 
                      $scope.employeeAttendanceArray[i].dateFlag=true;
              }
              callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
          }else if(Math.abs(this.months)>2){
              alert("You cannot select the interval for more than two months");
              $scope.toDate='';
          }
        }else{
          callApi($scope.fromDate,$scope.toDate,$stateParams.userId);
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
          console.log("button pressed");
      };
      $scope.open2 = function() {
          $scope.popup2.open2 = true;
          console.log("button pressed");
      };
      /*==========================Date Selection==========---------========================*/
      function getEmployee(){
        $http.get("/role2/employeeDetail?userId="+$stateParams.userId).success(function(response, status){
        $scope.newUser = {};
        $scope.employeeData = response.data.employee;
        $scope.userName = $scope.employeeData.firstName +" "+ $scope.employeeData.lastName ;
        $scope.s.hair = $scope.employeeData.hairPost;
        $scope.s.makeup = $scope.employeeData.makeupPost;
        $scope.appointments = response.data.appointments;
        $log.debug($scope.employeeData);
        console.log(response);
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

	$scope.hd=[{"name":"Creative Stylist","value":0},{"name":"Trend Setter","value":1},{"name":"Regional Artist","value":2},{"name":"None","value":3}, {"name":"All","value":4}];
	$scope.md=[{"name":"Senior Artist","value":0},{"name":"Regional Artist","value":1},{"name":"Trainer","value":2},{"name":"None","value":3}, {"name":"All","value":4}];
    $scope.openEditEmployee = function(){
          console.log(status);

       $http.get("/role3/employee?userId=" + $stateParams.userId).success(function(response, status){
          $scope.newUser = response.data.user;
          console.log($scope.newUser);
          $("#editEmployee").modal('show');
        });
        
    };

    $scope.editEmployee = function(){
      $scope.newUser.userId = $stateParams.userId;
        $http.post("/role2/editEmployee", $scope.newUser).success(function(response, status){
          if(response.success){
              console.log(response);
              $('#editEmployee').modal('hide');
              getEmployee();
          }
      });
    };
		$scope.cat=getServices(services);
		$scope.hair="";
		$scope.makeup="";
		$scope.serv=[];
		console.log($scope.cat);
		$scope.selectedCat=[];
		$scope.fClose=function(){
			console.log($scope.selectedSuperCat);
			$scope.serv=[];
			for(var i=0;i<$scope.selectedSuperCat.length;i++){
				for(var j=0;j<$scope.selectedSuperCat[i].categories.length;j++){
				$scope.serv.push($scope.selectedSuperCat[i].categories[j]);
				};
			}
			console.log($scope.serv);
		};
		$scope.fCloses=function(){
			console.log($scope.selectedSer);
			
		};

    function getServices(services){
        var data = [];
        services.forEach(function(sc){
          sc.categories.forEach(function(cat){
            data.push(cat);
          });
        });
        return data;
    };

    $scope.updateEmployeeServices = function(){
        var otherServices = [];
        for(var i=0; i<$scope.selectedSer.length; i++){
          otherServices.push($scope.selectedSer[i].id);
        }
		
        var obj = {makeup : $scope.s.makeup, hair : $scope.s.hair, otherServices : otherServices, employeeId : $stateParams.userId};
        console.log(obj);
        $http.post("/role2/updateEmployeeService", obj).success(function(response, status){
            $http.post("/role3/services").success(function(response, status){
            services = response.data;
        });
        });
    };

      $scope.categories = [];
      $scope.userId = $stateParams.userId;
      $scope.userName = $stateParams.userName  ;
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
  	      console.log(points, evt);
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
	  $scope.makeCSVData = makeCSVData;
	  	  $scope.data = [
            {cname: "Usha Nagvani", earning: 2400,date: 6,rate: 60},
			{cname: "Usha Nagvani", earning: 1400,date: 6,rate: 70},
			{cname: "Usha Nagvani", earning: 2900,date: 2,rate: 90},
			{cname: "Usha Nagvani", earning: 5400,date: 6,rate: 30}
        ];

        var parameters = {
            page : 1
        };

        var settings = {
            counts : [],
            dataset: $scope.data
        };

        $scope.tableParams = new NgTableParams(parameters, settings);

        //$log.debug('Params : ',$scope.tableParams);

        function makeCSVData(){
            var csvData = $scope.data;
            csvData.unshift({cname:'Customer Name', earning:'Earnings',date:'Date',rate:'Rating'});
            return csvData;
        }

      $http.post("/role2/memberServicesDetail", {userId : $stateParams.userId}).success(function(response, status){
          $scope.empServices = response.data;
         /* $scope.categories.forEach(function(category){
              category.services.forEach(function(service){
                  data.forEach(function(d){
                      if(d.serviceId == service.serviceId) {
                          service.isAssigned = true;
                          if(d.isSpecialist)service.isSpecialist = true;
                          else service.isSpecialist = false;
                      }
                  });
              });*/
          });

          $scope.editService = function(index){
              $scope.index = index;
              $scope.currentCategory = angular.copy($scope.categories[index]);
              $("#editMemberService").modal('show');
          };

          $scope.update = function(){
              var services = [];
              $scope.currentCategory.services.forEach(function(s){
                  if(s.isAssigned) services.push({serviceId : s.serviceId, isSpecialist : s.isSpecialist});
              });
              $http.post("/role2/updateMemberServicesDetail", {userId : $stateParams.userId, services:services, categoryId : $scope.currentCategory.categoryId}).success(function(response, status){
                  $("#editMemberService").modal('hide');
                  $scope.categories[$scope.index] = angular.copy($scope.currentCategory);
                  $scope.currentCategory = {};
              });
          };


           $scope.exportToExcel = function (tableId) {
            console.log(tableId)
        // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }

/*==========================copy to clipBoard emp id==============start===========*/
        $scope.supported = false;
        $scope.successCopy = function () {
            console.log('Copied!');
        };

        $scope.failCopy = function (err) {
            console.error('Error!', err);
        };
/*==========================copy to clipBoard emp id==============stop===========*/
  


/*==========================Upload image files ==============start===========*/

            $scope.uploadFiles = function (files) {
                $scope.files = files;
                console.log($scope.userName);
                console.log($scope.employeeData._id);
                console.log(parlorId);
                console.log(files.length);
                if (files && files.length) {
                    console.log(files)
                    Upload.upload({
                        url: 'http://10.0.1.178:8777/upload',
                        data: {
                            'employeeId':$scope.employeeData._id,
                            'employeeName':$scope.userName,
                            'parlorId':parlorId,
                            'count':files.length,
                            'files': files
                        }
                    }).then(function (response) {
                        console.log(response);
                        $timeout(function () {
                            $scope.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0) {
                            $scope.errorMsg = response.status + ': ' + response.data;
                        }
                    }, function (evt) {
                        $scope.progress = 
                            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
/*==========================Upload image files ==============stops===========*/
      });

