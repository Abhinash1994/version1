
'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 * Main module of the application.
 */
var app = angular
    .module('sbAdminApp', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'nvd3',
        'ngTable',
        'ngSanitize',
        'ngAnimate',
        'ngCsv',
        'mwl.calendar',
        'ui-notification',
        'angular-clipboard',
        'ngFileUpload',
        'pdf',
        'ngToast',
        'rzModule',
        'textAngular',
        'angularUtils.directives.dirPagination',
        'anguFixedHeaderTable',
        'ngRoute',
        'ngResource',
        'ngMap',
        'dndLists',
        'ngSelectable',
        'ui.bootstrap.pagination', 
        'ui.bootstrap.datetimepicker',
    ]);



app.filter('monthName', [function() {
    return function(monthNumber) { //1 = January
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber];
    }
}]);

app.filter("mycustomFilter",[function(){
    return function(a,b,c,d){
        var temp=0;
       if(a.analysis[b]==null)
       {}
       else{
          var filteredItem= a.analysis[b].filter(function(n){
              return n.serviceCategory==c.serviceCategory;
           })

           if(filteredItem.length>0)
           {
               if(d=='service')
               {
                   temp=filteredItem[0].numberOfServices;
               }
               else{
                   temp=filteredItem[0].totalRevenue;
               }
}}
            return temp;}}])
app.filter("total",[function(){
    return function(a,b,c){
        var temp=0
                if(a[b]==null)
                {

                }
                else{
                            if(c=='service')
                            {
                                temp=a[b].reduce(function(data,val){
                                   data=data+val.numberOfServices;
                                   return data;
                                },0)
                            }
                            else{
                                temp=a[b].reduce(function(data,val){
                                    data=data+val.totalRevenue;
                                    return data;
                                },0)

                            }
        }
        return temp;
    }
}])

app.filter('roles', function() {
    return function(role) {

        var sendRole = ['', 'Admin', 'HR', 'Operations', 'Sales', '', 'Trainer', 'Marketing', 'Designer', 'Cashier', 'Call Center', 'Finance']
        return sendRole[role];
    }
})

app.filter('filterOutCustomerWord', function() {
    return function(text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;

        return length > limit ? changedString.substr(0, limit - 1) : changedString;
    }
});
app.filter('filterOutNotificationWord', function() {
    return function(text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;

        return length > limit ? changedString.substr(12, limit - 1) : changedString;
    }
});
app.filter('ceil', function() {
    return function(input) {
        return Math.ceil(input);
    };
});
app.directive('disableRightClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            element.bind('contextmenu', function(e) {
                e.preventDefault();
            })
        }
    }
})
app.factory('Excel', function($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        };
    return {
        tableToExcel: function(tableId, worksheetName) {
            var table = $(tableId),
                ctx = {
                    worksheet: worksheetName,
                    table: table.html()
                },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});

app.service("deleteAppointmentIdService", function() {
    var appointmentId = '';

    function getappointmentId() {
        return appointmentId;
    }

    function setappointmentId(newAppointmentId) {
        appointmentId = newAppointmentId;
    }
    return {
        getappointmentId: getappointmentId,
        setappointmentId: setappointmentId,
    }
});

app.service("dealMenuContent", function() {
    var dealObject = '';
});
app.service("PackageMenuContent", function() {
    var dealObject = '';
});



app.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});



