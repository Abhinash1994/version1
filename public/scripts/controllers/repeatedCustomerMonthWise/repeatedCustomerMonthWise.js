angular.module('sbAdminApp',['nvd3']).controller('repeatedCustomerCtrl',function(Excel,$scope,$http,$timeout){

    $scope.tableData=[];

$http.post('/role1/report/repeatCustomerPattern').success(function(res){
			// console.log(res);
			$scope.data=res;
			var max=0;
			var pos=0;
			$scope.parentLength=$scope.data.length;
			$scope.childLength=0;
			$scope.temp=0;
			$scope.data.forEach(function(a,i)
		{
            if(max<a.values.length)
                        {
									max=a.values.length;
									pos=i;
                        }

        })
				$scope.data[pos].values.forEach(function(a){
				$scope.data.forEach(function(c){
					if(max>c.values.length){
						var flag=0;
						c.values.forEach(function(h){
							if(a.label==h.label){
								flag=1
							}			
							})
								if(flag==0){
									c.values.push({label:a.label,value:0})
								}
					}
				})
			})

              

                for(a=0;a<$scope.data[0].values.length;a++){
                         for(c=a+1;c<$scope.data[0].values.length;c++){
                                    if($scope.data[0].values[c].value>$scope.data[0].values[a].value)
                                    {
                                        var b={};
                                        b=$scope.data[0].values[a];
                                        $scope.data[0].values[a]=$scope.data[0].values[c];
                                        $scope.data[0].values[c]=b;
                                      //  console.log(   $scope.data[0].values[c]);
                                    }
                                }


                }

                    // console.log($scope.data);

                $scope.data[0].values.forEach(function(a,m){
                        $scope.data.forEach(function(h,i){
                                if(i!=0){
                                  h.values.forEach(function(b,d){
                                                if(a.label==b.label){
                                                        var temp=$scope.data[i].values[m];
                                                        $scope.data[i].values[m]=$scope.data[i].values[d];
                                                        $scope.data[i].values[d]=temp;
                                                }
                                     })  
                                }
                                
                        })

                })

                 




									$scope.temp=($scope.data[0].values.lenght*$scope.parent)*30;

				
	$scope.options = {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    width:$scope.temp,
                    showLegend:true,
                    x: function(d) {
                        return d.label;
                    },
                    y: function(d) {
                        return d.value;
                    },
                    showControls: true,
                    showValues: true,
                    duration: 500,
                    xAxis: {
                        showMaxMin: false
                    },

                    yAxis: {

                        tickFormat: function(d) {
                            return d3.format(',.2f')(d);
                        }
                    } ,
                    stacked:false,
                    dispatch:{
                        stateChange:function(e){

                            if(! e.stacked){
                                $scope.$apply(function(){
                                    var a=$scope.data.length;
                                    var b=$scope.data[0].values.length;
                                    var sum=a*b;
                                    var c=b*a;

                                    if(sum>10){

                                        $scope.options.chart.width=c*30;
                                    }
                                    else{
                                        $scope.options.chart.width=400;
                                    }
                                    $scope.options.chart.stacked=false;
                                })
                            }
                            else{

                                $scope.$apply(function(){
                                    var a=$scope.data[0].values.length;
                                    var b=$scope.data.length;
                                    var sum=b*a;

                                    if(a>10){
                                        a=a*50;
                                        $scope.options.chart.width=a;
                                         $scope.options.chart.height=450;

                                    }
                                    else{

                                        $scope.options.chart.width=400;
                                    }
                                        $scope.options.chart.stacked=true;

                                })



                            }


                        }
                    }
                }
            };
			
	})

  $scope.exportToExcel = function (tableId) { // ex: '#my-table'

            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }




     

})