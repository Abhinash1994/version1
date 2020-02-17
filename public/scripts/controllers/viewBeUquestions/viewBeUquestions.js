angular.module('sbAdminApp', [ 'ui.bootstrap','isteven-multi-select'])
.controller('viewBeUformCtrl',function($scope,$http){
$scope.sortOrder={sort:''};
$scope.editCopiedRoles={roles:[]}
$scope.role={copiedRoles:[]}
  $scope.roles=[{key:'Operation',value:3},{key:'Sales',value:4},{key:'Trainer',value:6},{key:'Cashier',value:9}]
   $scope.chkroles=[{key:'Operation',value:3},{key:'Sales',value:4},{key:'Trainer',value:6},{key:'Cashier',value:9}]
 $scope.sendData=[];
	$scope.data=[];
  $scope.Question={val:''}
		// console.log("helllo its me");



$scope.viewBeUQuestion=function(){
							$http.post("/beuApp/listFormQuestions").success(function(res)
	{
							// console.log(res);
							$scope.data=[];
							$scope.data=res.data;
	})
}

$scope.viewBeUQuestion();


	$scope.editQuestion=function(a){
    $scope.edit={};
				$scope.edit=angular.copy(a);
    if($scope.edit.role){
        $scope.edit.role.forEach(function(c){
            // console.log(c)
              $scope.chkroles.forEach(function(b){
                  if(b.value==c){
                    b.isSelected=true;
                  }
              })
        })  

        }  


     
				$('#myModal').modal('show');
}


$scope.updateQuestion=function(){
var temp=[];
  console.log($scope.editCopiedRoles.roles)
  $scope.editCopiedRoles.roles.forEach(function(a){
    temp.push(a.value);
  })

  $scope.edit.role=temp;
			var a={
							action:'edit',
							data:$scope.edit,
							questionId:$scope.edit.questionId

			}
					// console.log(a);
			$http.post("/beuApp/listFormQuestions",a).success(function(res){

										// console.log(res);
										$('#myModal').modal('hide');
										$scope.viewBeUQuestion();


			})

}



$scope.removeQuestion=function(d){

		var r=confirm("Are you sure you want to remove Question");
		if(r)
	{

				var a={
							questionId:d.questionId,
							action:'delete'
			}

			// console.log(a)

		$http.post("/beuApp/listFormQuestions",a).success(function(res){

										// console.log(res)
										$('#myModal').modal('hide');
										$scope.viewBeUQuestion();


			})
	}

	else{
		// console.log("r is false");
	}


}

///          create     Be U    questions
	$scope.category = {
  select: '',
  copiedArray: []
 };
 $scope.subCategory = {
  select: '',
  copiedArray: []
 };
 $scope.categories = [];

 $scope.subCategories = [];
 $scope.formTypes = [{
  _value: 'radio',
  name: 'SingleSelect'
 }, {
  _value: 'checkbox',
  name: 'MultiSelect'
 }, {
  _value: 'text',
  name: 'text'
 }, {
  _value: 'range',
  name: 'Range'
 },
 {
  _value: 'dropDown',
  name: 'DropDown'
 }];
 $scope.formType = {
  select: ''
 };
 $scope.Nop = {
  select: 0
 };
 $scope.numberOfOptions = [];


 $http.get("/beuApp/listBeuFormCategories").success(function(res) {
  // console.log(res)
  res.data.forEach(function(d) {
   $scope.categories.push(d);
  })
 })


 $scope.optionsChanged = function(a) {
  // $scope.subCategories=[];
  $scope.sendData=[]
   $scope.subCategories=[];
  $scope.dynamicArray = [];
  // console.log($scope.subCategories);

  $scope.subCategory.select = "";
  $scope.formType.select = "";
			  if ($scope.category.copiedArray.length > 0)
 {
   							$scope.category.copiedArray.forEach(function(b)
   						{
    							     var a={categoryId:''};
                       a.categoryId=b._id;
                       $scope.sendData.push(a);

              })

    }

    // console.log($scope.sendData);

               

		$http.post("/beuApp/listBeuFormSubCategories", $scope.sendData).success(function(res) {
    // console.log(res);
    


     $scope.subCategories=res.data;
    // res.data.forEach(function(a) {
    //  var c = 0;
    //  $scope.subCategories.forEach(function(s) {
    //   if (a.categoryId == s.categoryId) {
    //    c = 1;
    //   }
    //  })
    //  if (c == 0) {
    //   console.log(a);
    //   $scope.dynamicArray.push(a);
    //  }

    // })

    // console.log($scope.dynamicArray);
    $scope.dynamicArray.forEach(function(e) {
     $scope.subCategories.push(e);
    })

   })

  }





 

 $scope.optionsChangedSub=function(){
        $scope.formType.select="";
 }

 $scope.checkBox = function() {
  $scope.formTypes.selected = {};
 

  if ($scope.formType.select == "checkbox" || $scope.formType.select=="radio"  || $scope.formType.select=="dropDown") {
   $scope.formTypes.selected.options = [];
   if ($scope.Nop.select > 0) {
    for (i = 0; i < $scope.Nop.select; i++) {
     var a = {
      label: "",
      value: ""
     };
     var b = i + 1;
     a.label = "options" + b;
     $scope.formTypes.selected.options.push(a);
    }
   }


  } 

else {
   $scope.formTypes.selected = {
    options: []
   };

  }

 }

 $scope.onselectAll = function() {
  $scope.category.copiedArray = [];
  $scope.categories.forEach(function(m) {
   var a = {
    _id: ""
   };

   a._id = m._id
   $scope.category.copiedArray.push(a);
  })
  $scope.optionsChanged();
 }

 $scope.onselectNone = function() {
  $scope.category.copiedArray = [];
 }

 $scope.selectAllSub = function() {

  $scope.subCategory.copiedArray = [];
  $scope.subCatgories.forEach(function(a) {
   var b = {
    _id: ""
   }
   b._id = a._id;
   $scope.subCategory.copiedArray.push(b);
  })

  $scope.optionsChanged();
 }

 $scope.selectNone = function() {
  $scope.subCatgory.copiedArray = [];
 }




 $scope.radioChange = function() {

  $scope.formTypes.selected = {};




 }



 $scope.submitQuestion = function() {


  // console.log($scope.formTypes);
if($scope.formType.select!="" && $scope.role.copiedRoles.length>0){
var b=[];
  $scope.role.copiedRoles.forEach(function(a){
              b.push(a.value);

  })




         var ab = {
   formType: $scope.formType.select,
   question: $scope.Question.val,
   showOnApp: true,
   categories: [],
   options: [],
   sortOrder:$scope.sortOrder.sort,
   role:b,

   minRange: $scope.formTypes.selected.min,
   maxRange: $scope.formTypes.selected.max

  }

  $scope.categories.forEach(function(a){
 $scope.category.copiedArray.forEach(function(b){

              if(a._id==b._id){
                var c={categoryName:"",formCategoryId:""};
                c.categoryName=a.name;
                c.formCategoryId=a._id;
                ab.categories.push(c);
              }
 })
})
 
$scope.subCategories.forEach(function(a) {
   $scope.subCategory.copiedArray.forEach(function(m) {
    if (m._id == a._id) {
      // console.log("hello",$scope.subCategories);

          ab.categories.forEach(function(b){
                  if(b.formCategoryId==a.categoryId)
                  {
                    b.subCategoryName=a.name;
                    b.formSubCategoryId=a._id;
                  }
          })    
     // e.formSubCategoryId = a._id;
     // e.subCategoryName = a.name;
     // e.formCategoryId = a.categoryId;
     // ab.categories.push(e);
    }
   })
  })






  // $scope.categories.forEach(function(a) {
  //  ab.categories.forEach(function(f) {
  //   if (f.formCategoryId == a._id) {
  //    f.categoryName = a.name;
  //   }
  //  })

  // })




  if ($scope.formTypes.selected) {
   if ($scope.formTypes.selected.options) {

    $scope.formTypes.selected.options.forEach(function(a) {
     ab.options.push({
      option: a.value
     });
    })

   }
  }


  if ($scope.category.copiedArray.length > 0 ) {
    // console.log(ab)
   $http.post("/beuApp/createBeuFormQuestions", ab).success(function(res) {
      alert(res);
    angular.forEach($scope.categories, function(value, key) {
     value.isSelected = false;
    });
    angular.forEach($scope.subCategories, function(value, key) {
     value.isSelected = false;
    });
    $scope.formType.select = "";
    $scope.Question.val = "";
    // console.log(ab);
    $scope.roles.forEach(function(a){
      a.ticked=false;
    })
    $scope.sortOrder.sort=''


    $scope.viewBeUQuestion();
   })
  } else {

   alert("parameters are not complete");
  }

}

 }


});
