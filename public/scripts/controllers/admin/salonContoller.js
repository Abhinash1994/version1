'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', ['ui.bootstrap','isteven-multi-select'])
  .controller('SalonCtrl', function($scope,$position, $http, $stateParams, $state) {

    $scope.parlorId = $stateParams.parlorId;
    $scope.p = {};
    $scope.cities=[{cityName:"Delhi",cityId:1},{cityName:"Banglore",cityId:2 , cityName:"Pune",cityId:3}]
    
    $scope.d=[]
     $scope.f=[] 
     $scope.e=[]
   
  

     $scope.banks=[{"name" : "Abu Dhabi Commercial Bank"},{"name" : "Abhyudaya Cooperative Bank"},{"name" : "Akola District Central Co-Operative Bank"},{"name" : "Allahabad Bank"},{"name" : "Almora Urban Co-Operative Bank ltd"},{"name" : "Andhra Bank"},{"name" : "Andhra Pragathi Grameena Bank"},{"name" : "Apna Sahakari Bank Ltd"},{"name" : "Australia and New Zealand Banking Group Ltd"},{"name" : "Axis Bank"},{"name" : "Bank of America"},{"name" : "Bank of Bahrein and Kuwait"},{"name" : "Bank of Baroda"},{"name" : "Bank of Ceylon"},{"name" : "Bank of India"},{"name" : "Bank Internasional Indonesia"},{"name" : "Bank of Maharashtra"},{"name" : "Bank of Tokyo Mitsubishi UFJ Ltd"},{"name" : "Barclays Bank"},{"name" : "Bassein Catholic Co-Op Bank Ltd"},{"name" : "Bharatiya Mahila Bank Ltd"},{"name" : "BNP Paribas Bank"},{"name" : "Commonwealth Bank of Australia"},{"name" : "Canara Bank"},{"name" : "Capital Local Area Bank Ltd"},{"name" : "Catholic Syrian Bank"},{"name" : "Central Bank of India"},{"name" : "Chinatrust Commercial Bank"},{"name" : "CITI Bank"},{"name" : "Citizen Credit Cooperative Bank"},{"name" : "City Union Bank Ltd"},{"name" : "Corporation Bank"},{"name" : "Credit Agricole Corporate and Investment Bank"},{"name" : "Credit Suisse AG"},{"name" : "DBS Bank Ltd"},{"name" : "Dena Bank"},{"name" : "Deutsche Bank"},{"name" : "Development Credit Bank Ltd"},{"name" : "Dhanlaxmi Bank Ltd"},{"name" : "DICGC"},{"name" : "Dombivli Nagari Sahakari Bank Ltd"},{"name" : "Firstrand Bank Ltd"},{"name" : "Gopinath Patil Parsik Janata Sahakari Bank"},{"name" : "Gurgaon Gramin Bank Ltd"},{"name" : "HDFC Bank Ltd"},{"name" : "HSBC"},{"name" : "HSBC Bank Oman Saog"},{"name" : "ICICI Bank Ltd"},{"name" : "IDBI Ltd"},{"name" : "Indian Bank"},{"name" : "Indian Overseas Bank"},{"name" : "Indusind Bank Ltd"},{"name" : "Industrial and Commercial Bank of China Ltd"},{"name" : "ING Vysya Bank Ltd"},{"name" : "Jalgaon Janata Sahkari Bank Ltd"},{"name" : "Jankalyan Sahakari Bank Ltd"},{"name" : "Janata Sahakari Bank Ltd (Pune)"},{"name" : "Janaseva Sahakari Bank Ltd (Pune)"},{"name" : "Janaseva Sahakari Bank (Borivli) Ltd"},{"name" : "JP Morgan Chase Bank NA"},{"name" : "Kallappanna Awade Ich Janata S Bank"},{"name" : "Kapole Cooperative Bank"},{"name" : "Karnataka Bank Ltd"},{"name" : "Karnataka Vikas Grameena Bank"},{"name" : "Karur Vysya Bank"},{"name" : "Kerala Gramin Bank"},{"name" : "Kotak Mahindra Bank"},{"name" : "Kurmanchal Nagar Sahkari Bank Ltd"},{"name" : "Mahanagar Cooperative Bank Ltd"},{"name" : "Maharastra State Cooperative Bank"},{"name" : "Mashreq Bank"},{"name" : "Mizuho Corporate Bank Ltd"},{"name" : "Mumbai District Central Co-Op Bank Ltd"},{"name" : "Nagar Urban Co-Operative Bank"},{"name" : "Nagpur Nagrik Sahakari Bank Ltd"},{"name" : "National Australia Bank"},{"name" : "New India Cooperative Ban Ltd"},{"name" : "NKGSB Cooperative Bank Ltd"},{"name" : "North Malabar Gramin Bank"},{"name" : "Nutan Nagarik Sahakari Bank Ltd"},{"name" : "Oman International Bank"},{"name" : "Oriental Bank of Commerce"},{"name" : "Prathama Bank"},{"name" : "Pragathi Krishna Gramin Bank"},{"name" : "Prime Co-Operative Bank Ltd"},{"name" : "Punjab and Maharashtra Cooperative Bank Ltd"},{"name" : "Punjab and Sind Bank"},{"name" : "Punjab National Bank"},{"name" : "Rabobank International (CCRB)"},{"name" : "Rajkot Nagarik Sahakari Bank Ltd"},{"name" : "Rajgurunagar Sahakari Bank Ltd"},{"name" : "Reserve Bank of India"},{"name" : "SBER Bank"},{"name" : "Shinhan Bank"},{"name" : "Shikshak Sahakari Bank Ltd"},{"name" : "Shri Chhatrapati Rajarshi Shahu Urban Co-Op Bank Ltd"},{"name" : "Societe Generale"},{"name" : "Solapur Janata Sahkari Bank Ltd, Solapur"},{"name" : "South Indian Bank"},{"name" : "Standard Chartered Bank"},{"name" : "State Bank of Bikaner and Jaipur"},{"name" : "State Bank of Hyderabad"},{"name" : "State Bank of India"},{"name" : "State Bank of Mauritius Ltd"},{"name" : "State Bank of Mysore"},{"name" : "State Bank of Patiala"},{"name" : "State Bank of Travancore"},{"name" : "Sumitomo Mitsui Banking Corporation"},{"name" : "Syndicate Bank"},{"name" : "Tamil Nadu Mercantile Bank"},{"name" : "Thane Bharat Sahakari Bank Ltd"},{"name" : "The A.P. Mahesh Co-Op Urban Bank Ltd"},{"name" : "The Akola Janata Commercial Cooperative Bank"},{"name" : "The Andhra Pradesh State Coop Bank Ltd"},{"name" : "The Ahmedabad Merc. Cooperative Bank"},{"name" : "The Bank of Nova Scotia"},{"name" : "The Bharat Cooperative Bank Ltd"},{"name" : "The Cosmos Cooperative Bank Ltd"},{"name" : "The Delhi State Cooperative Bank Ltd"},{"name" : "The Federal Bank Ltd"},{"name" : "The Gadchiroli District Central Cooperative Bank Ltd"},{"name" : "The Greater Bombay Co-operative Bank Ltd"},{"name" : "The Gujarat State Co-Operative Bank Ltd"},{"name" : "The Jalgaon Peoples Co-Op Bank"},{"name" : "The Jammu and Kashmir Bank"},{"name" : "The Karad Urban Co-op Bank Ltd"},{"name" : "The Kalupur Commercial Cooperative Bank"},{"name" : "The Karnataka State Apex Cooperative Bank Ltd"},{"name" : "The Kalyan Janata Sahakari Bank Ltd"},{"name" : "The Kangra Central Cooperative Bank Ltd"},{"name" : "The Kangra Cooperative Bank Ltd"},{"name" : "The Lakshmi Vilas Bank"},{"name" : "The Mehsana Urban Cooperative Bank Ltd"},{"name" : "The Municipal Co Operative Bank Ltd, Mumbai"},{"name" : "The Nasik Merchants Co-Op Bank Ltd"},{"name" : "The Nainital Bank Ltd"},{"name" : "The Rajasthan State Cooperative Bank Ltd"},{"name" : "The Ratnakar Bank Ltd"},{"name" : "The Royal Bank of Scotland N.V."},{"name" : "The Saraswat Cooperative Bank Ltd"},{"name" : "The Sahebrao Deshmukh Co-Op. Bank Ltd"},{"name" : "The Seva Vikas Co-Operative Bank Ltd (SVB)"},{"name" : "The Shamrao Vithal Cooperative Bank Ltd"},{"name" : "The Surat District Co Operative Bank Ltd"},{"name" : "The Surat Peoples Co-Op Bank Ltd"},{"name" : "The Sutex Cooperative Bank"},{"name" : "The Tamilnadu State Apex Cooperative Bank"},{"name" : "The Thane Janata Sahakari Bank Ltd"},{"name" : "The Thane District Central Co-Op Bank Ltd"},{"name" : "The Varachha Co-Op. Bank Ltd"},{"name" : "The Vishweshwar Sahakari Bank Ltd., Pune"},{"name" : "The West Bengal State Cooperative Bank Ltd"},{"name" : "The Zoroastrian Cooperative Bank Limited"},{"name" : "Tumkur Grain Merchants Cooperative Bank Ltd"},{"name" : "UCO Bank"},{"name" : "Union Bank of India"},{"name" : "United Bank of India"},{"name" : "United Overseas Bank"},{"name" : "Vasai Vikas Sahakari Bank Ltd"},{"name" : "Vijaya Bank"},{"name" : "Westpac Banking Corporation"},{"name" : "Woori Bank"},{"name" : "Yes Bank Ltd"},{"name" : "Zila Sahkari Bank Ltd Ghaziabad"}];

    $http.get("/role1/parlorDetail?parlorId=" + $scope.parlorId).success(function(response, status){
        // console.log(response.data)
        $scope.p = angular.copy(response.data.parlor);
         console.log("------------------",new Date($scope.p.parlorLiveDate));
      if($scope.p.parlorLiveDate==null && $scope.p.parlorLiveDate==undefined)
        {
              $scope.flag=false;
        }
      
      else{
         $scope.p.parlorLiveDate=new Date($scope.p.parlorLiveDate)
              $scope.manager=response.data
            // console.log($scope.manager)
            $scope.currentDate=new Date();
            $scope.currentDate=new Date($scope.currentDate.getFullYear()+'-'+ $scope.currentDate.getMonth()+'-'+ $scope.currentDate.getDate() );
            $scope.parlorLiveDate=new Date($scope.p.parlorLiveDate.getFullYear()+'-'+$scope.p.parlorLiveDate.getMonth()+'-'+$scope.p.parlorLiveDate.getDate());
            $scope.oneDayAfter=new Date(new Date($scope.p.parlorLiveDate).setDate($scope.p.parlorLiveDate.getDate()+1));
            $scope.oneDayAfter=new Date($scope.oneDayAfter.getFullYear()+'-'+$scope.oneDayAfter.getMonth()+'-'+($scope.oneDayAfter.getDate()));
            // console.log($scope.currentDate)
            // console.log($scope.oneDayAfter)
            if($scope.currentDate.getTime()==$scope.parlorLiveDate.getTime() || $scope.oneDayAfter.getTime()==$scope.currentDate.getTime() ){
              $scope.flag=false;
              // console.log("hello")
            }
        else{
              $scope.flag=true;
            }


      }
        
        $scope.eList1=angular.copy(response.data)
         $scope.eList2=angular.copy(response.data) 
         $scope.eList3=angular.copy(response.data)
         
              $scope.eList1.employee.forEach(function(a){
            response.data.salonHead.forEach(function(b){
                if(a.id==b){
                    a.ticked=true;
                }
            })
           
       }) 
            $scope.eList2.employee.forEach(function(a){
            response.data.asstManager.forEach(function(b){
                if(a.id==b){
                    a.ticked=true;
                }
            })
           
       }) 
                 
            $scope.eList3.employee.forEach(function(a){
            response.data.salonManager.forEach(function(b){
                if(a.id==b){
                    a.ticked=true;
                }
            })
           
       }) 
              
              
       
        
    });
    $scope.updateParlor = function(){
        var e=[]
        $scope.e.forEach(function(a){
            e.push(a.id)
        })
        
          var d=[]
        $scope.d.forEach(function(a){
            d.push(a.id)
        })
         var f=[]
        $scope.f.forEach(function(a){
            f.push(a.id)
        })
        //  console.log(d)
        // console.log(f)
        // console.log(e)
        $scope.p.avgRoyalityAmount=$scope.p.minimumGuarantee;
        // console.log($scope.p)

      $http.post("/role1/updateParlor", {parlorId : $scope.parlorId, data : $scope.p,salonHead:d,salonAsst:f,salonManager:e}).success(function(response, status){
          $scope.p = response.data;
      });
    }

 
 var today = new Date();
  today.setMonth(today.getMonth()+6);
  $scope.tre = today;
  
  $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());
  $scope.today = function() {
    $scope.p = new Date();
    $scope.maxDate = $scope.minDate ? null : new Date();
  };
  $scope.today();

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();

  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };



    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };
      $scope.open2 = function() {
       
        $scope.popup2.opened = true;
    };

    $scope.popup3 = {
        opened: false
    };
      $scope.open3 = function() {
       
        $scope.popup3.opened = true;
    };

    $scope.popup4 = {
        opened: false
    };
      $scope.open4 = function() {
       
        $scope.popup4.opened = true;
    };

    $scope.popup5 = {
        opened: false
    };

       $scope.open5 = function() {
        $scope.popup5.opened = true;
    };

     $scope.popup6 = {
        opened: false
    };

       $scope.open6 = function() {
        $scope.popup6.opened = true;
    };
    $scope.popup7 = {
        opened: false
    };

       $scope.open7 = function() {
        $scope.popup7.opened = true;
    };

    $scope.p.discountEndTime = new Date();
   
  
    
    $scope.dateOptions = { 
        formatYear: 'yy',
        startingDay: 1
    
    };
  });
