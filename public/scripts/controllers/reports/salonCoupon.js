angular.module("sbAdminApp",["daterangepicker"])
.controller("salonsCouponUsed",function($scope,$http,Excel,$timeout){
			
        $scope.filter = {parlorId : parlorId};


      $scope.role=role;
        $scope.allParlors = allParlors;
        $scope.selectedParlorId = parlorId;

        $scope.changeParlor = function(pId){
        $scope.selectedParlorId = pId;
        $scope.filter.date.parlorId = pId;
          $scope.updateData()
      };


      // console.log("helo");
			var today=new Date();
        $scope.data=[];
        var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	$scope.filter.date = {startDate: firstDay, endDate: lastDay, parlorId : parlorId};

 $('body').on('apply.daterangepicker', function(ev, picker) {
 			// console.log($scope.filter);
        $scope.filter.date.parlorId = $scope.selectedParlorId;
 			$scope.updateData()

          
           })

 // console.log($scope.filter)


      $scope.exportToExcel = function (tableId) {


         var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
          $timeout(function () {
              location.href = exportHref;
          }, 100); // trigger download

       
      }
$scope.updateData=function(){

      	$http.post("/role3/salonWisePersonalCouponReport",$scope.filter.date).success(function(res){
      		$scope.data=res.data;
          console.log("final data:",$scope.data)
      	$scope.fixedHeaderMethod()
      	})


}

$scope.updateData()

 $scope.fixedHeaderMethod = function(){
               $timeout(
                function() {
                    $('#tableId').fixedHeaderTable({fixedColumn: true});
                    var a=document.getElementsByClassName("fht-cell");
                    var mid=(a.length-1)/2
                    for(var i=1;i<=mid;i++){
                        a[i].clientWidth=a[i+mid].clientWidth;
                        a[i].offsetWidth=a[i+mid].clientWidth;
                        a[i].scrollWidth=a[i+mid].clientWidth;
                        a[i].style.width=a[i+mid].clientWidth+'px';
                            console.log(i+" "+(i+mid));
                        }
                }
             );
        } 



})