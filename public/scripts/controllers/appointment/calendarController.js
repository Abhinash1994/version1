/**
 * Created by Rohan on 7/7/16.
 */


angular.module('sbAdminApp')
    .controller('calendarCtrl', ['$scope', '$position', '$http', '$state','$log','moment', function($scope,$position, $http, $state, $log, moment) {
		$scope.employees=[];
		// console.log(employees);
		employees.forEach(function(element) {
			if(element.active){
				var s = {id:element.userId,title:element.name};
				$scope.employees.push(s);
			}
		});
		// console.log($scope.employees);
        $('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,agendaDay'
			},
			defaultView: 'agendaDay',
			minTime:"09:00:00",
			navLinks: true, // can click day/week names to navigate views
			editable: false,
			slotDuration:'00:15:00',
			schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
			resources: $scope.employees,
			eventLimit: true, // allow "more" link when too many events
			events: function(start, end, timezone, callback) {
				
				// console.log("Event function called");
				// console.log(start._d);
				// console.log(end._d);
				var events=[];
				$http.get("/role3/appointment?startDate=" + start._d + "&endDate=" +  end._d).success(function(response, status){
					// console.log(response.data);
					response.data.forEach(function(element) {
						var stat="";
						if(element.status==1){
							stat="#23527c";
						}
						else if(element.status==2){
							stat="#ff0000"
						}
						else if(element.status==3){
							stat="#32cd32"
						}
						else if(element.status==4){
							stat="#ffbf00"
						}
						var service1=[];
						var time=new Date(element.startsAt);
						var start1=[angular.copy(time)];
						var end1=[angular.copy(time)];
						for(var i=0;i<element.services.length;i++) {	
							var duration=0;
							var client= element.client.name + ". Services Ordered are ";
							var ser="";
							end1[i].setMinutes(end1[i].getMinutes()+element.services[i].estimatedTime);
							// console.log(start1);
							// console.log(end1);
							element.services[i].employees.forEach(function(element2) {
									ser=element.services[i].name;
									var name=client+ser;
									if(i!=0){
										name=ser;
									}
									// console.log(end1);	
									// console.log(start1);
									// console.log(element.services[i].estimatedTime);
									// console.log(end1);
									var id=element.services[i].code+element2.employeeId;
									var s = {title:name, start:start1[i],end:end1[i],resourceId:element2.employeeId,id:id,color:stat};
									events.push(s);
							});	
							start1[i+1]=angular.copy(time);
							end1[i+1]=angular.copy(time);
							start1[i+1].setMinutes(start1[i].getMinutes()+element.services[i].estimatedTime);
							end1[i+1].setMinutes(start1[i].getMinutes()+element.services[i].estimatedTime);

						};
					});
					// console.log(events);
					callback(events);
				});
			},
			dayClick: function(date, jsEvent, view) {
				if (view.name != 'month')
					return;
		
				if (view.name == 'month' || view.name == 'basicWeek' ) {
					$('#calendar').fullCalendar('changeView', 'agendaDay');
					$('#calendar').fullCalendar('gotoDate', date);
				}
		
			}
				
							
		});
    }]);

	// angular.module('sbAdminApp')
  // .config(function(calendarConfig) {
  //
  //   console.log('ddddddddddddd'+JSON.stringify()(calendarConfig)); //view all available config
	// calendarConfig.showTimesOnWeekView = true;
  // });