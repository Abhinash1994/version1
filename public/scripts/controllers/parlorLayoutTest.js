'use strict';

angular.module('sbAdminApp')
.controller('parlorLayoutTest', function($rootScope,$window,$scope, $http,$route, $routeParams, $location,$log,$q,$timeout, $compile){
 

console.log($routeParams);
      $scope.currentDate={date:new Date()}

      $scope.svgArrayContainer=[];
        $scope.svgRoomContainer=[];
        $scope.svgCLientArray=[];
        $scope.svgMinCircle=[];
        $scope.svgCircleText=[];
        $scope.svgTspan=[];
        $scope.svgTspanMin=[];
        $scope.chairArray=[];

  
      $scope.popup2 = {
          opened: false
      };

      $scope.open2 = function() {
          $scope.popup2.opened = true;
      };
      var today = new Date();
      $scope.date={};
      $scope.date.date = new Date();
      console.log($scope.date.date);
var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      var ypos = 1;
      var numberOfRows = 20;
      var numberOfColumns = 20;
      var width = 0;
      var height = 0;

        $scope.veiwBoxValue="0 0 700 520";
        $scope.svgWidth=700;
  $scope.screenWidth=$window.innerWidth;
    $scope.screenHeight=$window.innerHeight;

$scope.initialScreenSize=function() {
      if($scope.screenWidth>1000){
        $scope.veiwBoxValue="0 0 700 520";
        $scope.svgWidth=700;
      }
      else {
        $scope.veiwBoxValue="0 0 700 750";
        $scope.svgWidth=350;

      }
    }
    $scope.checkScreenWidth=function(){
      $scope.veiwBoxValue="0 0 700 520";
      $scope.svgWidth=700;

    }
    $scope.mobileScreen=function() {
      $scope.veiwBoxValue="0 0 700 750";
      $scope.svgWidth=350;

    }


$http.get("/api/parlorLayout?parlorId="+parlorId).success(function(response){
            console.log(response);
      if(response.data){

          // For Angular
                 /* el = document.getElementById('grid');
                 angular.element(el).append( $compile()($scope) );*/



        //For jQuery

        var linkFn = $compile(response.data.layout);
        var element = linkFn($scope); 

        $("#svg").html(element);


                  $scope.mainContainerHeight=document.getElementById("grid").offsetHeight;
    console.log($scope.mainContainerHeight);
    $scope.mainContainerWidth=document.getElementById("grid").offsetWidth;
    console.log($scope.mainContainerWidth);
      xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      ypos = 1;
      numberOfRows = 100;
      numberOfColumns = 100;
      width = $scope.mainContainerHeight/numberOfRows;
      height = $scope.mainContainerWidth/numberOfColumns;


    $scope.screenWidth=$window.innerWidth;
    $scope.screenHeight=$window.innerHeight;


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

    
 

    var gridData2 = gridData();
    // // I like to log the data to the console for quick debugging

    var grid = d3.select("#grid")
                  .select('#svg')
    var row = grid.selectAll(".row")
      .data(gridData2)
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
    //     function removeChair(gridX,gridY){
    //       console.log("hfjdhj")
    //       console.log("remchairX",gridX);
    //       console.log("remchairY",gridY);
    //       var rChair=gridX.toString()+ "_"+gridY.toString();
    //       if(document.getElementById(rChair)!=null){
    //         document.getElementById(rChair).remove();;
    //           $scope.chairArray.forEach(function(s, i){
    //                 if(s.x == gridX && s.y == gridY){
    //                   $scope.chairArray.splice((i),1);
    //                 }
    //             })
    //       }
    //
    //         console.log("$scope.chairArray",$scope.chairArray);
    //     }
    //
        

        $scope.changeParlor();

        
            }else{
              console.log("not found");
            }
          })


        $scope.changeParlor=function() {
          console.log("date time",$scope.date.date.toISOString());
          $http.get("/api/parlorChairStatus?parlorId="+parlorId+'&datetime='+$scope.date.date.toISOString()).success(function(response){
            console.log(response);
            $scope.putChairs=response.data.chairsPosition;
            console.log($scope.putChairs);
            $scope.createChair();
          })
        }



$scope.createChair=function () {

                  var svgContainer1 = document.getElementById("svg");
                  for (var i = 0; i < $scope.putChairs.length; i++) {
                    console.log("HERE" + i);
                    console.log("direction" + $scope.putChairs[i].direction);
                    // if($scope.putChairs[i].timeRemaining != 0)
                    
                    // chair
                    $scope.svgArrayContainer[i]=document.createElementNS('http://www.w3.org/2000/svg','image');
                    $scope.svgArrayContainer[i].setAttributeNS(null,'height','50');
                    $scope.svgArrayContainer[i].setAttributeNS(null,'width','50');

                    //occupied

                    $scope.svgCLientArray[i]=document.createElementNS('http://www.w3.org/2000/svg','image');
                    $scope.svgCLientArray[i].setAttributeNS(null,'height','50');
                    $scope.svgCLientArray[i].setAttributeNS(null,'width','50');

                    // Time Remaining circle
                    $scope.svgMinCircle[i] = document.createElementNS('http://www.w3.org/2000/svg','circle');
                    $scope.svgMinCircle[i].setAttributeNS(null, 'style', 'fill: #033DBA; stroke: #033DBA; stroke-width: null;' );

                    // Time Remaining text
                    $scope.svgCircleText[i] = document.createElementNS('http://www.w3.org/2000/svg',"text");
                    $scope.svgCircleText[i].setAttribute('fill', '#fff');
                    $scope.svgCircleText[i].setAttribute('font-size', '12');

                    //svgTspan
                    $scope.svgTspan[i] = document.createElementNS('http://www.w3.org/2000/svg',"tspan");
                    $scope.svgTspanMin[i] = document.createElementNS('http://www.w3.org/2000/svg',"tspan");

                    if(!$scope.putChairs[i].isRoom){

                      if($scope.putChairs[i].direction==1){
                        $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatTop.png');
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/' + ($scope.putChairs[i].gender == "M" ? 'userMaleTop' : 'userFemaleTop') + '.png');
                          //time Remaining Bubble
                          $scope.svgMinCircle[i].setAttributeNS(null, 'r',20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1.6)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+9)-1.55)*height);

                          // time remaining text

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.9)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+9)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.4)-1.55)*width);

                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgTspan[i].appendChild($scope.textNode);

                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.2)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);

                        }

                      }
                      if($scope.putChairs[i].direction==2){
                        $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatLeft.png');

                        if($scope.putChairs[i].isOccupied){
                          $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/' + ($scope.putChairs[i].gender == "M" ? 'userMaleLeft' : 'userFemaleLeft') + '.png');

                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+8.8)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1.7)-1.55)*height);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+7.9)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1.7)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.8)-1.55)*width);

                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);

                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+7.5)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                        }
                      }
                      if($scope.putChairs[i].direction==3){
                        $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatRight.png');

                          if($scope.putChairs[i].isOccupied){

                            $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/' + ($scope.putChairs[i].gender == "M" ? 'userMaleRight' : 'userFemaleRight') + '.png');

                            $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                            $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x-6)-1.55)*width);
                            $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+2)-1.55)*height);

                            $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-7)-1.55)*width);
                            $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1.8)-1.55)*height);

                            $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-7)-1.55)*width);

                            $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                            $scope.svgCircleText[i].appendChild($scope.textNode);
                            $scope.textNodeMin=document.createTextNode("min");
                            $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-7.3)-1.55)*width);
                            $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                            $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                            $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                            $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                          }
                      }
                      if($scope.putChairs[i].direction==4){
                        $scope.svgArrayContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/seatBottom.png');
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgCLientArray[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/' + ($scope.putChairs[i].gender == "M" ? 'userMaleBottom' : 'userFemaleBottom') + '.png');

                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+1.5)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y-6)-1.55)*height);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.6)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y-6)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.4)-1.55)*width);

                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);
                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+0.4)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);

                        }
                      }
                      $scope.svgArrayContainer[i].setAttributeNS(null,'x',(($scope.putChairs[i].x-2)-1.55)*width);
                      $scope.svgArrayContainer[i].setAttributeNS(null,'y',(($scope.putChairs[i].y-2)-1.55)*height);
                      $scope.svgArrayContainer[i].setAttributeNS(null, 'visibility', 'visible');

                      $scope.svgCLientArray[i].setAttributeNS(null,'x',(($scope.putChairs[i].x-2)-1.55)*width);
                      $scope.svgCLientArray[i].setAttributeNS(null,'y',(($scope.putChairs[i].y-2)-1.55)*height);
                      $scope.svgCLientArray[i].setAttributeNS(null, 'visibility', 'visible');

                          svgContainer1.append($scope.svgArrayContainer[i]);
                          // if(scope.putChairs[i].timeRemaining != 0){
                              svgContainer1.append($scope.svgCLientArray[i]);
                              svgContainer1.append($scope.svgMinCircle[i]);
                              svgContainer1.appendChild($scope.svgCircleText[i]);  
                          // }

                    }
                    if($scope.putChairs[i].isRoom){
                      $scope.svgRoomContainer[i]=document.createElementNS('http://www.w3.org/2000/svg','image');
                      $scope.svgRoomContainer[i].setAttributeNS(null,'x',($scope.putChairs[i].x-2)*width);
                      $scope.svgRoomContainer[i].setAttributeNS(null,'y',($scope.putChairs[i].y-4)*height);
                      $scope.svgRoomContainer[i].setAttributeNS(null,'height','50');
                      $scope.svgRoomContainer[i].setAttributeNS(null,'width','50');
                      var bedArray = ['bedTop', 'bedLeft', 'bedRight', 'bedBottom'];  // 1 - Top ,2- Left , 3- Right, 4-Bottom
                      $scope.svgRoomContainer[i].setAttributeNS('http://www.w3.org/1999/xlink','href', '/images/'+bedArray[$scope.putChairs[i].direction-1]+'.png');
                      svgContainer1.appendChild($scope.svgRoomContainer[i]);

                      if($scope.putChairs[i].direction==1){
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+3.2)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+8.6)-1.55)*height);
                          svgContainer1.appendChild($scope.svgMinCircle[i]);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.5)-1.55)*width);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.2)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+8.6)-1.55)*height);

                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);
                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.9)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                        }
                      }

                      if($scope.putChairs[i].direction==2){
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+11)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1)-1.55)*height);
                          svgContainer1.appendChild($scope.svgMinCircle[i]);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+10)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+3.5)-1.55)*width);
                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);

                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+9.6)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                        }
                      }
                      if($scope.putChairs[i].direction==3){
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x-4)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y+1.2)-1.55)*height);
                          svgContainer1.appendChild($scope.svgMinCircle[i]);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-5.2)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y+1.2)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-0.8)-1.55)*width);
                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);

                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x-5.5)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                        }
                      }
                      if($scope.putChairs[i].direction==4){
                        if($scope.putChairs[i].isOccupied){
                          $scope.svgMinCircle[i].setAttributeNS(null, 'r', 20);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cx',(($scope.putChairs[i].x+3)-1.55)*width);
                          $scope.svgMinCircle[i].setAttributeNS(null, 'cy', (($scope.putChairs[i].y-6.2)-1.55)*height);
                          svgContainer1.appendChild($scope.svgMinCircle[i]);

                          $scope.svgCircleText[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+2.1)-1.55)*width);
                          $scope.svgCircleText[i].setAttributeNS(null,"y",(($scope.putChairs[i].y-6.5)-1.55)*height);

                          $scope.svgTspan[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.2)-1.55)*width);
                          $scope.textNode = document.createTextNode($scope.putChairs[i].timeRemaining);
                          $scope.svgCircleText[i].appendChild($scope.textNode);

                          $scope.textNodeMin=document.createTextNode("min");
                          $scope.svgTspanMin[i].setAttributeNS(null,"x",(($scope.putChairs[i].x+1.8)-1.55)*width);
                          $scope.svgTspanMin[i].setAttributeNS(null,"dy",10);

                          $scope.svgTspanMin[i].appendChild($scope.textNodeMin);

                          $scope.svgCircleText[i].appendChild($scope.svgTspan[i]);
                          $scope.svgCircleText[i].appendChild($scope.svgTspanMin[i]);
                        }
                      }

                      svgContainer1.appendChild($scope.svgCircleText[i]);

                    }

                  }

              }
         

});


  app.directive('myDirective', ['$window', function ($window) {
    var directive={};

        directive.link= link;
        directive.scope={custom: "&",small: "&"};
        directive.restrict='A';


     function link(scope, element, attrs){
       console.log(scope)
       console.log($window);
       angular.element($window).bind('resize', function(){

           scope.windowWidth = $window.innerWidth;
           scope.$apply(function () {
              scope.windowWidth = $window.innerWidth;
              scope.windowHeight = $window.innerHeight;

              if(scope.windowWidth>1000){

                scope.custom();
              }
              if(scope.windowWidth<=1000){

                scope.small();
              }


          });
       });
     }
     return directive;
 }]);
