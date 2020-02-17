angular.module("sbAdminApp",["daterangepicker"])
        .controller("employeeAnalysisCtrl",function($scope,$http,Excel,$timeout){
                        $scope.parlor={}
                                $http.get("/beuApp/getParlors")
                                    .success(function(res){
                                                console.log(res);
                                                $scope.parlors=res.data;
                                    })
            $scope.exportToExcel = function (tableId) { // ex: '#my-table'
                var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
                $timeout(function () {
                    location.href = exportHref;
                }, 100); // trigger download
            }
            $scope.dates={}
            $scope.dates.date = {
                startDate: {
                    '_d': new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                },
                endDate: {
                    '_d': new Date()
                },
            };

            $('body').on('apply.daterangepicker', function(ev, picker) {

                            if($scope.parlor.selectedParlor!=undefined && $scope.parlor.selectedParlor!='')
                            {
                                $scope.changeOnDropDown()
                            }



            });

            $scope.changeOnDropDown=function(){
            $scope.employeeData=[];
                $('#selector').fixedHeaderTable('destroy');
                    $http.post("/beuApp/employeeAnalysis",{parlorId:$scope.parlor.selectedParlor,startDate:$scope.dates.date.startDate,endDate:$scope.dates.date.endDate})
                        .success(function(res){
                            console.log(res)
                            $scope.customStartDate=new Date($scope.dates.date.startDate)
                            $scope.customEndDate=new Date($scope.dates.date.endDate)
                            $scope.employeeData=res;
                            $scope.employeeData=$scope.employeeData.map(function(data){
                                data.analysis01=[];
                                    for(var a in data.analysis)
                                    {
                                        if(data.analysis[a]==null)
                                        {
                                            var c=a.indexOf('/');
                                            var week=a.substring(0,c);
                                            var year=a.substring(c+1,a.length);
                                            var startDate=getDateOfWeek(parseInt(week),parseInt(year));
                                            var endDate=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+6);
                                            var b={weekname:a,services:[],startDate:startDate,endDate:endDate};
                                        }
                                        else{
                                            var c=a.indexOf('/');
                                            var week=a.substring(0,c);
                                            var year=a.substring(c+1,a.length);
                                            var startDate=getDateOfWeek(parseInt(week),parseInt(year));
                                            var endDate=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+6);
                                            var b={weekName:a,services:data.analysis[a],startDate:startDate,endDate:endDate}
                                        }

                                        data.analysis01.push(b);

                                    }
                                return data
                            })
                            console.log($scope.employeeData)

                            $scope.compare();

                            $timeout(
                                function() {

                                    $('#selector').fixedHeaderTable();
                                    var myTable = document.getElementById('firstRowFirstCell');
                                    console.log(document.getElementById('firstRowSecondCell').offsetHeight)
                                    document.getElementById('firstRowFirstCell').style.height = document.getElementById('firstRowSecondCell').offsetHeight + 'px';
                                    // document.getElementById('firstRowZeroCell').style.height = document.getElementById('firstRowSecondCell').offsetHeight + 'px';
                                    console.log(document.getElementsByClassName("fht-cell"));
                                    var a = document.getElementsByClassName("fht-cell");
                                    var mid = (a.length - 2) / 2
                                    for (var i = 2; i <= mid; i++) {
                                        a[i].clientWidth = a[i + mid].clientWidth;
                                        a[i].offsetWidth = a[i + mid].clientWidth;
                                        a[i].scrollWidth = a[i + mid].clientWidth;
                                        a[i].style.width = a[i + mid].clientWidth + 'px';
                                    }
                                })

                        })
            }

            $scope.compare=function(){
                    $scope.employeeData=$scope.employeeData.map(function(data,index){
                        var b=0;
                        var flag=true;
                        console.log(index);
                        if(index==0)
                        {
                           b=data.analysis01[index].services.length
                        }

                        data.analysis01.forEach(function(data1,i){
                            var c=data1.services.length;
                            if(b<c)
                            {
                                flag=false;
                                b=c
                                data.servicesLength=c;
                                data.index=i
                            }
                        })
                        if(!flag)
                        {
                            data.servicesPack=data.analysis01[data.index].services;
                        }




                        // $scope.filter(data.servicesPack,data.analysis,data);
                        return data;
                    })
                $scope.employeeData.map(function(data,index){
                    $scope.filter(data,data,index);
                })

            }
            $scope.filter=function(a,data,index){
                if(!a.servicesPack)
                {
                    a.servicesPack=[];
                }
                data.analysis01.forEach(function(datas){
                    datas.services.forEach(function(data1){
                       var  flag=false;
                                a.servicesPack.forEach(function(data2){
                                    if(data2.serviceCategory==data1.serviceCategory)
                                    {
                                            flag=true;
                                    }

                                })
                        if(!flag){
                            $scope.employeeData[index].servicesPack.push(data1)
                        }
                    })
                    $scope.employeeData[index].servicesLength=$scope.employeeData[index].servicesPack.length;

                })

                // console.log($scope.employeeData);

            }







            function getDateOfWeek(w, y) {
                var d = (1+ (w - 1) * 7); // 1st of January + 7 days for each week
                return new Date(y, 0, d);
            }
        })