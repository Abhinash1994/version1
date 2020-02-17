/**
 * Created by Manisha on 7/21/2017.
 */
/**
 * Created by Manisha on 7/21/2017.
 */
angular.module('sbAdminApp', ["ngJsonExportExcel",
    'ui.bootstrap', 'ngDragDrop',
    'isteven-multi-select',
    'daterangepicker','nvd3'
]).controller("frequencyReportCtrl",function($scope,$http,Excel,$timeout)
{

    $scope.totalItems=0;
    $scope.currentPage=1;
    $scope.itemsPerPage = 15;
     $scope.tableHeading={
                            "1":['Count','Per'],
                            "2":['Count','Per'],
                            "3":['Count','Per'],
                            "4":['Count','Per'],
                            "5":['Count','Per'],
                            "Above 5":['Count','Per']
    };
    var today = new Date();
    $scope.multisalonsObject={
        multisalons:[],
        multi:[]
    }
    $scope.frequencyReport=[];
    $scope.beu=null;
    $scope.dates={}
    $scope.dates.date = {
        startDate: {
            '_d': new Date(today.getFullYear(), today.getMonth(), 1)
        },
        endDate: {
            '_d': new Date()
        },
    };

    $http.get("/graphs/getParlorList").success(function(data){
        // console.log(data);
        data.forEach(function(element){
            $scope.multisalonsObject.multisalons.push(element);
        })
    })
    $http.post("/role1/customerFrequency").success(function(response){

        $scope.beu=response.data.beu;
        response.data.parlor.forEach(function(element){


           var a={parlorName:"",one:0,two:0,three:0,four:0,five:0,moreThanFive:0,total:0}
            var b=0;
           a.parlorName=element.parlorName;

           var d=0;
          var h=1;


          element.data.forEach(function(m){
              for(var key in m){

                  if(key==1){
                      a.one=m[key];
                      var c=0;
                      c=1*m[key];
                      a.total=a.total+c
                  }
                  else if(key==2){
                      var c=0;
                      a.two=m[key];
                      c=2*m[key];
                      a.total=a.total+c
                  }
                  else if(key==3){
                      a.three=m[key];
                      var c=0;
                      c=3*m[key];
                      a.total=a.total+c
                  }
                  else if(key==4){
                      a.four=m[key];
                      var c=0;
                      c=4*m[key];
                      a.total=a.total+c
                  }
                  else if(key==5){
                      a.five=m[key];
                      var c=0;
                      c=5*m[key];
                      a.total=a.total+c
                  }

                  else{
                      b=b+m[key];
                      var c=0;
                      c=6*m[key];
                      a.total=a.total+c;

                  }

              }
          })



           a.moreThanFive=b;
           $scope.frequencyReport.push(a);
       })

        $scope.totalItems=response.data.parlor.length;
        $scope.frequencyReport.forEach(function(element,index){
            var a=0;
            var c=0;
                response.data.parlor[index].data.forEach(function(m){
                    for(var key in m){
                        if(key==1){
                            var a=0;
                            a=(element.one*1)/element.total;
                            element.one1=(a*100).toFixed(2);
                        }
                        else if(key==2){
                            var a=0;a=(element.two*2)/element.total;
                            element.two1=(a*100).toFixed(2);
                        }
                        else if(key==3){
                            var a=0;a=(element.three*3)/element.total;
                            element.three1=(a*100).toFixed(2);
                        }
                        else if(key==4){
                            var a=0;a=(element.four*4)/element.total;
                            element.four1=(a*100).toFixed(2);
                        }
                        else if(key==5){
                            var a=0;a=(element.five*5)/element.total;
                            element.five1=(a*100).toFixed(2);
                        }

                        else{
                            var a=0;a=(element.moreThanFive*6)/element.total;
                            element.moreThanFive1=(a*100).toFixed(2);
                        }


                    }
                })

        })


    })
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }
})