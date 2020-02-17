'use strict';
/**
* @ngdoc function
* @name sbAdminApp.controller:MainCtrl
* @description
* # LeaveController
* Controller of the sbAdminApp
*/
angular.module('sbAdminApp',['ngCsv','ngAnimate'])
.controller('appointmentCtrl',['$scope','$http', function($scope, $http, NgTableParams) {
// console.log('appointment controller');
    $scope.female=true;
$scope.showServices=false;
$scope.IsHidden = true;
var progress=0;
var duration   = 500;
$scope.customers = clients;
var screenWidth = window.innerWidth;
$scope.newApp={}
var margin = {left: 20, top: 20, right: 20, bottom: 20},
width = Math.min(screenWidth, 400) - margin.left - margin.right,
height = Math.min(screenWidth, 400) - margin.top - margin.bottom;

var r=height/2;
var arc = d3.svg.arc().outerRadius(r).innerRadius(r - 100);
var image_width = 22;
var image_height = 22;
var colors = d3.scale.ordinal().range(["#00acc1"]);
$scope.services = services;
// console.log("services from backend",$scope.services)
$scope.manipulateData={
                        putData:function(services){
                                            
                                    // console.log(services)    
                        }
}
$scope.phoneNumberChanged = function() {
    $scope.userNotRegisteredFlag = 1;
    $scope.disableNextButton = true;
    var x=0;
    var serviceLength=0;
    if($scope.newApp.services){
         x=($scope.newApp.services.reduce(function (a,b) { return a + b.price; }, 0));
         serviceLength=$scope.newApp.services.length
    }
    $http.post("/role3/customer", { phoneNumber: $scope.newApp.user.phoneNumber,subtotal:Math.ceil(x*1.18),noOfService:serviceLength }).success(function(response, status) {
        var data = response.data;
        // console.log(response.data);
        $scope.userNotRegisteredFlag = response.data;
        $scope.applyMembershipCredits(0);
        if (data) {
            $scope.newApp.user.userId = data.userId;
            $scope.newApp.user.emailId = data.emailId;
            $scope.newApp.user.name = data.name;
            $scope.newApp.user.membership = data.membership;
            $scope.newApp.user.gender = data.gender;
            $scope.newApp.user.advanceCredits = data.advanceCredits;
            $scope.newApp.user.loyalityPoints = data.loyalityPoints;
            $scope.newApp.user.freeServices = data.freeServices;
            $scope.newApp.user.checked = data.checked;
            $scope.newApp.user.customerCrmFlag = data.zeroCompletedAppointments;
            if ($scope.newApp.user.freeServices.length) {
                //freeSer($scope.newApp.user.freeServices)
                //push free services here
                consoe.log("free services",$scope.newApp.user.freeServices);
            };
        } else {
            $scope.newApp.user.userId = null;
            $scope.newApp.user.membershipId = null;
            $scope.newApp.user.membership = [];
            $scope.newApp.user.name = "";
            $scope.newApp.user.customerCrmFlag = true;
            $scope.newApp.user.credits = 0;
            $scope.newApp.user.gender = "M";
        }
        $scope.newApp.otherCharges = 0;
        $scope.newApp.useAdvanceCredits = 0;
    });
    // console.log($scope.newApp.user);
};

$scope.customerNameChanged = function() {
    $scope.customers.forEach(function(customer) {
        if ($scope.newApp.user.name == customer.name) {
            // $scope.newApp.user.membershipName = customer.membership.name;
            $scope.newApp.user.userId = customer.userId;
            // console.log($scope.newApp);
            var x=($scope.newApp.services.reduce(function (a,b) { return a + b.price; }, 0));
            $scope.newApp.user.loyalityPoints = customer.loyalityPoints;
            $scope.newApp.user.phoneNumber = customer.phoneNumber;
            $http.post("/role3/customer", { phoneNumber: $scope.newApp.user.phoneNumber,subtotal:Math.ceil(x*1.18),noOfService:$scope.newApp.services.length }).success(function(response, status) {
                var data = response.data;
                $scope.newApp.user.loyalityPoints = data.loyalityPoints;
                console.log($scope.newApp.user.loyalityPoints);
                $scope.newApp.user.advanceCredits = data.advanceCredits;
                $scope.newApp.user.freeServices = data.freeServices;
                $scope.newApp.user.membership = data.membership;
                if ($scope.newApp.user.freeServices.length) {
                    freeSer($scope.newApp.user.freeServices)
                };
            });

            $scope.newApp.user.gender = customer.gender;
        }
    });
    $scope.newApp.useAdvanceCredits = 0;
}
$scope.applyMembershipCredits = function(value) {
    $scope.newApp.useMembershipCredits = value;

    if (value) {
        $http.post("/role3/newAppointmentMembership", { data: $scope.newApp }).success(function(response, status) {
            var data = response.data;
            // console.log(data);
            $scope.newApp.membershipCreditsLeft = data.creditsLeft;
            $scope.newApp.membershipCreditsUsed = Math.ceil(data.creditsUsed*(1 + $scope.parlorTax/100));
            $scope.membershipDiscount = data.discount;
            $scope.ssubtotal -= (data.creditsUsed + data.discount);
            $scope.stax = $scope.ssubtotal * (1 + $scope.parlorTax/100);
            var am = (data.creditsUsed + data.discount) *(1 + $scope.parlorTax/100);

            $scope.total -= Math.ceil(am);
            $scope.total = Math.ceil($scope.total);
            // console.log($scope.total);

        });
    } else {
        $scope.newApp.membershipCreditsLeft = $scope.newApp.user.credits;
        $scope.newApp.membershipCreditsUsed = 0;
    }
};
// -------------                       chart 1    -----------------------------------------------------
var svg = d3.select("#chart").append("svg")
            .attr("width", (width + margin.left + margin.right))
            .attr("height", (height + margin.top + margin.bottom))
            .attr("class","outerPie")
            .append("g").attr("class", "wrapper")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
var femaleSvg=d3.select("#chart4").append("svg")
            .attr("width", (width + margin.left + margin.right))
            .attr("height", (height + margin.top + margin.bottom))
            .attr("class","outerPies")
            .append("g").attr("class", "wrappers")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
//////////////////////////////////////////////////////////////
///////////////////// Data &  Scales /////////////////////////
//////////////////////////////////////////////////////////////
//Some random data
//Inserting Services Data

$scope.services.forEach(function(element) {
element.value=10;
}, this);
var donutData=$scope.services;
var colorScale = d3.scale.linear()
                    .domain([1,3.5,6])
                    .range(["#f9176d", "#f9176d", "#f9176d"])
                    .interpolate(d3.interpolateHcl);
//Create an arc function

    var arc = d3.svg.arc()
                .innerRadius((width*0.4/2)-18)
                .outerRadius(width*0.4/2 + 40);

//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
var pie = d3.layout.pie()
            .startAngle(-90 * Math.PI/180)
            .endAngle(-90 * Math.PI/180 + 2*Math.PI)
            .value(function(d) { return d.value; })
            .padAngle(.01)
            .sort(null);
// append Image in center
        svg.append("svg:image")
           .attr("xlink:href",function() {return  "/images/female.png" ;})
           .attr("width",100)
           .attr("height",100)
           .attr("x",-1*100/2)
           .attr("y",-1*100/2);

var path=svg.selectAll(".donutArcs")
            .data(pie(donutData))
            .enter().append("path")
            .attr("class", "donutArcs")
            .attr("d", arc)
            .attr("id",function(d,i){return "donutArc"+i;})
            .style("fill", function(d,i) 
                   {
                        return colors(i);
                    })

        path.transition().duration(1000)
                         .attrTween("d", function (d) {
                                                        var start = {startAngle: 0, endAngle: 0};
                                                            var interpolate = d3.interpolate(start, d);
                                                            return function (t) {
                                                                return arc(interpolate(t));
                                                        };
                                            });
            path.on("click", function(d)
        {
  
                        $scope.categoryCircle(d.data.categories);
                        d3.selectAll(".donutArcs").style("fill",function(d,i)
                            {return colors(i);})
                        d3.select(this).style("fill", "#27c0c5");
     })
//Append the label names on the outside
        svg.selectAll(".donutText")
           .data(pie(donutData))
            .enter().append("text")
            .attr("class", "donutText")
//Move the labels below the arcs for those slices with an end angle greater than 90 degrees
            .attr("x",function(d,i){
                        if(i>2)
                        {
                            return 70} 
                        else
                        {return 30}
                    }) 
            .attr("dy",function(d,i){return 20})
            .append("textPath")
            .attr("startOffset",function(d,i){
                        if(i>2)
                    {
                                return "50%"    
                    }
                else{
                        return 50;
                    }
                })
                .style("text-anchor","middle")
                .style('fill', '#fff')
                .attr("xlink:href",function(d,i){return "#donutArc"+i;})
                .text(function(d){return d.data.name;});
            
    
    $scope.categoryCircle=function(cat)
                        {

                            $scope.IsHidden =true;
                                $scope.$apply();
                        var transitionArc= d3.svg.arc().innerRadius((400/2-30)).outerRadius((400/2)-50).startAngle(1.57).endAngle(4.71);
                  
                    var screenWidth = window.innerWidth;
                    var margin = {left:30, top: 30, right: 30, bottom: 30},
                    width = Math.min(screenWidth, 400) - margin.left - margin.right,
                    height = Math.min(screenWidth, 400) - margin.top - margin.bottom;

        if($scope.female){
                  d3.select(".innerPie").remove();
                var svg = d3.select(".outerPie").append("svg")
                    .attr("width", (400 + margin.left + margin.right))
                    .attr("height", (400 + margin.top + margin.bottom))
                    .attr("class","innerPie")
                    .append("g").attr("class", "wrapper")
                    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
           
           
           }
    else{
        
         d3.select(".innerPies").remove();
                var svg = d3.select(".outerPies").append("svg")
                    .attr("width", (400 + margin.left + margin.right))
                    .attr("height", (400 + margin.top + margin.bottom))
                    .attr("class","innerPies")
                    .append("g").attr("class", "wrapper")
                    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
        
        
    }
                        
//////////////////////////////////////////////////////////////
///////////////////// Data &  Scales /////////////////////////
//////////////////////////////////////////////////////////////

//Some random data
//Inserting Services Data
                    $scope.categories = cat;
                    $scope.categories.forEach(function(element) 
                {
                        element.value=10;
                }, this);
    
            var donutData=$scope.categories;
            var colorScale = d3.scale.linear()
                                .domain([1,3.5,6])
                                .range(["#27a7a6", "#27a7a6", "#27a7a6"])
                                .interpolate(d3.interpolateHcl);

    //Create an arc function
                var arc = d3.svg.arc()
                            .innerRadius(width*0.4/2+45)
                            .outerRadius(width*0.4/2 + 134);

//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
            var pie = d3.layout.pie()
                        .startAngle(-90 * Math.PI/180)
                        .endAngle(-90 * Math.PI/180 + 2*Math.PI)
                        .value(function(d) { return d.value; })
                        .padAngle(.01)
                        .sort(null);

// -----------------------------------------          Services                  --------------------------------------------
 
            var path=svg.selectAll(".donutArc")
                        .data(pie(donutData))
                        .enter()
                        .append("path")
                        .attr("id",function(d,i){if(donutData.length==1){  return  "donutArc2"+i}})
                        .attr("class", "donutArc")
                        .attr("d", arc)
                        .style("fill", function(d,i) {
                                if(i === 7) return "#CCCCCC"; //Other
                                else return colorScale(i);
                            })
 
                    path.on("click", function(d) {
                            $scope.subTitles=[];
                            // console.log($scope.services)
                            // console.log(d)
                            $scope.services.forEach(function(s){
                                s.categories.forEach(function(v){
                                    if(v.categoryId==d.data.categoryId){
                                        // console.log(v)
                                        $scope.superCat=s.name
                                        v.services.forEach(function(chksubTitle){
                                            if($scope.subTitles.length==0){
                                                $scope.subTitles.push({subTitles:chksubTitle.subTitle,data:[]})
                                            }else{
                                                var a=true;
                                                $scope.subTitles.forEach(function(checkingTitles){
                                                        if(checkingTitles.subTitles==chksubTitle.subTitle)
                                                             {
                                                                     a=false;  
                                                             }
                                                })
                                                if(a){
                                                      $scope.subTitles.push({subTitles:chksubTitle.subTitle,data:[]})
                                                }
                                            }   
                                         })
                                    }
                                })
                            }) 
                        $scope.services.forEach(function(chkTitle){
                            chkTitle.categories.forEach(function(chktitle2){
                                chktitle2.services.forEach(function(chktitle3){
                                    if(chktitle3.categoryId==d.data.categoryId){
                                        $scope.subTitles.forEach(function(chkTitle4){
                                            var a={}
                                            if(chktitle3.subTitle==chkTitle4.subTitles){
                                                if($scope.female)
                                                {
                                                   if(chktitle3.gender=="F")
                                                    {
                                                        a=Object.assign({},chktitle3);
                                                        delete a.subTitle;
                                                        chkTitle4.data.push(a) 
                                                    }
                                                   
                                                }
                                                 else{
                                                          if(chktitle3.gender=="M")
                                                    {
                                                        a=Object.assign({},chktitle3);
                                                        delete a.subTitle;
                                                        chkTitle4.data.push(a) 
                                                    }
                                                }
                                            }
                                        })   
                                    }
                                })
                            })        
                        })
     
     // console.log($scope.subTitles)
$scope.subCat=d.data.name
d3.selectAll(".donutArc").style("fill",function(d,i)
  {return colorScale(i);})

d3.select(this).style("fill", "#27c0c5");
$scope.IsHidden = false
$scope.serviceBox(d.data.services);
$scope.showServices=true;
     
 
 
 
 
 })
    
         path.each(function(d,i) {
         
         if(donutData.length>1)
            {
                //Search pattern for everything between the start and the first capital L
                                var firstArcSection = /(^.+?)L/; 	
                                    console.log(firstArcSection.exec( d3.select(this).attr("d") ))
                                //Grab everything up to the first Line statement
                    if(donutData.length>1){
                        var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
                    }
                        else{
                             var newArc = firstArcSection.exec( d3.select(this).attr("d"));
                        }
                               
                                //Replace all the comma's so that IE can handle it
                                newArc = newArc.replace(/,/g , " ");
                                
                                //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
                                //flip the end and start position
                                if (d.endAngle > 90 * Math.PI/180) {
                                    var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
                                        middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
                                        endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
                                    //Flip the direction of the arc by switching the start en end point (and sweep flag)
                                    //of those elements that are below the horizontal line
                                    var newStart = endLoc.exec( newArc )[1];
                                    var newEnd = startLoc.exec( newArc )[1];
                                    var middleSec = middleLoc.exec( newArc )[1];
                                    
                                    //Build up the new arc notation, set the sweep-flag to 0
                                    newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
                                }//if
                                
                                //Create a new invisible arc that the text can flow along
                                svg.append("path")
                                    .attr("class", "hiddenDonutArcs")
                                    .attr("id", "donutArc2"+i)
                                    .attr("d", newArc)
                                    .style("fill", "none");
                
                
                
                
            }
                           
     
     });
                        svg.selectAll(".donutText").data(pie(donutData)).enter().append("text").attr("class", "donutText")
                                
            //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
                                .attr("dx",function(d,i){if(donutData.length>1){} else{return 700}})
                                .attr("dy", function(d,i) { if(donutData.length>1){return (d.endAngle > 90 * Math.PI/180 ? -11 :20)}else{return 15;} })
                               .append("textPath")
                                .attr("startOffset",function(){if(donutData.length>1){return "50%";}
                                                                else{return 50; }
                                })
                                .style("text-anchor","middle")
                                .attr("xlink:href",function(d,i){return "#donutArc2"+i;})
                                .text(function(d){return d.data.name;});


            svg.selectAll(".donutImage")
                .data(pie(donutData))
                .enter()
                .append("svg:image")
                .attr("transform", function(d)
            {
                    var x = arc.centroid(d)[0] - 25/2;
                    var y = arc.centroid(d)[1] - 25/2;
                    if(donutData.length==1)
                {
                            x=-14.99999;
                            y=-202;
                }
//                    else if(d.data.name=="Hair Color"){
//                            y=135;
//                        }

                    return "translate(" + x + "," + y + ")";
            }).attr("xlink:href",function(d) { console.log(d); return d.data.femaleImage})
              .attr("width", 40)
              .attr("height",40);

    }
  
    
    
    
    
//----------------------------------      Male Chart Start ----------------------------------------------
    
     femaleSvg.append("svg:image")
           .attr("xlink:href",function() {return "/images/men.png" ;})
           .attr("width",180)
           .attr("height",180)
           .attr("x",-1*180/2)
           .attr("y",-1*180/2);
    var paths=femaleSvg.selectAll(".donutArc")
                      .data(pie(donutData))
                      .enter().append("path")
                      .attr("class", "donutArc")
                      .attr("d", arc)
                     .attr("id",function(d,i){return "donutArcs00"+i;})
                      .style("fill", function(d,i) 
                   {
//                    if(i === 7) return "#CCCCCC"; //Other
                        return colors(i);
                    })
            femaleSvg.selectAll(".donutTexts")
                     .data(pie(donutData))
                     .enter().append("text")
                     .attr("class", "donutTexts")
//Move the labels below the arcs for those slices with an end angle greater than 90 degrees
                     .attr("x",function(d,i){
                                                if(i>2)
                                            {
                                                    return 70         
                                            } 
                                                else
                                            {
                                                return 30
                                            }
                    }) 
            .attr("dy",function(d,i){return 20})
            .append("textPath")
            .attr("startOffset",function(d,i){
                        if(i>2)
                    {
                                return "50%"
                    }
                else{
                        return 50;
                    }
                })
                .style("text-anchor","middle")
                .style('fill', '#fff')
                .attr("xlink:href",function(d,i){return "#donutArcs00"+i;})
                .text(function(d){return d.data.name;});
            

                paths.transition().duration(1000)
                     .attrTween("d", function (d) 
                {
                        var start = {startAngle: 0, endAngle: 0};
                        var interpolate = d3.interpolate(start, d);
                                return function (t) 
                                {
                                        return arc(interpolate(t));
                                };
                });
        paths.on("click",function(d,i)
        {
                        $scope.myCircle(d.data.categories);
                        d3.selectAll(".donutArc").style("fill",function(d,i)
                            {return colors(i);})
                        d3.select(this).style("fill", "#27c0c5");              
        })
    
        $scope.myCircle=function(cat)
    {
                 
                  $scope.IsHidden =true;
                    $scope.$apply();
                    var transitionArc= d3.svg.arc().innerRadius((300/2-40)).outerRadius((300/2)-50).startAngle(1.57).endAngle(4.71);
                    d3.select(".innerPies").remove();
                    var screenWidth = window.innerWidth;
                    var margin = {left: 30, top: 30, right: 30, bottom: 30},
                    width = Math.min(screenWidth, 400) - margin.left - margin.right,
                    height = Math.min(screenWidth, 400) - margin.top - margin.bottom;
            
            var svg = d3.select(".outerPies").append("svg")
                    .attr("width", (400 + margin.left + margin.right))
                    .attr("height", (400 + margin.top + margin.bottom))
                    .attr("class","innerPies")
                    .append("g").attr("class", "wrappers")
                    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
//////////////////////////////////////////////////////////////
///////////////////// Data &  Scales /////////////////////////
//////////////////////////////////////////////////////////////

//Some random data
//Inserting Services Data
                    $scope.categories = cat;
                    $scope.categories.forEach(function(element) 
                {
                        element.value=10;
                }, this);
    
            var donutData=$scope.categories;
            var colorScale = d3.scale.linear()
                                .domain([1,3.5,6])
                                .range(["#27a7a6", "#27a7a6", "#27a7a6"])
                                .interpolate(d3.interpolateHcl);

    //Create an arc function
                var arc = d3.svg.arc()
                            .innerRadius(width*0.4/2+45)
                            .outerRadius(width*0.4/2 + 134);

//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
            var pie = d3.layout.pie()
                        .startAngle(-90 * Math.PI/180)
                        .endAngle(-90 * Math.PI/180 + 2*Math.PI)
                        .value(function(d) { return d.value; })
                        .padAngle(.01)
                        .sort(null);

// -----------------------------------------          Services                  --------------------------------------------
 
            var path=svg.selectAll(".donutArcs01")
                        .data(pie(donutData))
                        .enter()
                        .append("path")
                        .attr("id",function(d,i){if(donutData.length==1){  return  "donutArc40"+i}})
                        .attr("class", "donutArcs01")
                        .attr("d", arc)
                        .style("fill", function(d,i) {
                                if(i === 7) return "#CCCCCC"; //Other
                                else return colorScale(i);
                            })
 
                    path.on("click", function(d) 
                    {
                                        $scope.subTitles=[];
                                        // console.log($scope.services)
                                        // console.log(d)
                                        $scope.services.forEach(function(s)
                        {
                                                s.categories.forEach(function(v){
                                                if(v.categoryId==d.data.categoryId){
                                                        console.log(v)
                                                        $scope.superCat=s.name
                                                        v.services.forEach(function(chksubTitle){
                                                            if($scope.subTitles.length==0)
                                                        {
                                                            $scope.subTitles.push({subTitles:chksubTitle.subTitle,data:[]})
                                                        }
                            else{
                                    var a=true;
                                    $scope.subTitles.forEach(function(checkingTitles){
                                            if(checkingTitles.subTitles==chksubTitle.subTitle)
                                    {
                                            a=false;  
                                    }
                                })
                                if(a){
                                      $scope.subTitles.push({subTitles:chksubTitle.subTitle,data:[]})
                                }
                        }   
                    })
                }
            })
    }) 
                        $scope.services.forEach(function(chkTitle)
            {
                            chkTitle.categories.forEach(function(chktitle2){
                                chktitle2.services.forEach(function(chktitle3){
                                    if(chktitle3.categoryId==d.data.categoryId)
                                    {
                                                $scope.subTitles.forEach(function(chkTitle4){
                                                    var a={}
                                                    if(chktitle3.subTitle==chkTitle4.subTitles)
                                                        {
                                                            if(chktitle3.gender=="M"){
                                                                a=Object.assign({},chktitle3);
                                                            delete a.subTitle;
                                                            
                                                            chkTitle4.data.push(a) 
                                                                
                                                            }
                                                           
                                                        }
                                                })   
                                    }
                                })
                            })        
            })
     
     // console.log($scope.subTitles)
$scope.subCat=d.data.name
d3.selectAll(".donutArcs01").style("fill",function(d,i)
  {return colorScale(i);})

d3.select(this).style("fill", "#27c0c5");
$scope.IsHidden = false
$scope.serviceBox(d.data.services);
$scope.showServices=true;
     
 
 
 
 
 })
    
                    path.each(function(d,i) 
            {
         
         if(donutData.length>1)
            {
                //Search pattern for everything between the start and the first capital L
                                var firstArcSection = /(^.+?)L/; 	
                                    console.log(firstArcSection.exec( d3.select(this).attr("d") ))
                                //Grab everything up to the first Line statement
                    if(donutData.length>1){
                        var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
                    }
                        else{
                             var newArc = firstArcSection.exec( d3.select(this).attr("d"));
                        }
                               
                                //Replace all the comma's so that IE can handle it
                                newArc = newArc.replace(/,/g , " ");
                                
                                //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
                                //flip the end and start position
                                if (d.endAngle > 90 * Math.PI/180) {
                                    var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
                                        middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
                                        endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
                                    //Flip the direction of the arc by switching the start en end point (and sweep flag)
                                    //of those elements that are below the horizontal line
                                    var newStart = endLoc.exec( newArc )[1];
                                    var newEnd = startLoc.exec( newArc )[1];
                                    var middleSec = middleLoc.exec( newArc )[1];
                                    
                                    //Build up the new arc notation, set the sweep-flag to 0
                                    newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
                                }//if
                                
                                //Create a new invisible arc that the text can flow along
                                svg.append("path")
                                    .attr("class", "hiddenDonutArcs0")
                                    .attr("id", "donutArc40"+i)
                                    .attr("d", newArc)
                                    .style("fill", "none");
                
                
                
                
            }
                           
     
     });


                            svg.selectAll(".donutTexts")
                               .data(pie(donutData))
                               .enter().append("text")
                               .attr("class", "donutTexts")
                                
            //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
                                .attr("dx",function(d,i){if(donutData.length>1){} else{return 756}})
                                .attr("dy", function(d,i) { if(donutData.length>1){return (d.endAngle > 90 * Math.PI/180 ? -11 :20)}else{return 13;} })
                               .append("textPath")
                                .attr("startOffset",function(){if(donutData.length>1){return "50%";}
                                                                else{return 50; }
                                })
                                .style("text-anchor","middle")
                                .attr("xlink:href",function(d,i){return "#donutArc40"+i;})
                                .text(function(d){return d.data.name;});


            svg.selectAll(".donutImage")
                .data(pie(donutData))
                .enter()
                .append("svg:image")
                .attr("transform", function(d)
            {
                    var x = arc.centroid(d)[0] - 25/2;
                    var y = arc.centroid(d)[1] - 25/2;
                    if(donutData.length==1)
                {
                            x=-14.99999;
                            y=-200;
                }
//                    else if(d.data.name=="Hair Color"){
//                            y=135;
//                        }

                    return "translate(" + x + "," + y + ")";
            }).attr("xlink:href",function(d) { console.log(d); return d.data.maleImage})
              .attr("width", 40)
              .attr("height",40);

        
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
//    -------------------------------------  Male Chart End -------------------------------------------------
  //   toggle    show male or female  
    
    
        $scope.toggle=function()
    {
            
            if($scope.subTitles!=undefined){
                if($scope.subTitles.length>0){
                                    $scope.IsHidden=!$scope.IsHidden;
                        }
                    
            }
               
                 
         
                    
        
        
        
    }
    
//    ----------------------
            $scope.serviceBox=function(ser)
        {
                 
                  $scope.brandsprice=ser;
                  $scope.price=$scope.brandsprice;
                  // console.log($scope.price);
                  $scope.$apply(function () 
                {

                          $scope.childServices=ser;
                          // console.log($scope.childServices);
                });

        }

//Add item in card
$scope.newname2=[];
$scope.addField = function(i) 
{

            $scope.services=services
            // console.log("this is a console",$scope.services);
            // console.log("service",$scope.services);
            $scope.cat12= $scope.childServices[i]
        
            // console.log("cat12",$scope.cat12)
            // console.log("new svc",$scope.services)
            // console.log("cat12",$scope.cat12.name)
            $scope.newname=$scope.cat12.name;
            $scope.newname2.push($scope.cat12.name)
            $scope.manipulateData.putData($scope.cat12);
            // console.log($scope.newname2)
}

$scope.remove=function($index,i){
// console.log("this is click");
$scope.newname2.splice($index,1);
}



// -----------------------------------------------------------------------------------------------

var donutDatas=angular.copy($scope.services)                            // chart 2

var width01 = 270,
height01 = 270,
radius = Math.min(width01, height01) / 2;





var arcs = d3.svg.arc()
.innerRadius(radius - 80)
.outerRadius(radius - 20);

var svg1 = d3.select("#chart2").append("svg")
.attr("width", width01)
.attr("height", height01)
.append("g")
.attr("transform", "translate(" + width01 / 2 + "," + height01 / 2 + ")")


var path = svg1.selectAll("path")
.data(pie(donutDatas))
.enter().append("path")
.attr("id",function(d,i){return "males"+i;})
.attr("fill", function(d, i) {
return colors(i);
})
.attr("d", arcs)

svg1.selectAll("path").transition()
.duration(2000)
.delay(500)
.attrTween("x", function (d, i, a) {
// console.log(a); // returns 60, the value of "x" at the start
return d3.interpolate(a, 400)
});


svg1.selectAll(".maleDonuts")
    .data(pie(donutDatas)).enter().append("text").attr("class","maleDonuts")
    .attr("dy", function(d,i) { return 15 })
    .attr("x",24)
    .append("textPath")
    .attr("startOffset",50)
    .style("text-anchor","middle")
    .style('fill', '#fff')
    .attr("xlink:href",function(d,i){return "#males"+i;})
    .text(function(d){return d.data.name;});
svg1.append("svg:image")
    .attr("xlink:href",function() {return  "/images/men.png" ;})
    .attr("width",150)
    .attr("height",150)
    .attr("x",-1*150/2)
    .attr("y",-1*150/2);

    //    -----------------------------------------   chart 3 -------------------------------------------
    var donutDataforSymbol=angular.copy($scope.services)                            // chart 2
    var width01 = 270,
        height01 = 270,
        radius = Math.min(width01, height01) / 2;

    var arcs = d3.svg.arc()
                .innerRadius(radius - 80)
                .outerRadius(radius - 20);

        var svg2 = d3.select("#chart3").append("svg")
                    .attr("width", width01)
                    .attr("height", height01)
                    .append("g")
                    .attr("transform", "translate(" + width01 / 2 + "," + height01 / 2 + ")")


        var path = svg2.selectAll("path")
                        .data(pie(donutDatas))
                        .enter().append("path")
                        .attr("id",function(d,i){return "males"+i;})
                        .attr("fill", function(d, i) {
                                            return colors(i);
                        }).attr("d", arcs)

                svg2.selectAll("path").transition()
                    .duration(2000)
                    .delay(500)
                    .attrTween("x", function (d, i, a) {
                        // console.log(a); // returns 60, the value of "x" at the start
                        return d3.interpolate(a, 400)
                });

            svg2.selectAll(".maleDonuts")
                .data(pie(donutDatas)).enter().append("text").attr("class","maleDonuts")
                .attr("dy", function(d,i) { return 15 })
                .attr("x",24)
                .append("textPath")
                .attr("startOffset",50)
                .style("text-anchor","middle")
                .style('fill', '#fff')
                .attr("xlink:href",function(d,i){return "#males"+i;})
                .text(function(d){return d.data.name;});

            svg2.append("svg:image")
                .attr("xlink:href",function() {return  "/images/female.png" ;})
                .attr("width",150)
                .attr("height",150)
                .attr("x",-1*150/2)
                .attr("y",-1*150/2);
    
    
}]).directive('addToCartButton', function() 
{
        function link(scope, element, attributes) {
//    element.on('click', function(event){
//        
//        console.log(event)
//        var cart=angular.element(document.getElementsByClassName("mkn"))
//        var cart0=angular.element(document.getElementsByClassName("klm"))
//       var e=cart0.prop("offsetLeft")
//        var c=cart.prop("offsetLeft");
//        var l=cart.prop("offsetWidth")
////        c=(c+l)/2;
//        var d=cart.prop("offsetTop")
//        console.log(e)
//        
//      var cartElem = angular.element(document.getElementsByClassName("shopping-cart"));
//      console.log(cartElem);
//      var offsetTopCart = cartElem.prop('offsetTop');
//      var offsetLeftCart = cartElem.prop('offsetLeft');
//      var widthCart = cartElem.prop('offsetWidth');
//      var heightCart = cartElem.prop('offsetHeight');
//      var imgElem = angular.element(event.target.parentNode.parentNode.childNodes[1]);
//      var parentElem = angular.element(event.target.parentNode.parentNode);
//var parentElem0=angular.element(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
//        console.log(parentElem0)
//      var offsetLeft = imgElem.prop("offsetLeft");
//      var offsetTop = imgElem.prop("offsetTop");
//      var imgSrc = imgElem.prop("currentSrc");
//        console.log(offsetTop);
//        // var h=-220;
//        if(offsetTop==5)
//        {
//            var j=25;
//            var d=0
//                d=parseInt(scope.index);
//                d=d+1
//            var s=(d*j)
//                if(d>2)
//                {
//                    s=s+(d*13);
//                }
////            var e=68*d;
////            console.log(d)
////            console.log(e)
////            offsetTop=206+5+e+1;
//            offsetLeft=-200;
//            h=-490-s
//           c=c-200
//        
//        }
//        offsetTop=event.pageY-15;
//        offsetLeft=event.pageX-270;
//        
//        console.log(offsetLeftCart)
//      console.log(offsetLeft + ' ' + offsetTop + ' ' + imgSrc);
//      var imgClone = angular.element('<p>'+scope.data+'</p>');
//      imgClone.css({
//        'height': '550px',
//        'position': 'absolute',
//        'top': offsetTop + 'px',
//        'left': offsetLeft + 'px',
//        'opacity': 0.5,
//        'z-index':109
//      });
//      imgClone.addClass('itemaddedanimate');
//      parentElem0.append(imgClone);
//      setTimeout(function () {
//        imgClone.css({
//          'height': '75px',
//          'top': 291+ 'px',
//          'left':1320+'px',
//          'opacity': 0.5
//        });
//      }, 1000);
//      setTimeout(function () {
//        imgClone.css({
//          'height': 0,
//          'opacity': 0.5
//          
//        });
//        cartElem.addClass('shakeit');
//      }, 1800);
//      setTimeout(function () {
//        cartElem.removeClass('shakeit');
//        imgClone.remove();
//      }, 2500);
//    });
  };


  return {
    restrict: 'E',
    link: link,
    transclude: true,
    replace: true,
    scope: {data:'@data',index:'@index',run:'&' ,val:'@val'},
    template: '<button class="add-to-cart" ng-transclude>{{val}}</button>'
  };
  });