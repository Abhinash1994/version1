angular.module('sbAdminApp')
  .controller('DefaultCtrl', function($scope,$position, $state) {
      if(role == 0)
        $state.go('login');
      else if(role == 1)
        $state.go('dashboard.parlors');
   	 else if(pages.length>0)
    	$state.go('dashboard.facebookpage');
      else
        $state.go('dashboard.home');
  });
