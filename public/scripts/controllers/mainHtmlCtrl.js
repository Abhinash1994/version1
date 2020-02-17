'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('mainHtmlCtrl', function($scope,$log, $http, $timeout,$rootScope,deleteAppointmentIdService) {
        $scope.arrayOfNotifications=[];
        // console.log(userType)
        // console.log(role);
        if(role!=1 && role != 7 && userType !="1"){

            // var socket = io.connect('http://www.beusalons.com');

           /* socket.on("connect",function(data){
                console.log("SDAdsa");
                console.log(data);
                socket.emit('room', parlorId);
            })*/

            /*socket.on("payment",function(data){
                console.log("payment received is ",data);
                console.log("new order from server ",data.data);
                var appointmentBookObject={'type':'','name':'','appointmentId':'','amount':''};
                appointmentBookObject.type=data.data.type;
                appointmentBookObject.name=data.data.name;
                appointmentBookObject.appointmentId=data.data.appointmentId;
                appointmentBookObject.amount=data.data.amount;
                pushObject(appointmentBookObject);
                $scope.arrayOfNotifications.reverse();
                $rootScope.$broadcast('broadcastRefreshAppointents');
                //alert(data)
            })*/

           /* socket.on("newOrder",function(data){
                console.log("new order from server ",data.data);
                var appointmentBookObject={'type':'','name':'','appointmentId':'','amount':''};
                appointmentBookObject.type=data.data.type;
                appointmentBookObject.name=data.data.name;
                appointmentBookObject.appointmentId=data.data.appointmentId;
                appointmentBookObject.amount=data.data.amount;
                pushObject(appointmentBookObject);
                $scope.arrayOfNotifications.reverse();
                $rootScope.$broadcast('broadcastRefreshAppointents');
                //alert(data)
            })*/

        }



        $scope.lengthOfNotifications='';
        $scope.decreaseNotificationCount=function(){
            var index=0;
            var countCheck=0;
            while(index<$scope.arrayOfNotifications.length){
                if($scope.arrayOfNotifications[index].seenFlag==false){
                    countCheck++;
                }
                index++;
            }
            $scope.lengthOfNotifications=countCheck;
        }
        var pushObject = function(x) {
            x.seenFlag=false;
            $scope.arrayOfNotifications.push(x);
            $scope.decreaseNotificationCount();
            // console.log($scope.arrayOfNotifications);
            $scope.$apply();
        }

        $rootScope.$on('removeNotificationAppointment',function(){
            var countCheck=0;
            for(var i=0;i<$scope.arrayOfNotifications.length;i++){
                if($scope.arrayOfNotifications[i].appointmentId==deleteAppointmentIdService.getappointmentId()){
                    $scope.arrayOfNotifications.splice(i,1);
                };
            }
            for(var i=0;i<$scope.arrayOfNotifications.length;i++)  {
                if($scope.arrayOfNotifications[i].seenFlag==false){
                    countCheck++;
                };
            }
            $scope.lengthOfNotifications=countCheck;
        });

        /*setTimeout(function(){ pushObject({'type':'A','name':'Nikita'}); }, 5000);
         setTimeout(function(){ pushObject({'type':'P','name':'Manoj','amount':2000}); }, 7000);
         setTimeout(function(){ pushObject({'type':'A','name':'Vikas'}); }, 9000);*/

         /*---------------------------code for face detection starts-----------------------------------*/
        /*if(role!=1){
            var i=0;
        var realCount=0;
        var timeoutFlag=false;
        var thumbs = document.getElementById("thumbs");
        var c = document.createElement("canvas");
        setInterval(function(){
            i=0;
            realCount=0;
        },30000)
        function generateThumbnail() {

            var ctx = c.getContext("2d");
            c.width = 600;
            c.height = 400;
            ctx.drawImage(video, 0, 0, 600, 400);
            thumbs.appendChild(c);
        }
        function snapshot() {
            if(i<4){
                console.log(i)
                var l=document.getElementById('testLink');
                var tempStringArray=(l.href).split(',');
                var tests=tempStringArray[1];
                //console.log(tests)
                console.log(parlorId)
                var data={
                    'parlorId':parlorId,
                    'imgs':tests
                }
                $http({
                  url: 'http://10.0.1.178:8877/people',
                  method: "POST",
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  data: $.param(data)
                }).success(function(data) {
                    console.log(realCount);
                    if(realCount==2){
                        console.log(data);
                          
                            $scope.imageString=data.faces[0].face;
                            $scope.customTemplateScope();
                    }
                    realCount++;
                });
                
                l.href = c.toDataURL();
                console.log(l)
                l.download = 'test.png';
                //l.click();
                i++;
            }
        }
        var globalTimeout;
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var tracker = new tracking.ObjectTracker("face");
        var localMediaStream = null;
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        tracking.track('#video', tracker, { camera: true });
        tracker.on('track', function(event) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            if (event.data.length == 0) {
                
                } 
            else{
                 //console.log('here')
                    event.data.forEach(function(rect) {
                        context.strokeStyle = '#ff0000';
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                        context.font = '11px Helvetica';
                        context.fillStyle = "#fff";
                        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                       // console.log("some1 dr");
                        if(i<10){
                            generateThumbnail();
                            snapshot();
                        }
                    });
                }
            

        });
        var gui = new dat.GUI();
        gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
        gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
        gui.add(tracker, 'stepSize', 1, 5).step(0.1);
        }*/

    /*---------------------------code for face detection ends-----------------------------------*/



    /*----------------------------------customerIrrelevant starts-----------------------------------------------*/
    $scope.closeFlag=false;
    var peopelDetectedQueue=[];
    $scope.notiCount=0;
    $scope.customTemplateScope = function(data) {
        // console.log(data.data)
        var notificationObject={
            'image':data.data.faces[0].face,
        'notification':Notification.primary({valk:'a',title:'hmm',message: "Notification Customer-"+$scope.notiCount, templateUrl: "custom_template.html", scope: $scope , delay:null, closeOnClick: $scope.closeFlag})
    }
        //Notification.primary({valk:'a',title:'hmm',message: "Customer-"+$scope.notiCount, templateUrl: "custom_template.html", scope: $scope , delay:null, closeOnClick: $scope.closeFlag,onClose:$scope.test()})
        peopelDetectedQueue.push(notificationObject);
        $scope.notiCount++;
    };// calls the custom notification

    /*setTimeout(function(){
        $scope.customTemplateScope();
    },2000);*///makes the pop up  notification go visible

    $scope.nTitle='gcvadshcbjhabsd';// scope attached with tempelate
    $scope.customerOrIrrelevant=function(cusOrIrrel,msg){
        //console.log(msg.$$unwrapTrustedValue());//done to get the message context
        var thenum = msg.$$unwrapTrustedValue().replace( /^\D+/g, '')
        // console.log(cusOrIrrel+'   '+thenum);
        for(var i=0;i<peopelDetectedQueue.length;i++){
            if(i==parseInt(thenum)){
                peopelDetectedQueue[i].notification.then(function(notification){
                    notification.kill(true);
                });
            }
        }
    };//makes the notification closed and tell customer and irrelevant

    
    $scope.getImage = function(data){
        // console.log(data);
        var image='';
        var thenum = data.$$unwrapTrustedValue().replace( /^\D+/g, '');
        for(var i=0;i<peopelDetectedQueue.length;i++){
            if(i==parseInt(thenum)){
                image=peopelDetectedQueue[i].image;
            }
        }
         //console.log(image);    
        return image;
    }//converts base64 image to png



    });