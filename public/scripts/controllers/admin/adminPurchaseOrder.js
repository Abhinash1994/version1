angular.module('sbAdminApp',['isteven-multi-select','daterangepicker']).controller('adminPurchaseOrderCtrl',function($scope,$http,$timeout){
	$scope.parlors=[];
	$scope.sellers=[];
	$scope.dates={};
	$scope.itemsArray=[];
	$scope.selected={sellers:[],
						parlors:""}
	$scope.dataRecords=[];
	$scope.showBill=function(c){
//		$scope.temp={};	
//		$scope.temp=c;
	



	}

    $scope.reOpen=function(m){
          // console.log(m) ;
          $http.post('/role2/recievePurchaseCorrect',{orderId:m._id}) 
                .success(function(res){
                    // console.log(res);
                    $scope.search();

                })      
    }
    
    
      $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

    
        $scope.toggleMin = function() {
            $scope.minDate = new Date(2017, 0, 1)
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MMM'];
        $scope.format = $scope.formats[0];

        $scope.status = {
            opened: false
        };

    
    
	   var today=new Date();
        $scope.date={dateRangeSelected : {startDate: moment().startOf('month'), endDate: moment()}};

	$http.post('/role1/allParlors').success(function(response){
					$scope.parlors=response.data;
				})

	$http.get('/role1/getSellers').success(function(response){
		// console.log(response)
		$scope.sellers=response.data;

	})

	$scope.$watch('selected.sellers',function(newv,oldv){
				if(newv.length>0){
					$scope.selected.parlors=''
				}
	})

	$scope.approveOrNot=function(id,boolean){
		// console.log(id);
		// console.log(boolean)
		$http.post('/role1/approveOrderBill',{approve:boolean,id:id}).success(function(res){
				// console.log(res)
		})
		$scope.search();
	}


$scope.showItems=function(m,n){
			$scope.itemsArray=[];
			$scope.itemsArray=m;
        $scope.temp=n



}

$scope.send=function(c){
    
            
    c.items=c.items.map(function(item)
                        {  item.sellingPrice =item.sellingPrice*item.recieveQuantity;
                          return item
                      })         
 
      var a=c.items.reduce(function(sum,i){
                            sum=(i.sellingPrice)+sum;
                            return sum
                },0)
      
    //   console.log(c);
    // console.log(a)
    
      
      $http.post("/role2/editReceivedPurchase",{orderAmount:a,items:c}).success(function(res){
          // console.log(c)
          
           $scope.search();
      })
   
             
}


	$scope.search=function(){

		// console.log($scope.selected.sellers)
		// console.log($scope.selected.parlors)
		// console.log($scope.date.dateRangeSelected);
        $scope.dataRecords=[]

		$scope.dates={
			startDate:$scope.date.dateRangeSelected.startDate._d,
			endDate:$scope.date.dateRangeSelected.endDate._d
		}


				var id=[];
				$scope.selected.sellers.forEach(function(a){
									id.push(a._id);
				})
				$http.post('/role1/fetchReorders',{sellerIds:id,parlorId:$scope.selected.parlors,date:$scope.dates}).success(function(res){
							// console.log(res);
							$scope.dataRecords=res.data;
                    	$('#showModal').modal('hide');

                 })
	}
    
    
    $scope.editItNow=function(c){
       $("#showModal").modal({
            backdrop: 'static',
            keyboard: false
        });
            $scope.temporary={};
            $scope.temporary=angular.copy(c);
            
        	$('#showModal').modal('show');
        
        
    }
    
    $scope.sendNow=function(a){
        // console.log(a)
        // console.log($scope.dt);
        $http.post("/role1/changeReceivedDate",{id:a,date:$scope.dt}).success(function(res){
            $('#showModal').modal('hide');
            $scope.search();
        })
        
    }
})