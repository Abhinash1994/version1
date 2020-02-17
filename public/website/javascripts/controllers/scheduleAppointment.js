app.controller('scheduleAppointment', ['$rootScope','$scope', '$http','$route','$routeParams','$location','ngProgressFactory','localStorageService','$mdDialog','Service','salonListingSearchBoxBooleanService','$log','$q',
    function($rootScope,$scope, $http,$route, $routeParams, $location,ngProgressFactory,localStorageService,$mdDialog,Service,salonListingSearchBoxBooleanService,$log,$q) {

    $scope.week=[];
    $scope.dateToday=new Date();
    console.log($scope.dateToday);
    $scope.check=false;
    $scope.activeDay=0;
    $scope.activeSlot=0;

if ($scope.dateToday.getHours()<parseInt($scope.$parent.passingObject.closingTime)){
      $scope.week.push({
        day:new Date()
      });
      var days=6;
    }else {
      var days=7;
      $scope.check=true;
    }

for (var i = 0; i < days; i++) {
        $scope.week.push({
        day: new Date($scope.dateToday.setDate($scope.dateToday.getDate() + 1))
      })
    }
    console.log($scope.week);
    $scope.checkToday = function areSameDate(d1, d2) {
        return d1.getFullYear() == d2.getFullYear()
            && d1.getMonth() == d2.getMonth()
            && d1.getDate() == d2.getDate();
    }
    var hours=function(t) {
            return Math.trunc((Math.abs(t))/(60*60*1000));
    }
    $scope.createTimeIntervals=function(day) {

      $scope.timeSetter=new Date(day);

      if($scope.checkToday(new Date(),new Date(day))){
        var d = new Date();
          console.log("hello")
        var currentMinute=d.getMinutes();
        d.setTime(d.getTime() + 120*60000)
        if (currentMinute<30) {
          d.setMinutes(0);
 }
        else {
          d.setMinutes(30);
        }

        console.log(d,"d ");
        var toCompare = new Date(d.getFullYear(),d.getMonth(),d.getDate(),parseInt($scope.$parent.passingObject.closingTime),0,0);
        console.log(toCompare)
        console.log("today");


        if (currentMinute<30) {
          var h = (hours(toCompare-d)*2)+2;
        }
        else {
          var h = (hours(toCompare-d)*2)+1;
        }

        $scope.timeArray = [];
        console.log(h)
        for (var i = 0; i < h; i++) {
          $scope.timeArray.push({
            fromTime : new Date(d),
            toTime : new Date(d.setTime(d.getTime() + 30*60000))
          });
        }
      }  /// today is working here
      else{
        console.log($scope.$parent.passingObject)
        $scope.timeArray = [];
      $scope.openingTime=parseInt($scope.$parent.passingObject.openingTime)
       var till = parseInt($scope.$parent.passingObject.closingTime)-parseInt($scope.$parent.passingObject.openingTime)
        $scope.timeSetter.setHours($scope.openingTime);
        $scope.timeSetter.setMinutes(0);
        $scope.timeSetter.setSeconds(0);
        console.log($scope.timeSetter);
        for (var i = 0; i < till*2; i++) {

          $scope.timeArray.push({
            fromTime : new Date($scope.timeSetter),
            toTime : new Date($scope.timeSetter.setTime($scope.timeSetter.getTime() + 30*60000))
          });
        }
            console.log("time",$scope.timeArray);
      }
    }
    $scope.showTimeOfDay=function(index) {
      $scope.activeSlot=0;
      $scope.activeDay=index;
      $scope.selectedDay=$scope.week[index];
      $scope.createTimeIntervals($scope.selectedDay.day);
      console.log($scope.selectedDay.day);
    }
    $scope.selectedTimeSlot=function(index,selectedTime) {
      $scope.activeSlot=index;
      console.log($scope.activeSlot)
      $scope.selectedTimeSlotValue=selectedTime;
      console.log($scope.selectedTimeSlotValue,"val");

    }

}]);
