angular.module("sbAdminApp",['ngCsvImport'])
    .controller("gstAmountCtrl",function($scope,$http){
    $scope.parlor={}
    $scope.gst={};
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };


    var today = new Date();
    $scope.dts = {time:new Date(today.getFullYear(),today.getMonth(),1)};
    // console.log($scope.dts);
    $scope.dte = new Date();
     $http.get("/role1/getParlorForLedger")
                     .success(function(res)
                {
                            $scope.parlors=res.data;
                })

    
    
    $scope.addGstAmount=function(){ 
        console.log({parlorId:$scope.parlor.selectedParlor,amount:$scope.gst.amount,date:$scope.dts.time,type:parseInt($scope.gst.type)})
        if($scope.gst.amount && $scope.parlor.selectedParlor)
        {
        $http.post("/role1/addGstAmount",{parlorId:$scope.parlor.selectedParlor,amount:$scope.gst.amount,date:$scope.dts.time,type:parseInt($scope.gst.type)})
             .success(function(res){
            $scope.gst.amount=undefined;
            $scope.parlor.selectedParlor=undefined;
             })
        }
    }
    
    
$scope.getGstAmount=function()
{
    $scope.gstData=[];
        $http.get("/role1/getParlorGstTransferAmount?parlorId="+$scope.parlor.selectedParlor+"&date="+$scope.dts.time)
             .success(function(res)
        {
                    // console.log(res) 
                        $scope.gstData=res.data;
        })
}


$scope.sendNow=function(a,b)
{
    $http.get('/api/isTransfered?id='+a+'&isTrue='+b)
         .success(function(res){
        // console.log(res)
        $scope.getGstAmount()
    })
}
$scope.findType=function(type){
 if (type==0)
        return "GST Amount"
else if(type==1)
return "Subscription Incentive"
}
$scope.apply=function(data){
    console.log("data",data);
    var finalData=[];
    data.forEach(function(element1) {
       var element= element1[0].split(',')
        finalData.push({parlorId:element[0],discountGenerated:parseInt(element[1]),adjustment:parseInt(element[2]),discountPaid:parseInt(element[3]),balance:parseInt(element[4])})
        
    }, this);
    console.log("final data",finalData);
    $http.post('/role1/updateGSTInSettlement',{data:finalData}).success(function(response){
        alert("Updated Successfully")
    })
}
})