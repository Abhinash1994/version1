angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('createdPackageJpegCtrl', function (PackageMenuContent,$scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$parse, $timeout,$q) {

        /*alert(parlorType);*/

   

    if(parlorType==0){
        $scope.backGroundImage='Deal Menu_Red_background';
        $scope.stamp='stemp_3';
        $scope.logo='redSalonBeUHeading';
        $scope.dealMenuSecondHeading='#000000';
        $scope.departmentHeadingsColor='#632a0f';
        $scope.headcolor='#d2232b';
        $scope.topcommon='#892f1d';
        $scope.categoryHeadingsColor='#632a0d';
        $scope.ValidityColor='#8a5225';
        $scope.straightLineColor='1px solid #632a0d';
        $scope.textServicesDealPriceColor='black';
    }else if(parlorType==1){
        $scope.backGroundImage='Deal Menu_Blue_background';
        $scope.stamp='stemp_2';
        $scope.logo='blueSalonBeUHeading';
        $scope.headcolor='#034591';
        $scope.topcommon='#1996d3';
        $scope.dealMenuSecondHeading='#252c84';
        $scope.departmentHeadingsColor='#034591';
        $scope.categoryHeadingsColor='#034591';
        $scope.ValidityColor='#2cb3d4';
        $scope.straightLineColor='1px solid #034591';
        $scope.textServicesDealPriceColor='#183018';
    }else if(parlorType==2){
        $scope.backGroundImage='Deal Menu_Green_bcakground';
        $scope.stamp='stemp_1';
        $scope.logo='greenSalonBeUHeading';
        $scope.headcolor='#118942';
        $scope.topcommon='#007941';
        $scope.dealMenuSecondHeading='#01582b'
        $scope.departmentHeadingsColor='#01582b';
        $scope.ValidityColor='#4b7d42';
        $scope.categoryHeadingsColor='#118942';
        $scope.straightLineColor='1px solid #118942';
        $scope.textServicesDealPriceColor='#020034';
    }
  //console.log(dealMenuContent.dealObject.data);
  $scope.dealObject=JSON.parse(PackageMenuContent.dealObject.data);
    
  console.log("this is package deal",$scope.dealObject);
    console.log("hekkk")
    

$scope.manipulateString=function(){
         var c=['Beauty','Grooming','Makeover','Bridal',"Men's"]   
                for(var a in $scope.dealObject)
        {
                    c.forEach(function(s){
                        if($scope.dealObject[a].name!=undefined){
                            var f= $scope.dealObject[a].name.includes(s);
                                console.log($scope.dealObject[a].name)
                                console.log(f)
                            if(f){
                                  if(s=="Beauty")
                            {
                                $scope.dealObject[a].name="BEAUTY"
                            }
                            else if(s=="Grooming"){
                                  $scope.dealObject[a].name="GROOMING"
                            }
                            else if(s=="Makeover"){  $scope.dealObject[a].name="MAKEOVER"}
                            else if(s=="Bridal"){  $scope.dealObject[a].name="BRIDAL"}
                            else if(s=="Men's"){  $scope.dealObject[a].name="MEN'S"}
                            }
                        
                        }
                        
                              
                    })     
        }



}

$scope.manipulateString()    ;
   String.prototype.visualLength = function()
    {
        var ruler = document.getElementById("ruler");
        ruler.innerHTML = this;
        return ruler.offsetWidth;
    }

  $scope.calculatePxMenuPrice=function(x){
    for(var i=0;i<x.length;i++){
        var s =( x[i].menuPrice).toString();
        var len = (s.visualLength());
        x[i]['width']=len+'px';
        //console.log(len);
     }
    }
    //$scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat11.selectedServices);
    //$scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat12.selectedServices);
   // $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat21.selectedServices);
    //$scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat22.selectedServices);
   // $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat31.selectedServices);
   // $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat32.selectedServices);

    //$scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat11.selectedServices);
    //$scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat21.selectedServices);
    //$scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat22.selectedServices);

    //$scope.calculatePxMenuPrice($scope.dealObject.makeUp.makeUpCat11.selectedServices);
    //$scope.calculatePxMenuPrice($scope.dealObject.spa.spaCat11.selectedServices);


        $scope.generateJpeg=function(){
        console.log("hejkjkda")
      var a=document.body.innerHTML;
      var b=document.getElementById('my-node').innerHTML;


    var x=0;
    function printDiv() {
       var divToPrint = document.getElementById('printArea');
        // var data='<img id="image" src="https://www.monsoonsalon.com/emailler/images/beu-logo.png">'
        console.log(b)


        var myWindow=window.open('','','width=1200,height=2000,margin=0');
        myWindow.document.write("<html><head><link rel='stylesheet'  href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'><style type='text/css' media='all' >.row{ }.para{color:"+ $scope.departmentHeadingsColor+"!important;}.cutomise{font-size:35px!important;} .para2{color:"+ $scope.headcolor+"!important;} .image{height:2200px;} b{ line-height: 30px; }  span{font-size:21px!important;font-weight: 700; } td b{font-size:25px; font-weight:200;}.toptext{text-align: center;font-size:18px;color:"+$scope.headcolor+"!important;}.validity{color:"+$scope.ValidityColor+"!important;}.topcommon{color:"+$scope.topcommon+"!important;} strike{color: #d2232b!important;}.persentage{border:1px solid red;color:#6e5654!important;border-radius: 4px!important;padding:5px!important;}p{font-size:20px;color:#555555!important;font-weight: 100;font-family: sans-serif;} .menuprice{margin-left:5px;}.dealprice{margin: 5px;}.abc{margin-right:1%;margin-left:1%;margin-top:1%;} .pad{padding-left:2%;padding-right:2%;} .cv{font-size:20px; font-weight:200;} h3{margin-top:0px;margin-bottom:1px;}.log{padding-top:4%!important;padding-bottom:4%!important;}.greenmenu{color:green!important;} .row{margin:0px; }.contentText{width:20%;padding-left: 1%;float: left;}.stamp{position:absolute;right:11%!important;top:1%;width:14%!important;}.contentTextLast{margin-right: 1%;width:18%;float:left;margin-left:3px;} @page {size:  auto;margin-top: 5cm;  margin: 0mm;scale:59;}</style>" + "</head><body>"+b+"</body></html>");
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
       // document.body.innerHTML=a;

          //      html2canvas($("#my-node"), {
          //       allowTaint: true,
          //   taintTest:false,

          //   onrendered: function(canvas) {


          //        var ctxS = canvas.getContext('2d');
          //        ctxS.imageSmoothingEnabled=true;
          //        ctxS.mozImageSmoothingEnabled = true;
          //        ctxS.webkitImageSmoothingEnabled = false;
          //        ctxS.msImageSmoothingEnabled = false;
          //       ctxS.font = '30px sans-serif';

          //           //console.log(ctxS);
          //       var a = document.createElement('a');
          //       // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
          //       // var myImage = canvas.toDataURL("image/jpg",1);
          //       // window.open(myImage);
          //       // var image = new Image();
          //       console.log(canvas.getContext('2d'));
          //       a.href = canvas.toDataURL("image/jpeg",1.0);
          //       a.download = 'Deal Menu.png';
          //       a.click();
          //       // console.log(a.href)
          //    }
          // });









        }






         });
