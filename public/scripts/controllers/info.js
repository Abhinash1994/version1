'use strict';

angular.module('sbAdminApp',)

.controller('info',
            function($scope,$http,NgTableParams,$timeout, $interval,$window,$document,$sce,$sanitize) {


      $scope.buttonDisabled=false;
      $scope.timer=false;
      $scope.pageEnd=false;
      $scope.currentTime = 0;
      $scope.API = null;
      $scope.state = null;
      $scope.videoCount=0;
      $scope.noOfVideoTags=0;


      // $scope.records = [
      //     {
      //       "text" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      //       "videoLink" : "videoplayback.mp4"
      //     },
      //     {
      //       "text" : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
      //       "videoLink" : "videoplayback.mp4"
      //     }
      //   ];

        $scope.vObject=[{
                          text:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
                          sources:[
                            {src:$sce.trustAsResourceUrl("http://res.cloudinary.com/dzfbvdazz/video/upload/v1505461405/rio_qbsjzb.mp4"), type: "video/mp4"}
                           ]
                        },
                        {

                          text:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                          sources:[
                            {src:$sce.trustAsResourceUrl("http://res.cloudinary.com/dzfbvdazz/video/upload/v1505461405/rio_qbsjzb.mp4"), type: "video/mp4"}
                           ]
                        }];

  $scope.initFunction=function() {
    $scope.scrollEnd();
    $scope.promise;
    $scope.novideos();
  };
  $scope.novideos=function() {
  for (var i = 0; i < $scope.vObject.length; i++) {
    if ($scope.vObject[i].sources!==undefined) {
      $scope.noOfVideoTags++;
    }
  }
    console.log($scope.noOfVideoTags);
  };

             $scope.onPlayerReady = function($API) {
                           $scope.API = $API;
                       };
                       $scope.onUpdateState = function ($state) {
                            $scope.state = $state;
                            console.log($scope.videoCount+" count");
                            console.log($scope.noOfVideoTags+" tags");
                        };
                      $scope.onComplete=function () {
                            console.log("video completed");
                            $scope.videoCount++;
                            console.log($scope.videoCount);

                        };
                        $scope.onUpdateTime = function ($currentTime, $totalTime) {
                          $scope.currentTime = $currentTime;
                          $scope.totalTime = $totalTime;
                          // console.log($scope.records[1].videoLink);
                      };

                  $scope.config={
                      sources:[
                        {src: $sce.trustAsResourceUrl("videoplayback.mp4"), type: "video/mp4"}
                      ],
                      theme: "node_modules/videogular-themes-default/videogular.css"
                  };
                  $timeout(function($timeout) {
                          $scope.timer=true;
                          console.log($scope.timer+"timeout");
                      }, 10000);

                      $scope.promise=$interval(function() {
                        if(($scope.videoCount==$scope.noOfVideoTags)&&($scope.timer==true)&&($scope.pageEnd==true||($window.pageYOffset==0))){
                          console.log("jsdfgadfabdfbg");
                          console.log($scope.videoCount+" count");
                          console.log($scope.noOfVideoTags+" tags");
                           $scope.buttonDisabled=true;
                            $interval.cancel($scope.promise);
                        }
                      }, 1000);

      $scope.scrollEnd=function () {

    var e1=angular.element($window)
            .bind(
              "scroll",
                function() {


                  $scope.windowHeight = "innerHeight" in $window ? $window.innerHeight: $document[0].documentElement.offsetHeight;
                  $scope.body = $document[0].body, $scope.html = $document[0].documentElement;
                  $scope.docHeight = Math.max($scope.body.scrollHeight, $scope.body.offsetHeight, $scope.html.clientHeight, $scope.html.scrollHeight, $scope.html.offsetHeight);
                  $scope.windowBottom = $scope.windowHeight + $window.pageYOffset;

                  if ($scope.windowBottom >= $scope.docHeight||($window.pageYOffset==0)) {
                    $scope.pageEnd=true;
                  }
              });

  }

    });
// .directive("myStopButton",
//   function() {
//     return {
//               restrict: "E",
//               require: "^videogular",
//               template: "<div class='fa fa-repeat' ng-click='API.stop(); API.play()'></div>",
//               link: function(scope, elem, attrs, API) {
//                   scope.API = API;
//               }
//     }
//   });
