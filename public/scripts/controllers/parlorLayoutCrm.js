'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('parlorLayoutCrm', function($scope,$http,$timeout,$state){

  // Code goes here
  $scope.role=role;
  $scope.parlorId=parlorId;
  $scope.mainContainerHeight=angular.element("#grid")[0].offsetHeight;
  console.log($scope.mainContainerHeight);
  $scope.mainContainerWidth=angular.element("#grid")[0].offsetWidth;
  console.log($scope.mainContainerWidth);
  $scope.parlor={selected:{}}
  $scope.direction=[
    {
      "dir" : "Top",
      "id"  : 1
    },
    {
      "dir" : "Left",
      "id"  : 2
    },
    {
      "dir" : "Right",
      "id"  : 3
    },
    {
      "dir" : "Bottom",
      "id"  : 4
    }
  ]
  $scope.room=[{
      "isRoom":"True",
      "val":true
    },
    {
      "isRoom":"False",
      "val":false
    }
  ]
  $scope.selectedRoom={};
  $scope.selectedDirection={};
  // $scope.selected={};
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
  	var ypos = 1;
    var numberOfRows = 100;
    var numberOfColumns = 100;
  	var width = $scope.mainContainerHeight/numberOfRows;
  	var height = $scope.mainContainerWidth/numberOfColumns;
    $scope.parlorNotSelected=true;
    $http.get("/api/allParlor").success(function(response) {  //inactive salons
      console.log(response);
      $scope.parlors=response.data;
    })
    $scope.directionFound=function(){
      console.log($scope.selectedDirection);
    }
    $scope.saveChairDirection=function(){

        $scope.createChair($scope.dx+(width/2),$scope.dy+(height/2),$scope.gridX,$scope.gridY);

    }
  function gridData() {
  	var data = new Array();
    console.log("width", width);
    console.log("height", height);
  	var click = 0;

  	// iterate for rows
  	for (var row = 0; row < numberOfRows; row++) {
  		data.push( new Array() );

  		// iterate for cells/columns inside rows
  		for (var column = 0; column < numberOfColumns; column++) {
  			data[row].push({
  				x: xpos,
  				y: ypos,
  				width: width,
  				height: height,
  				click: click
  			})
  			// increment the x position. I.e. move it over by 50 (width variable)
  			xpos += width;
  		}
  		// reset the x position after a row is complete
  		xpos = 1;
  		// increment the y position for the next row. Move it down 50 (height variable)
  		ypos += height;
  	}
  	return data;
  }

  var gridData = gridData();
  // I like to log the data to the console for quick debugging
  console.log(gridData);

  var grid = d3.select("#grid")
                .select('#svg')
  var row = grid.selectAll(".row")
  	.data(gridData)
  	.enter().append("g")
  	.attr("class", "row");

  var column = row.selectAll(".square")
  	.data(function(d) { return d; })
  	.enter().append("rect")
  	.attr("class","square")
  	.attr("x", function(d) { return d.x; })
  	.attr("y", function(d) { return d.y; })
  	.attr("width", function(d) { return d.width; })
  	.attr("height", function(d) { return d.height; })
  	.style("fill", "transparent")
  	.style("stroke", "#f39bab")
  	.on('click', function(d) {
      var x=parseInt(Math.trunc(d.x / width)) + 1;
      var y=parseInt(Math.trunc(d.y / height)) +1;
      $scope.gridX=x;
      $scope.gridY=y;
      $scope.dx=d.x;
      $scope.dy=d.y;
        console.log("x", x)
        console.log("y", y)
        console.log("d.x",d.x);
        console.log("d.y",d.y);

       var rChair=x.toString()+ "_"+y.toString();
       if(document.getElementById(rChair)==null){
         $("#myModal").modal('show');

       }
       else
         {
             removeChair(x,y)
         }

      });
      function removeChair(gridX,gridY){
        console.log("hfjdhj")
        console.log("remchairX",gridX);
        console.log("remchairY",gridY);
        var rChair=gridX.toString()+ "_"+gridY.toString();
        if(document.getElementById(rChair)!=null){
          document.getElementById(rChair).remove();
            $scope.chairArray.forEach(function(s, i){
                  if(s.x == gridX && s.y == gridY){
                    $scope.chairArray.splice((i),1);
                  }
              })
        }

          console.log("$scope.chairArray",$scope.chairArray);
      }

      $scope.chairArray=[];
      $scope.changeParlor=function() {
        $scope.parlorNotSelected=false;
        console.log($scope.parlor.selected.parlorId);
      }
      $scope.createChair=function (chairX,chairY,gridX,gridY) {

          var svgContainer1 = document.getElementById("svg");
          var id=gridX.toString()+"_"+gridY.toString();
          $scope.svgArrayContainer=document.createElementNS('http://www.w3.org/2000/svg','image');//seat
          $scope.svgArrayContainer.setAttributeNS(null,'height','50');
          $scope.svgArrayContainer.setAttributeNS(null,'width','50');
          $scope.svgArrayContainer.setAttributeNS(null,'x',chairX-25);
          $scope.svgArrayContainer.setAttributeNS(null,'y',chairY-25);
          $scope.svgArrayContainer.setAttributeNS(null, 'visibility', 'visible');
          $scope.svgArrayContainer.setAttributeNS(null,'id',id);

          $scope.svgRoomContainer=document.createElementNS('http://www.w3.org/2000/svg','image');//room
          $scope.svgRoomContainer.setAttributeNS(null,'visibility','visible');
          $scope.svgRoomContainer.setAttributeNS(null,'id',id);

          if($scope.selectedDirection.id==1){
            if (!$scope.selectedRoom.val) {
              $scope.svgArrayContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatTop.png');
              svgContainer1.append($scope.svgArrayContainer);

            }
            else{
              $scope.svgRoomContainer.setAttributeNS(null,'height','50');
              $scope.svgRoomContainer.setAttributeNS(null,'width','25');
              $scope.svgRoomContainer.setAttributeNS(null,'x',chairX-12.5);
              $scope.svgRoomContainer.setAttributeNS(null,'y',chairY-25);
              $scope.svgRoomContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/bedTop.png');
              svgContainer1.append($scope.svgRoomContainer);
            }
          }
          if($scope.selectedDirection.id==2){
            if (!$scope.selectedRoom.val) {
              $scope.svgArrayContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatLeft.png');
              svgContainer1.append($scope.svgArrayContainer);

            }
            else{
              $scope.svgRoomContainer.setAttributeNS(null,'height','25');
              $scope.svgRoomContainer.setAttributeNS(null,'width','50');
              $scope.svgRoomContainer.setAttributeNS(null,'x',chairX-25);
              $scope.svgRoomContainer.setAttributeNS(null,'y',chairY-12.5);
              $scope.svgRoomContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/bedLeft.png');
              svgContainer1.append($scope.svgRoomContainer);
            }
          }
          if($scope.selectedDirection.id==3){
            if (!$scope.selectedRoom.val) {
              $scope.svgArrayContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatRight.png');
              svgContainer1.append($scope.svgArrayContainer);

            }
            else{
              $scope.svgRoomContainer.setAttributeNS(null,'height','25');
              $scope.svgRoomContainer.setAttributeNS(null,'width','50');
              $scope.svgRoomContainer.setAttributeNS(null,'x',chairX-25);
              $scope.svgRoomContainer.setAttributeNS(null,'y',chairY-12.5);
              $scope.svgRoomContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/bedRight.png');
              svgContainer1.append($scope.svgRoomContainer);
            }

          }
          if($scope.selectedDirection.id==4){
            if (!$scope.selectedRoom.val) {
              $scope.svgArrayContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatBottom.png');
              svgContainer1.append($scope.svgArrayContainer);

            }
            else{
              $scope.svgRoomContainer.setAttributeNS(null,'height','50');
              $scope.svgRoomContainer.setAttributeNS(null,'width','25');
              $scope.svgRoomContainer.setAttributeNS(null,'x',chairX-12.5);
              $scope.svgRoomContainer.setAttributeNS(null,'y',chairY-25);
              $scope.svgRoomContainer.setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/bedBottom.png');
              svgContainer1.append($scope.svgRoomContainer);
            }
          }

          $scope.svgArrayContainer.addEventListener("click",function() {if(this.id!=null){$scope.removeSeat(this.id)}} );
          $scope.svgRoomContainer.addEventListener("click",function() {if(this.id!=null){$scope.removeSeat(this.id)}} );

              console.log($scope.svgArrayContainer);

              console.log("chairX",chairX);
              console.log("chairY",chairY);
          $scope.chairArray.push({
            x:gridX,
            y:gridY,
            direction:$scope.selectedDirection.id,
            isRoom:$scope.selectedRoom.val,
            chairId:id
          })
          console.log("$scope.chairArray",$scope.chairArray);
      }

      $scope.saveLayout=function() {
        if($scope.parlor==undefined){
          var query={
            parlorId:$scope.parlorId,
            chairsPosition:$scope.chairArray
          }
        }
        if($scope.parlor!=undefined){
          var query={
            parlorId:$scope.parlor.selected.parlorId,
            chairsPosition:$scope.chairArray
          }
        }
        console.log(query);

        $http.post("/role2/parlorChair",query).success(function(response){
            console.log(response);
        })
      }
      $scope.removeSeat=function(id){
        var coords=id.split("_")
        var coordX=coords[0];
        var coordY=coords[1];
        removeChair(coordX,coordY);
      }
});
