angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select'])
.controller('clientsOnMap', function($scope,$http, $interval,NgTableParams,NgMap, $timeout) { 
    console.log("inside controller");
    var markers = [];
 	var vm = this;
 	MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ 
      = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';  //changed image path
 	$scope.selectedRadio = "app";
    $scope.fetchUsers=function(){
      console.log($scope.selectedRadio);
      var url = "";
      if($scope.selectedRadio == "app")url = "/role1/appointmentInLastSixMonthsnUserlatLong";
      else if($scope.selectedRadio == "salons")url = "/role1/salonLatLong";
      else if($scope.selectedRadio == "subscribers")url = "/role1/subscriptionUserlatLong";
      else if($scope.selectedRadio == "aalenes")url = "/role1/aalenes";
      else if($scope.selectedRadio == "markets")url = "/role1/salonLatLong";
      $http.get(url).success(function(response, status){
      	console.log(response);
        markers=response.data;


	        vm.dynMarkers = [];
	    NgMap.getMap().then(function(map) {
	      for (var i=0; i<markers.length; i++) {
          var latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
          if($scope.selectedRadio == "salons"){
            if(markers[i].salonScore<.6)vm.dynMarkers.push(new google.maps.Marker({position:latLng,icon:"https://res.cloudinary.com/dyqcevdpm/image/upload/v1558360456/red_location_pgthhl.png",title:markers[i].name}))
           else if(markers[i].salonScore<1)vm.dynMarkers.push(new google.maps.Marker({position:latLng,icon:"https://res.cloudinary.com/dyqcevdpm/image/upload/v1558360463/blue_location_ozwjnn.png",title:markers[i].name}))
            else vm.dynMarkers.push(new google.maps.Marker({position:latLng,icon:"https://res.cloudinary.com/dyqcevdpm/image/upload/v1558360445/green_location_btkvmt.png",title:markers[i].name}))
          }else{
            vm.dynMarkers.push(new google.maps.Marker({position:latLng}));
          }
	       
	      }
	      vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});
	    });

    });


    }
    


});


