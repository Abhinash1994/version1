angular.module('sbAdminApp')
    .directive('lineGraph', ['$log',function($log){

        return {
            restrict : 'E',
            scope : {
                dataset : '=',
                minval : '@',
                maxval : '@',
                xlabel : '@',
                ylabel : '@'
            },
            templateUrl : "scripts/directives/graph/line-graph.html",
            link : function(scope, element, attrs){
                scope.minval *= 1;
                scope.maxval *= 1;

                var tickValues = [];

                function pad(){
                    var extraPadding = parseInt((scope.maxval - scope.minval)/10);
                    $log.debug(extraPadding);
                    $log.debug([scope.minval - extraPadding, scope.maxval + extraPadding]);
                    return [scope.minval - extraPadding, scope.maxval + extraPadding];
                }

                function pushData() {
                    var data = [];

                    //Data is represented as an array of {x,y} pairs.
                    for (var i = 0; i < scope.dataset.length; i++) {
                        data.push({
                            x: getDate(scope.dataset[i].month),
                            y: scope.dataset[i].sales
                        });
                    }

                    //Line chart data should be sent as an array of series objects.
                    return [
                        {
                            values: data,      //values - represents the array of {x,y} data points
                            key: scope.xlabel, //key  - the name of the series.
                            color: '#ff7f0e',  //color - optional: choose your own line color.
                            area: false
                        }
                    ];
                }

                function getDate(date){
                    var strDate = new String(date);

                    var year = strDate.substr(0,4);
                    var month = strDate.substr(4,2)-1; //zero based index
                    var day = strDate.substr(6,2);

                    tickValues.push(new Date(year, month, day));
                    return new Date(year, month, day);
                }

                scope.options = {
                    "chart" : {
                        "type" : "lineChart",
                        "height" : 500,
                        "margin" : {
                            "top" : 100,
                            "right" : 50,
                            "bottom" : 50,
                            "left" : 50
                        },
                        "useInteractiveGuideline" : true,
                        "dispatch" : {},
                        "xAxis" : {
                            "axisLabel" : scope.xlabel,
                            "axisLabelDistance" : 0,
                            "tickValues" : tickValues,
                            "tickFormat" : function (d) {
                                return d3.time.format("%b")(new Date(d));
                            }
                        },
                        "yAxis": {
                            "axisLabel" : scope.ylabel,
                            "axisLabelDistance" : -20
                        },
                        "yDomain" : pad()
                    }
                };
                scope.data = pushData();
            }
        }

    }]);