app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });


    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('dashboard.home', {
            url: '/home',
            controller: 'MainCtrl',
            templateUrl: 'views/dashboard/home.html',
            resolve: {
                loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            '/scripts/controllers/main.js',
                            '/scripts/directives/timeline/timeline.js',
                            '/scripts/directives/notifications/notifications.js',
                            '/scripts/directives/chat/chat.js',
                            '/scripts/directives/dashboard/stats/stats.js',
                            '/scripts/directives/graph/graphDirective.js',
                            '/scripts/controllers/chatController.js',
                            'bower_components/socket.io-client/dist/socket.io.js',
                            '/styles/chat.css',
                            '/libraries/faceDetectionLib/tracking-min.js',
                            '/libraries/faceDetectionLib/face-min.js',
                            '/libraries/faceDetectionLib/dat.gui.min.js',
                            '/libraries/faceDetectionLib/stats.min.js'
                        ]
                    })
                }
            }
        })

    .state('dashboard', {
            url: '/dashboard',
            controller: 'mainHtmlCtrl',
            templateUrl: 'views/dashboard/main.html',
            resolve: {
                loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            '/scripts/controllers/mainHtmlCtrl.js',
                         

                        ]
                    })
                },
                loadMyDirectives: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: [
                                'bower_components/socket.io-client/dist/socket.io.js',
                                '/scripts/directives/header/header.js',
                                '/scripts/directives/header/header-notification/header-notification.js',
                                '/scripts/directives/notifications/notifications.js',
                                '/scripts/directives/sidebar/sidebar.js',
                                '/scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                                '/libraries/faceDetectionLib/tracking-min.js',
                                '/libraries/faceDetectionLib/face-min.js',
                                '/libraries/faceDetectionLib/dat.gui.min.js',
                                '/libraries/faceDetectionLib/stats.min.js',
                                '/libraries/angular-ui-notification/angular-ui-notification.js',
                                '/libraries/ng-toast/dist/ngToast.min.js'


                            ]
                        }),
                        $ocLazyLoad.load({
                            name: 'toggle-switch',
                            files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                            ]
                        }),
                        $ocLazyLoad.load({
                            name: 'ngAnimate',
                            files: ['bower_components/angular-animate/angular-animate.js']
                        })
                    $ocLazyLoad.load({
                        name: 'ngCookies',
                        files: ['bower_components/angular-cookies/angular-cookies.js']
                    })
                    $ocLazyLoad.load({
                        name: 'ngResource',
                        files: ['bower_components/angular-resource/angular-resource.js']
                    })
                    $ocLazyLoad.load({
                        name: 'ngSanitize',
                        files: ['bower_components/angular-sanitize/angular-sanitize.js']
                    })
                    $ocLazyLoad.load({
                            name: 'ngTouch',
                            files: ['bower_components/angular-touch/angular-touch.js']
                        })
                        /*$ocLazyLoad.load(
                            {
                                name:'ui-notification',
                                files:['/libraries/angular-ui-notification/angular-ui-notification.js']
                            })*/
                        /*$ocLazyLoad.load(
                         {
                         name:'d3',
                         files:['bower_components/d3/d3.min.js']
                         })
                         $ocLazyLoad.load(
                         {
                         name:'nvd3',
                         files:['bower_components/nvd3/build/nv.d3.js',
                         'bower_components/nvd3/build/nv.d3.css']
                         })
                         $ocLazyLoad.load(
                         {
                         name:'angular-nvd3',
                         files:['bower_components/angular-nvd3/dist/angular-nvd3.js']
                         })*/
                }
            }
        })
        .state('dashboard.facebookpage', {
            url: '/facebookpage',
            controller: 'FacebookCtrl',
            templateUrl: 'views/marketing/facebookpage.html',
            resolve: {
                loadMyFiles: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            '/scripts/controllers/facebookPageController.js',
                        ]
                    })
                }
            }
        })
           .state('dashboard.updatedealprice', {
            templateUrl: 'views/deal/updatedealprice.html',
            controller: 'updatedealprice',
            url: '/update-deal-price',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/deal/updatedealprice.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })

        .state('dashboard.editDeal', {
            templateUrl: 'views/deal/edit-deal.html',
            controller: 'dealCtrl',
            url: '/edit-deal?dealIdParlor',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/deal/dealEditController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        //    .state('dashboard.dealMenu',{
        //     templateUrl:'views/dealMenu.html',
        //     controller:'dealMenuCtrl',
        //     url:'/dealMenu',
        //     resolve: {
        //       loadMyFile:function($ocLazyLoad) {
        //         return $ocLazyLoad.load({
        //             name:'sbAdminApp',
        //             files:['/scripts/controllers/dealMenuController.js','bower_components/angular-multi-select-master/isteven-multi-select.js','bower_components/angular-multi-select-master/isteven-multi-select.css'
        //           ,'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css','bower_components/moment/moment.js','bower_components/bootstrap-daterangepicker/daterangepicker.js','bower_components/angular-daterangepicker/js/angular-daterangepicker.js','bower_components/dom-to-image/src/dom-to-image.js']
        //         })
        //       }
        //     }
        // })
        .state('dashboard.createdJpeg', {
            templateUrl: 'views/createdJpeg.html',
            controller: 'createdJpegCtrl',
            url: '/createdJpeg',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/createdJpegController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/dom-to-image/src/dom-to-image.js', 'bower_components/fileSaver/fileSaver.js', '/libraries/file-saver/canvas-toBlob.js']
                    })
                }
            }
        })


    .state('dashboard.createdPackageJpeg', {
        templateUrl: 'views/createdPackageJpeg.html',
        controller: 'createdPackageJpegCtrl',
        url: '/createdPackageJpeg',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/createdPackageJpegController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/dom-to-image/src/dom-to-image.js', 'bower_components/fileSaver/fileSaver.js', '/libraries/file-saver/canvas-toBlob.js']
                })
            }
        }

    })


    .state('dashboard.cashOnlineReport', {
        templateUrl: 'views/adminReports/cashOnlineReport.html',
        controller: 'cashOnlineReportCtrl',
        url: '/cashOnlineReport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/cashOnlineReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.relevanceReport', {
        templateUrl: 'views/adminReports/relevanceReport.html',
        controller: 'relevanceReportCtrl',
        url: '/relevanceReport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/relevanceReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.apptsOfRelevance', {
        templateUrl: 'views/adminReports/apptsOfRelevance.html',
        controller: 'apptsOfRelevance',
        url: '/apptsOfRelevance',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/apptsOfRelevance.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.notifcations', {
            templateUrl: 'views/admin/notifications.html',
            controller: 'notifcationCtrl',
            url: '/sendNotifications',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/sendNotification.js']
                    })
                }
            }
        })
        .state('dashboard.adminAdhar', {
            templateUrl: 'views/admin/adminAdhar.html',
            controller: 'adminAdhar',
            url: '/adminAdhar',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/adminAdhar.js']
                    })
                }
            }
        })


    .state('dashboard.salonAdhar', {
            templateUrl: 'views/admin/salonAdhar.html',
            controller: 'salonAdhar',
            url: '/salonAdhar',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/salonAdhar.js']
                    })
                }
            }
        })
        .state('dashboard.gstDetails', {
            templateUrl: 'views/admin/gstDetails.html',
            controller: 'gstDetails',
            url: '/gstDetails',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/gstDetails.js']
                    })
                }
            }
        })
        .state('dashboard.adminGST', {
            templateUrl: 'views/admin/adminGST.html',
            controller: 'adminGST',
            url: '/adminGST',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/adminGST.js']
                    })
                }
            }
        })
        .state('dashboard.searchOpt', {
            templateUrl: 'views/admin/searchOpt.html',
            controller: 'searchOpt',
            url: '/searchOTP',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/searchOpt.js']
                    })
                }
            }
        })
        .state('dashboard.cashBackDetails', {
            templateUrl: 'views/admin/cashBackDetails.html',
            controller: 'cashBackDetails',
            url: '/cashBackDetails',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/cashBackDetails.js']
                    })
                }
            }
        })
        .state('dashboard.employeeNotifcations', {
            templateUrl: 'views/admin/EmployeeNotifications.html',
            controller: 'employeeNotifcationCtrl',
            url: '/employeeSendNotifications',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/employeeSendNotification.js']
                    })
                }
            }
        })

    .state('dashboard.parlors', {
            templateUrl: 'views/admin/parlors.html',
            controller: 'ParlorsCtrl',
            url: '/parlors',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorsContoller.js']
                    })
                }
            }
        })
        .state('dashboard.editSalon', {
            templateUrl: 'views/admin/edit-salon.html',
            controller: 'SalonCtrl',
            url: '/edit-salon?parlorId',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/salonContoller.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        

    .state('dashboard.owners', {
        templateUrl: 'views/admin/owners.html',
        controller: 'OwnersCtrl',
        url: '/owners',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/ownersController.js']
                })
            }
        }
    })

    .state('dashboard.create-membership', {
            templateUrl: 'views/membership/create-membership.html',
            controller: 'createMembershipCtrl',
            url: '/create-membership',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/membership/createMembershipController.js']
                    })
                }
            }
        })
        .state('dashboard.view-membership', {
            templateUrl: 'views/membership/view-membership.html',
            controller: 'viewMembershipCtrl',
            url: '/create-membership',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/membership/viewMembershipController.js']
                    })
                }
            }
        })
        .state('dashboard.previous-expense', {
            templateUrl: 'views/expense/previous-expense.html',
            controller: 'PreviousExpenseCtrl',
            url: '/previous-expense',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/expense/previousExpenseController.js']
                    })
                }
            }
        })
        .state('dashboard.createOffer', {
            templateUrl: 'views/offer/create-offer.html',
            controller: 'CreateOfferCtrl',
            url: '/create-offer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/offer/createOfferCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.calendar', {
            templateUrl: 'views/appointment/calendar-view.html',
            controller: 'calendarCtrl',
            url: '/calendar',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/calendarController.js', 'bower_components/moment/moment.js', 'bower_components/fullcalendar-3.1.0/fullcalendar.min.css', 'bower_components/fullcalendar-3.1.0/fullcalendar.min.js', 'bower_components/fullcalendar-3.1.0/scheduler.min.css', 'bower_components/fullcalendar-3.1.0/scheduler.min.js']
                    })
                }
            }
        })
        .state('dashboard.sellSubscription', {
            templateUrl: 'views/appointment/sellSubscription.html',
            controller: 'sellSubscription',
            url: '/sellSubscription',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/sellSubscription.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css' ]
                    })
                }
            }
        })
        .state('dashboard.createDeal', {
            templateUrl: 'views/deal/create-deal.html',
            controller: 'CreateDealCtrl',
            url: '/create-deal',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/deal/createDealCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })

    .state('dashboard.offers', {
            templateUrl: 'views/offer/offers.html',
            controller: 'OffersCtrl',
            url: '/offers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/offer/offerCtrl.js']
                    })
                }
            }
        })
        .state('dashboard.appointments', {
            templateUrl: 'views/appointments.html',
            controller: 'AppointmentsCtrl',
            url: '/appointments',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointmentsController.js']
                    })
                }
            }
        })
        .state('dashboard.newappointments', {
            templateUrl: 'views/appointment/new-appointments.html',
            controller: 'newAppointmentsCtrl',
            url: '/new-appointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/newAppointmentsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.3.1.js', 'bower_components/socket.io-client/dist/socket.io.js','/scripts/controllers/parlorLayoutTest.js']
                    })
                }
            }
        })
        .state('dashboard.book', {
            templateUrl: 'views/appointment/book.html',
            controller: 'bookCtrl',
            url: '/booking',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/book.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.3.1.js', 'bower_components/socket.io-client/dist/socket.io.js','/scripts/controllers/parlorLayoutTest.js']
                    })
                }
            }
        })
        .state('dashboard.newmodifyappointments', {
            templateUrl: 'views/appointment/new-modify-appointments.html',
            controller: 'newAppointmentsCtrl',
            url: '/new-modify-appointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/newAppointmentsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.3.1.js', 'bower_components/socket.io-client/dist/socket.io.js','/scripts/controllers/parlorLayoutTest.js']
                    })
                }
            }
        })
        .state('dashboard.cancelledappointments', {
            templateUrl: 'views/appointment/cancel-appointments.html',
            controller: 'cancelledAppointmentsCtrl',
            url: '/cancel-appointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/cancelledAppointmentsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.dealMenu', {
            templateUrl: 'views/dealMenu.html',
            controller: 'dealMenuCtrl',
            url: '/dealMenu',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/dealMenuController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.packageMenu', {
        templateUrl: 'views/packageMenu.html',
        controller: 'packageMenuCtrl',
        url: '/packageMenu',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/packageMenuCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.dealTest', {
        templateUrl: 'views/daeltest.html',
        controller: 'dealtestCtrl',
        url: '/dealTest',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/dealtestCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.noncompappointments', {
        templateUrl: 'views/appointment/noncomp-appointments.html',
        controller: 'nonCompAppointmentsCtrl',
        url: '/non-completed-appointment',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/appointment/nonCompAppointmentsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.onlinePayment', {
            templateUrl: 'views/adminReports/onlinePaymentReport.html',
            controller: 'onlinePaymentReportCtrl',
            url: '/onlinePaymentReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/onlinePaymentReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.appointment', {
            templateUrl: 'views/appointment/appointment.html',
            controller: 'appointmentCtrl',
            url: '/apt',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/appointment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.refundPayment', {
            templateUrl: 'views/admin/refundPayment.html',
            controller: 'refundPaymentCtrl',
            url: '/refundPayment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/refundPaymentController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.addSlab', {
            templateUrl: 'views/admin/addSlab.html',
            controller: 'addSlabCtrl',
            url: '/addSlab',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/addSlabController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        // .state('dashboard.onlinePayment',{
        //     templateUrl:'views/adminReports/onlinePaymentReport.html',
        //     controller:'onlinePaymentReportCtrl',
        //     url:'/onlinePaymentReport',
        //     resolve: {
        //       loadMyFile:function($ocLazyLoad) {
        //         return $ocLazyLoad.load({
        //             name:'sbAdminApp',
        //             files:['/scripts/controllers/adminReports/onlinePaymentReportController.js','bower_components/angular-multi-select-master/isteven-multi-select.js','bower_components/angular-multi-select-master/isteven-multi-select.css'
        //           ,'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css','bower_components/moment/moment.js','bower_components/bootstrap-daterangepicker/daterangepicker.js','bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
        //         })
        //       }
        //     }
        // })

    .state('dashboard.appointmentsOTP', {
            templateUrl: 'views/appointment/appointments-otp.html',
            controller: 'appointmentsOTPCtrl',
            url: '/appointment-otp',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/appointmentsOTPController.js']
                    })
                }
            }
        })
        .state('dashboard.summaryr', {
            templateUrl: 'views/reports/daily-summary.html',
            controller: 'dailySummaryCtrl',
            url: '/reports/daily-summary',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/dailySummaryController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

         .state('dashboard.additionreport', {
            templateUrl: 'views/reports/additionReport.html',
            controller: 'additionreport',
            url: '/reports/addition',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/additionReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
    // .state('dashboard.graphicalReport',{
    //            templateUrl:'views/graphs/graphReports.html',
    //            controller:'graphReportCtrl',
    //            url:'/graphReports',
    //            resolve: {
    //                loadMyFile:function($ocLazyLoad) {
    //                    return $ocLazyLoad.load({
    //                        name:'sbAdminApp',
    //                        files:['/scripts/controllers/graphs/graphReportsController.js','bower_components/dragdrop/draganddrop.js','bower_components/angular-multi-select-master/isteven-multi-select.js','bower_components/angular-multi-select-master/isteven-multi-select.css'
    //                            ,'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css','bower_components/moment/moment.js','bower_components/bootstrap-daterangepicker/daterangepicker.js','bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
    //                    })
    //                }
    //            }
    //        })

    .state('dashboard.incentiver', {
            templateUrl: 'views/reports/incentive-report.html',
            controller: 'incentiveReportCtrl',
            url: '/reports/incentive-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/incentiveReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.revenuer', {
            templateUrl: 'views/reports/revenue-report.html',
            controller: 'revenueReportCtrl',
            url: '/reports/revenue',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/revenueReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.freeServ', {
            templateUrl: 'views/adminReports/freeServ.html',
            controller: 'freeServCtrl',
            url: '/free-Service',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/freeServ.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.freeHairCut', {
            templateUrl: 'views/adminReports/freeHairCut.html',
            controller: 'freeHairCutCtrl',
            url: '/free-hair-cut',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/freeHairCut.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.inventoryOrdered', {
            templateUrl: 'views/inventory/inventoryOrdered.html',
            controller: 'inventoryOrdered',
            url: '/inventory-admin-view',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/inventory/inventoryOrdered.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.settlement', {
            templateUrl: 'views/settlement/settlement-report.html',
            controller: 'settlementReportCtrl',
            url: '/settlement-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/settlementReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', '/node_modules/textangular/dist/textAngular.min.js']
                    })
                }
            }
        })
       .state('dashboard.settlementInvoice', {
            templateUrl: 'views/settlement/settlementInvoice.html',
            controller: 'settlementInvoiceCtrl',
            url: '/settlement-Invoice',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/settlementInvoice.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', '/node_modules/textangular/dist/textAngular.min.js']
                    })
                }
            }
        })
        .state('dashboard.signUpInvoice', {
            templateUrl: 'views/settlement/signUpInvoice.html',
            controller: 'signUpInvoice',
            url: '/signup-Invoice',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/signUpInvoice.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', '/node_modules/textangular/dist/textAngular.min.js']
                    })
                }
            }
        })
        .state('dashboard.monthLedger', {
            templateUrl: 'views/settlement/monthLedger.html',
            controller: 'monthLedgerCtrl',
            url: '/month-ledger',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/monthLedger.js']
                    })
                }
            }
        })
        .state('dashboard.uploadTutorial', {
            templateUrl: 'views/tutorial/upload-tutorial.html',
            controller: 'uploadTutorialCtrl',
            url: '/upload-tutorial',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/tutorial/uploadTutorialCtrl.js', 'node_modules/textangular/dist/textAngular-rangy.min.js', 'node_modules/textangular/dist/textAngular-sanitize.min.js', '/node_modules/textangular/dist/textAngular.min.js']
                    })
                }
            }
        })
        .state('dashboard.viewTutorial', {
            templateUrl: 'views/tutorial/view-tutorial.html',
            controller: 'viewTutorialCtrl',
            url: '/view-tutorial?chapterId',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/tutorial/viewTutorialCtrl.js']
                    })
                }
            }
        })
        .state('dashboard.graphicalReport', {
            templateUrl: 'views/graphs/graphReports.html',
            controller: 'graphReportCtrl',
            url: '/graphReports',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/graphs/graphReportsController.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.repeatCustomerMonthWise', {
            templateUrl: 'views/repeatedCustomerMonthWise/repeatedCustomerMonthWise.html',
            controller: 'repeatedCustomerCtrl',
            url: '/repeatedCustomerMonthWise',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/repeatedCustomerMonthWise/repeatedCustomerMonthWise.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.thousandCashBackSpend', {
            templateUrl: 'views/thousandCashBackSpend/thousandCashBackSpend.html',
            controller: 'thousandCashBackSpendCtrl',
            url: '/thousandCashBackSpend',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/thousandCashBackSpend/thousandCashBackSpend.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.frequencyMonitor', {
        templateUrl: 'views/frequencyMonitorReport/frequencyMonitorReport.html',
        controller: 'frequencyReportCtrl',
        url: '/frequencyReport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/frequencyReport/frequencyReportController.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.appointmentClosingPattern', {
        templateUrl: 'views/appointmentClosingPattern/appointmentClosingPattern.html',
        controller: 'appointmentClosingPatternCtrl',
        url: '/appointmentClosingPattern',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/appointmentClosingPattern/appointmentClosingPattern.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })




    .state('dashboard.usedLoyaltyPoints', {
            templateUrl: 'views/usedLoyaltyPoints/usedLoyaltyPointsReport.html',
            controller: 'usedLoyaltyPointsCtrl',
            url: '/usedLoyaltyPointsReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/usedLoyaltyPointsReport/usedLoyaltyPointsReportController.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.beUForm', {
            templateUrl: 'views/beuformCategory/beUFormCategory.html',
            controller: 'beUformCtrl',
            url: '/beUFormCategory',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/beuformCategory/beUFormCategory.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.salonCashback&Loyalty', {
            templateUrl: 'views/salonCashbackLoyalty/salonCashbackLoyalty.html',
            controller: 'salonCashbackLoyaltyCtrl',
            url: '/salonCashback&Loyalty',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonCashbackLoyalty/salonCashbackLoyaltyCtrl.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.videoTutorial', {
            templateUrl: 'views/video/video.html',
            controller: 'videoCtrl',
            url: '/video',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/video/video.js', "http://vjs.zencdn.net/5.19.2/video.js", "http://vjs.zencdn.net/5.19.2/video-js.css"]
                    })
                }
            }
        })
        .state('dashboard.salonSettlement', {
            templateUrl: 'views/settlement/salonWise.html',
            controller: 'salonWise',
            url: '/salonSettlement-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/salonWise.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.monthlySettlement', {
        templateUrl: 'views/settlement/monthlySettlement.html',
        controller: 'monthlySettlementCtrl',
        url: '/monthlySettlement',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/settlement/monthlySettlementCtrl.js']
                })
            }
        }
    })


    .state('dashboard.inventoryDiscount', {
        templateUrl: 'views/inventory/inventory-discount.html',
        controller: 'inventoryDiscount',
        url: '/inventory-discount',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/inventory/inventoryDiscount.js']
                })
            }
        }
    })

    .state('dashboard.purchaseOrders', {
            templateUrl: 'views/inventory/purchase-orders.html',
            controller: 'purchaseOrders',
            url: '/purchase-order',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/inventory/purchaseOrders.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/moment/moment.js']
                    })
                }
            }
        })
        .state('dashboard.reorderByBrand', {
            templateUrl: 'views/inventory/reorder-brand.html',
            controller: 'reorderByBrand',
            url: '/reorder-brand',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/inventory/reorderByBrand.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/moment/moment.js']
                    })
                }
            }
        })
        .state('dashboard.adminWiseSettlement', {
            templateUrl: 'views/settlement/adminWise.html',
            controller: 'adminWise',
            url: '/adminWiseSettlement',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/adminWise.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.appDashDownload', {
            templateUrl: 'views/appDash.html',
            controller: 'appDashCtrl',
            url: '/download-dashboard',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appDash.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.editReview', {
            templateUrl: 'views/admin/editReview.html',
            controller: 'editReviewCtrl',
            url: '/edit-review',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/editReview.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.couponCode', {
            templateUrl: 'views/coupanCode.html',
            controller: 'coupanCodeCtrl',
            url: '/coupon-code',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/coupanCode.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.admincoupanCode', {
            templateUrl: 'views/adminReports/adminCoupanCode.html',
            controller: 'adminCoupanCodeCtrl',
            url: '/admin-coupon-code',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/adminCoupanCode.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        }).state('dashboard.adminRazorPay', {
            templateUrl: 'views/adminReports/adminRazorPay.html',
            controller: 'adminRazorPayCtrl',
            url: '/admin-razor-pay',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/adminRazorPay.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.recommendation', {
            templateUrl: 'views/admin/recommendation.html',
            controller: 'recommendation',
            url: '/recommendation-services',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/recommendation.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.editAppointment', {
            templateUrl: 'views/editAppointment.html',
            controller: 'editApptCtrl',
            url: '/editAppointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/editAppointment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.reopenAppointment', {
            templateUrl: 'views/reopenAppointment.html',
            controller: 'reopenAppointmentCtrl',
            url: '/reopenAppointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reopenAppointment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.teamMemberProfile', {
            templateUrl: 'views/members/teamMemberProfile.html',
            controller: 'teamMemberProfileCtrl',
            url: '/teamMemberProfile',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/members/teamMemberProfileController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.dayWiseReport', {
            templateUrl: 'views/adminReports/dayWiseReport.html',
            controller: 'dayWiseReportCtrl',
            url: '/day-wise-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/dayWiseReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.timeWiseReport', {
            templateUrl: 'views/adminReports/timeWiseReport.html',
            controller: 'timeWiseReportCtrl',
            url: '/time-wise-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/timeWiseReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.employeeRepetition', {
            templateUrl: 'views/adminReports/empRepetition.html',
            controller: 'empReptCtrl',
            url: '/employee-repetition',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/empRepetition.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.serviceRepetition', {
            templateUrl: 'views/adminReports/serviceRepetition.html',
            controller: 'servReptCtrl',
            url: '/service-repetition',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/serviceRepetition.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.nearbuy', {
            templateUrl: 'views/nearbuy.html',
            controller: 'nearbuyCtrl',
            url: '/nearbuy',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/nearbuy.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.razorPay', {
            templateUrl: 'views/razorPay.html',
            controller: 'razorPayCtrl',
            url: '/razor-pay',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/razorPay.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.membershipSold', {
            templateUrl: 'views/adminReports/membershipSold.html',
            controller: 'membershipSoldCtrl',
            url: '/membership-sold',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/membershipSold.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.weeklyReport', {
        templateUrl: 'views/adminReports/weekly-report.html',
        controller: 'weeklyReportCtrl',
        url: '/weeklyReport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/weeklyReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.onlineAppointmentPattern', {
        templateUrl: 'views/adminReports/onlineAppointmentPattern.html',
        controller: 'OnlineAppointmentPattern',
        url: '/onlineAppointmentPattern',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/onlinAppointmentPattern.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

     .state('dashboard.trainingSessionReport', {
        templateUrl: 'views/adminReports/trainingSessionReport.html',
        controller: 'trainingSessionRepor',
        url: '/trainingSessionRepor',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/adminReports/trainingSessionReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })



    .state('dashboard.incentiveReport', {
            templateUrl: 'views/adminReports/incentiveReport.html',
            controller: 'incentiveAdminReportCtrl',
            url: '/incentiveAdminReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/incentiveReportAdminController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.serviceReport', {
            templateUrl: 'views/adminReports/serviceReport.html',
            controller: 'servReportCtrl',
            url: '/serviceReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/serviceReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
         .state('dashboard.quarterlySettlement', {
            templateUrl: 'views/adminReports/quarterlySettlement.html',
            controller: 'quarterlySettlement',
            url: '/quarterlySettlement',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/quarterlySettlement.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.empPerformance', {
            templateUrl: 'views/adminReports/empPerformanceReport.html',
            controller: 'empPerformanceCtrl',
            url: '/empPerformanceReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/empPerformanceReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.empPerformanceReports', {
            templateUrl: 'views/adminReports/empPerformanceReports.html',
            controller: 'empPerformanceReportsCtrl',
            url: '/top3PartnerReports',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/empPerformance&Reports.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.empSegment', {
            templateUrl: 'views/adminReports/empSegmentReport.html',
            controller: 'empSegmentCtrl',
            url: '/empSegmentReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/empSegmentReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        //------vital-----Revenue-----------------

    .state('dashboard.branchRevenue', {
        templateUrl: 'views/vital/branchRevenue.html',
        controller: 'branchRevenueCtrl',
        url: '/vital/branchRevenue',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/vital/branchRevenue.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })

    .state('dashboard.ownerbranchRevenue', {
        templateUrl: 'views/reports/ownerbranchRevenue.html',
        controller: 'ownerbranchRevenue',
        url: '/reports/ownerbranchRevenue',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/reports/ownerbranchRevenue.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })

     .state('dashboard.ownervital', {
        templateUrl: 'views/reports/ownervital.html',
        controller: 'ownervital',
        url: '/reports/ownervital',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/reports/ownervital.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })


    .state('dashboard.oldNewAvg', {
            templateUrl: 'views/vital/oldNewAvg.html',
            controller: 'oldNewAvgCtrl',
            url: '/vital/oldNewAvg',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/vital/oldNewAvg.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.oldNewBranch', {
            templateUrl: 'views/vital/oldNewBranch.html',
            controller: 'oldNewBranchCtrl',
            url: '/vital/oldNewBranch',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/vital/oldNewBranch.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.vital', {
            templateUrl: 'views/vital/vital.html',
            controller: 'vitalCtrl',
            url: '/vital/vital',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/vital/vital.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })

    .state('dashboard.custSupport', {
        templateUrl: 'views/customerSupport/customerSupport.html',
        controller: 'customerSupportCtrl',
        url: '/customerSupport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/customerSupport/customerSupport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

 .state('dashboard.salonPasspayment', {
        templateUrl: 'views/customerSupport/salonPasspayment.html',
        controller: 'salonPasspaymentCtrl',
        url: '/salonPasspayment',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/customerSupport/salonPasspayment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
 .state('dashboard.salonAffiliateAppointment', {
        templateUrl: 'views/salon-support/salonAffiliateAppointment.html',
        controller: 'salonAffiliateAppointCtrl',
        url: '/salon-affiliate-appointment',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/customerSupport/salonAffiliateAppointment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.clientSupportReport', {
        templateUrl: 'views/salon-support/client-support.html',
        controller: 'clientSupport',
        url: 'salonsupport/cleint-support',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/salon-support/clientSupport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.dateWiseSupport', {
        templateUrl: 'views/salon-support/dateWiseSupport.html',
        controller: 'dateWiseSupport',
        url: 'salonsupport/dateWiseSupport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/salon-support/dateWiseSupport.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })

     .state('dashboard.repeatWiseSupport', {
        templateUrl: 'views/salon-support/repeatWiseSupport.html',
        controller: 'repeatWiseSupport',
        url: 'salonsupport/repeatWiseSupport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/salon-support/repeatWiseSupport.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })

    .state('dashboard.earlyBird', {
        templateUrl: 'views/salon-support/early-bird.html',
        controller: 'clientSupport',
        url: 'salonsupport/early-bird',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/salon-support/earlyBird.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.addFlashSale', {
        templateUrl: 'views/admin/addFlashSale.html',
        controller: 'addFlashSale',
        url: 'salonsupport/add-flash-sale',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/addFlashSale.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.mapFeature', {
        templateUrl: 'views/vital/mapFeature.html',
        controller: 'mapFeature',
        url: '/mapFeature',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/vital/mapFeature.js']
                })
            }
        }
    })
    .state('dashboard.addRoyaltyAmount', {
        templateUrl: 'views/admin/addRoyaltyAmount.html',
        controller: 'addRoyaltyAmount',
        url: '/salonsupport/add-royalty-amount',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/addRoyaltyAmount.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.tdstcsUpload', {
        templateUrl: 'views/admin/tdstcsUpload.html',
        controller: 'tdstcsUpload',
        url: '/tds-finance',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',

                    files: ['/scripts/controllers/admin/tdstcsUpload.js','bower_components/angular-csv-import/dist/angular-csv-import.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']

                    // files: ['/scripts/controllers/admin/tdstcsUpload.js','bower_components/angular-csv-import/dist/angular-csv-import.js']

                })
            }
        }
    })
      
     .state('dashboard.uploadpreviousdue', {
        templateUrl: 'views/uploadpreviousdue/uploadpreviousdue.html',
        controller: 'uploadpreviousdue',
        url: '/upload-previous-due',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/uploadpreviousdue/uploadpreviousdue.js','bower_components/angular-csv-import/dist/angular-csv-import.js' ]
                })
            }
        }
    })
     .state('dashboard.salonDetail', {
        templateUrl: 'views/salonDetail/salonDetail.html',
        controller: 'salonDetail',
        url: '/salon-detail',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/salonDetail/salonDetail.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

  .state('dashboard.addHrSupport', {
        templateUrl: 'views/admin/addHrSupport.html',
        controller: 'addHrSupport',
        url: 'addHrSupport',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/addHrSupport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
    .state('dashboard.payProductDiscount', {
        templateUrl: 'views/admin/payProductDiscount.html',
        controller: 'payProductDiscount',
        url: '/payProductDiscount',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/payProductDiscount.js','bower_components/angular-csv-import/dist/angular-csv-import.js' ]
                })
            }
        }
    })

    .state('dashboard.members', {
            templateUrl: 'views/members/members.html',
            controller: 'membersCtrl',
            url: '/Create Members/members',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/members/members.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.clientsOnMap', {
            templateUrl: 'views/vital/clientsOnMap.html',
            controller: 'clientsOnMap',
            url: '/vital/clients-on-map',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/vital/clientsOnMap.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.pendingAppt', {
            templateUrl: 'views/pendingAppt.html',
            controller: 'pApptCtrl',
            url: 'pendingAppt',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/pendingAppt.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.collectionr', {
            templateUrl: 'views/reports/collection-report.html',
            controller: 'collectionReportCtrl',
            url: '/reports/collection',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/collectionReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.salesSalonList', {
            templateUrl: 'views/sales/salon-list.html',
            controller: 'salonList',
            url: '/sales/salon-list',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/sales/salonList.js','bower_components/angular-csv-import/dist/angular-csv-import.js' ]
                    })
                }
            }
        })
        .state('dashboard.salonsForSales', {
            templateUrl: 'views/sales/salonsForSales.html',
            controller: 'salonsForSales',
            url: '/sales/salonsForSales',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/sales/salonsForSales.js']
                    })
                }
            }
        })
           .state('dashboard.printMOU', {
            templateUrl: 'views/sales/printMou.html',
            controller: 'printMOU',
            url: '/sales/printMOU',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/sales/printMou.js']
                    })
                }
            }
        })
        .state('dashboard.employeer', {
            templateUrl: 'views/reports/employee-report.html',
            controller: 'employeeReportController',
            url: '/reports/employee',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/employeeReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.servicer', {
            templateUrl: 'views/reports/service-report.html',
            controller: 'serviceReportCtrl',
            url: '/reports/service',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/serviceReportController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.membership', {
        templateUrl: 'views/membership/membership.html',
        controller: 'membershipCtrl',
        url: '/membership',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/membershipCtrl.js']
                })
            }
        }
    })

    .state('dashboard.operatorWise', {
        templateUrl: 'views/operatorPerformance/operatorWise.html',
        controller: 'operatorWiseCtrl',
        url: '/OperatorPerformance/operatorWise',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/operatorPerformance/operatorWise.js']
                })
            }
        }
    })

    .state('dashboard.create-parlor', {
        templateUrl: 'views/admin/create-parlor.html',
        controller: 'CreateParlorCtrl',
        url: '/create-parlor',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/createParlorController.js']
                })
            }
        }
    })


    .state('dashboard.add-inventory-items', {
        templateUrl: 'views/admin/add-inventory-items.html',
        controller: 'addInventoryItemsCtrl',
        url: '/add-inventory-items',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/addInventoryItemsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.inventoryCategory', {
            templateUrl: 'views/admin/inventoryCategory.html',
            controller: 'inventoryCatCtrl',
            url: '/inventory-category',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/inventoryCategory.js']
                    })
                }
            }
        })
        .state('dashboard.searchCustomer', {
            templateUrl: 'views/admin/searchCustomer.html',
            controller: 'searchCustomerCtrl',
            url: '/search-customer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/searchCustomer.js']
                    })
                }
            }
        })
       .state('dashboard.searchCustomerdetail', {
            templateUrl: 'views/admin/searchCustomerdetail.html',
            controller: 'searchCustomerdetail',
            url: '/customerdetails ',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/searchCustomerdetail.js']
                    })
                }
            }
        })
        .state('dashboard.zeroStatusAppts', {
            templateUrl: 'views/admin/zeroStatusAppts.html',
            controller: 'zeroStatusApptsCtrl',
            url: '/zeroStatusAppts',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/zeroStatusApptsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })

    .state('dashboard.searchOtp', {
            templateUrl: 'views/admin/searchOtp.html',
            controller: 'searchOtp',
            url: '/search-Otp',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/searchOtp.js']
                    })
                }
            }
        })
        .state('dashboard.EmployeeReferral', {
            templateUrl: 'views/admin/EmployeeReferral.html',
            controller: 'EmployeeReferral',
            url: '/EmployeeReferral',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/EmployeeReferral.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angu-fixed-header-table.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })

    .state('dashboard.SearchReffaralCtrl', {
        templateUrl: 'views/admin/SearchReffaral.html',
        controller: 'SearchReffaralCtrl',
        url: '/SearchReffaralCtrl',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/SearchReffaralCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })

    .state('dashboard.add-sellers', {
            templateUrl: 'views/admin/add-sellers.html',
            controller: 'addSellersCtrl',
            url: '/add-sellers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/addSellersController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.serviceProduct', {
            templateUrl: 'views/admin/serviceProduct.html',
            controller: 'serviceProductCtrl',
            url: '/serviceProduct',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/serviceProductController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.serviceBrand', {
            templateUrl: 'views/admin/serviceBrand.html',
            controller: 'serviceBrandCtrl',
            url: '/serviceBrand',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/admin/serviceBrandController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.services', {
            templateUrl: 'views/admin/services.html',
            controller: 'ServicesCtrl',
            url: '/services',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/servicesController.js']
                    })
                }
            }
        }).state('dashboard.add-service', {
            templateUrl: 'views/admin/create-service.html',
            controller: 'CreateServiceCtrl',
            url: '/create-service?categoryId&categoryName&superCategory&sort&maleImage&femaleImage',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/createServiceController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.parlor-categories', {
            templateUrl: 'views/parlor-categories.html',
            controller: 'ParlorCategoriesCtrl',
            url: '/parlor-service-category',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorCategoriesController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.opsVisit', {
            templateUrl: 'views/adminReports/ops-visit.html',
            controller: 'OpsVisitCtrl',
            url: '/ops-visit',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/OpsVisitsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.service-percent', {
            templateUrl: 'views/admin/serive-percentage.html',
            controller: 'servicePercentCtrl',
            url: '/parlor-service-percentage',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/servicePercentController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.packages', {
            templateUrl: 'views/service/packages.html',
            controller: 'PackageCtrl',
            url: '/parlor-packages',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/service/packagesController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })






        .state('dashboard.expense', {
            templateUrl: 'views/expense/add-expense.html',
            controller: 'addExpenseCtrl',
            url: '/add-expense',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/expense/addExpenseController.js']
                    })
                }
            }
        })
        .state('dashboard.profitAndLoss', {
            templateUrl: 'views/profitAndLoss/profitAndLoss.html',
            controller: 'profitAndLossCtrl',
            url: '/profitAndLoss',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/profitAndLoss/profitAndLossCtrl.js']
                    })
                }
            }
        })

    .state('dashboard.previous', {
            templateUrl: 'views/previousAppointments.html',
            controller: 'PreviousAppointmentCtrl',
            url: '/previous-appointments',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/previousAppointmentController.js']
                    })
                }
            }
        })
        .state('dashboard.completed', {
            templateUrl: 'views/appointment/completedAppointments.html',
            controller: 'CompletedAppointmentCtrl',
            url: '/completed-appointments',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/completedAppointmentController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.authorizedAppointments', {
            templateUrl: 'views/appointment/authorizedAppointments.html',
            controller: 'authorizedAppointmentsCtrl',
            url: '/authorizedAppointments',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/authorizedAppointmentsController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.customers', {
            templateUrl: 'views/customers.html',
            controller: 'CustomersCtrl',
            url: '/customers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customersContoller.js']
                    })
                }
            }
        })
        .state('dashboard.employeeHome', {
            templateUrl: 'views/employee/employee-home.html',
            controller: 'employeeHomeController',
            url: '/employee_home',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            //'/scripts/services/employeeHomeService.js',
                            '/scripts/controllers/employee/employeeHomeController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.serviceHome', {
            templateUrl: 'views/service/service-home.html',
            controller: 'serviceHomeController',
            url: '/service_home',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/service/serviceHomeController.js']
                    })
                }
            }
        })

    .state('dashboard.customer-home', {
            templateUrl: 'views/customer-home.html',
            controller: 'CustomerHomeCtrl',
            url: '/customer-home?userId&userName',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerHomeContoller.js']
                    })
                }
            }
        })
        .state('dashboard.parlor-home', {
            templateUrl: 'views/parlor-home.html',
            controller: 'ParlorHomeCtrl',
            url: '/parlor-home',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorHomeContoller.js']
                    })
                }
            }
        })
        .state('dashboard.parlor-services-by-category', {
            templateUrl: 'views/parlor-services.html',
            controller: 'ParlorServicesCtrl',
            url: '/parlor-services?categoryId&categoryName',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorServicesController.js']
                    })
                }
            }
        })
        .state('dashboard.allparlors', {
            templateUrl: 'views/allparlors.html',
            controller: 'AllParlorCtrl',
            url: '/allparlors',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/AllParlorCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.chat', {
            templateUrl: 'views/chat/chat.html',
            controller: 'chat',
            url: '/chat',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/chat/chat.js', '/styles/chat.css']
                    })
                }
            }
        })
        .state('dashboard.team', {
            templateUrl: 'views/employee.html',
            controller: 'TeamCtrl',
            url: '/team',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/teamContoller.js']
                    })
                }
            }
        })
        .state('dashboard.smscustomer', {
            templateUrl: 'views/marketing/sms-customers.html',
            controller: 'smsCustomer',
            url: '/sms-customers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/marketing/smsCustomerContoller.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
     .state('dashboard.smsCoupon', {
            templateUrl: 'views/marketing/sms-coupon.html',
            controller: 'smsCoupon',
            url: '/sms-coupon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/marketing/smsCouponController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
        .state('dashboard.appointment-home', {
            templateUrl: 'views/appointment/appointment_home.html',
            controller: 'appointmentHomeController',
            url: '/appointment-home',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointment/appointmentHomeController.js']
                    })
                }
            }
        })
        .state('dashboard.member-detail', {
            templateUrl: 'views/employee/member-detail.html',
            controller: 'MemberDetailCtrl',
            url: '/member-detail?userId&userName',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                            name: 'chart.js',
                            files: [
                                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.css',
                                '/libraries/angular-clipboard/angular-clipboard.js',
                                '/libraries/fileupload/upload.js',
                                '/libraries/fileupload/upload2.js'
                            ]
                        }),
                        $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: ['/scripts/controllers/memberDetailController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/libraries/angular-clipboard/angular-clipboard.js', ]
                        })
                }
            }
        })
        .state('dashboard.team-member-detail', {
            templateUrl: 'views/members/team-member-detail.html',
            controller: 'teamMemberDetailCtrl',
            url: '/team-member-detail?userId',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                            name: 'chart.js',
                            files: [
                                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.css'
                            ]
                        }),
                        $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: ['/scripts/controllers/members/teamMemberDetailController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                        })
                }
            }
        })
        .state('dashboard.leave', {
            templateUrl: 'views/leave.html',
            controller: 'LeaveCtrl',
            url: '/leave/:userId',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/leaveController.js']
                    })
                }
            }
        })
        .state('dashboard.inventoryMangement', {
            templateUrl: 'views/inventory/inventory-management.html',
            controller: 'inventoryMangement',
            url: '/inventory/invenrtory-management',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/inventoryMangementController.js']
                    })
                }
            }
        })

    .state('dashboard.reorder', {
            templateUrl: 'views/inventory/reorder.html',
            controller: 'reorder',
            url: '/inventory/reorder',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reorderController.js']
                    })
                }
            }
        })
        .state('dashboard.discountBucket', {
            templateUrl: 'views/discountBucket/discountBucket.html',
            controller: 'discountBucketCtrl',
            url: '/discountBucket',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/discountBucketController.js']
                    })
                }
            }
        })

    .state('dashboard.reorder1', {
            templateUrl: 'views/inventory/reorder1.html',
            controller: 'reorder1',
            url: '/inventory/reorder1',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reorderController1.js']
                    })
                }
            }
        })
        .state('dashboard.allProducts', {
            templateUrl: 'views/inventory/all-products.html',
            controller: 'allProducts',
            url: '/inventory/all-products',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/allProductsController.js']
                    })
                }
            }
        }).state('dashboard.to-do-list', {
            templateUrl: 'views/todo_list.html',
            controller: 'todo_list',
            url: '/to-do-list',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            '/scripts/controllers/todolistCtrl.js',
                            '/styles/todolist.css',
                            "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css",
                            "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min.js"

                        ]
                    })
                }
            }
        })
        .state('dashboard.blank', {
            templateUrl: 'views/pages/blank.html',
            url: '/blank'
        })
        .state('login', {
            templateUrl: 'views/pages/login.html',
            controller: 'loginCtrl',
            url: '/login',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/loginController.js']
                    })
                }
            }
        })
        .state('default', {
            controller: 'DefaultCtrl',
            url: '/home',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/defaultController.js']
                    })
                }
            }
        })

    .state('dashboard.chart', {
            templateUrl: 'views/chart.html',
            url: '/chart',
            controller: 'ChartCtrl',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                            name: 'chart.js',
                            files: [
                                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.css'
                            ]
                        }),
                        $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: ['/scripts/controllers/chartContoller.js']
                        })
                }
            }
        })
        .state('dashboard.table', {
            templateUrl: 'views/table.html',
            url: '/table'
        })
        .state('dashboard.panels-wells', {
            templateUrl: 'views/ui-elements/panels-wells.html',
            url: '/panels-wells'
        })
        .state('dashboard.buttons', {
            templateUrl: 'views/ui-elements/buttons.html',
            url: '/buttons'
        })
        /****************my code start************/
        .state('dashboard.test', {
            templateUrl: 'views/test.html',
            controller: 'test',
            url: '/test',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/test.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
    .state('dashboard.map',{
        templateUrl:'views/map.html',
        controller:'map',
        url:'/map',
        resolve: {
            loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['/scripts/controllers/map.js','bower_components/ngmap/build/scripts/ng-map.min.js',"http://maps.google.com/maps/api/js"]
                })
            }
        }
    })
    .state('dashboard.innvoiceOfSalon',{
        templateUrl:'views/admin/innvoiceOfSalon.html',
        controller:'innvoiceOfSalon',
        url:'/innvoiceOfSalon',
        resolve: {
            loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['/scripts/controllers/admin/innvoiceOfSalon.js']
                })
            }
        }
    })
    .state('dashboard.generateInvoice',{
        templateUrl:'views/admin/generateInvoice.html',
        controller:'generateInvoiceCtrl',
        url:'/generate-invoice',
        resolve: {
            loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['/scripts/controllers/admin/generateInvoice.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                })
            }
        }
    })
      .state('dashboard.yearlyInnvoice',{
        templateUrl:'views/admin/yearlyInnvoice.html',
        controller:'yearlyInnvoice',
        url:'/yearly-innvoice',
        resolve: {
            loadMyFile:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:['/scripts/controllers/admin/yearlyInnvoice.js']
                })
            }
        }
    })
        .state('dashboard.createChapter', {
            templateUrl: 'views/trainer/createChapter.html',
            controller: 'createChapter',
            url: '/createChapter',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/trainer/createChapter.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.trainingSession', {
            templateUrl: 'views/trainer/trainingSession.html',
            controller: 'trainingSession',
            url: '/trainingSession',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/trainer/trainingSession.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.websiteQueries', {
            templateUrl: 'views/websiteQueries.html',
            controller: 'websiteQueries',
            url: '/websiteQueries',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/websiteQueries.js', 'bower_components/angularUtils-pagination/dirPagination.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.trainingCompleted', {
            templateUrl: 'views/trainer/trainingCompleted.html',
            controller: 'trainingCompleted',
            url: '/trainingCompleted',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/trainer/trainingCompleted.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.cohortReport', {
            templateUrl: 'views/cohortReport.html',
            controller: 'cohortReport',
            url: '/cohortReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/cohortReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
     .state('dashboard.parlorClientFrq', {
            templateUrl: 'views/parlorClientFrq.html',
            controller: 'parlorClientFrq',
            url: '/parlorClientFrq',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorClientFrq.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
      .state('dashboard.CreateFlashCoopon', {
            templateUrl: 'views/CreateFlashCoopon.html',
            controller: 'CreateFlashCooponCtrl',
            url: '/CreateFlashCoopon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/CreateFlashCoopon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
       .state('dashboard.Salon-support-report', {
            templateUrl: 'views/salon-support/salonsupportReport.html',
            controller: 'Salon-support-reportCtrl',
            url: '/salon-support-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salon-support/salonsupportReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.salonSupportmonthwise', {
            templateUrl: 'views/salon-support/salonSupportmonthWise.html',
            controller: 'salonSupportmonthwiseCtrl',
            url: '/salon-support-month-wise',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salon-support/salonSupportmonthWise.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


        .state('dashboard.salarySheet', {
            templateUrl: 'views/salarySheet.html',
            controller: 'salarySheet',
            url: '/salarySheet',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salarySheet.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.visitedOnce', {
            templateUrl: 'views/visitedOnce.html',
            controller: 'visitedOnce',
            url: '/visitedOnce',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/visitedOnce.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.visitedOnceContacted', {
            templateUrl: 'views/visitedOnceContacted.html',
            controller: 'visitedOnceContacted',
            url: '/visitedOnceContacted',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/visitedOnceContacted.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.itemsInCart', {
            templateUrl: 'views/customerSupport/itemsInCart.html',
            controller: 'itemsInCart',
            url: '/itemsInCart',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/itemsInCart.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        // .state('dashboard.visitedOnceConverted', {
        //     templateUrl: 'views/visitedOnceConverted.html',
        //     controller: 'visitedOnceConverted',
        //     url: '/visitedOnceConverted',
        //     resolve: {
        //         loadMyFile: function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'sbAdminApp',
        //                 files: ['/scripts/controllers/visitedOnceConverted.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
        //             })
        //         }
        //     }
        // })
        // .state('dashboard.visitedOnceReports', {
        //     templateUrl: 'views/visitedOnceReports.html',
        //     controller: 'visitedOnceReports',
        //     url: '/visitedOnceReports',
        //     resolve: {
        //         loadMyFile: function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'sbAdminApp',
        //                 files: ['/scripts/controllers/visitedOnceReports.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
        //             })
        //         }
        //     }
        // })
        // .state('dashboard.employeeIncentiveReport', {
        //     templateUrl: 'views/incentives/employeeIncentiveReport.html',
        //     controller: 'employeeIncentiveReport',
        //     url: '/employeeIncentiveReport',
        //     resolve: {
        //         loadMyFile: function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'sbAdminApp',
        //                 files: ['/scripts/controllers/incentives/employeeIncentiveReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/angu-fixed-header-table.js']
        //             })
        //         }
        //     }
        // })
        // .state('dashboard.salonCohort', {
        //     templateUrl: 'views/adminReports/salonCohort.html',
        //     controller: 'salonCohort',
        //     url: '/salonCohort',
        //     resolve: {
        //         loadMyFile: function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'sbAdminApp',
        //                 files: ['/scripts/controllers/adminReports/salonCohort.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
        //             })
        //         }
        //     }
        // })

    // .state('dashboard.employeeLuckyDraw', {
    //         templateUrl: 'views/employeeLuckyDraw.html',
    //         controller: 'employeeLuckyDraw',
    //         url: '/employeeLuckyDraw',
    //         resolve: {
    //             loadMyFile: function($ocLazyLoad) {
    //                 return $ocLazyLoad.load({
    //                     name: 'sbAdminApp',
    //                     files: ['/scripts/controllers/visitedOnceContacted.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
    //                 })
    //             }
    //         }
    //     })
    .state('dashboard.visitedOnceConverted', {
            templateUrl: 'views/visitedOnceConverted.html',
            controller: 'visitedOnceConverted',
            url: '/visitedOnceConverted',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/visitedOnceConverted.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.visitedOnceReports', {
            templateUrl: 'views/visitedOnceReports.html',
            controller: 'visitedOnceReports',
            url: '/visitedOnceReports',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/visitedOnceReports.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.divasAndMachosCustomers', {
            templateUrl: 'views/divasAndMachosCustomers.html',
            controller: 'divasAndMachosCustomers',
            url: '/divasAndMachosCustomers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/divasAndMachosCustomers.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.afterThreeMonths', {
            templateUrl: 'views/afterThreeMonths.html',
            controller: 'afterThreeMonths',
            url: '/afterThreeMonths',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/afterThreeMonths.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.subscriptionQueries', {
            templateUrl: 'views/subscriptionQueries.html',
            controller: 'subscriptionQueries',
            url: '/subscriptionQueries',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/subscriptionQueries.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.razorPayNonSubscriber', {
            templateUrl: 'views/razorPayNonSubscriber.html',
            controller: 'razorPayNonSubscriber',
            url: '/razorPayNonSubscriber',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/razorPayNonSubscriber.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.couponRedemption', {
            templateUrl: 'views/coupon/couponRedemption.html',
            controller: 'couponRedemption',
            url: '/couponRedemption',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/coupon/couponRedemption.js', 
                        'bower_components/angular-multi-select-master/isteven-multi-select.js', 
                        'bower_components/angular-multi-select-master/isteven-multi-select.css', 
                        'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 
                        'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.addcoupontouser', {
            templateUrl: 'views/coupon/coupontouser.html',
            controller: 'Addcoupontouser',
            url: '/add-coupon-to-user',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/coupon/coupontouser.js', 
                        'bower_components/angular-multi-select-master/isteven-multi-select.js', 
                        'bower_components/angular-multi-select-master/isteven-multi-select.css', 
                        'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 
                        'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

            .state('dashboard.dashboardMarketing', {
            templateUrl: 'views/dashboardMarketing/dashboardMarketing.html',
            controller: 'dashboardMarketing',
            url: '/dashboardMarketing',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/dashboardMarketing/dashboardMarketing.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


           .state('dashboard.addManagertoSalon', {
            templateUrl: 'views/addManagertoSalon/addmanager.html',
            controller: 'addManagertoSalon',
            url: '/add-manager-to-salon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/addManagertoSalon/addmanager.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


           .state('dashboard.addOwnertoSalon', {
            templateUrl: 'views/addOwnertoSalon/addowner.html',
            controller: 'addOwnertoSalon',
            url: '/add-owner-to-salon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/addOwnertoSalon/addowner.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.addEmployeetoSalon', {
            templateUrl: 'views/addEmployeetoSalon/addemployee.html',
            controller: 'addEmployeetoSalon',
            url: '/add-employee-to-salon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/addEmployeetoSalon/addemployee.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


       .state('dashboard.salonReview', {
            templateUrl: 'views/salonReviewPage/salonReviewPage.html',
            controller: 'salonReview',
            url: '/salonReview',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReviewPage/salonReviewPage.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })   

         .state('dashboard.salonRecommendations', {
            templateUrl: 'views/salonRecommendations/salonrecommendations.html',
            controller: 'salonrecommendations',
            url: '/salonRecommendation',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonRecommendations/salonRecommendations.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

           .state('dashboard.allSalon', {
            templateUrl: 'views/allSalon/allSalon.html',
            controller: 'allSalon',
            url: '/allSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/allSalon/allSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


            .state('dashboard.employeeRepeatCustomerReport', {
            templateUrl: 'views/reports/employeeRepeatCustomerReport.html',
            controller: 'employeeRepeatCustomerReport',
            url: '/report/employeeRepeatCustomerReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/reports/employeeRepeatCustomerReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


        .state('dashboard.customersNoShow3Months', {
            templateUrl: 'views/customersNoShow3Months/customersNoShow3Months.html',
            controller: 'customersNoShow3Months',
            url: '/customersNoShow3Months',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customersNoShow3Months/customersNoShow3Months.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.LuckyDrawSalonWiseReport', {
            templateUrl: 'views/LuckyDrawSalonWiseReport/LuckyDrawSalonWiseReport.html',
            controller: 'LuckyDrawSalonWiseReport',
            url: '/LuckyDrawSalonWiseReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/LuckyDrawSalonWiseReport/LuckyDrawSalonWiseReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.LuckyDrawEmployeeWiseReport', {
            templateUrl: 'views/LuckyDrawEmployeeWiseReport/LuckyDrawEmployeeWiseReport.html',
            controller: 'LuckyDrawEmployeeWiseReport',
            url: '/LuckyDrawEmployeeWiseReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/LuckyDrawEmployeeWiseReport/LuckyDrawEmployeeWiseReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.newGurgaonCustomerReport', {
            templateUrl: 'views/newGurgaonCustomerReport/newGurgaonCustomerReport.html',
            controller: 'newGurgaonCustomerReport',
            url: '/newGurgaonCustomerReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/newGurgaonCustomerReport/newGurgaonCustomerReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.previouSubscribers', {
            templateUrl: 'views/customerSupport/previouSubscribers.html',
            controller: 'previouSubscribers',
            url: '/previous-subscribers',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/previouSubscribers.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.userMembership', {
            templateUrl: 'views/UserMembership/UserMembership.html',
            controller: 'UserMembership',
            url: '/user-membership',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/UserMembership/UserMembership.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
         .state('dashboard.OldSalonNearNewSalon', {
            templateUrl: 'views/OldSalonNearNewSalon/OldSalonNearNewSalon.html',
            controller: 'OldSalonNearNewSalon',
            url: '/OldSalonNearNewSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/OldSalonNearNewSalon/OldSalonNearNewSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.appointmentCancelBySalon', {
            templateUrl: 'views/appointmentCancelBySalon/appointmentCancel.html',
            controller: 'appointmentCancelBySalon',
            url: '/appointmentCancelBySalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appointmentCancelBySalon/appointmentCancel.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        

        .state('dashboard.revenueReport', {
            templateUrl: 'views/adminReports/revenueReport.html',
            controller: 'revenueReport',
            url: '/revenueReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/revenueReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.uploadImage', {
            templateUrl: 'views/uploadImage.html',
            controller: 'uploadImage',
            url: '/uploadImage',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/uploadImage.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.addSong', {
            templateUrl: 'views/music-player/add-song.html',
            controller: 'addSong',
            url: '/addSong',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/music-player/addSong.js']
                    })
                }
            }
        })
        .state('dashboard.musicPlayer', {
            templateUrl: 'views/music/music-player.html',
            controller: 'musicPlayer',
            url: '/musicPlayer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/music/music-player.js','https://cdn.socket.io/socket.io-1.3.5.js','/scripts/controllers/music/dnd.js','/scripts/controllers/music/siriwave.js',"https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.3/howler.core.min.js",'/styles/skeleton.css']
                    })
                }
            }
        })
        .state('dashboard.editSubscriptionAppt', {
            templateUrl: 'views/editSubscriptionAppt.html',
            controller: 'editSubscriptionAppt',
            url: '/editSubscriptionAppt',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/editSubscriptionAppt.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.subscriptionhead', {
            templateUrl: 'views/subscriptionhead.html',
            controller: 'subscriptionhead',
            url: '/subscriptionhead',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/subscriptionhead.js', 'bower_components/angularUtils-pagination/dirPagination.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
    
        .state('dashboard.parlorLayout', {
            templateUrl: 'views/parlorLayoutCrm.html',
            controller: 'parlorLayoutCrm',
            url: '/parlorLayoutCrm',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorLayoutCrm.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.parlorLayoutTest', {
            templateUrl: 'views/parlorLayoutTest.html',
            controller: 'parlorLayoutTest',
            url: '/parlorLayoutTest',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorLayoutTest.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.parlorLayout2', {
            templateUrl: 'views/parlorLayoutCrm2.html',
            controller: 'parlorLayoutCrm2',
            url: '/parlorLayoutCrm2',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/parlorLayoutCrm2.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.firstAppSettlement', {
            templateUrl: 'views/settlement/firstAppSettlement.html',
            controller: 'firstAppSettlement',
            url: '/firstAppSettlement',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/firstAppSettlement.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.employeeIncentiveReport', {
            templateUrl: 'views/incentives/employeeIncentiveReport.html',
            controller: 'employeeIncentiveReport',
            url: '/employeeIncentiveReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/incentives/employeeIncentiveReport.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/angu-fixed-header-table.js']
                    })
                }
            }
        })
        .state('dashboard.salonCohort', {
            templateUrl: 'views/adminReports/salonCohort.html',
            controller: 'salonCohort',
            url: '/salonCohort',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/salonCohort.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.salonReportAppCustomer', {
            templateUrl: 'views/adminReports/salonReportAppCustomer.html',
            controller: 'salonReportAppCustomer',
            url: '/salonReportAppCustomer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/salonReportAppCustomer.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.employeeLuckyDraw', {
        templateUrl: 'views/employeeLuckyDraw.html',
        controller: 'employeeLuckyDraw',
        url: '/employeeLuckyDraw',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/employeeLuckyDraw.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })




    .state('dashboard.opsFormDetails', {
            templateUrl: 'views/opsFormDetails.html',
            controller: 'opsFormDetails',
            url: '/opsFormDetails',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/opsFormDetails.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.viewOpsFormDetails', {
            templateUrl: 'views/viewOpsFormDetails.html',
            controller: 'viewOpsFormDetails',
            url: '/viewOpsFormDetails?formId',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/viewOpsFormDetails.js', '/styles/rzslider.css']
                    })
                }
            }
        })
        .state('dashboard.info', {
            templateUrl: 'views/info.html',
            controller: 'info',
            url: '/info',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/info.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    /***************luckyDraw page***************/
    .state('dashboard.luckyDraw', {
            templateUrl: 'views/luckyDraw.html',
            controller: 'luckyDraw',
            url: '/luckyDraw',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/luckyDraw.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.luckyDrawModel', {
            templateUrl: 'views/luckyDrawModel.html',
            controller: 'luckyDrawModelCtrl',
            url: '/luckyDrawModel',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/luckyDrawModel.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    /****************my code end************/
    .state('dashboard.notifications', {
            templateUrl: 'views/ui-elements/notifications.html',
            url: '/notifications'
        })
        .state('dashboard.typography', {
            templateUrl: 'views/ui-elements/typography.html',
            url: '/typography'
        })
        .state('dashboard.icons', {
            templateUrl: 'views/ui-elements/icons.html',
            url: '/icons'
        })
        .state('dashboard.grid', {
            templateUrl: 'views/ui-elements/grid.html',
            url: '/grid'
        }) /*******************report dashboard for salon owner************starts*****************/
        .state('dashboard.serviceReportSalon', {
            templateUrl: 'views/salonReports/serviceReportSalon.html',
            controller: 'serviceReportSalonCtrl',
            url: '/serviceReportSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReports/serviceReportSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    //   .state('dashboard.createBeUQuestions',{
    //     templateUrl:'views/createBeUQuestions/createBeUQuestions.html',
    //     controller:'createBeUQuestCtrl',
    //     url:'/createBeUQuestions',
    //     resolve: {
    //         loadMyFile:function($ocLazyLoad) {
    //             return $ocLazyLoad.load({
    //                 name:'sbAdminApp',
    //                 files:['/scripts/controllers/createBeUquestions/createBeUquestions.js','bower_components/angular-multi-select-master/isteven-multi-select.js','bower_components/angular-multi-select-master/isteven-multi-select.css'
    //                     ,'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css','bower_components/moment/moment.js','bower_components/bootstrap-daterangepicker/daterangepicker.js','bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
    //             })
    //         }
    //     }
    // })

    .state('dashboard.create&ViewBeUQuestions', {
        templateUrl: 'views/viewBeUQuestions/viewBeUQuestions.html',
        controller: 'viewBeUformCtrl',
        url: '/viewBeUQuestions',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/viewBeUquestions/viewBeUquestions.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.create&editDeals', {
        templateUrl: 'views/create&EditDeals/create&EditDeals.html',
        controller: 'create&EditCtrl',
        url: '/create&editDeals',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/create&EditDeals/create&EditDeals.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })


    .state('dashboard.weeklyReportSalon', {
            templateUrl: 'views/salonReports/weeklyReportSalon.html',
            controller: 'weeklyReportSalonCtrl',
            url: '/weeklyReportSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReports/weeklyReportSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.checkInCheckout', {
            templateUrl: 'views/adminReports/checkInCheckout.html',
            controller: 'checkInCheckout',
            url: '/checkInCheckout',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/checkInCheckoutReportCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


        .state('dashboard.incentiveReportSalon', {
            templateUrl: 'views/salonReports/incentiveReportSalon.html',
            controller: 'incentiveReportSalonCtrl',
            url: '/incentiveReportSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReports/incentiveReportSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.empSegmentReportSalon', {
            templateUrl: 'views/salonReports/empSegmentReportSalon.html',
            controller: 'empSegmentReportSalonCtrl',
            url: '/empSegmentReportSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReports/empSegmentReportSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.corporateCompany', {
            templateUrl: 'views/corporateCompany/corporateCompany.html',
            controller: 'corporateCompanyCtrl',
            url: '/corporateCompany',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/corporateCompany/corporateCompanyController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.corporateCompanyRequest', {
            templateUrl: 'views/corporateCompanyRequest.html',
            controller: 'corporateCompanyRequestCtrl',
            url: '/corporateCompanyRequest',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/corporateCompanyRequestCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        }).state('dashboard.capturePayment', {
            templateUrl: 'views/capturePayment.html',
            controller: 'capturePaymentCtrl',
            url: '/capturePayment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/capturePaymentCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })


    .state('dashboard.discountOnPurchase', {
        templateUrl: 'views/discountOnPurchase/discountOnPurchase.html',
        controller: 'discountOnPurchaseCtrl',
        url: '/discountOnPurchase',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/discountOnPurchase/discountOnPurchaseCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
     .state('dashboard.SalonManage', {
        templateUrl: 'views/addOrEditSalon/addOrEditSalons.html',
        controller: 'addOrEditSalonCtrl',
        url: '/SalonManage/:param',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/addOrEditSalon/addOrEditSalonCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })



    .state('dashboard.empPerformanceReportSalon', {
            templateUrl: 'views/salonReports/empPerformanceReportSalon.html',
            controller: 'empPerformanceReportSalonCtrl',
            url: '/empPerformanceReportSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonReports/empPerformanceReportSalon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.kpiDashboard', {
            templateUrl: 'views/kpi/kpiDashboard.html',
            controller: 'kpiDashboardCtrl',
            url: '/kpi/kpi-dashboard',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/kpi/kpiDashboard.js']
                    })
                }
            }
        })
        .state('dashboard.kpiDashboardEntry', {
            templateUrl: 'views/kpi/kpiDashboardEntry.html',
            controller: 'kpiDashboardEntryCtrl',
            url: '/kpi/kpi-dashboard-Entry',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/kpi/kpiDashboardEntry.js']
                    })
                }
            }
        })

    .state('dashboard.adminPurchaseOrder', {
        templateUrl: 'views/admin/adminPurchaseOrder.html',
        controller: 'adminPurchaseOrderCtrl',
        url: '/adminPurchaseOrder',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/admin/adminPurchaseOrder.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.searchBy', {
        templateUrl: 'views/searchBy.html',
        controller: 'searchByCtrl',
        url: '/searchBy',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/searchByCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })


    .state('dashboard.incentiveEditForum', {
        templateUrl: 'views/incentiveEditForum.html',
        controller: 'incentiveEditForumCtrl',
        url: '/incentiveEditForum',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/incentiveEditForum.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.invoiceWise', {
        templateUrl: 'views/reports/invoiceWiseCollection.html',
        controller: 'invoiceWiseCollectionCtrl',
        url: '/invoiceWise',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/reports/invoiceWiseCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })
     .state('dashboard.salonsCouponUsed', {
        templateUrl: 'views/reports/salonCoupon.html',
        controller: 'salonsCouponUsed',
        url: '/salon-coupon-used',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/reports/salonCoupon.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

 .state('dashboard.employeeWise', {
        templateUrl: 'views/reports/employeeWise.html',
        controller: 'employeeWise',
        url: '/employeeWise',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/reports/employeeWise.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })


    .state('dashboard.editManagerIncentive', {
        templateUrl: 'views/editManagerIncentive.html',
        controller: 'editManagerIncentiveCtrl',
        url: '/editManagerIncentive',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/editManagerIncentive.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.notificationOrSms', {
        templateUrl: 'views/notificationOrSms.html',
        controller: 'notificationOrSmsCtrl',
        url: '/notificationOrSms',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/notificationOrSms.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.bloggerAppointment', {
        templateUrl: 'views/bloggerAppointment.html',
        controller: 'bloggerAppointmentCtrl',
        url: '/bloggerAppointment',
        resolve: {
            loadMyFile: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'sbAdminApp',
                    files: ['/scripts/controllers/bloggerAppointment.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                })
            }
        }
    })

    .state('dashboard.editFeaturedReviews', {
            templateUrl: 'views/editFeaturedReviews.html',
            controller: 'editFeaturedReviewsCtrl',
            url: '/editFeaturedReview',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/editFeaturedReviewsCtrl.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/angu-fixed-header-table.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.appPaymentandLoyaltyUsedReport', {
            templateUrl: 'views/appPaymentandLoyaltyUsedReport.html',
            controller: 'appPaymentandLoyaltyUsedReportCtrl',
            url: '/appPaymentandLoyaltyUsedReport',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/appPaymentandLoyaltyUsedReport.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', ]
                    })
                }
            }
        })

    .state('dashboard.parlorData', {
            templateUrl: 'views/adminReports/parlorData.html',
            controller: 'parlorDataCtrl',
            url: '/parlorData',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/parlorData.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        .state('dashboard.customerMonthCohort', {
            templateUrl: 'views/adminReports/customerMonthCohort.html',
            controller: 'customerMonthCohortCtrl',
            url: '/customerMonthCohort',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/adminReports/customerMonthCohort.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

    .state('dashboard.accountStatement', {
            templateUrl: 'views/settlement/accountStatement.html',
            controller: 'accountStatementCtrl',
            url: '/accountStatement',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/accountStatement.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.createTrainingChapter', {
            templateUrl: 'views/createTrainingChapter.html',
            controller: 'createTrainingChapter',
            url: '/createTrainingChapter',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/createTrainingChapter.js']
                    })
                }
            }
        })


     .state('dashboard.gstAmountTransfer', {
            templateUrl: 'views/settlement/gstAmountTransfer.html',
            controller: 'gstAmountCtrl',
            url: '/gstAmountTransfer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/settlement/gstAmountTransfer.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css','bower_components/angular-csv-import/dist/angular-csv-import.js']
                    })
                }
            }
        })
     .state('dashboard.weeklyReportSalon2', {
            templateUrl: 'views/weeklyReportsSalon.html',
            controller: 'weeklyReportSalonsCtrl',
            url: '/weeklyReportSalon2',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/weeklyReportsSalon.js','bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
     .state('dashboard.sellersItems', {
            templateUrl: 'views/sellerItems.html',
            controller: 'sellerItemsCtrl',
            url: '/sellerItems2',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/sellerItems.js']
                    })
                }
            }
        })

        .state('dashboard.employeeAnalysis',{
            templateUrl:'views/employeeAnalysis.html',
            controller:'employeeAnalysisCtrl',
            url:'/employeeAnalysis',
            resolve:{
                loadMyFile:function($ocLazyLoad){
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                                    files:['/scripts/controllers/employeeAnalysisCtrl.js','bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']})
                }
            }
        })
    .state('dashboard.subscriptionSales',{
            templateUrl:'views/subscriptionSales.html',
            controller:'subscriptionSalesCtrl',
            url:'/subscriptionSales',
            resolve:{
                loadMyFile:function($ocLazyLoad){
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                                    files:['/scripts/controllers/subscriptionSalesCtrl.js','bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']})
                }
            }
        })
        
	
	 .state('dashboard.redeemsubscriptionnearby',{
            templateUrl:'views/redeemsubscriptionnearby.html',
            controller:'redeemsubscriptionnearbyCtrl',
            url:'/redeemsubscriptionnearby',
            resolve:{
                loadMyFile:function($ocLazyLoad){
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                                    files:['/scripts/controllers/redeemsubscriptionnearbyCtrl.js','bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']})
                }
            }
        })
	
	
	
	
   .state('dashboard.pastAppointment',{
            templateUrl:'views/pastAppointment.html',
            controller:'pastAppointmentCtrl',
            url:'/pastAppointment',
            resolve:{
                loadMyFile:function($ocLazyLoad){
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                                    files:['/scripts/controllers/pastAppointment.js','bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']})
                }
            }
        })
      .state('dashboard.customer', {
            templateUrl: 'views/customer/blockCode.html',
            controller: 'blockCodeCtrl',
            url: '/customer-block-code',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customer/blockCode.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
      .state('dashboard.appontmentedit', {
            templateUrl: 'views/appontmentedit/changeAppt.html',
            controller: 'editSubscriptionCtrl',
            url: '/appontment-edit',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/changeApptController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
         .state('dashboard.redim', {
            templateUrl: 'views/appontmentedit/redimAppoitment.html',
            controller: 'redimAppointmentController',
            url: '/redim-Appointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/redimAppointmentController.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css']
                    })
                }
            }
        })
          .state('dashboard.newCustomerReport', {
            templateUrl: 'views/appontmentedit/newCustomerReport.html',
            controller: 'newCustomerReport',
            url: '/new-customer-report',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/newCustomerReportctrl.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

        .state('dashboard.facebookQueries', {
            templateUrl: 'views/appontmentedit/facebookqueries.html',
            controller: 'facebookqueries',
            url: '/facebook-queries',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/facebookqueries.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

            .state('dashboard.websiteAppointment', {
            templateUrl: 'views/customerSupport/websiteAppointment.html',
            controller: 'websiteAppointment',
            url: '/website-appointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/websiteAppointment.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

          .state('dashboard.primecustomer', {
            templateUrl: 'views/customerSupport/primeCustomer.html',
            controller: 'primecustomer',
            url: '/prime-customer',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/primeCustomer.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

          .state('dashboard.leads', {
            templateUrl: 'views/customerSupport/leads.html',
            controller: 'leads',
            url: '/leads',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/leads.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        }) 
        .state('dashboard.conversionSummary', {
            templateUrl: 'views/customerSupport/conversionSummary.html',
            controller: 'conversionSummary',
            url: '/conversionSummary',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                            files: ['/scripts/controllers/customerSupport/conversionSummary.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        }) 
        .state('dashboard.myConversions', {
            templateUrl: 'views/customerSupport/myConversions.html',
            controller: 'myConversions',
            url: '/myConversions',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                            files: ['/scripts/controllers/customerSupport/myConversions.js']
                    })
                }
            }
        }) 
        .state('dashboard.latestapointment', {
            templateUrl: 'views/appontmentedit/latestAppointmentDetails.html',
            controller: 'latestAppontmentDetails',
            url: '/latest-detail',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/letestAppontmentDetails.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
          .state('dashboard.subscriptionpay', {
            templateUrl: 'views/appontmentedit/subscriptionPay.html',
            controller: 'subsrciptionPay',
            url: '/subscription-pay',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/subsrciptionPay.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

            .state('dashboard.transferSubscription', {
            templateUrl: 'views/appontmentedit/transferSubscription.html',
            controller: 'transferSubscription',
            url: '/transfer-subscription',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/appontmentedit/transferSubscription.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })

         .state('dashboard.salonSubscriptionSide', {
            templateUrl: 'views/salonSubscriptionSide/salonSubscriptionSide.html',
            controller: 'salonSideSubscriptionCtrl',
            url: '/sbrptSalon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonSubscriptionSide/salonSubscriptionSideCtrl.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
        
        .state('dashboard.subscriptionReports', {
            templateUrl: 'views/salonSubscriptionSide/subscriptionReports.html',
            controller: 'subscriptionReports',
            url: '/subscriptionReports',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonSubscriptionSide/subscriptionReports.js']
                    })
                }
            }
        })
        .state('dashboard.subscribersAttendance', {
            templateUrl: 'views/salonSubscriptionSide/subscribersAttendance.html',
            controller: 'subscribersAttendance',
            url: '/subscribersAttendance',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/salonSubscriptionSide/subscribersAttendance.js']
                    })
                }
            }
        })
        
        .state('dashboard.userQuestionnaire', {
            templateUrl: 'views/customerSupport/userQuestionnaire.html',
            controller: 'userQuestionnaire',
            url: '/userQuestionnaire',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/userQuestionnaire.js','bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css',]
                    })
                }
            }
        })
        .state('dashboard.allotData', {
            templateUrl: 'views/customerSupport/allotData.html',
            controller: 'allotData',
            url: '/allotData',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/customerSupport/allotData.js',"/node_modules/ngx-drag-to-select/ngx-drag-to-select.css"]
                    })
                }
            }
        })
         
         .state('dashboard.createCoupon', {
            templateUrl: 'views/createCoupon/createCoupon.html',
            controller: 'createCouponCtrl',
            url: '/createCoupon',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/createCoupon/createCoupon.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
   .state('dashboard.flashsaleappointment', {
            templateUrl: 'views/flashsaleAppointment.html',
            controller: 'flashsaleAppointmentCtrl',
            url: '/flashsaleAppointment',
            resolve: {
                loadMyFile: function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: ['/scripts/controllers/flashsaleAppointment.js', 'bower_components/dragdrop/draganddrop.js', 'bower_components/angular-multi-select-master/isteven-multi-select.js', 'bower_components/angular-multi-select-master/isteven-multi-select.css', '/scripts/directives/headDirective/headDirective.js', 'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css', 'bower_components/moment/moment.js', 'bower_components/bootstrap-daterangepicker/daterangepicker.js', 'bower_components/angular-daterangepicker/js/angular-daterangepicker.js']
                    })
                }
            }
        })
    
   
    /*******************report dashboard for salon owner************stops*****************/
}]);



 