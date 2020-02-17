angular.module('sbAdminApp', ['ui.bootstrap', 'isteven-multi-select'])
    .controller('membersCtrl', function($scope, $http, $stateParams, $window,NgTableParams,$state) {
    
    // console.log("members" );
    $scope.selectParlors = '';
    $scope.positions = [{role:1, 'name' : "Main Admin"},
                        {role:2, 'name' : "HR"},
                        {role:3, 'name' : "Operation"},
                        {role:4, 'name' : "Sales"},
                        {role:6, 'name' : "Trainer"},
                        {role:7, 'name' : "Marketing"},
                        {role:8, 'name' : "Designer"},
                        {role:9, 'name' : "Cashier"},
                        {role:10, 'name' : "Call Center"},
                        {role:11, 'name' : "Finance"},
                          {role:12, 'name' : "Ops Executive"}
                       ]
    $scope.newMember={};
    $scope.selectParlors = ' ';
    $scope.selectedParlor=[];
    $scope.parlorIdsToBeSent=[];
    $http.post("/role1/parlorList").success(function(response, status){
    $scope.parlors = response.data;
    //console.log($scope.parlors);
    });

    $scope.changeParlor=function(){
          
            }
    $scope.addMember=function(member){
        member['parlorIds'] = [];
        for(var i=0;i<$scope.selectedParlor.length;i++){
            member.parlorIds.push($scope.selectedParlor[i].parlorId);
            }
         // console.log(member);
        $('#addNewMember').modal('hide');
        $http.post("/admin/member", member).success(function(response, status){
            $scope.parlorsData = response;
            // console.log(response);
        });
        $scope.newMember={};
          
    }

    
    $http({
        method: 'GET',
        url: '/admin/member'
    }).then(function successCallback(response) {
        $scope.members=response.data.data;
        // console.log(response);
        // console.log($scope.members);
    }, function errorCallback(response) {
       // console.log("Error");
    });
    
    $scope.editMembers=function(mem){
        
        $scope.selectParlors = '';
        $scope.editMember = mem; 
          // console.log(mem);
        var copyOfParlors=angular.copy($scope.parlors);
         $scope.selectParlors = copyOfParlors;
          // console.log( $scope.selectParlors);
         var index=0;
              while(index<$scope.editMember.parlorIds.length){
               for(var i=0;i< $scope.selectParlors.length;i++){
                if($scope.editMember.parlorIds[index]===$scope.selectParlors[i].parlorId){
                   $scope.selectParlors[i]['isSelected']=true;
                }

            }
            index++;
        }
        
      
        
    }
    
    $scope.updateMember = function(){
       // console.log($scope.selectedParlor1);
        //console.log($scope.editMember);
         $scope.editMember.parlorIds = [];
        for(var i=0;i<$scope.selectedParlor1.length;i++){
             $scope.editMember.parlorIds.push($scope.selectedParlor1[i].parlorId);
            }
        
        // console.log($scope.editMember);
         $('#editMem').modal('hide');
        $http.put("/admin/updateMember", $scope.editMember).success(function(response, status){
            $scope.parlorsData = response;
            // console.log(response);
        });
    }
    
    
 

        $scope.openMemberDetail = function(userId){

            $state.go('dashboard.team-member-detail', {userId: userId});
        };

//    function for deleting members
         $scope.deleteMembers=function(m)
  {
        $http.get('/role1/deleteMember?id='+m.userId).success(function(res)
        {
                        // console.log(res);
                        $scope.refresh();
        })
  }

//   function  to refresh  the data
    $scope.refresh=function()
    {
         $http.get("/admin/member").success(function(response )
         {
                    $scope.members=response.data
          });
    }



});