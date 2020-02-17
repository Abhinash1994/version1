angular.module('sbAdminApp', ['ui.bootstrap', 'isteven-multi-select', 'daterangepicker']).
controller('createBeUQuestCtrl', function($scope, $http) {
 $scope.category = {
  select: '',
  copiedArray: []
 };
 $scope.subCategory = {
  select: '',
  copiedArray: []
 };
 $scope.categories = [];
 $scope.sendData = {
  categoryId: ''
 };
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
  $scope.dynamicArray = [];
  // console.log($scope.subCategories);
  $scope.sendData = {};
  $scope.subCategory.select = "";
  $scope.formType.select = "";
			  if ($scope.category.copiedArray.length > 0)
 {
   							$scope.category.copiedArray.forEach(function(b)
   						{
    									var a = 0;
								if ($scope.subCategories.length > 0)
							{
     								$scope.subCategories.forEach(function(c)
     							{
      									if (b._id == c.categoryId)
      								{
       												a = 1;
     								 }
     							})
     									if (a == 0)
     								{
      										$scope.sendData.categoryId = b._id;
     								}

    						}
    							else
    						{
     									$scope.sendData = {
      															categoryId: b._id
     														};
    						}

   })

		$http.post("/beuApp/listBeuFormSubCategories", $scope.sendData).success(function(res) {
    // console.log(res);
    res.data.forEach(function(a) {
     var c = 0;
     $scope.subCategories.forEach(function(s) {
      if (a.categoryId == s.categoryId) {
       c = 1;
      }
     })
     if (c == 0) {
      // console.log(a);
      $scope.dynamicArray.push(a);
     }

    })

    // console.log($scope.dynamicArray);
    $scope.dynamicArray.forEach(function(e) {
     $scope.subCategories.push(e);
    })

   })

  }





 }

 $scope.optionsChangedSub=function(){
        $scope.formType.select="";
 }

 $scope.checkBox = function() {
  $scope.formTypes.selected = {};
  if ($scope.formType.select == "checkbox") {
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


  } else if ($scope.formType.select == "radio") {

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


  } else {
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
if($scope.formType.select!=""){
         var ab = {
   formType: $scope.formType.select,
   question: $scope.Question.val,
   showOnApp: true,
   categories: [],
   options: [],
   minRange: $scope.formTypes.selected.min,
   maxRange: $scope.formTypes.selected.max

  }

  $scope.subCategories.forEach(function(a) {
   $scope.subCategory.copiedArray.forEach(function(m) {
    if (m._id == a._id) {
     var e = {
      categoryName: "",
      formCategoryId: "",
      subCategoryName: "",
      formSubCategoryId: ""
     };
     e.formSubCategoryId = a._id;
     e.subCategoryName = a.name;
     e.formCategoryId = a.categoryId;
     ab.categories.push(e);
    }
   })
  })


  $scope.categories.forEach(function(a) {
   ab.categories.forEach(function(f) {
    if (f.formCategoryId == a._id) {
     f.categoryName = a.name;
    }
   })

  })




  if ($scope.formTypes.selected) {
   if ($scope.formTypes.selected.options) {

    $scope.formTypes.selected.options.forEach(function(a) {
     ab.options.push({
      option: a.value
     });
    })

   }
  }


  if ($scope.category.copiedArray.length > 0 && $scope.subCategory.copiedArray.length > 0) {
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
   })
  } else {

   alert("parameters are not complete");
  }

}

 }


})
