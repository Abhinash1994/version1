angular.module("sbAdminApp")
	   .controller("createTrainingChapter",function($scope,$http)
{
    $scope.selectedquestion={}
        $scope.createSuperCat={};
        $scope.getSuperCat={};
        $scope.superCategory={};
        $scope.getChapters={};
        $scope.submitChapters={};
        $scope.units=[];
        $scope.subCategory=[];
        $scope.subCategories={};
        $scope.getIt={}
        $scope.trainingSession={};
        $scope.questionObjects={};
        $scope.questionObject={};
        $scope.popup1 = {
            opened: false
        };
          $scope.selectedTrainer=""
        $scope.traiD=function(selectedTrainer){
         
            $scope.selectedTrainer=selectedTrainer
        }
    $http({
        method: 'GET',
        url: '/admin/member'
    }).then(function successCallback(response) {
        $scope.members=response.data.data;
        console.log(response);
        $scope.trainer=[]
        console.log($scope.members);
        $scope.members.forEach(function(emp){
            if(emp.role==6)
             $scope.trainer.push(emp)


        })

    }, function errorCallback(response) {
       console.log("Error");
    });

    
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
    
        $scope.date={dts:new Date(),trainId:''} 
        console.log($scope.date.dts);
            
        
	   $http.get("/beuApp/getUnits").success(function(res)
        {
        console.log(res)
        $scope.units=res.data;
           $scope.trainingSession.units=angular.copy($scope.units)
    })

        $scope.addSuperCategory=function()
        {
                if($scope.superCategory.superCategoryName)
            {
                 $http.post('/beuApp/createTrainingSupercategory',{unitId:$scope.createSuperCat.selectedUnit,superCategoryName:$scope.superCategory.superCategoryName})
                    .success(function(res){
                    console.log(res)
                    if(res.success)
                        {
                             $scope.createSuperCat.selectedUnit='';
                            $scope.superCategory.superCategoryName=undefined;
                            alert("Super Category Created Successfully");

                        }

                })
            }


    }


        $scope.getSuperCategory=function()
        {

                    $http.post("/beuApp/getTrainingSupercategory",{unitId:$scope.getSuperCat.selectedUnit})
                             .success(function(res)
                        {
                            $scope.subCategory=res.data;
                        })
            }

        $scope.getTrainingChapters=function()
        {

                $http.post("/beuApp/getTrainingChapter")
                      .success(function(res){
                    console.log(res)
                })
            }

        $scope.addSubCategory=function()
        {
            console.log($scope.getSuperCat)
            console.log($scope.subCategories.subcategoryName)

            if($scope.subCategories.subcategoryName)
            {
               $http.post("/beuApp/createTrainingSubcategory",{superCategoryId:$scope.getSuperCat.selectedSuperCategory,subCategoryName:$scope.subCategories.subcategoryName})
                .success(function(res){
                  if(res.success)
                    {
                        alert("SubCategory Created Succesfully");
                        $scope.getSuperCat.selectedSuperCategory='';
                        $scope.subCategories.subcategoryName=undefined;
                    }
               })
            }
    }

        $scope.getchapterSuperCategory=function()
        {
                    $http.post("/beuApp/getTrainingSupercategory",{ unitId:$scope.getChapters.selectedUnits }).success(function(res){
                        $scope.getChapters.superCategories=res.data;
                    })
                }


        $scope.getSubCategories=function()
        {
            $http.post("/beuApp/getTrainingSubcategory",{superCategoryId:$scope.getChapters.selectedSuperCategory}).success(function(res){
                console.log(res)
                $scope.getChapters.getSubCategories=res.data;
                console.log($scope.getChapters)
            })
        }

            $scope.addChapters=function()
        {
            $scope.submitChapters.subCategoryId=$scope.getChapters.selectedSubCategory;
            console.log($scope.submitChapters)
            $http.post("/beuApp/createTrainingChapter",$scope.submitChapters).success(function(res)
            {
                console.log(res)

                if(res.success)
                {
                    alert("Chapter created Successfully");
                    $scope.getChapters.selectedSubCategory="";
                    $scope.submitChapters={};
                }
            })
}
        
        $scope.trainingSession.getSuperCategory=function(){
            console.log($scope.trainingSession.selectedUnit)
            $http.post("/beuApp/getTrainingSupercategory",{unitId:$scope.trainingSession.selectedUnit}).success(function(res){
                    console.log(res)
                    $scope.trainingSession.superCategories=res.data; 
            })
        }
        
        $scope.trainingSession.getSubCategory=function(){
              $http.post("/beuApp/getTrainingSubcategory",{superCategoryId:$scope.trainingSession.selectedSuperCategory}).success(function(res){
                $scope.trainingSession.subCategories=res.data;
            })
        }
        
        $scope.testQuiz=function(){
            
            $http.post("/beuApp/takeTrainingQuiz",{chapterId:'5a200f24a274052688b1311a'}).success(function(res){
                console.log(res)
                $scope.quizArray=res
            })
        }
        
        
        $scope.initialise=function(a)
        {
                 $scope.createSuperCat.selectedUnit=""   ;
                $scope.superCategory.superCategoryName=undefined;
                $scope.getSuperCat.selectedUnit="";
                $scope.getSuperCat.selectedSuperCategory="";
                $scope.subCategories.subcategoryName=undefined;
                $scope.getChapters.selectedSubCategory=""
                $scope.submitChapters.chapterName=undefined;
                $scope.getChapters.selectedSuperCategory="";
                $scope.getChapters.selectedUnits="";
                $scope.trainingSession.selectedUnit=""
                $scope.trainingSession.selectedSuperCategory=""
                $scope.trainingSession.selectedSubCategory=""
                $scope.trainingSession.selectedChapter=""
                $scope.trainingSession.selectedParlor=""
                $scope.trainingSession.theory=false;
                $scope.trainingSession.practical=false;
               if(a==2)
            {
                  $scope.getWholeData();
            }
                    if(a==3)
                {
                        $scope.testQuiz();
                }
                
        }
        
        
        
        $scope.trainingSession.getChapters=function(){
            console.log($scope.trainingSession.selectedSubCategory)
              $http.post("/beuApp/getTrainingChapter",{subCategoryId:$scope.trainingSession.selectedSubCategory}).success(function(res){
                  console.log(res)
               $scope.trainingSession.chapters=res.data;
            })
        }
        
        $scope.getParlors=function(){
            
                        $http.get("/beuApp/getParlors")
                             .success(function(res)
                        {
                             $scope.parlors=res.data;
                            
                        })
            
        }
$scope.getWholeData=function(){
      $http.get("/beuApp/trainingStatics").success(function(res){
        $scope.question=[];
          $scope.questionObject={};
        $scope.question=res.data;
        console.log(res)
    })
    
}    
  
        
        
        
        $scope.getActiveEmployees=function(){
            $http.post("/beuApp/getActiveEmployees",{parlorId:$scope.trainingSession.selectedParlor})
                 .success(function(res){
                console.log(res)
                $scope.trainingSession.employees=res.data;
            })
        }
        $scope.getParlors();
    
        
    
        $scope.submitEmployees=function()
    {
          var a=[]  
            $scope.trainingSession.empList=$scope.trainingSession.employees.filter(function(s)
            {
                           if(s.isTrue)
                            {
                                
                                a.push({employeeId:s._id})
                                return {
                                employeeId :s._id    
                                };
                            }
                              
            })
            console.log("date",$scope.selectedTrainer)

            $http.post("/beuApp/submitTrainingSession",{unitId:$scope.trainingSession.selectedUnit,
                                                        superCategoryId:$scope.trainingSession.selectedSuperCategory
                                                        ,subCategoryId:$scope.trainingSession.selectedSubCategory
                                                       ,parlorId:$scope.trainingSession.selectedParlor,
                                                         chapterId:$scope.trainingSession.selectedChapter,
                                                         theory:$scope.trainingSession.theory,
                                                         practical:$scope.trainingSession.practical,
                                                            employees:a,date:$scope.date.dts,
                                                            trainerId:$scope.date.trainId,
                            }) .success(function(res)
                            {
                                                        console.log(res)
                            
                                                        if(!res.success)
                                                        {
                                                            alert(res.data);
                                                        }
                            
                                            else{
                                                 $scope.initialise()
                                            }
                                                       
                        
                        
                        })           
    }
        
        
        $scope.changeInQuestionsUnit=function()
        {
                $scope.questionObject.selectedSuperCategory=undefined;  
                $scope.questionObject.selectedSubCategory=undefined;
                $scope.questionObject.selectedChapter=undefined;
            
                for(i=0;i<$scope.question.length;i++)
                {
                    if($scope.question[i].unitId==$scope.questionObject.selectedUnit)
                    {
                        $scope.questionObjects.superCategory=$scope.question[i].superCategories;
                        break;
                    }
                }
            
        }
        
        $scope.changeInQuestionsSuperCategory=function(){
             
                $scope.questionObject.selectedSubCategory=undefined;
                $scope.questionObject.selectedChapter=undefined;
                    for(i=0;i<$scope.questionObjects.superCategory.length;i++)
                {
                    if($scope.questionObjects.superCategory[i]._id==$scope.questionObject.selectedSuperCategory)
                    {
                        $scope.questionObjects.subCategory=$scope.questionObjects.superCategory[i].subCategories;
                        break;
                    }
                }
            
        }
        
        $scope.changeInQuestionssubCategory=function()
        {
            
              
                $scope.questionObject.selectedChapter=undefined;
            console.log("hjfghghjds")
              for(i=0;i<$scope.questionObjects.subCategory.length;i++)
                {
                    if($scope.questionObjects.subCategory[i]._id==$scope.questionObject.selectedSubCategory)
                    {
                        $scope.questionObjects.chapters=$scope.questionObjects.subCategory[i].chapters;
                        console.log($scope.questionObjects.subCategory[i].chapters)
                        break;
                    }
                }
            
        }
        
        $scope.createOptions=function(){
            $scope.questionObject.optionArray=[];
            if($scope.questionObject.noOfOptions<5 && $scope.questionObject.noOfOptions>0 ){
                 for(i=0;i<$scope.questionObject.noOfOptions;i++)
            {
                $scope.questionObject.optionArray.push({});
            }
               }
            else{
                alert("no of Options must be greater and less then 0 and 5")
                $scope.questionObject.noOfOptions=undefined;
                
            }
          
        }
        
        $scope.clickme=function(){
            console.log($scope.selectedquestion);
        }
        
        $scope.changeInChapters=function(){
//             for(i=0;i<$scope.questionObjects.subCategory.length;i++)
//                {
//                    if($scope.questionObjects.subCategory[i]._id==$scope.questionObject.selectedsubCategory)
//                    {
//                        $scope.questionObjects.chapters=$scope.questionObjects.subCategories[i].chapters;
//                        break;
//                    }
//                }
            
        }
        
        $scope.submitQuestions=function(){
            var s={};
            s.subCategoryId=$scope.questionObject.selectedSubCategory;
            s.superCategoryId=$scope.questionObject.selectedSuperCategory;
            s.chapterId=$scope.questionObject.selectedChapter;
            s.unitId=$scope.questionObject.selectedUnit;
            s.options=$scope.questionObject.optionArray;;
            s.answer=$scope.selectedquestion.answer;
            s.question=$scope.questionObject.selectedQuestion;
;
                    console.log(s)
                 console.log($scope.selectedquestion)
            if($scope.selectedquestion.answer!=undefined)
            {   
                s.options=s.options.map(function(mk,i){
                    if(i==$scope.selectedquestion.answer)
                    {
                                mk.isAnswer=true;        
                    }
                    else{
                        mk.isAnswer=false;
                    }
                    return mk;
                })
                console.log(s)
                
            $http.post("/beuApp/createTrainingQuestion",s).success(function(res){
                console.log(res)
                $scope.questionObject={};
                $scope.selectedquestion.answer=""
                alert(res.data)
            })
                
            }
            else{
                alert("Please select one answer first")
            }
           
        }
        
        $scope.submitQuiz=function(){
            $scope.model=[]
                                var a=$scope.quizArray.reduce(function(m,h){
                                                if(h.answer==undefined)
                                                {
                                                    m=false
                                                }
                                    return m;
                                    
                                },true)
                                            $scope.model=$scope.quizArray.map(function(as){
                                                        var a={questionId:as._id,answer:as.answer}
                                                        return a
                                            })
                                
                                if(a){
                                                $http.post("/beuApp/submitTrainingQuiz",{employeeId : "58899d1ff8169604955dcd47",sessionId : "5a2e72846823f01444524987",quiz:$scope.model}) .success(function(res){
                                                    console.log(res)
                                                })
                                    }
                            else{
                                            alert("Please tick Them first")
                            }
                                console.log(a)
        }
        
    


})
