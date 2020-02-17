'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','ngTable','daterangepicker'])
.controller('parlorLayoutCrm2', function($scope,$http,$timeout,$state){

  // Code goes here
  $scope.role=role;
  $scope.parlorId=parlorId;
  $scope.mainContainerHeight=angular.element("#grid")[0].offsetHeight;
  console.log($scope.mainContainerHeight);
  $scope.mainContainerWidth=angular.element("#grid")[0].offsetWidth;
  console.log($scope.mainContainerWidth);
  $scope.selected={};
  $scope.parlor={selected:{}};
  $scope.svgArrayContainer=[];
  $scope.svgCLientArray=[];
  $scope.svgMinCircle=[];
  $scope.svgCircleText=[];
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
  	var ypos = 1;
    var numberOfRows = 20;
    var numberOfColumns = 20;
  	var width = $scope.mainContainerHeight/numberOfRows;
  	var height = $scope.mainContainerWidth/numberOfColumns;
    $scope.parlorNotSelected=true;

    $http.get("/api/allParlor").success(function(response) {
      console.log(response);
      $scope.parlors=response.data;
      console.log($scope.parlors);
    })

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
  	.style("stroke", "transparent")
  	.on('click', function(d) {
      var x=parseInt(Math.trunc(d.x / width)) + 1;
      var y=parseInt(Math.trunc(d.y / height)) +1;
        console.log("x", x)
        console.log("y", y)
        console.log("d.x",d.x);
        console.log("d.y",d.y);

       var rChair=x.toString()+ "_"+y.toString();
       if(document.getElementById(rChair)==null){
          // $scope.createChair(d.x+(width/2),d.y+(height/2),x,y);
       }else{
           // removeChair(x,y)
       }

      });
      function removeChair(gridX,gridY){
        console.log("hfjdhj")
        console.log("remchairX",gridX);
        console.log("remchairY",gridY);
        var rChair=gridX.toString()+ "_"+gridY.toString();
        if(document.getElementById(rChair)!=null){
          document.getElementById(rChair).remove();;
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
        console.log("selected",$scope.parlor.selected);
        $scope.svgArrayContainer=[];
        $scope.svgRoomContainer=[];
        $scope.svgCLientArray=[];
        $scope.svgMinCircle=[];
        $scope.svgCircleText=[];
        $scope.svgTspan=[];
        $scope.svgTspanMin=[];
        $http.get("/role2/parlorChair?parlorId="+$scope.parlor.selected).success(function(response){
          console.log(response);
          $scope.putChairs=response.data.chairsPosition;
          console.log($scope.putChairs);
          $scope.createChair();
        })
      }

      $scope.createChair=function () {

          var svgContainer1 = document.getElementById("svg");
          for (var i = 0; i < $scope.putChairs.length; i++) {
            // chair

            if($scope.putChairs[i].timeRemaining==undefined){
              $scope.putChairs[i].timeRemaining=0;
            }

            $scope.svgArrayContainer[i]=document.createElementNS('http://www.w3.org/2000/svg','image');
            $scope.svgArrayContainer[i].setAttributeNS(null,'height','50');
            $scope.svgArrayContainer[i].setAttributeNS(null,'width','50');

            //occupied

            $scope.svgCLientArray[i]=document.createElementNS('http://www.w3.org/2000/svg','image');
            $scope.svgCLientArray[i].setAttributeNS(null,'height','50');
            $scope.svgCLientArray[i].setAttributeNS(null,'width','50');

            // Time Remaining circle
            $scope.svgMinCircle[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
            $scope.svgMinCircle[i].setAttributeNS(null, 'style', 'fill: #1010a0; stroke: #1010a0; stroke-width: null;' );

            // Time Remaining text
            $scope.svgCircleText[i] = document.createElementNS('http://www.w3.org/2000/svg',"text");
            $scope.svgCircleText[i].setAttribute('fill', '#fff');

            //svgTspan
            $scope.svgTspan[i] = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
            $scope.svgTspanMin[i] = document.createElementNS('http://www.w3.org/2000/svg',"tspan");

            if(!$scope.putChairs[i].isRoom){

              if($scope.putChairs[i].direction==1){
                $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatTop.png');
                if($scope.putChairs[i].isOccupied){

                  //userImage
                  $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/userMaleTop.png');
                  //time Remaining Bubble
                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+3)-1.55)*height);

                  // time remaining text

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+3)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7  )-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgTspan[i].appendChild($scope.textNode);

                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);

                }

              }
              if($scope.putChairs[i].direction==2){
                $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatLeft.png');

                if($scope.putChairs[i].isOccupied=true){
                  // $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/userMaleLeft.png');

                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+3)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1)-1.55)*height);

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.7)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.7)-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');


                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);

                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.7)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                }
              }
              if($scope.putChairs[i].direction==3){
                $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatRight.png');

                  if($scope.putChairs[i].isOccupied=true){

                    $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/userMaleRight.png');

                    $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                    $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x-1)-1.55)*width);
                    $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1)-1.55)*height);

                    $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-1.3)-1.55)*width);
                    $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1)-1.55)*height);

                    $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-1.3)-1.55)*width);
                    $scope.svgTspan[i].setAttribute('font-size', '13');

                    $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                    $scope.svgCircleText[i].appendChild($scope.textNode);
                    $scope.textNodeMin=document.createTextNode("min");
                    $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-1.3)-1.55)*width);
                    $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                    $scope.svgTspanMin[i].setAttribute('font-size', '10');

                    $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                    $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                    $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                  }
              }
              if($scope.putChairs[i].direction==4){
                $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatBottom.png');
                if($scope.putChairs[i].isOccupied=true){
                  $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/userMaleBottom.png');

                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y-1)-1.55)*height);

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y-1)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7)-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);
                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.7)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);

                }
              }
              $scope.svgArrayContainer[i].setAttributeNS(null,'x',($scope.putChairs[i].x-1.55)*width);
              $scope.svgArrayContainer[i].setAttributeNS(null,'y',($scope.putChairs[i].y-1.55)*height);
              $scope.svgArrayContainer[i].setAttributeNS(null, 'visibility', 'visible');

              $scope.svgCLientArray[i].setAttributeNS(null,'x',($scope.putChairs[i].x-1.55)*width);
              $scope.svgCLientArray[i].setAttributeNS(null,'y',($scope.putChairs[i].y-1.55)*height);
              $scope.svgCLientArray[i].setAttributeNS(null, 'visibility', 'visible');

                  svgContainer1.append($scope.svgArrayContainer[i]);
                  svgContainer1.append($scope.svgCLientArray[i]);
                  svgContainer1.append($scope.svgMinCircle[i]);
                  svgContainer1.appendChild($scope.svgCircleText[i]);

            }
            if($scope.putChairs[i].isRoom){
              $scope.svgRoomContainer[i]=document.createElementNS('http://www.w3.org/2000/svg','rect');
              $scope.svgRoomContainer[i].setAttributeNS(null,'height','25');
              $scope.svgRoomContainer[i].setAttributeNS(null,'width','50');
              $scope.svgRoomContainer[i].setAttributeNS(null,'x',($scope.putChairs[i].x-1)*width);
              $scope.svgRoomContainer[i].setAttributeNS(null,'y',($scope.putChairs[i].y-1)*height);
              $scope.svgRoomContainer[i].setAttributeNS(null,'fill','#0a3893');
              svgContainer1.appendChild($scope.svgRoomContainer[i]);

              if($scope.putChairs[i].direction==1){
                if($scope.putChairs[i].isOccupied){
                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1.5)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+2.5)-1.55)*height);
                  svgContainer1.appendChild($scope.svgMinCircle[i]);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.5)-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+2.5)-1.55)*height);

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);
                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                }
              }

              if($scope.putChairs[i].direction==2){
                if($scope.putChairs[i].isOccupied){
                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+3.5)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1)-1.55)*height);
                  svgContainer1.appendChild($scope.svgMinCircle[i]);

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+3.2)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+3.5)-1.55)*width);
                  $scope.svgTspanMin[i].setAttribute('font-size', '13');

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);

                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+3.2)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                }
              }
              if($scope.putChairs[i].direction==3){
                if($scope.putChairs[i].isOccupied){
                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x-0.5)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1)-1.55)*height);
                  svgContainer1.appendChild($scope.svgMinCircle[i]);

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-0.8)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-0.8)-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);

                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-0.8)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                }
              }
              if($scope.putChairs[i].direction==4){
                if($scope.putChairs[i].isOccupied){
                  $scope.svgMinCircle[i].setAttributeNS(null, 'r', 15);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1.5)-1.55)*width);
                  $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y-0.5)-1.55)*height);
                  svgContainer1.appendChild($scope.svgMinCircle[i]);

                  $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                  $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y-0.5)-1.55)*height);

                  $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                  $scope.svgTspan[i].setAttribute('font-size', '13');

                  $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                  $scope.svgCircleText[i].appendChild($scope.textNode);

                  $scope.textNodeMin=document.createTextNode("min");
                  $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                  $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);
                  $scope.svgTspanMin[i].setAttribute('font-size', '10');

                  $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                  $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                  $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                }
              }
              svgContainer1.appendChild($scope.svgCircleText[i]);
              $scope.svgArrayContainer.addEventListener("click",function() {$scope.clientSeatSelection()} );
            }

          }

      }
      $scope.clientSeatSelection=function() {

          // if(this.id!=null){$scope.removeSeat(this.id)}
          console.log("clicked");
      }

      $scope.removeSeat=function(id){
        var coords=id.split("_")
        var coordX=coords[0];
        var coordY=coords[1];
        removeChair(coordX,coordY);
      }
});
