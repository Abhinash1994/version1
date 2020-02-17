'use strict';

angular.module('sbAdminApp', ['ui.calendar','ui.bootstrap','daterangepicker','ngSanitize','ngTable'])
.controller('dealtestCtrl', function($scope,$http,$timeout) {
    $scope.rewindObject1={};
  $scope.hairCat1='';
  var categoriesCopy='';
  /*$scope.rewindObject=[];*/
//   data for dropdown getting it through api
        $http.get("/role3/newPackagesApi").success(function(response, status){
            console.log(response);
            $scope.deals=response.data;
        });
//     end of Api
        
  $scope.urlHomeSliderImages="/api/parlorDeals?parlorId="+parlorId;
        $http.get($scope.urlHomeSliderImages,{cache:false}).then(function(response) {
            console.log("hello",response.data);
            $scope.groupObject=angular.copy(response.data.data);
            console.log($scope.groupObject)
            for(var i=0;i<response.data.data.length;i++){
                if(response.data.data[i].name=='Package'){
                    $scope.categories=response.data.data[i].services;
                    console.log($scope.categories)

                    break;
                }
            }

            $scope.description=response.data.data[6].services[0].description;
            console.log($scope.description);

      for(var i=0;i<$scope.categories.length;i++){
        $scope.categories[i]['isSelected']=false;
      }
      console.log($scope.categories);
      categoriesCopy=angular.copy($scope.categories);
          $http.get("/role2/createDealJpeg").then(function(response) {

                console.log("h2",response);

        });
        })

        $http.get("/role2/logo").success(function(response, status){
            console.log('logo',response)
            $scope.parlorDetails=response.data;
            console.log($scope.parlorDetails);

        })
        // print code priview start
        $scope.generateJpeg=function(){
        var a=document.body.innerHTML;
        var b=document.getElementById('my-node').innerHTML;
        var x=0;

         function printDiv() {
         var divToPrint = document.getElementById('printArea');
          // var data='<img id="image" src="https://www.monsoonsalon.com/emailler/images/beu-logo.png">'
          console.log(b)


          var myWindow=window.open('','','width=1200,height=2000,margin=0');
          myWindow.document.write("<html><head><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' ><style type='text/css' media='all' >.row{ }.para{color:#fff;} .image{height:1800px;} b{ line-height: 30px; }  span b{font-size:24px; }  b{font-size:22px !important; font-weight:200;color:white;}  .abc{margin-top:2%;margin-right:1%;margin-left:1%;}.deal-images{width: 68%;margin: auto;position: absolute;top: 15px;left: 213px;}.deal-images img{width: 100%;height: auto;z-index: 2;position:absolute;left:0;top:0px;}img{width:100%;height:auto;z-index:2;position:absolute;left:0px;top:0px}.cv{font-size:20px;font-weight:200;}@page{size:auto;margin-top:5cm;margin: 0mm;scale:59;}.pricetext1{color:#034591;position:absolute;left:90px;top:22px;width:100%;z-index:777;font-size: 23px;}.pricetext2{color: #fff;z-index:777;position:absolute;left:40%;font-size: 23px;top:22px;}.pricetext3{color: #034591;position:absolute;top:22px;font-size: 23px;left:70%;}p{color:red;}.parloraddress{color: #fff;position:absolute;z-index:777;left:40%;font-size: 23px;top:20px;}.parlorName{color: #fff;position:absolute;z-index:777;left:85%;font-size: 23px!important;top:-30px;}.container-add{color: #fff;position:absolute;z-index:777;left:285px;top:0px;font-size: 23px!important;width:100%;}.parlorno{color: #fff;position:absolute;z-index:777;left: 82px;top:20px;font-size: 23px;}.col-md-4 {width: 33.33333333%;}.col-md-8 {width: 66.66666667%;}.headtext1{color: #fff;position:absolute;top:50px;z-index:777;left:110px;font-size: 23px;}.headdeal{color: #fff;position:absolute;top:50px;z-index:777;left:300px;font-size: 23px;}.headtext2{color: #fff;position:absolute;z-index:777;left:40%;font-size: 23px;}.headtext3{color: #fff;position:absolute;z-index:777;top:50px;left:70%;font-size: 23px;}.headTop1{top:750px;} .headTop{top:725px !important;font-size:27px;} </style>"+"</head><body>"+b+"</body></html>");
        
          myWindow.document.close();

          if(x>0){
              myWindow.print();
              // myWindow.close();
          }else {
              var is_chrome = Boolean(window.chrome);
              if (is_chrome) {
                  myWindow.onload = function () {
                      x++;
                      myWindow.print();
                      // myWindow.close();
                  };


              }
              else {
                  myWindow.print();
                  // myWindow.close();
              }
          }

        }
        printDiv() ;
        }
        
        
        // when the option is changed
            $scope.categorySelected=function(){
                       console.log($scope.rewindObject1.update1)
                $scope.selected={};
                if($scope.rewindObject1.update1=="Makeup"){
                         $scope.selected=angular.copy($scope.groupObject[11])     
//                            $scope.selected=[];
                                        $scope.selected=$scope.selected.services.filter(function(a,b){
                                                    return b>2;
                                        })
                }
                else if($scope.rewindObject1.update1=="Hair"){
                        $scope.selected=[];
                            $scope.selected[0]=$scope.groupObject[1].services[1]
                            $scope.selected[1]=$scope.groupObject[1].services[0]
                            $scope.selected.push($scope.groupObject[2].services[0])
                                var a=$scope.selected[1].name.substring(0,9);
                                var b=$scope.selected[1].name.substring(10,23);
                                var c=$scope.selected[1].name.substring(24,36)
                                $scope.selected[1].names=[]
                                $scope.selected[1].names[0]=a.concat("/");
                                $scope.selected[1].names[1]=b.concat("/");
                                $scope.selected[1].names[2]=c
                        }
            
                else if($scope.rewindObject1.update1=="Beauty"){
                     $scope.selected=angular.copy($scope.groupObject[9])  
                }
                
                console.log($scope.selected)
            }



});
