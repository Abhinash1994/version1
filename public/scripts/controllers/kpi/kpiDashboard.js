angular.module('sbAdminApp')
  .controller('kpiDashboardCtrl', ['$scope', '$http','$state','Excel','$timeout', function($scope, $http,$state, Excel ,$timeout,$window) {

      $scope.flag=true;
      $scope.flagService=true;
      $scope.flagTransaction=true;
      $scope.flagVisitors=true;
      $scope.flagFreebies=true;
      $scope.getParlorFootFall = function(parlors, parlorType){
          /*console.log(parlors);
          console.log(parlorType);*/
          var footFall = 0, noOfSalons = 0, reportValue = 0,reportValueCash=0,footFallCash=0;
          parlors.forEach(function(par){
            if(par.parlorType == parlorType){
                footFall = par.footFall;                
                noOfSalons = par.noOfSalons;
                reportValue = par.reportValue;
                footFallCash = par.footFallCash;
                reportValueCash = par.reportValueCash;

            }
          });
          return {footFall : footFall, noOfSalons:noOfSalons,reportValue :reportValue,footFallCash : footFallCash,reportValueCash :reportValueCash};
      }
      
      $scope.parlorTypes = [ 0 , 1, 2];
      $scope.getParlorType =function(i){
          
          if(i==0) return "Red Category" ;
          else if(i==1) return "Blue Category" ;
          else  return "Green Category" ;
          
      }
       $http.post("/role1/report/footFall").success(function(response, status){
           // console.log("--------------",response)
                        $scope.datas   = response
         
           
       });
      

      $scope.goToSalonKpi = function(){
          
          if($scope.flag){
          $http.post("/role1/report/salonRevenue").success(function(response, status){
           // console.log("--------------",response)
                        $scope.datasSalon   = response;
          $scope.flag=false;
           
       });}
      }
      

       $scope.goToSalonServices = function(){
           if($scope.flagService){
             $http.post("/role1/report/noOfService").success(function(response, status){
           // console.log("--------------",response)
                        $scope.datasServices   = response;
                        $scope.flagService=false;
                });
           }
       }
       
       $scope.goToTransactionFree =function(){
           
             if($scope.flagTransaction){
             $http.post("/role1/report/freeHairCut").success(function(response, status){
                // console.log("--------datasApp------",response)
                        $scope.datasApp   = response;
                        $scope.flagTransaction=false;
                           $http.post("/role1/report/appTransaction").success(function(response, status){
                            // console.log("-------datasApp1-------",response)
                        $scope.datasApp1   = response;
                       
                });
                });
           
           
           
             
             
             
             }
           
       }
              $scope.goToVisitors =function(){
           
             if($scope.flagVisitors){
             $http.post("/role1/report/secondVisit").success(function(response, status){
           // console.log("--------------",response)
                        $scope.visitors   = response;
                        $scope.flagVisitors=false;
                });
           }
           
       }
              $scope.goToFreebie= function(){
                 if($scope.flagFreebies){
             $http.post("/role1/report/freebiesDistribution").success(function(response, status){
           // console.log("--------------",response)
                        $scope.freebies   = response;
                        $scope.flagFreebies=false;
                });
           } 
                  
                  
                  
              }
            
              /*{{1 | date: 'MMMM'}} {'overAll':'','red':'','blue':'','green':''}*/
              $scope.goToDepartmentsReport= function(){
               
                    $http.post("/role1/report/departmentWiseReport").success(function(response, status){
                    // console.log("--------------",response);
                      $scope.departmentWiseData=response;  
                      /*for(var i=0;i<$scope.departmentWiseData.length;i++){
                        var totalRedService=0;
                        var totalRedRevenue=0;
                        var totalBlueService=0;
                        var totalBlueRevenue=0;
                        var totalGreenService=0;
                        var totalGreenRevenue=0;

                        for(var j=0;j<$scope.departmentWiseData[i].departments.length;j++){
                          
                          for(var k=0;k<$scope.departmentWiseData[i].departments[j].parlors.length;k++){
                              if($scope.departmentWiseData[i].departments[j].parlors[k].parlorType==0){
                                  totalRedService=totalRedService+$scope.departmentWiseData[i].departments[j].parlors[k].noOfService
                                  totalRedRevenue=totalRedRevenue+$scope.departmentWiseData[i].departments[j].parlors[k].revenue
                              }else if($scope.departmentWiseData[i].departments[j].parlors[k].parlorType==1){
                                totalBlueService=totalBlueService+$scope.departmentWiseData[i].departments[j].parlors[k].noOfService
                                  totalBlueRevenue=totalBlueRevenue+$scope.departmentWiseData[i].departments[j].parlors[k].revenue
                              }else if($scope.departmentWiseData[i].departments[j].parlors[k].parlorType==2){
                                totalGreenService=totalGreenService+$scope.departmentWiseData[i].departments[j].parlors[k].noOfService
                                  totalGreenRevenue=totalGreenRevenue+$scope.departmentWiseData[i].departments[j].parlors[k].revenue
                              }
                          }
                        }
                        $scope.departmentWiseData[i]['totalRedService']=totalRedService;
                        $scope.departmentWiseData[i]['totalRedRevenue']=totalRedRevenue;
                        $scope.departmentWiseData[i]['totalBlueService']=totalBlueService;
                        $scope.departmentWiseData[i]['totalBlueRevenue']=totalBlueRevenue;
                        $scope.departmentWiseData[i]['totalGreenService']=totalGreenService;
                        $scope.departmentWiseData[i]['totalGreenRevenue']=totalGreenRevenue;
                      }*/
                    });
                        
             }
             $scope.colSpanServicePerInvoiceReport=0;
             $scope.getMonth=function(x){
              $scope.colSpanServicePerInvoiceReport++;
              return  moment(x, 'M').format('MMMM');

             }
          $scope.exportToExcelDepartmentWise = function (tableId) {
            // console.log(tableId)
        // ex: '#my-table'
            var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
        }
         $scope.goToClientWiseReport= function(){
               
                    $http.post("role1/report/clientWiseReport").success(function(response, status){
                    // console.log("--------------",response);
                    $scope.clientWiseReport=response;    
                    });
                        
             }

         $scope.goToServiceComboReport= function(){
               
                    $http.post("role1/report/serviceComboReport").success(function(response, status){
                    // console.log("--------------",response);
                    $scope.serviceComboReport=response;
                    $scope.maxTopServices=[];
                    for(var i=0;i<$scope.serviceComboReport.length;i++){
                        if($scope.maxTopServices.length<$scope.serviceComboReport[i].topServices.length){
                              $scope.maxTopServices=$scope.serviceComboReport[i].topServices;
                        }else{
                          continue;
                        }
                    }
                    });
                        
             }   

             $scope.goToServicePerInvoiceReport= function(){
               
                    $http.post("role1/report/serviceFrequency").success(function(response, status){
                    // console.log("--------------",response);
                    $scope.servicePerInvoiceReport=response;
                    });
                        
             } 

             $scope.goToOldVsNewReport=function(){

                $http.post("role1/report/oldNewClientReport").success(function(response, status){
                    // console.log("--------------",response);
                    $scope.oldNewClientReport=response;
                    $scope.maxMonth=[];
                    for(var i=0;i<$scope.oldNewClientReport.length;i++){
                        if($scope.maxMonth.length<$scope.oldNewClientReport[i].months.length){
                            $scope.maxMonth=$scope.oldNewClientReport[i].months;
                        }
                    }
                    for(var i=0;i<$scope.oldNewClientReport.length;i++){
                        for(var j=0;j<$scope.maxMonth.length;j++){
                            $scope.matchFlag=false;
                            for(var k=0;k<$scope.oldNewClientReport[i].months.length;k++){
                                if($scope.oldNewClientReport[i].months[k].month==$scope.maxMonth[j].month){
                                  $scope.matchFlag=true;
                                }
                            }
                            if($scope.matchFlag==false){
                              $scope.oldNewClientReport[i].months.push({'month':$scope.maxMonth[j].month,'newClient':0,'oldClient':0,'year':$scope.maxMonth[j].year})
                            }
                        }
                    }
                  });

             }

             $scope.goRepeatBehaviourReport=function(){

                $http.post("role1/report/serviceFrequency").success(function(response, status){
                    // console.log("--------------",response);
                    $scope.servicePerInvoiceReport=response;
                    });
                
             }
        

      
  }]);