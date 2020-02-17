/**
 * Created by Rohan on 7/7/16.
 */


angular.module('sbAdminApp')
    .controller('PreviousAppointmentCtrl', ['$scope', '$position', '$http', '$state','$log','moment','calendarConfig', function($scope,$position, $http, $state, $log, moment, calendarConfig) {

        var vm = $scope;

        vm.changeEvents = function(type){
            console.log(vm.viewDate);
            $http.get("/role3/appointment?month=" + vm.viewDate.getMonth() + "&year=" +  vm.viewDate.getFullYear()).success(function(response, status){
                console.log(response.data);
                vm.events = parseEvents(response.data);
            });
        };

        function parseEvents(events){
            var data = [];
            events.forEach(function(ev){
                var obj = {
                    title: ev.client.name + " (" + getServices(ev.services) + ")", // The title of the event
                    color: ev.status == 3 ? calendarConfig.colorTypes.success : ev.status == 2 ? calendarConfig.colorTypes.important : calendarConfig.colorTypes.warning,
            type: ev.status == 3 ? 'success' : ev.status == 2 ? 'important' : 'special', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
            startsAt: new Date(ev.startsAt), // A javascript date object for when the event starts
            endsAt: new Date(new Date(ev.startsAt).getTime() + (ev.estimatedTime * 60000)), // Optional - a javascript date object for when the event ends
            editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
            deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
            draggable: false, //Allow an event to be dragged and dropped
            resizable: true, //Allow an event to be resizable
            incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
            allDay: false // s
                };
                data.push(obj);
            });
            console.log(data)

            return data;
        }

        function getServices(services){
            var service = "";
            services.forEach(function(s){
                service += s.name + ", ";
            });
            return service;
        }

        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.events = [

        ];

        vm.isCellOpen = false;

        vm.eventClicked = function(event) {
            console.log(event);
        };

        vm.changeEvents();

        // vm.eventEdited = function(event) {
        //   alert.show('Edited', event);
        // };
        //
        // vm.eventDeleted = function(event) {
        //   alert.show('Deleted', event);
        // };
        //
        // vm.eventTimesChanged = function(event) {
        //   alert.show('Dropped or resized', event);
        // };
        //
        // vm.toggle = function($event, field, event) {
        //   $event.preventDefault();
        //   $event.stopPropagation();
        //   event[field] = !event[field];
        // };
        console.log('ddddddddddddd'+JSON.stringify(calendarConfig));
        calendarConfig.showTimesOnWeekView = true;
    }]);

	// angular.module('sbAdminApp')
  // .config(function(calendarConfig) {
  //
  //   console.log('ddddddddddddd'+JSON.stringify()(calendarConfig)); //view all available config
	// calendarConfig.showTimesOnWeekView = true;
  // });
