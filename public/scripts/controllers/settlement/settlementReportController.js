angular.module('sbAdminApp')
    .controller('settlementReportCtrl', function($scope, $http, $stateParams, $window,NgTableParams) { 

    $http.post("/role1/parlorList").success(function(response, status){
        $scope.parlors = response.data;
        // console.log("hi",$scope.parlors);
    });

    $scope.parlorChanged = function(){
        // console.log($scope.selectedParlor);
        var period = $scope.selectedPeriod ? $scope.selectedPeriod : 1;
        $http.get("/role1/settlementReport?parlorId=" + $scope.selectedParlor + "&period=" + period).success(function(response, status){
            $scope.set = response.data;
            // console.log($scope.data);
            $scope.salonName=$scope.set.parlorName;
            // console.log('hello',$scope.salonName)

        });
    };
    $scope.dateSelected=function(list,selectedIndex){
        for(var i=0;i<list.length;i++){
            if(list[i].value==selectedIndex){
                $scope.dateOfSettlement=list[i].date;
            }
        }
        //console.log(list[selectedIndex-1].date);
        $scope.parlorChanged();

    }

     $http.get("/role1/periods").success(function(response, status){
        $scope.periods = response.data;
        // console.log("hello",$scope.periods);
    });


   
        $scope.generateRevenueReport=function(){
           // console.log(document.getElementById('tableOfReport').innerHTML)
       /*   var table1=document.getElementById('tableOfReport1').innerHTML;
            var table2=document.getElementById('tableOfReport2').innerHTML;
            var table3=document.getElementById('tableOfReport3').innerHTML;
            var table4=document.getElementById('tableOfReport4').innerHTML;
            var table5=document.getElementById('tableOfReport5').innerHTML;

            var data1=table1.replace(/<tbody>/g,'').replace(/<\/tbody>/g,'').replace(/<tr>/g,'').replace(/<\/tr>/g,'\r\n').replace(/<th>/g,'').replace(/<\/th>/g,',').replace(/<th class="ng-binding">/g,'').replace(/<td>/g,'').replace(/<td class="ng-binding">/g,'').replace(/,/g,' ').replace(/<\/td>/g,',').replace(/\t/g,'').replace(/\n/g,'');
            var data2=table2.replace(/<tbody>/g,'').replace(/<\/tbody>/g,'').replace(/<tr>/g,'').replace(/<\/tr>/g,'\r\n').replace(/<th>/g,'').replace(/<\/th>/g,',').replace(/<th class="ng-binding">/g,'').replace(/<td>/g,'').replace(/<td class="ng-binding">/g,'').replace(/,/g,' ').replace(/<\/td>/g,',').replace(/\t/g,'').replace(/\n/g,'').replace(/\t/g,'');
            var data3=table3.replace(/<tbody>/g,'').replace(/<\/tbody>/g,'').replace(/<tr>/g,'').replace(/<\/tr>/g,'\r\n').replace(/<th>/g,'').replace(/<\/th>/g,',').replace(/<th class="ng-binding">/g,'').replace(/<td>/g,'').replace(/<td class="ng-binding">/g,'').replace(/,/g,' ').replace(/<\/td>/g,',').replace(/\t/g,'').replace(/\n/g,'').replace(/\t/g,'');
            var data4=table4.replace(/<tbody>/g,'').replace(/<\/tbody>/g,'').replace(/<tr>/g,'').replace(/<\/tr>/g,'\r\n').replace(/<th>/g,'').replace(/<\/th>/g,',').replace(/<th class="ng-binding">/g,'').replace(/<td>/g,'').replace(/<td class="ng-binding">/g,'').replace(/,/g,' ').replace(/<\/td>/g,',').replace(/\t/g,'').replace(/\n/g,'').replace(/\t/g,'');
            var data5=table5.replace(/<tbody>/g,'').replace(/<\/tbody>/g,'').replace(/<tr>/g,'').replace(/<\/tr>/g,'\r\n').replace(/<th>/g,'').replace(/<\/th>/g,',').replace(/<th class="ng-binding">/g,'').replace(/<td>/g,'').replace(/<td class="ng-binding">/g,'').replace(/,/g,' ').replace(/<\/td>/g,',').replace(/\t/g,'').replace(/\n/g,'').replace(/\t/g,'');
            var data=data1+'\n'+'Service Revenue'+'\n'+data2+'\n'+'Membership Revenue'+'\n'+data3+'\n'+'Collection Summary'+'\n'+data4+'\n'+'Final Settlement Summary'+'\n'+data5;
            console.log(data);
            var myLink=document.createElement('a');
            console.log()
            myLink.download=$scope.salonName+$scope.dateOfSettlement+'.pdf';
            myLink.href='data:application/pdf,'+ escape(data);
            myLink.click();*/
            var pdf = new jsPDF('1','pt','a5');
            pdf.addHTML(document.getElementById("tableCopy1") ,function() {
                pdf.addPage();
                pdf.addHTML(document.getElementById("tableCopy2") ,function() {
                    pdf.save($scope.salonName+$scope.dateOfSettlement+'.pdf');
                });
            });
        }
    
});