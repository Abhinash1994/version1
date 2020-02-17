angular.module('sbAdminApp', ['ui.calendar', 'ui.bootstrap','isteven-multi-select','daterangepicker','ngSanitize', 'ngCsv'])

    .controller('createdJpegCtrl', function (dealMenuContent,$scope, $compile, $http, $timeout, $window, $log,NgTableParams,Excel,$parse, $timeout,$q) {
    $http.post("employeeApp/salonSupportReport").success(function(res){
        console.log(res);
        $scope.homeData=res.data;
        console.log($scope.homeData);
        
    })

        /*alert(parlorType);*/
    $scope.parlorType=parlorType;
    if(parlorType==0){
        $scope.backGroundImage='Deal Menu_Red_background';
        $scope.stamp='stemp_3';
        $scope.logo='redSalonBeUHeading';
        $scope.dealMenuSecondHeading='#000000';
        $scope.departmentHeadingsColor='#632a0f';
        $scope.categoryHeadingsColor='#632a0d';
        $scope.straightLineColor='1px solid #632a0d';
        $scope.textServicesDealPriceColor='black';
    }else if(parlorType==1){
        $scope.backGroundImage='Deal Menu_Blue_background';
        $scope.stamp='stemp_2';
        $scope.logo='blueSalonBeUHeading';
        $scope.dealMenuSecondHeading='#252c84'
        $scope.departmentHeadingsColor='#034591';
        $scope.categoryHeadingsColor='#034591';
        $scope.straightLineColor='1px solid #034591';
        $scope.textServicesDealPriceColor='#183018';
    }else if(parlorType==2){
        $scope.backGroundImage='Deal Menu_Green_bcakground';
        $scope.stamp='stemp_1';
        $scope.logo='greenSalonBeUHeading';
        $scope.dealMenuSecondHeading='#01582b'
        $scope.departmentHeadingsColor='#01582b';
        $scope.categoryHeadingsColor='#118942';
        $scope.straightLineColor='1px solid #118942';
        $scope.textServicesDealPriceColor='#020034';
    }
  //console.log(dealMenuContent.dealObject.data);
  $scope.dealObject=JSON.parse(dealMenuContent.dealObject.data);
  console.log($scope.dealObject);
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
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat11.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat12.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat21.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat22.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat31.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.hair.hairCat32.selectedServices);

    $scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat11.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat21.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.beauty.beautyCat22.selectedServices);

    $scope.calculatePxMenuPrice($scope.dealObject.makeUp.makeUpCat11.selectedServices);
    $scope.calculatePxMenuPrice($scope.dealObject.spa.spaCat11.selectedServices);


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
        myWindow.document.write("<html><head><link rel='stylesheet'  href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'><style type='text/css' media='all' >.row{ }.para{color:"+ $scope.departmentHeadingsColor+"!important;} .image{height:97%;} b{ line-height: 30px;font-weight:100!important; } span{font-size:25px;color:#555555!important;font-weight:100!important;} span b{font-size:25px;color:#555555!important;font-weight:100!important;} td b{font-size:25px; font-weight:100!important;color:#555555!important;} .dealstamp{position: absolute;top: -71px!important;z-index: 8;right: 72%;width: 65%!important;} .abc{margin-top:2%;margin-right:1%;margin-left:1%;} .cv{font-size:20px; font-weight:200;} @page {size:  auto;margin-top: 5cm;  margin: 0mm;scale:59;}</style>" + "</head><body>"+b+"</body></html>");
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