angular.module('sbAdminApp', ["ngJsonExportExcel",
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3'
]).controller("graphReportCtrl", function($scope,$http, Excel,sortify, $timeout)
{
        $scope.excelStyle="dimension_horizontal";

        $scope.oneAtATime = true;
        $scope.month=[  {'_id':0,'name':'January'},
                        {'_id':1,'name':'February'},
                        {'_id':2,'name':'March'},
                        {'_id':3,'name':'April'},
                        {'_id':4,'name':'May'},
                        {'_id':5,'name':'June'}
                        ,{'_id':6,'name':'July'}
                        ,{'_id':7,'name':'August'}
                        ,{'_id':8,'name':'September'}
                        ,{'_id':9,'name':'October'},
                        {'_id':10,'name':'November'},
                        {'_id':11,'name':'December'}
                     ]

    $scope.x = [];
        $scope.mult=[];
        $scope.y = null;
        $scope.graphObject={};
        $scope.limit={}
        $scope.salon={range:'all'};
        $scope.salonType={type:'3'};
        $scope.dimension = [];
        $scope.measure = [];
        $scope.checking=[];
        $scope.graphToShow = [];
        $scope.data = []
        $scope.keys = []
        $scope.keys2 = []
        $scope.dataD = []
        $scope.dates={};
        $scope.range={val:"high"};
        $scope.values = [];
        $scope.finalGraph = [];
        $scope.clonedArray=[];
        $scope.a = 0;
        $scope.multisalonsObject={multisalons:[],
                                    multisalonsFilter:[]};
        $scope.tconst=[];
        $scope.datatable=[]
        $scope.graphLoader = false;
        $scope.temparray=[];
        $scope.mydata = {
            label: "salon",
            value: 'revenue'
        };
        $scope.datalist = [];
        var today = new Date();
        $scope.dates.date = {
            startDate: {
                '_d': new Date(today.getFullYear(), today.getMonth(), 1)
            },
            endDate: {
                '_d': new Date()
            },
        };
    var colors = ['#d50000', '#ff8a80 ', '#c51162','#d500f9 ','#7b1fa2','#e1bee7','#880e4f ','#ab47bc','#2962ff','#82b1ff'
                    ,'#0d47a1','#1e88e5','#2196f3','#90caf9','#e3f2fd','#304ffe','#6200ea','#7e57c2','#004d40','#a5d6a7 ','#dce775'
                    ,'#00c853','#69f0ae','#ff6d00','#ffd180','#e65100','#fdd835','#ff9800','#dd2c00','#424242','#9e9e9e','#a1887f','#90a4ae',
        '#b2ebf2 ','#e1f5fe','#3f51b5','#e91e63','#b39ddb','#26a69a','#ccff90'
    ];
    $scope.check=function(){
            if($scope.salon.range=="all"){
                $scope.limit.top=undefined;
                $scope.limit.bottom=undefined;
                $scope.radioselect();
            }

            else if($scope.salon.range=="bottom "){

                $scope.limit.top=undefined;

                // console.log("salon from bottom");
            }

            else if($scope.salon.range=="top"){
                $scope.limit.bottom=undefined;
            }


        }
        $http.get("/graphs/getParlorList").success(function(data){
            // console.log(data);
            data.forEach(function(element){
                    $scope.multisalonsObject.multisalons.push(element);
                    // $scope.multisalonsFilter.push({id:element.id});
                    // console.log($scope.multisalonsFilter)
            })

            // console.log($scope.multisalonsObject.multisalonsFilter)

        })
        $('body').on('apply.daterangepicker', function(ev, picker) {

           if($scope.x!=null && $scope.y!=null){
               if ($scope.x.length > 0 &&
                   $scope.y.length>0) {
                   $scope.sendData();
               }
           }

        });
        $http.post("/graphs/getDimension").success(function(data) {

                $scope.dataD = data.data[0]
                $scope.dataM = data.data[1]

                for (var key in data.data[0]) {
                    $scope.keys.push(key)
                }
                for (var key in data.data[1]) {
                    $scope.keys2.push(key)
                }
            })
        $scope.idsArray = []
        $scope.sendData = function() {
            if ($scope.dates.date != null) {
                $scope.graphLoader = true
                $scope.y.forEach(function(p, index) {
                    $scope.idsArray.push({
                        id: p.Id,
                        name: p.name
                    })
                })
                $scope.Data = {};
                $scope.Data.data = [];
                $scope.Data.date = {};
                $scope.Data.salonType=$scope.salonType.type;
                $scope.Data.parlor=[];
                // console.log($scope.multisalonsObject.multisalonsFilter);
                if($scope.multisalonsObject.multisalonsFilter.length>0){
                    $scope.multisalonsObject.multisalonsFilter.forEach(function(element){

                        $scope.Data.parlor.push(element.id);
                    })
                }

                else{

                    $scope.multisalonsObject.multisalons.forEach(function(element){
                        $scope.Data.parlor.push(element.id);
                    })
                }



                $scope.Data.date.startDate = $scope.dates.date.startDate._d.toJSON();
                $scope.Data.date.endDate = $scope.dates.date.endDate._d.toJSON();
                var a=[];



                $scope.Data.data = [{data:[],status:0}, {

                    group: 1,
                    Ids: $scope.idsArray
                }]


                if($scope.x.length>1){
                    $scope.Data.data[0].status=1;
                }
                else{
                    $scope.Data.data[0].status=0;
                }

                $scope.x.forEach(function(x){
                    $scope.Data.data[0].data.push(x)
                })
                $http.post('/graphs/graph', $scope.Data).success(function(data) {
                    // console.log(data);
                       $scope.temparray=[];


                    if(data.data!=undefined){
                        $scope.graphToShow = data.data;

                        if (data.data.length > 1) {
                            $scope.graphObject.graph = "MultiBarGraph";
                            $scope.multiBarGraph($scope.graphToShow);

                        } else {
                            $scope.graphLoad();
                        }
                    }

                    else if(data.data==undefined){
                        // console.log(data);
                        $scope.graphToShow = data;
                        $scope.graphObject.graph = "MultiBarGraph";
                        $scope.multiBarGraph($scope.graphToShow);
                    }
                    $scope.graphLoader = false;



                });
                $scope.idsArray = [];
            }
        }
        $scope.onDrop = function($event, $data, array) {
            if ($data.group == 0) {
                if($scope.x==null){
                    $scope.x = [];
                }
                var a=0;
                        if($scope.x.length>0){

                            $scope.x.forEach(function(element){
                                    if(element.name==$data.name){
                                        a=1;
                                    }
                            })
                        }

                    if(a==0&&$scope.x.length<2){
                        $scope.x.push($data);
                    }


                // console.log($scope.x);

            } else {
                if ($scope.y == null) {
                    $scope.y = [];
                }
                if ($scope.y.length == 0) {
                    var a=0;
                    $scope.x.forEach(function(element){
                        if(element.Id==101){
                            a=1;
                        }
                    })

                    if ($data.show == 0 && a== 1) {
                        $scope.y = null;

                    } else if ($scope.x != null||$scope.x.length>0) {
                        $scope.y.push($data);
                        // console.log("hip hip hoorey hip hip hoorey")
                    } else if ($scope.y.length == 0) {
                        $scope.y = null;
                    }



                } else {
                    $scope.done = true
                    $scope.matched = false
                    $scope.y.forEach(function(
                        element, index) {

                        if ($scope.done) {
                            if (element.Id == $data.Id) {
                                $scope.matched =
                                    true

                            } else {
                                if ($scope.matched) {} else {
                                    $scope.matched =
                                        false
                                }

                            }
                        }
                    })
                    if (!$scope.matched) {

                        var a=0;
                        $scope.done = false
                        $scope.x.forEach(function(element){

                            if(element.Id==101){
                                a=1;

                            }


                        })

                        if ($data.show == 0 && a==1) {

                        } else if ($scope.x != null && $scope.x.length<2) {
                            $scope.y.push($data);
                           //  console.log("here is the problem");
                           // console.log( $scope.x.length);
                        }


                    }
                }
            }

           if($scope.x!=null && $scope.y!=null){
               if ($scope.x.length>0 && $scope.y.length>0) {

                   $scope.sendData();
               }

           }



        }
        $scope.pop_obj = function(data, m, index) {
            if (m == 'X') {
                $scope.temparray=[];
                if($scope.x.length==1){
                    $scope.x=null;}
                else{
                    $scope.x.splice(index,1);
                    if($scope.x!=null &&  $scope.y!=null) {
                        if ($scope.x.length > 0 &&
                            $scope.y.length > 0) {
                            $scope.sendData();
                        }

                    }
                }

                $scope.finalGraph = [];
                $scope.datalist = []
                $scope.graphToShow = [];

                if($scope.x!=null &&  $scope.y!=null){

                    if ($scope.x.length > 0 &&
                        $scope.y.length>0) {
                        $scope.sendData();
                    }
                }

                // $scope.y = null;
            } else {
                var a=0;
                if ($scope.y.length == 0) {
                    $scope.y = null;
                    $scope.finalGraph = [];
                    $scope.datalist = []
                    $scope.graphToShow = [];
                    $scope.max = 0;
                    $scope.average = 0;

                }
                else {
                    $scope.y.splice(index,1);
                    $scope.finalGraph = [];
                    $scope.datalist = []
                    $scope.graphToShow = [];
                    $scope.max = 0;
                    $scope.average = 0;
                    if($scope.y!=null && $scope.x!=null){
                        if ($scope.x.length > 0 &&
                            $scope.y.length>0) {
                            $scope.sendData();
                        }
                    }

                }
            }
        }
        $scope.pieChart = function(data) {

            $scope.a = 0
            $scope.finalGraph = [];

            $scope.a = 700;
            data[0].data.forEach(function(element, index) {
                if (element.data.length > 0) {
                    $scope.finalGraph.push({
                        label: element.parlorName,
                        value: element.data[0].revenue
                    });
                }

            })


            $scope.temparray=[];
            $scope.radioselect();
            // console.log($scope.finalGraph)


            if($scope.excelStyle=="dimension_horizontal"){

                $scope.horizontal($scope.finalGraph);
            }
            else{
                $scope.vertical($scope.finalGraph)
            }

            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: $scope.a,
                    x: function(d) {
                        return d.label;
                    },
                    y: function(d) {
                        return d.value;
                    },
                    showLabels: false,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };
            $scope.limitRange();
        }
        $scope.barChart = function(data) {

            $scope.a = 0;
            $scope.dummydata=[];
            $scope.finalGraph = [];
            $scope.a = data[0].data.length * 70;
            if (data[0].data.length < 10) {
                $scope.a = 400;
            }

            data.forEach(function(m) {
                $scope.prepareData = {
                    key: "",
                    values: []
                };
                $scope.prepareData.key = m.name;

                m.data.forEach(function(element, index) {

                    if (element.data.length > 0) {
                        $scope.prepareData.values.push({
                            label: element.parlorName,
                            value: element.data[0].revenue
                        });
                        $scope.dummydata.push({label:element.parlorName,value:element.data[0].revenue})
                    }

                })

                // $scope.datalist.push($scope.finalGraph[0]);
                $scope.finalGraph.push($scope.prepareData);
            });

            if($scope.excelStyle=="dimension_horizontal"){
                $scope.horizontal($scope.dummydata);

            }
            else{
                $scope.vertical($scope.dummydata);
            }

            $scope.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    width: $scope.a,
                    x: function(d) {
                        return d.label;
                    },
                    y: function(d) {
                        return d.value + (1e-10);
                    },
                    showValues: true,
                    valueFormat: function(d) {
                        return d3.format(',.4f')(d);
                    },
                    duration: 500,
                    xAxis: {

                    },
                    yAxis: {
                        axisLabelDistance: -10
                    }
                }
            };
            $scope.temparray=[];
            $scope.radioselect();
            $scope.limitRange();
        }
        $scope.multiBarGraph = function(data) {
            $scope.lastKey = "";
            $scope.pos = 0;
            $scope.changingArray = [];
            $scope.mydata = {
                label: $scope.x[0].name
            };
            $scope.datalist = [];
            $scope.finalGraph = [];
            $scope.m_alength = 0;
            $scope.temp = 0;
            $scope.mydata = {
                label: $scope.x.name
            }
            $scope.showMe={key:'',values:[]};
            $scope.putDat = [];
            $scope.putData = {
                label: ""
            };
            $scope.putDataCopy = [];
            var flag = 0;
            $scope.dataModal={key:"",values:[]};
            if($scope.y.length>0) {


                if (data[0].id == undefined) {

                    if (data[0].key == undefined) {
                        data.forEach(function (element) {
                            $scope.dataModal = {key: "", values: []};
                            $scope.dataModal.key = element._id;
                            $scope.finalGraph.push($scope.dataModal);

                        })
                        // console.log(data);
                        data.forEach(function (element, index) {

                            $scope.multisalonsObject.multisalons.forEach(function (ea) {

                                if (element.data[ea.id] == undefined) {
                                    var values = {label: "", value: 0};
                                    values.label = ea.name;
                                    $scope.finalGraph[index].values.push(values);
                                }

                                else {
                                    var values = {label: "", value: 0};
                                    values.value = Math.ceil(element.data[ea.id].revenue);
                                    values.label = ea.name;
                                    $scope.finalGraph[index].values.push(values);
                                }

                            })


                        })

                        $scope.finalGraph.forEach(function(e,i){
                            e.values.forEach(function(f){
                                var c=0;
                                $scope.finalGraph[i].values.forEach(function(g){
                                    if(f.label==g.label){
                                        c++;
                                        // console.log("first value"+c+" "+f.label);
                                        if(c>1){
                                            g.label=f.label+c.toString();
                                        }

                                    }
                                })
                            })
                        })
                    }

                    else {
                    var max = 0;
                    var pos = 0;
                    data.forEach(function (e, i) {

                        e.key = e.key.toString();
                        $scope.finalGraph.push(e);
                        if(e.values.length>max){
                            max=e.values.length;
                            pos=i;
                        }
                    })
                        // console.log(max);

                        $scope.finalGraph.forEach(function(e){
                        e.values.forEach(function(f){
                            var c=0;
                            e.values.forEach(function(g){
                                // console.log("first value"+ c);
                                if(f.label==g.label){
                                    c++;
                                    // console.log("first value"+ c);
                                    if(c>1){
                                        f.label=f.label+c.toString();
                                    }
                                }
                            })
                        })
                    })

                        $scope.finalGraph.forEach(function(e,j){

                            e.values.forEach(function(m){

                                $scope.finalGraph.forEach(function(h,q){
                                    var a=0;
                                    if(j!=q){
                                        h.values.forEach(function(i){
                                            if(m.label==i.label){
                                                a=1;
                                            }
                                        })

                                        if(a==0){
                                            h.values.push({label:m.label,value:0});
                                        }
                                    }


                                })


                            })

                        })

                    //     $scope.finalGraph.forEach(function (e, i) {
                    //     if(i!=pos){
                    //         if (e.values.length < max) {
                    //             $scope.finalGraph[pos].values.forEach(function (m) {
                    //                 var a = 0;
                    //                 e.values.forEach(function (em) {
                    //                     if (m.label == em.label) {
                    //                         a = 1;
                    //                     }
                    //
                    //                 })
                    //                 if (a == 0) {
                    //                     var c = {label: m.label, value: 0};
                    //                     e.values.push(c);
                    //                 }
                    //
                    //             })
                    //         }
                    //
                    //     }
                    //
                    // })
                        // var a=0;
                        // $scope.finalGraph.forEach(function(e,i){
                        //    if(e.values.length>max){
                        //        max=e.values.length;
                        //        pos=i;
                        //        a=1;
                        //    }
                        // })
                        // if(a>0){
                        //     $scope.finalGraph.forEach(function (e, i) {
                        //         if(i!=pos){
                        //             if (e.values.length < max) {
                        //                 $scope.finalGraph[pos].values.forEach(function (m) {
                        //                     var a = 0;
                        //                     e.values.forEach(function (em) {
                        //                         if (m.label == em.label) {
                        //                             a = 1;
                        //                         }
                        //
                        //                     })
                        //                     if (a == 0) {
                        //                         var c = {label: m.label, value: 0};
                        //                         e.values.push(c);
                        //                     }
                        //
                        //                 })
                        //             }
                        //
                        //         }
                        //
                        //     })
                        // }




                }



                        // $scope.finalGraph.map(function (g) {
                        //     return {
                        //         "key": g.key,
                        //         "values": g.values.sort(function (a, b) {
                        //             var textA = a.label.toUpperCase();
                        //             var textB = b.label.toUpperCase();
                        //             return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        //         })
                        //     }
                        // })

                    $scope.finalGraph.forEach(function (element, index) {
                        $scope.putDat.push(element.key);
                        $scope.putData[$scope.putDat[index]] = "";
                            $scope.mydata[$scope.putDat[index].replace(/[_\W]+/g, "_")] = $scope.putDat[index].replace(/[_\W]+/g, "_");
                            if ($scope.m_alength < element.values.length) {
                                $scope.m_alength = element.values.length;
                                $scope.pos = index;
                                $scope.lastKey = element.key;
                            }
                            element.values.forEach(function (myelement, i) {
                                flag = 0;
                                if (index == 0) {
                                    $scope.changingArray.push(myelement.label);
                                } else {
                                    for (j = 0; j < element.values.length; j++) {
                                        if (myelement.label == $scope.changingArray[j]) {
                                            flag = 1;
                                            break;
                                        } else {
                                        }
                                    }
                                    if (flag == 0) {
                                        $scope.changingArray.push(myelement.label);

                                    }
                                }
                            })
                        })
                    $scope.manageData($scope.finalGraph);
                }
                else {data.forEach(function (f, index) {
                        $scope.showMe = {values: []};
                        $scope.showMe['key'] = angular.copy(f.name);
                    f.data.forEach(function (m, i) {
                            if (m.data.length > 0) {
                                $scope.showMe.values.push({label: m.parlorName, value: m.data[0].revenue})
                            }

                            else{
                                $scope.showMe.values.push({label: m.parlorName, value: 0})
                            }

                        })

                        $scope.finalGraph.push($scope.showMe);
                    })
                    $scope.finalGraph.forEach(function(e,i){
                        e.values.forEach(function(f){
                            var c=0;
                            $scope.finalGraph[i].values.forEach(function(g){
                                if(f.label==g.label){
                                    c++;
                                    // console.log("first value"+c+" "+f.label);
                                    if(c>1){
                                        g.label=f.label+c.toString();
                                    }

                                }
                            })
                        })
                    })
                    var max=0;
                    var pos=0
                    $scope.finalGraph.forEach(function(element,index){

                        if(max<element.values.length){
                            max=element.values.length;
                            pos=index;
                        }
                    })
                    $scope.finalGraph[pos].values.forEach(function(element){
                        $scope.finalGraph.forEach(function(e,i){

                            if(i!=pos){
                                var a=0;
                                e.values.forEach(function(em){
                                    if(em.label==element.label){
                                        a=1;
                                    }
                                })
                                if(a==0){

                                    var val={label:"",value:0};
                                    val.label=element.label;
                                    e.values.push(val);
                                }
                            }



                        })

                    })
                    $scope.finalGraph.forEach(function (element, index) {
                        $scope.putDat.push(element.key);
                        $scope.putData[$scope.putDat[index]] = "";
                        $scope.mydata[$scope.putDat[index].replace(/[_\W]+/g, "_")] = $scope.putDat[index].replace(/[_\W]+/g, "_");
                        if ($scope.m_alength < element.values.length) {
                            $scope.m_alength = element.values.length;
                            $scope.pos = index;
                            $scope.lastKey = element.key;
                        }
                        element.values.forEach(function (myelement, i) {
                            flag = 0;
                            if (index == 0) {
                                $scope.changingArray.push(myelement.label);

                            } else {
                                for (j = 0; j < element.values.length; j++) {
                                    if (myelement.label == $scope.changingArray[j]) {
                                        flag = 1;
                                        break;
                                    } else {
                                    }
                                }
                                if (flag == 0) {
                                    $scope.changingArray.push(myelement.label);

                                }
                            }
                        })
                    })
                    $scope.manageData($scope.finalGraph);
                }
                $scope.a = 0;
                $scope.finalGraph.forEach(function (elements) {
                    $scope.a = elements.values.length + $scope.a;
                })
                if($scope.a<10){
                    $scope.a=500;
                }
                else{
                    $scope.a = $scope.a * 60;
                }
            }
            var a=$scope.finalGraph.length;
            var b=$scope.finalGraph[0].values.length;
            if(a*b<10){
                $scope.a=500;
            }

            else{
                var c=a*b;
                $scope.a=c*70;
            }
            $scope.options = {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    width:$scope.a,
                    showLegend:true,
                    x: function(d) {
                        return d.label;
                    },
                    y: function(d) {
                        return d.value;
                    },
                    color: function(d,i){

                        return ( colors[i % colors.length])
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
                                    var a=$scope.finalGraph.length;
                                    var b=$scope.finalGraph[0].values.length;
                                    var sum=a*b;
                                    var c=b*a;

                                    if(sum>10){

                                        $scope.options.chart.width=c*50;
                                    }
                                    else{
                                        $scope.options.chart.width=400;
                                    }
                                    $scope.options.chart.stacked=false;
                                })
                            }
                            else{

                                $scope.$apply(function(){
                                    var a=$scope.finalGraph[0].values.length;
                                    var b=$scope.finalGraph.length;
                                    var sum=b*a;

                                    if(a>10){
                                        a=a*50;
                                        $scope.options.chart.width=a;

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
            if($scope.finalGraph.length>10){
                $scope.options.chart.showLegend=false;
            }
            $scope.temparray = [];
            $scope.radioselect();
            $scope.limitRange();

        }
        $scope.averageLineGraph = function(data) {
            $scope.options={};
            $scope.datalist = [];
            $scope.mydata = {
                x: $scope.x.name,
                y: $scope.y[0].name
            };
            $scope.sum = 0;
            $scope.dummydata=[];
            $scope.counter = 0;
            $scope.average = 0;
            $scope.max = 0;
            $scope.a = 0;

            $scope.a = data[0].data.length * 60;
            if (data[0].data.length < 10) {
                $scope.a = 400;
            }
            $scope.finalGraph = [];
            data.forEach(function(element, i) {


                $scope.showMe = {
                    key: '',
                    values: []
                };

                $scope.showMe.key = element.name;


                element.data.forEach(function(f, a) {
                    if (f.data.length > 0) {
                        if ($scope.max < f.data[0].revenue) {
                            $scope.max = f.data[0].revenue;
                        }
                        $scope.sum = f.data[0].revenue + $scope.sum;
                        $scope.showMe.values.push({
                            x: f.parlorName,
                            y: f.data[0].revenue
                        });
                        $scope.dummydata.push({label:f.parlorName,value:f.data[0].revenue});
                        $scope.counter++;
                    }
                })
                $scope.finalGraph.push($scope.showMe);

            })
            if($scope.excelStyle=="dimension_horizontal"){

                $scope.horizontal($scope.dummydata);
            }
            else{

                $scope.vertical($scope.dummydata);
            }
            $scope.average = $scope.sum / $scope.counter


            $scope.options = {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    stacked: true,
                    width: $scope.a,
                    showControls: false,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 45,
                        left: 45,
                    },
                    clipEdge: true,
                    duration: 500,
                    xAxis: {},
                    yAxis: {

                        axisLabelDistance: -20,
                        tickFormat: function(d) {
                            return d3.format(',.2f')(d);
                        },
                    },

                },
            };
            $scope.temparray=[];
            $scope.radioselect();
            $scope.limitRange();
        }
        $scope.callback = function(scope) {
            // console.log(scope);
            scope.isReady = false;
            if ($scope.graphObject.graph == "AverageLineBar") {
                // drawing the line
                var svg = d3.select('nvd3').select('svg');
                var chart = scope.chart;
                var api = scope.api;
                var margin = chart.margin();
                var height = chart.height();
                var width = svg.style('width').split('px')[0];
                var yAxes = Math.floor(Math.random() * (chart.yAxis.domain()[1] - 0)) + 0;


                var yScale = d3.scale.linear()
                    .range([0 + margin.top, height - margin.bottom])
                    .domain([0, $scope.max]);
                var lineChartY = yScale($scope.max - $scope.average);
                svg.append('line')
                    .style('stroke', 'red')
                    .style('stroke-width', '2px')
                    .attr('x1', margin.left)
                    .attr('y1', lineChartY)
                    .attr('x2', width - margin.right)
                    .attr('y2', lineChartY);
                var x = [15, 30, 45];
                var y = height - 30;
            }
        }
        $scope.graphLoad = function() {

            if ($scope.graphObject.graph == "DiscreteBarGraph") {

                $scope.finalGraph = [];
                $scope.barChart($scope.graphToShow);
            } else if ($scope.graphObject.graph == "PieChart") {

                $scope.finalGraph = [];
                $scope.pieChart($scope.graphToShow);
            } else if ($scope.graphObject.graph == "MultiBarGraph") {

                $scope.datalist = [];

                $scope.finalGraph = [];

                $scope.multiBarGraph($scope.graphToShow);
            } else if ($scope.graphObject.graph == "AverageLineBar") {
                $scope.datalist = [];
                $scope.finalGraph = [];
                // console.log($scope.graphToShow);
                $scope.averageLineGraph($scope.graphToShow);

                // break ;
            }
            else if ($scope.graphObject.graph == "MultiBarHorizontalChart") {


                $scope.finalGraph = [];
                $scope.multibarHorizontalChart($scope.graphToShow);
            }
            else {
                $scope.multiBarGraph($scope.graphToShow);

                //  $scope.averageLineGraph($scope.graphToShow);
            }
        }
        $scope.multibarHorizontalChart=function(data){
            $scope.lastKey = "";
            $scope.pos = 0;
            $scope.mydata = {
                label: $scope.x[0].name
            };
            $scope.m_alength = 0;
            $scope.temp = 0;
            $scope.putDataCopy = [];
            var flag = 0;
            $scope.changingArray = [];
            $scope.a=0;
            $scope.finalGraph = [];
            $scope.m_alength = 0;
            $scope.temp = 0;
            $scope.putDat = [];
            $scope.putData = {
                label: ""
            };
            $scope.putDataCopy = [];
            var flag = 0;

            if (data[0].id == undefined) {
                if (data[0].key == undefined) {
                    data.forEach(function (element) {
                        $scope.dataModal = {key: "", values: []};
                        $scope.dataModal.key = element._id;
                        $scope.finalGraph.push($scope.dataModal);

                    })

                    data.forEach(function (element, index) {

                        $scope.multisalonsObject.multisalons.forEach(function (ea) {

                            if (element.data[ea.id] == undefined) {
                                var values = {label: "", value: 0};
                                values.label = ea.name;
                                $scope.finalGraph[index].values.push(values);
                            }

                            else {
                                var values = {label: "", value: 0};
                                values.value = Math.ceil(element.data[ea.id].revenue);
                                values.label = ea.name;
                                $scope.finalGraph[index].values.push(values);
                            }

                        })


                    })

                    $scope.finalGraph.forEach(function(e,i){
                        e.values.forEach(function(f){
                            var c=0;
                            $scope.finalGraph[i].values.forEach(function(g){
                                if(f.label==g.label){
                                    c++;
                                    // console.log("first value"+c+" "+f.label);
                                    if(c>1){
                                        g.label=f.label+c.toString();
                                    }

                                }
                            })
                        })
                    })
                }
                else {var max = 0;
                    var pos = 0;
                    data.forEach(function (e, i) {
                        e.key = e.key.toString();
                        $scope.finalGraph.push(e);
                        if (e.values.length > max) {
                            max = e.values.length;
                            pos = i;
                        }
                    })

                    // console.log($scope.finalGraph);

                    $scope.finalGraph.forEach(function(e){
                        e.values.forEach(function(f){
                            var c=0;
                            e.values.forEach(function(g){
                                if(f.label==g.label){
                                    c++;
                                    if(c>1){
                                        f.label=f.label+c.toString();
                                    }
                                }
                            })
                        })
                    })
                    $scope.finalGraph.forEach(function (e, i) {
                        if(i!=pos){
                            if (e.values.length < max) {
                                $scope.finalGraph[pos].values.forEach(function (m) {
                                    var a = 0;
                                    e.values.forEach(function (em) {
                                        if (m.label == em.label) {
                                            a = 1;
                                        }

                                    })
                                    if (a == 0) {
                                        var c = {label: m.label, value: 0};
                                        e.values.push(c);
                                    }

                                })
                            }

                        }

                    })
                    var a=0;
                    $scope.finalGraph.forEach(function(e,i){
                        if(e.values.length>max){
                            max=e.values.length;
                            pos=i;
                            a=1
                        }
                    })
                    if(a>0){
                        $scope.finalGraph.forEach(function (e, i) {
                            if(i!=pos){
                                if (e.values.length < max) {
                                    $scope.finalGraph[pos].values.forEach(function (m) {
                                        var a = 0;
                                        e.values.forEach(function (em) {
                                            if (m.label == em.label) {
                                                a = 1;
                                            }

                                        })
                                        if (a == 0) {
                                            var c = {label: m.label, value: 0};
                                            e.values.push(c);
                                        }

                                    })
                                }

                            }

                        })
                    }


                }
                $scope.finalGraph.map(function (g) {
                    return {
                        "key": g.key,
                        "values": g.values.sort(function (a, b) {
                            var textA = a.label.toUpperCase();
                            var textB = b.label.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        })
                    }
                })
                $scope.finalGraph.forEach(function (element, index) {
                    $scope.putDat.push(element.key);
                    $scope.putData[$scope.putDat[index]] = "";
                    $scope.mydata[$scope.putDat[index].replace(/[_\W]+/g, "_")] = $scope.putDat[index].replace(/[_\W]+/g, "_");
                    if ($scope.m_alength < element.values.length) {
                        $scope.m_alength = element.values.length;
                        $scope.pos = index;
                        $scope.lastKey = element.key;
                    }
                    element.values.forEach(function (myelement, i) {
                        flag = 0;
                        if (index == 0) {
                            $scope.changingArray.push(myelement.label);
                        } else {
                            for (j = 0; j < element.values.length; j++) {
                                if (myelement.label == $scope.changingArray[j]) {
                                    flag = 1;
                                    break;
                                } else {
                                }
                            }
                            if (flag == 0) {
                                $scope.changingArray.push(myelement.label);

                            }
                        }
                    })
                })
                $scope.manageData($scope.finalGraph);
            }

           else{
                data.forEach(function(f, index) {
                    $scope.showMe={values:[]};
                    $scope.showMe['key'] = f.name;
                    f.data.forEach(function(m, i) {
                        if (m.data.length > 0) {
                            $scope.showMe.values.push({ label: m.parlorName,value: m.data[0].revenue})
                        }

                        else{
                            $scope.showMe.values.push({ label: m.parlorName,value: 0})
                        }

                    })

                    $scope.finalGraph.push($scope.showMe);
                })
                var max=0;
                var pos=0;
                $scope.finalGraph.forEach(function(element,index){
                    if(max<element.values.length){
                        max=element.values.length;
                        pos=index;
                    }
                })
                $scope.finalGraph[pos].values.forEach(function(element){
                    $scope.finalGraph.forEach(function(e,i){

                        if(i!=pos){
                            var a=0;
                            e.values.forEach(function(em){
                                if(em.label==element.label){
                                    a=1;
                                }
                            })
                            if(a==0){

                                var val={label:"",value:0};
                                val.label=element.label;
                                e.values.push(val);
                            }
                        }



                    })

                });




                // $scope.finalGraph.map(function(g){
                //     return {
                //
                //         "key":g.key,
                //         "values":g.values.sort(function(a, b) {
                //             console.log(a.label + " "+ b.label);
                //             var textA = a.label;
                //             var textB = b.label;
                //             textA = textA.toUpperCase();
                //             textB = textB.toUpperCase();
                //             return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                //         })
                //     }
                //
                // });
                $scope.finalGraph.forEach(function(element, index) {

                    $scope.putDat.push(element.key);
                    $scope.putData[$scope.putDat[index]] = "";
                    $scope.mydata[$scope.putDat[index].replace(/[_\W]+/g, "_")] = $scope.putDat[index].replace(/[_\W]+/g, "_");
                    if ($scope.m_alength < element.values.length) {
                        $scope.m_alength = element.values.length;
                        $scope.pos = index;
                        $scope.lastKey = element.key;
                    }
                    element.values.forEach(function(myelement, i) {
                        flag=0;
                        if (index == 0) {
                            $scope.changingArray.push(myelement.label);

                        } else {
                            for (j = 0; j < element.values.length; j++) {
                                if (myelement.label == $scope.changingArray[j]) {
                                    flag = 1;
                                    break;
                                } else {}
                            }
                            if (flag == 0) {
                                $scope.changingArray.push(myelement.label);

                            }
                        }
                    })
                });
                $scope.manageData($scope.finalGraph);

            }
            $scope.a=0
            $scope.finalGraph.forEach(function(elements){
                $scope.a=elements.values.length+$scope.a;
            })

            $scope.a=$scope.a*30;
            $scope.options = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    height:$scope.a,
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    showControls: true,
                    showValues: true,
                    duration: 500,
                    showLegend:true,
                    xAxis: {
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Values',
                        tickFormat: function(d){
                            return d3.format(',.2f')(d);
                        }
                    }, color: function(d,i){

                        return ( colors[i % colors.length])
                    }, dispatch:{
                        stateChange:function(e){

                            if(e.stacked){
                                $scope.$apply(function(){
                                    var a=$scope.finalGraph[0].values.length;

                                    if(a>10){
                                        $scope.options.chart.height=a*50;
                                    }
                                    else{
                                        $scope.options.chart.height=400;
                                    }
                                    $scope.options.chart.stacked=true;
                                })
                            }
                            else{
                                $scope.$apply(function(){
                                    var a=$scope.finalGraph.length;
                                    var b=$scope.finalGraph[0].values.length;
                                    var c=b*a;

                                    if(b>10){

                                        $scope.options.chart.height=c*50;
                                    }
                                    else{
                                        $scope.options.chart.height=400;
                                    }
                                    $scope.options.chart.stacked=false;
                                })

                            }


                        }
                    }
                }
            };
            if($scope.finalGraph.length>10){
                $scope.options.chart.showLegend=false;
            }
            $scope.temparray=[];
            $scope.radioselect();
            $scope.limitRange();
        }
        $scope.manageData = function(data) {

            var a = [];
            $scope.data_for_new={}
            $scope.datalist=[];
            $scope.myData={};



            var flag = 0;
            if($scope.excelStyle=="dimension_vertical"){
                $scope.mydata.label=$scope.x[0].name;
                for (h = 0; h < $scope.changingArray.length; h++)
                {
                    $scope.datalist.push
                    ({
                        label: $scope.changingArray[h]
                    });
                }
                for (i = 0; i < data.length; i++)
                {
                    data[i].values.forEach(function(myelement, index)
                    {
                        flag = 0;
                        var a=0;
                        for (j = 0; j < $scope.datalist.length; j++)
                        {
                            var h=0;
                            if ($scope.datalist[j].label == myelement.label)
                            {
                                if( $scope.datalist[j][data[i].key.replace(/[_\W]+/g, "_")]!=undefined)
                                {

                                }
                                else if($scope.datalist[j][data[i].key.replace(/[_\W]+/g, "_")]==undefined) {
                                    $scope.datalist[j][data[i].key.replace(/[_\W]+/g, "_")] = angular.copy(myelement.value.toFixed(2));
                                    h=1;
                                }
                            }

                            if(h==1)
                            {
                                break;
                            }
                        }
                    })
                }



            }

            else{
                $scope.mydata={label:"Measures"};
                $scope.changingArray.forEach(function(element,index)
                {
                    $scope.mydata['value'+index]=element;
                })





                $scope.finalGraph.forEach(function(element,indexi)
                {
                    $scope.data_for_new={};
                    $scope.data_for_new.label=element.key;
                    element.values.forEach(function(element01,index)
                    {
                        $scope.flag=0;
                        $scope.changingArray.forEach(function(element02,i){
                            if(element02==element01.label && $scope.flag !=1 &&$scope.data_for_new['value'+i]==undefined )
                            {

                                $scope.data_for_new['value'+i]=  element01.value.toFixed(2);
                                $scope.flag=1;
                            }
                        })
                    })



                    $scope.datalist.push($scope.data_for_new);

                })

                    $scope.datatable=[];
                        $scope.datalist.forEach(function(element){
                                    $scope.datatable.push(element);
                        })
                    $scope.datalist=[];
                    $scope.datatable.forEach(function(element,index){
                                        // $scope.datalist[index]['value'+index]=element['value'+index];
                                var a={}
                                a['label']=element.label;
                                for(var i=0;i<Object.keys(element).length;i++){
                                    a['value'+i]=element['value'+i];
                                }

                                $scope.datalist.push(a);

                    })

            }


        }
        $scope.horizontal=function(data) {

            $scope.changing = [];
            $scope.mydata = {label: "Measures"};
            $scope.data_for_new = {label: $scope.y[0].name};
            $scope.datalist = [];
            data.forEach(function (element, index) {
                $scope.changing.push("value" + index);
                $scope.data_for_new[$scope.changing[index]] = element.value.toFixed(2);
                $scope.mydata[$scope.changing[index]] = element.label;
            })
            $scope.datalist.push($scope.data_for_new);



        }
        $scope.vertical=function(data){
            // $scope.radioselect();
            $scope.mydata={};
            $scope.datalist=[];

            $scope.mydata={label:$scope.x[0].name,value:$scope.y[0].name};
            data.forEach(function(element){
                element.value=element.value.toFixed(2);
                $scope.datalist.push(element)
            })




        }
        $scope.itemsSelected=function(a){

            if($scope.x!=null && $scope.y.length>0){



                            $scope.sendData();
            }
            else {

            }
        }
        $scope.radioselect=function() {
            if($scope.temparray.length==0){
                $scope.finalGraph.forEach(function(element){
                    $scope.temparray.push(element)
                })
            }
            if($scope.graphObject.graph!='PieChart' && $scope.graphObject.graph!="AverageLineBar") {
                $scope.finalGraph=[];
                if ($scope.range.val == 'high')
                {
                    $scope.temparray=sortify.highToLow($scope.temparray);
                    $scope.temparray.forEach(function(element){
                        $scope.finalGraph.push(element)})
                    if($scope.graphObject.graph!='MultiBarHorizontalChart'){
                                    var  a=0;
                                    var b=0;
                                    var c=0;
                                  a=$scope.finalGraph.length;
                                  b=$scope.finalGraph[0].values.length;
                                  c=a*b;

                                        if(c<10){

                                                if($scope.options!=undefined){

                                                    $scope.options.chart.width=500;
                                                }

                                        }

                                        else{
                                            b=b*a;

                                            if($scope.options!=undefined){
                                                if($scope.options.chart.stacked){
                                                    if(a>10){
                                                        $scope.options.chart.width=a*70;
                                                    }
                                                    else if(b>10){
                                                        $scope.options.chart.width=b*70;
                                                    }

                                                }

                                               else{
                                                    $scope.options.chart.width=b*70;
                                                }

                                            }
                                        }



                                }
                    else{


                                    var  a=0;
                                    var b=0;
                                    var c=0;
                                    a=$scope.finalGraph.length;
                                    b=$scope.finalGraph[0].values.length;
                                    c=a*b;

                                    if(c<10){

                                        if($scope.options!=undefined){

                                            $scope.options.chart.height=500;
                                        }

                                    }

                                    else{
                                        b=b*a;
                                        if($scope.options!=undefined){

                                            if($scope.options.chart.stacked){

                                                if(a>10){
                                                    $scope.options.chart.height=a*30;
                                                }

                                                else if(b>10){
                                                    $scope.options.chart.height=b*30;
                                                }


                                            }
                                            else{
                                                $scope.options.chart.height=b*30;
                                            }

                                        }
                                    }


                                }
                }
                else {
                        $scope.temparray =sortify.lowToHigh($scope.temparray)
                        $scope.temparray.forEach(function(element)
                        {
                            $scope.finalGraph.push(element)
                        })
                            if($scope.graphObject.graph!='MultiBarHorizontalChart'){
                                    var  a=0;
                                    var b=0;
                                    var c=0;
                                    a=$scope.finalGraph.length;
                                    b=$scope.finalGraph[0].values.length;
                                    c=a*b;


                                    if(c<10){

                                        if($scope.options!=undefined){
                                            // console.log("hello");
                                            $scope.options.chart.width=500;
                                        }

                                    }

                                    else {
                                        b = b * a;
                                        if ($scope.options != undefined) {
                                            if ($scope.options.chart.stacked) {

                                                if(a>10){
                                                    $scope.options.chart.width = a * 70;
                                                }

                                                else if(b>10){
                                                    $scope.options.chart.width=b*70;
                                                }

                                            }

                                            else {
                                                $scope.options.chart.width = b * 70;
                                            }
                                        }

                                    }

                                }
                            else{

                                    var  a=0;
                                    var b=0;
                                    var c=0;
                                    a=$scope.finalGraph.length;
                                    b=$scope.finalGraph[0].values.length;;
                                    c=a*b;
                                    if(c<10){

                                        if($scope.options!=undefined){

                                            $scope.options.chart.height=500;
                                        }

                                    }

                                    else{
                                        b=b*a;
                                        if($scope.options!=undefined){

                                            if($scope.options.chart.stacked){
                                                if(a>10){
                                                    $scope.options.chart.height=a*70;
                                                }
                                                else if(b>10){
                                                    $scope.options.chart.height=b*70;
                                                }

                                            }

                                            else{
                                                $scope.options.chart.height=b*30;
                                            }


                                        }
                                    }


                                }
                }
            }

                        else if($scope.graphObject.graph=="PieChart"){
                                    $scope.finalGraph=[]
                                         if ($scope.range.val == 'high') {
                                                $scope.temparray=sortify.piehighToLow($scope.temparray)
                                               // $scope.piehighToLow($scope.temparray);
                                                 $scope.temparray.forEach(function(element){
                                                $scope.finalGraph.push(element)

                                                 })




                            }
                            else {
                                   $scope.temparray=sortify.pielowToHigh($scope.temparray);
                                // $scope.pielowToHigh($scope.temparray)

                                $scope.temparray.forEach(function(element){

                                    $scope.finalGraph.push(element)

                                })

                            }
                        }

                  else{
                                            $scope.finalGraph=[];

                            if ($scope.range.val == 'high') {

                                $scope.temparray=sortify.averagelinehightolow($scope.temparray);
                                // $scope.averagelinehightolow($scope.temparray);
                                $scope.temparray.forEach(function(element) {
                                    $scope.finalGraph.push(element)
                                })

                                var a=0

                                // $scope.options.chart.width=a*b;
                                if($scope.options.chart!=undefined){
                                    if($scope.finalGraph[0].values.length<10){
                                        $scope.options.chart.width=400;

                                    }

                                    else{
                                        a=$scope.finalGraph.length*$scope.finalGraph[0].values.length;
                                        $scope.options.chart.width=a*0;


                                    }

                                }


                            }

                            else{
                                $scope.temparray=sortify.averagelinelowtohigh($scope.temparray)
                                // $scope.averagelinelowtohigh($scope.temparray);
                                $scope.temparray.forEach(function(element) {
                                    $scope.finalGraph.push(element)
                                })

                                if($scope.options.chart.width!=undefined){
                                    if($scope.finalGraph[0].values.length<10){
                                        $scope.options.chart.width=400;

                                    }

                                    else{
                                        a=$scope.finalGraph.length*$scope.finalGraph[0].values.length;
                                        $scope.options.chart.width=a*40;

                                    }

                                }
                            }
                        }
        }
        $scope.limitRange=function() {
            if($scope.temparray.length==0){
                                                $scope.finalGraph.forEach(function(element){
                                                                $scope.temparray.push(element);
                                                            })
                                            }
            if($scope.graphObject.graph!="PieChart" && $scope.graphObject.graph!="AverageLineBar"){
                if($scope.salon.range=="bottom"&&$scope.limit.bottom>0){
                    $scope.temparray=sortify.lowToHigh($scope.temparray);
                    // $scope.lowToHigh($scope.temparray);
                    $scope.finalGraph=[];
                    $scope.temparray.forEach(function(element,index){
                        var a={key:"",values:[]};
                        a.key=element.key;


                        element.values.forEach(function(element00,index0){
                            if(index0<=$scope.limit.bottom-1){
                                a.values.push(element00);
                            }
                        })
                        $scope.finalGraph.push(a);
                    })
                    var a=0;
                    if($scope.graphObject.graph!='MultiBarHorizontalChart'){
                        var  a=0;
                        var b=0;
                        var c=0
                        a=$scope.finalGraph.length;
                        b=$scope.finalGraph[0].values.length;
                        c=a*b;
                        if(c<10){

                            if($scope.options!=undefined){

                                $scope.options.chart.width=500;
                            }

                        }

                        else{
                            b=b*a;
                            if($scope.options!=undefined) {

                                if ($scope.options.chart.stacked) {
                                    $scope.options.chart.width = $scope.finalGraph[0].values.length * 70;
                                }
                                else {$scope.options.chart.width = b * 70;}
                            }
                        }



                    }
                    else{

                        if($scope.options!=undefined){
                            $scope.options.chart.height=500;
                        }

                    }


                }
                else if($scope.salon.range=="top"&&$scope.limit.top>0){
                    $scope.temparray=sortify.highToLow($scope.temparray);
                                                                // $scope.highToLow($scope.temparray);
                    $scope.finalGraph=[];

                    $scope.temparray.forEach(function(element,index){
                        var a={key:"",values:[]};

                        a.key=element.key;
                        element.values.forEach(function(element00,index0){
                            if(index0<=$scope.limit.top-1){
                                a.values.push(element00);
                            }
                        })
                        $scope.finalGraph.push(a);
                    })



                                                                var a=0;
                    if($scope.graphObject.graph!='MultiBarHorizontalChart'){
                        var  a=0;
                        var b=0;
                        var c=0;
                        a=$scope.finalGraph.length;
                        b=$scope.finalGraph[0].values.length;
                        c=a*b;

                        if(c<10){

                            if($scope.options!=undefined){

                                $scope.options.chart.width=500;
                            }

                        }

                        else{
                            b=b*a;
                            if($scope.options!=undefined){
                                if($scope.options.chart.stacked){

                                    // console.log("width  :"+a);
                                    $scope.options.chart.width=$scope.finalGraph[0].values.length*70;
                                }
                                else{
                                    $scope.options.chart.width=b*70;
                                }

                            }
                        }



                    }
                    else{

                        if($scope.options!=undefined){
                            $scope.options.chart.height=500;
                        }

                    }

                    // console.log($scope.finalGraph)
                                                            }
            }


                                                        else if($scope.graphObject.graph=="PieChart"){
                                                        if($scope.salon.range=="bottom"&&$scope.limit.bottom>0){
                                                                $scope.finalGraph=[];
                                                                $scope.temparray=sortify.pielowToHigh($scope.temparray);
                                                                                        // $scope.pielowToHigh($scope.temparray);
                                                                                        $scope.temparray.forEach(function(element,index){

                                                                                            if(index<=$scope.limit.bottom-1){
                                                                                                $scope.finalGraph.push(element);
                                                                                            }
                                                                                        })

                                                            }

                                                            else if($scope.salon.range=="top"&&$scope.limit.top>0){
                                                                $scope.finalGraph=[];
                                                                $scope.temparray=sortify.piehighToLow($scope.temparray);
                                                                // $scope.piehighToLow($scope.temparray);
                                                                $scope.temparray.forEach(function(element,index){

                                                                    if(index<=$scope.limit.top-1){
                                                                        $scope.finalGraph.push(element);
                                                                    }
                                                                })
                                                            }

                                                        }


                                                        else{
                                                            if($scope.salon.range=="bottom"&&$scope.limit.bottom>0){
                                                                $scope.temparray=sortify.averagelinelowtohigh($scope.temparray);
                                                                // $scope.averagelinelowtohigh($scope.temparray);
                                                                $scope.finalGraph=[];

                                                                $scope.temparray.forEach(function(element,index){
                                                                    var a={key:"",values:[]};
                                                                    // console.log($scope.temparray)
                                                                    a.key=element.key;
                                                                    element.values.forEach(function(element00,index0){

                                                                        if(index0<=$scope.limit.bottom-1){

                                                                            a.values.push(element00);
                                                                            // console.log("hello it has started")
                                                                        }
                                                                    })
                                                                    // console.log(a.values);

                                                                    $scope.finalGraph.push(a);
                                                                })
                                                                var a=0;
                                                                if($scope.finalGraph[0].values.length<10){
                                                                    $scope.options.chart.width=600;

                                                                }

                                                                else{
                                                                    a=$scope.finalGraph.length*$scope.finalGraph[0].values.length;
                                                                    $scope.options.chart.width=a*40;

                                                                    // console.log($scope.finalGraph)
                                                                }
                                                                    // console.log($scope.finalGraph)

                                                            }
                                                            else if($scope.salon.range=="top"&&$scope.limit.top>0){
                                                                $scope.finalGraph=[];
                                                                $scope.temparray=sortify.averagelinehightolow($scope.temparray);                                                                // $scope.averagelinehightolow($scope.temparray);
                                                                // console.log($scope.temparray);
                                                                $scope.finalGraph=[];
                                                                // console.log($scope.temparray)
                                                                $scope.temparray.forEach(function(element,index){
                                                                    var a={key:"",values:[]};
                                                                    // console.log($scope.temparray)
                                                                    a.key=element.key;
                                                                    element.values.forEach(function(element00,index0){

                                                                        if(index0<=$scope.limit.top-1){

                                                                            a.values.push(element00);
                                                                        }
                                                                    })
                                                                    $scope.finalGraph.push(a);
                                                                })

                                                                var a=0;
                                                                if($scope.finalGraph[0].values.length<10){
                                                                    $scope.options.chart.width=600;
                                                                    // console.log("ugfhdkdfjgfdk")
                                                                }

                                                                else{
                                                                    a=$scope.finalGraph.length*$scope.finalGraph[0].values.length;
                                                                    $scope.options.chart.width=a*40;

                                                                    // console.log($scope.finalGraph)
                                                                }

                                                            }
                                                        }

        }
})
angular.module('sbAdminApp').service("sortify",function(){
    this.highToLow=function(temp){
        for (i = 0; i < temp[0].values.length; i++) {

            for (j = i + 1; j <temp[0].values.length; j++) {
                var a = {};
                if (temp[0].values[j].value > temp[0].values[i].value) {
                    a = temp[0].values[i];
                    temp[0].values[i] = temp[0].values[j];
                    temp[0].values[j] = a;
                }
            }
        }


        temp[0].values.forEach(function(element,index){
            temp.forEach(function(e,i){

                if(i!=0){

                    temp[i].values.forEach(function(em,m){
                        if(em.label==element.label){
                            var a={};
                            a=temp[i].values[index];
                            temp[i].values[index]=em;
                            temp[i].values[m]=a;

                        }


                    })


                }

            })
        })

        return temp
    }
    this.lowToHigh=function(temp){
        // console.log(temp[0].key);
        for (i = 0; i < temp[0].values.length; i++) {
            for (j = i + 1; j <temp[0].values.length; j++) {
                var a = {};
                if (temp[0].values[j].value < temp[0].values[i].value) {
                    a = temp[0].values[i];
                    // b=temp[0].values[i].label
                    temp[0].values[i] = temp[0].values[j];
                    // temp[0].values[i].label = temp[0].values[j].label;
                    temp[0].values[j] = a;
                }
            }}
        temp[0].values.forEach(function(element,index){
            temp.forEach(function(e,i){
                if(i!=0){
                    temp[i].values.forEach(function(em,m){
                        if(em.label==element.label){
                            var a={};
                            a=temp[i].values[index];
                            temp[i].values[index]=em;
                            temp[i].values[m]=a;
                        }
                    })
                }
            })
        })

        return temp;
    }
    this.piehighToLow=function(temp){
        for (i = 0; i <temp.length; i++) {

            for (j = i + 1; j < temp.length; j++) {

                var a = {};

                if (temp[j].value > temp[i].value) {
                    a = temp[i];
                    temp[i] = temp[j];
                    temp[j] = a;
                }

            }
        }
        return temp
    }
    this.pielowToHigh=function(temp){
        for (i = 0; i <temp.length; i++) {

            for (j = i + 1; j < temp.length; j++) {

                var a = {};

                if (temp[j].value < temp[i].value) {
                    a = temp[i];
                    temp[i] = temp[j];
                    temp[j] = a;
                }

            }
        }

        return temp
    }
    this.averagelinehightolow=function(temp){
        for(i=0;i<temp[0].values.length;i++){
            for(j=i+1;j<temp[0].values.length;j++){
                var a={};
                if(temp[0].values[j].y>temp[0].values[i].y){
                    a=temp[0].values[j];
                    temp[0].values[j]=temp[0].values[i];
                    temp[0].values[i]=a;

                }

            }
        }

        return temp;
    }
    this.averagelinelowtohigh=function(temp){

        for(i=0;i<temp[0].values.length;i++){
            for(j=i+1;j<temp[0].values.length;j++){
                var a={};
                if(temp[0].values[j].y<temp[0].values[i].y){
                    a=temp[0].values[j];
                    temp[0].values[j]=temp[0].values[i];
                    temp[0].values[i]=a;

                }

            }
        }

        return temp
    }
})




