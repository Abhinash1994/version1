angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('createdJpegCtrl', function ($scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$parse, $timeout,$q) {
	

	console.log("createDealJpeg");	

	 /*var scaleBy = 5;
    var w = 1000;
    var h = 1000;
    var div = document.querySelector("#my-node");
    var canvas = document.createElement('canvas');
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var context = canvas.getContext('2d');
    context.scale(scaleBy, scaleBy);
$scope.generateJpeg=function(){
    html2canvas(div, {
        canvas:canvas,
        onrendered: function (canvas) {
            theCanvas = canvas;
            document.body.appendChild(canvas);

            Canvas2Image.saveAsPNG(canvas);
            $(body).append(canvas);
        }
    });

}*/
   
   	$scope.generateJpeg=function(){
		html2canvas($("#my-node"), {
        onrendered: function(canvas) {
            // canvas is the final rendered <canvas> element
            var myImage = canvas.toDataURL("image/jpeg");
            window.open(myImage);
      		  }
   		 });
		console.log(angular.toJson($scope.rewindObject))
        $http.post("/role2/createDealJpeg",{data:angular.toJson($scope.rewindObject)}).then(function(response) {
            console.log(response);
			          
       	 });
		 
		}	

		
    
	});
	