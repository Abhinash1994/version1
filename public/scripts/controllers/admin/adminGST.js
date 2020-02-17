angular.module('sbAdminApp')
    .controller('adminGST',function($scope, $http,Excel,Upload,NgTableParams,$timeout) {
    	
        $http.get('/role2/geTallParlorGst').then(function(response){

            // console.log(response)
      
            $scope.GSTDetails=response.data.data
            	// $scope.GSTDetails.forEach(function(a){
            	// 			var c=""
            	// 			a.empWithoutAccounts.forEach(function(b,i){
            	// 					if(i)
            	// 						c=c.concat(b);
            	// 					if(i<a.empWithoutAccounts.length-1 && i!=0){
            	// 								c=c.concat(' ,  ')
            	// 					}
            	// 			});

            			

            	// 			a.emps=c;



            	// })

            // console.log('detail here',$scope.GSTDetails)
        });

  $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        var exportHref = Excel.tableToExcel(tableId, 'WireWorkbenchDataExport');
        $timeout(function () {
            location.href = exportHref;
        }, 100); // trigger download
    }

    });