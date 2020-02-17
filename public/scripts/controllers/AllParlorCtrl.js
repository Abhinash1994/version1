'use strict';
/**\
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LeaveController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp',['nvd3','ui.bootstrap','isteven-multi-select','daterangepicker'])
    
  .controller('AllParlorCtrl',['$scope','NgTableParams','$log','$http', function($scope, NgTableParams,$log,$http) {
	  
		$scope.categories=[];
		$scope.graph={
					"x_axis":"appointment",
					"z_axis":"service",
					"condition": "or",
					"op":"count",
					"sort":"asc",
					"heading":"Heading",
					"type":"discreteBarChart"
				};
		$scope.category = 0;
		$scope.date = {
        startDate: null,
        endDate: null
						};
		function get_random_color() {
		var letters = 'ABCDE'.split('');
		var color = '#';
			for (var i=0; i<3; i++ ) {
				color += letters[Math.floor(Math.random() * letters.length)];
			}
			return color;
		};
		$scope.selectedfilters=[];
		$scope.graph.filters=[];
		$scope.service = "";
		$scope.service=services;
		$scope.membership=memberships;
		$scope.employee=employees;
		$scope.mainfilter=[];
		$scope.mainfilter.name="";
		$scope.l1filter=[];
		$scope.graph.filter=[];
		var fcount=0;
		var mfilterValues=[];
		$scope.names="";
		$scope.l1filter.value="";
		$scope.x_values=[{"key":"None","value":""},{"key":"Service","value":"service"},{"key":"Employee","value":"employee"},{"key":"Customer","value":"client"},{"key":"Membership","value":"membership"},{"key":"Date","value":"date"},{"key":"Offer","value":"offer"},{"key":"Branch","value":"branch"}];
		$scope.y_values=[{"key":"Appointment","value":"appointment"},{"key":"Service","value":"service"},{"key":"Product","value":"product"},{"key":"Profit","value":"profit"}];
		$scope.y_op=[{"key":"Count","value":"count"},{"key":"Revenue","value":"revenue"}];
		$scope.z_values=[{"key":"Service","value":"service"},{"key":"Product","value":"product"},{"key":"Employee","value":"employee"},{"key":"Client","value":"client"},{"key":"Membership","value":"membership"},{"key":"Date","value":"date"},{"key":"Offer","value":"offer"},{"key":"Branch","value":"branch"}];
		$scope.mfilters=[{"key":"Service","value":"service"},{"key":"Employee","value":"employee"},{"key":"Customer","value":"client"},{"key":"Membership","value":"membership"},{"key":"Date","value":"date"}];
		$scope.mfilterSelected=function(){
			if($scope.mainfilter.name=="employee" || $scope.mainfilter.name=="client" || $scope.mainfilter.name=="membership"){
				$scope.names=$scope.mainfilter.name+'s';
				$scope.l1filters=eval($scope.names);
			}
			else if($scope.mainfilter.name=="service"){
				$scope.names=$scope.mainfilter.name+'s';
				var s=[];
				var ser=eval($scope.names);
				for(var k=0;k<ser.length;k++){
					s.push({ "name":ser[k].name, "group": true});
					for(var l=0;l<ser[k].services.length;l++){
					console.log("chala");	
					s.push({"name":ser[k].services[l].name});
					}
					s.push({ "group": false});
				}
				$scope.l1filters=s;
				console.log(s);
			}
		};

		$scope.l1filterSelected=function(){
			if($scope.l1filter.value.length || mfilterValues.indexOf($scope.mainfilter.name) > -1){
				console.log($scope.l1filter.value);
			var values=[];
			for(var j=0;j<$scope.l1filter.value.length;j++){
				values[j]=$scope.l1filter.value[j].name;
			};
			console.log(values);
			console.log($scope.mainfilter.name);
			console.log($scope.l1filter.value);
			
			if (mfilterValues.indexOf($scope.mainfilter.name) > -1) {
				var index=mfilterValues.indexOf($scope.mainfilter.name);
				console.log(mfilterValues);
				$scope.graph.filters[index].value=values;
				console.log($scope.graph.filters);
				if($scope.l1filter.value.length==0){
					$scope.graph.filters.splice(index, 1);
					mfilterValues.splice(index, 1);
					fcount--;
				};
				$scope.change();

			} else {
			mfilterValues.push($scope.mainfilter.name);
			var farray={"key":$scope.mainfilter.name,"value":values};
			console.log(farray);
			$scope.graph.filters[fcount]=farray;
			fcount++;
			console.log($scope.graph.filters);
			$scope.change();
			console.log($scope.graph);
			}
			}
		};
		var s=0;
		$scope.filtercancel1=function(s){
			mfilterValues.splice(s, 1);
			$scope.graph.filters.splice(s, 1);
			$scope.change();
			fcount--;
		};
		
		$scope.change=function(){
			if($scope.date.startDate){
				$scope.graph.date = $scope.date;
			}
			console.log($scope.graph);
			$http.post("/role2/chart",$scope.graph).success(function(data){
            $scope.data1 = data;
			console.log(angular.copy($scope.data1));
			
			if($scope.graph.y_axis && $scope.graph.y_axis !=''){
				var arr=[];
				for(var j=0;j<data.data.length;j++)
				{	
					var parts =
						{
						key: data.data[j]._id,
						color: get_random_color(),
						values:data.data[j].data
						};
					console.log(j);
					arr[j]= parts;
					console.log(arr);
					console.log(parts);
					
				}
				console.log(arr);
				$scope.data=arr;
				$scope.options = {
					chart: {
						type: 'multiBarChart',
						height: 450,
						x: function(d){return d._id;},
						y: function(d){return d.data;},
						showControls: true,
						showValues: true,
						duration: 500,
						xAxis: {
							showMaxMin: false
						},
						yAxis: {
							axisLabel: 'Values',
							tickFormat: function(d){
								return d3.format(',')(d);
							}
						}
					}
				};
			}
			else{
				$scope.data = [
				{
                key: "X Axis",
                values:data.data
				}
				];
				$scope.options = {
            chart: {
                type: $scope.graph.type,
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d._id;},
				y: function(d){return d.data;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
            }
			};
			}
			
			
			});
			
		};
		$scope.change();
		
		$scope.graph1={
					"x_axis":"appointment",
					"y_axis":"employee",
					"z_axis":"service",
					"condition": "or",
					"op":"count",
					"sort":"asc",
					"heading":"Heading",
					"type":"discreteBarChart"
				};
		$http.post("/role2/chart",$scope.graph1).success(function(data){
            $scope.data2 = data;
			console.log($scope.data2);			
			});
		
		
  }]);
