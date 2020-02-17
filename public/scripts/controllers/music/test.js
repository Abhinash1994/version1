angular.module('sbAdminApp',['ui.bootstrap'])
.controller('musicPlayer', function($scope, $http) {
    // console.log('Music PLayer controller' );
    var pId="594a359d9856d3158171ea4f";

    $scope.oldSongId=0;
    $scope.newSongId=0;
    $scope.selected="false";
  // You can issue commands right away

    $scope.openSaveModal=function(){
      $('#savePLayList').modal('show');
      // console.log("Save function");
    }

    $scope.savePlayList=function(list,name){
      // console.log("button working");


    }


    // $timeout( function(){
    //     db.find({}, { playListName: 1, _id: 0 }, function (err, docs) {
    //       console.log(docs)
    //       if(docs.length){
    //         $scope.playlists=docs;
    //         console.log(docs);
    //         // $('#loadPlayList').modal('show');
    //       }else{
    //         console.log("No playlist Found")
    //         // alert("No Playlist Found")
    //       }

    //     });
    //  }, 1000 );

    $scope.openLoadPlayList=function(){

    }
    $scope.loadThisList=function(name){

    }

    $scope.loadModels=function(array){
     
    
      
          // $scope.models[1].items=angular.copy(array);
          
    }

    $scope.selectAllItems=function(list){
      // console.log(list)
      list.items.forEach(function(item){ //added this
        if(item.selected==true){
          item.selected = false;
        }
        else {
          item.selected = true;
        }
      })
      return list.items.filter(function(item) { return item.selected; });
    }

    $scope.changePlaylist=function(songIds,index,type,draggedFrom,dragTo){
      // console.log(songIds)
      var dummies=angular.copy($scope.models[1]);
      socket.emit ('changePlaylistPlayer', {songIds:songIds,index:index,type:type,parlorId:pId});
        var flag=true;
      songIds.forEach(function(songI){
        $scope.allSongs.forEach(function(allSong){
          if(allSong.songId==songI){
            allSong.requestedBy="Salon"
            // console.log()
            $scope.models[1].items.splice(index,0,allSong);
            index=index+1;
          }
        })
      })
      if(player){
                    // console.log("player is defined")
                    // console.log(dragTo);
                    // console.log(draggedFrom);
              if(dragTo!=draggedFrom){
                // console.log(dragTo)
                if(draggedFrom!='Your Playlist')
                 {
                      if(player.playlist.length>0){
                          var dummy=angular.copy($scope.models[1].items.slice(1,$scope.models[1].items.length));
                         player.playlist.splice(1,player.playlist.length-1);
                          dummy.forEach(function(abc){
                                              player.playlist.push(abc);
                            })

                      }
                          else{
                                player.playlist=angular.copy($scope.models[1].items);
                          }
                       
                      }
                        else{
                                songIds.forEach(function(abc){
                                      player.playlist.splice(player.playlist.findIndex(function(def){return def.songId==abc}),1);
                                })
                              } 

                }
             
 }
      else{
        // console.log("hdgshdg")
        player = new Player($scope.models[1].items);
      }

      // console.log(player)
      $scope.$apply();
}
    $scope.afterUserRequest=function(requestedBy,songIds,index,type){
        var flag=true;
      songIds.forEach(function(songI){
        $scope.allSongs.forEach(function(allSong){
          if(allSong.songId==songI){
            $scope.models[1].items.splice(index,0,allSong);
            $scope.models[1].items[index].requestedBy=requestedBy;
            // console.log($scope.models[1].items);
            index=index+1;
          }
        })
      })

        if(player){
            if(player.playlist.length>0){
            for(var index=0;index<$scope.models[1].items.length;index++){
                    if(player.playlist[index]){
                          if(player.playlist[index].songId!=$scope.models[1].items[index].songId){
                                  flag=false;
                                  player.playlist.splice(index,0,$scope.models[1].items[index]);
                        break;}}}};
                if(flag){
                  player.playlist.push($scope.models[1].items[$scope.models[1].items.length-1])
                }
       }
      else{
             player = new Player($scope.models[1].items);
      }


      // player = new Player($scope.models[1].items);

      $timeout(function () {
        // console.log("playlist updated");
      },2000)
    }
// Cache references to DOM elements.
var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

/*const testFolder = 'C:\\songs';*/
const testFolder = './audio';
$scope.playerList=''
var player;
// console.log("reached here")
function p(){
  // console.log("playlist");
  $('#playlist1').modal('show');
}
$scope.closeModal=function() {
  $('#playlist1').modal('hide');
}

// console.log("came here..............................................");

var socket = io.connect('http://13.126.45.78:1337', {transports : ['websocket', 'polling']});

            // console.log(socket);

            socket.on("connect",function(data){
                // console.log("SDAdsa");
                socket.emit('musicroom', pId+'music');
                /*$http.get("/role3/registerSocket?socketId=" + data.id).success(function(response, status){
                    console.log("message is ", response);
                });*/
                //alert(data)
            })
            socket.on ('musicRoomJoined', function (data) {
              // console.log("Music Room Joined");
              // console.log(data);
             });


            socket.on("userRequest",function(data){
                // console.log("Insert user request in playlist");
                var array=[];
                array[0]=data.songId;
                $scope.requestedByLastIndex=data.requestedByLastIndex;
                $scope.afterUserRequest(data.requestedBy,array,data.index,1); })
           
            socket.on("songChanged",function(data){
                // console.log(data);
                // $scope.new=player;
                // console.log($scope.new);
               for(var i=0;i<$scope.new.playlist.length;i++){
                    if($scope.new.playlist[i].file==data){
                         player.skipTo(i);
                         break;
                    }
                }
              // console.log("song changed to  ",data);
              //alert(data)
          })


            // var data={
            //   songId:"1o1",
            //   songName:"hehehe",
            //   fileName:"urfile$105.mp3",
            //   url:"http://res.cloudinary.com/dyqcevdpm/video/upload/br_1766/v1520667879/01_Mundiyan_-_Baaghi_2_-_320Kbps_1_qfokdg.mp3"
            // 



var Player = function(playlist) {
  // console.log(playlist)
  this.playlist = playlist;
  this.index = 0;
  // console.log("player",playlist);
  // console.log("player plylist",playlist[0])
  // Display the title of the first track.
  if(playlist.length>0){
     track.innerHTML = '1. ' + playlist[0].title;
  }
 
  // Setup the playlist display.
  var uniqueArr=[];
  for (var i = 0; i < this.playlist.length; i++) {
    if(uniqueArr.indexOf(playlist[i]) == -1){
        uniqueArr.push(playlist[i]);
    }
  }
  this.playlist=uniqueArr;
  this.playlist.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    div.onclick = function() {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });

};
Player.prototype = {
  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
    behaivour:'paused',
    runningIndex:0,
  play: function(index) {

    var self = this;
    self.behaviour='playing'
      // console.log(self)
    var sound;
    // console.log($scope.oldSongId)

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];
    // console.log("player data",data);
    if($scope.oldSongId==0){
      // console.log(data);
      socket.emit ('songStarted', {songId:data.songId,parlorId:pId});
      $scope.oldSongId=data.songId;
      // $scope.models[1].items.splice(0,1);
      // self.playlist.splice(0,1);
      // self.index=0;
    }else if($scope.oldSongId==data.songId){
      // console.log("same song/");
      // socket.emit ('songStarted',{songId:data.songId,parlorId:"594a359d9856d3158171ea4f"});
         // socket.emit ('songStarted', {songId:data.songId,parlorId:"594a359d9856d3158171ea4f"});
    }else{
      // console.log("New Song");
      $scope.oldSongId=data.songId;
      // console.log(data)
      socket.emit ('songStarted', {songId:data.songId,parlorId:pId});
      
}

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      // console.log(data)
      // console.log("if");
      sound = data.howl;

    } else {
      // console.log("else");
      sound = data.howl = new Howl({
        src: ['.'+testFolder +'/' +data.file],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: function() {
          // Display the duration.
          duration.innerHTML = self.formatTime(Math.round(sound.duration()));

          // Start upating the progress of the track.
          requestAnimationFrame(self.step.bind(self));

          // Start the wave animation if we have already loaded
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          pauseBtn.style.display = 'block';
          
        },
        onload: function() {
          // console.log("Song Loaded");

               
            // Start the wave animation.
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          loading.style.display = 'none';
        },
        onend: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
          self.skip('right');
             if(self.playlist.length>1){
              // runningIndex++;
              //  track.innerHTML = self.runningIndex + '. ' + data.title;

            var a=$scope.models[0].items.findIndex(function(check){return $scope.models[1].items[0].songId==check.songId})
               $scope.models[0].items[a].selected=false;
             $scope.models[0].items[a].howl=null;
            $scope.models[1].items.splice(0,1);
            self.playlist.splice(0,1);
            $scope.$apply()
              self.index=0;

             }
         
          
          // console.log("end")
         
            
            
        },
        onpause: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onstop: function() {
          // Stop the wave animation.
          // console.log(player)
          // console.log(self)
          if(self.direction=='next'){
            // console.log('hjhjh')
    if(self.playlist.length>1){
                  // track.innerHTML = self.runningIndex + '. ' + data.title;
                                // console.log('splice from next')
                                var a=$scope.models[0].items.findIndex(function(check){return $scope.models[1].items[0].songId==check.songId})
                                // console.log(a)
             $scope.models[0].items[a].selected=false;
             $scope.models[0].items[a].howl=null;
             $scope.models[1].items.splice(0,1);
                                self.playlist.splice(0,1);
                                  self.index=0;
                                  self.direction='default'
              $scope.$apply();
          }

          }
            
         
          // console.log("hfsghdg")
          // console.log(self)
        
        
     
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        }
      });
    }
    // Begin playing the sound.
    sound.play();

    // Update the track display.
   
    if(self.playlist.length>1){
        self.runningIndex++;
         track.innerHTML = self.runningIndex + '. ' + data.title;
    }
    
    // console.log("Song Started",data);
    // Show the pause button.
    if (sound.state() === 'loaded') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
    } else {
      loading.style.display = 'block';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
    }

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  /**
   * Pause the currently playing track.
   */
  pause: function() {
    var self = this;
     self.behaviour='paused'
    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function(direction) {
    var self = this;

      self.direction=direction;
      // console.log('skip')
    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      // index = self.index - 1;
      // if (index < 0) {
      //   index = self.playlist.length - 1;
      // }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
      self.skipTo(index);
    }

},
skipTo: function(index) {
                          var self = this;
                          if (self.playlist[self.index].howl) {
                                                                self.playlist[self.index].howl.stop();
                          }
                              progress.style.width = '0%';
                              self.play(index);
  },

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume: function(val) {
    var self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function(per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.
     // console.log("jdksk")
    if (sound.playing()) {
      // console.log("jdksk")
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function() {
    var self = this;

    // Get the Howl we want to manipulate.

    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function() {
    var self = this;
    var display = (playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      playlist.style.display = display;
    }, (display === 'block') ? 0 : 50);
    playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function() {
    var self = this;
    var display = (volume.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      volume.style.display = display;
    }, (display === 'block') ? 0 : 500);
    volume.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
};


  // console.log($scope.allSongs);

  // console.log($scope.models);
//   $http.get("'http://www.beusalons.com/mp3/playlist?parlorId="+pId).success(function (res) {
//     console.log(res);
//     if (res.success) {
//       console.log(res.data.playlist);
//         console.log(  $scope.allSongs);
//       $scope.requestedByLastIndex=res.data.requestedByLastIndex;
//       $scope.models[1].items=[];
//       res.data.playlist.forEach(function(s){
//         $scope.allSongs.forEach(function(allSong){
//           if(allSong.songId==s.songId){
//             allSong.requestedBy=s.requestedBy
//             $scope.models[1].items.push(allSong);
//           }
//         })
//       })
//       player = new Player({src: ['https://www.youtube.com/watch?v=JGwWNGJdvx8']});
//     }
//     else {
//       $scope.loadThisList("Default-Playlist");
//       console.log("loaded playlist123", $scope.models[1].items)
//         player = new Player({src: ['https://www.youtube.com/watch?v=JGwWNGJdvx8']});
//         console.log(player);
//     }
//   });
player = new Player({src: ['https://www.youtube.com/watch?v=JGwWNGJdvx8']});



playlistBtn.addEventListener('click', function() {
  p();
});
// Bind our player controls.
playBtn.addEventListener('click', function() {
  player.play();
});
pauseBtn.addEventListener('click', function() {
  player.pause();
});
prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});
waveform.addEventListener('click', function(event) {
  player.seek(event.clientX / window.innerWidth);
});
playlistBtn.addEventListener('click', function() {

  // player.togglePlaylist();
});
playlist.addEventListener('click', function() {
  player.togglePlaylist();
});
volumeBtn.addEventListener('click', function() {
  player.toggleVolume();
});
volume.addEventListener('click', function() {
  player.toggleVolume();
});

// Setup the event listeners to enable dragging of volume slider.
barEmpty.addEventListener('click', function(event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volume(per);
});
sliderBtn.addEventListener('mousedown', function() {
  window.sliderDown = true;
});
sliderBtn.addEventListener('touchstart', function() {
  window.sliderDown = true;
});
volume.addEventListener('mouseup', function() {
  window.sliderDown = false;
});
volume.addEventListener('touchend', function() {
  window.sliderDown = false;
});


var move = function(event) {
  if (window.sliderDown) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    player.volume(per);
  }
};

volume.addEventListener('mousemove', move);
volume.addEventListener('touchmove', move);

// Setup the "waveform" animation.
var wave = new SiriWave({
    container: waveform,
    width: window.innerWidth,
    height: window.innerHeight * 0.3,
    cover: true,
    speed: 0.03,
    amplitude: 0.7,
    frequency: 2
});
wave.start();

// Update the height of the wave animation.
// These are basically some hacks to get SiriWave.js to do what we want.
var resize = function() {
  var height = window.innerHeight * 0.3;
  var width = window.innerWidth;
  wave.height = height;
  wave.height_2 = height / 2;
  wave.MAX = wave.height_2 - 4;
  wave.width = width;
  wave.width_2 = width / 2;
  wave.width_4 = width / 4;
  wave.canvas.height = height;
  wave.canvas.width = width;
  wave.container.style.margin = -(height / 2) + 'px auto';
};
window.addEventListener('resize', resize);
resize();

// Dragging library code---------------------------------
$scope.models = [
  {listName: "All Songs", items: [], dragging: false},
  {listName: "Your Playlist", items: [], dragging: false}
];

/**
 * dnd-dragging determines what data gets serialized and send to the receiver
 * of the drop. While we usually just send a single object, we send the array
 * of all selected items here.
 */
$scope.getSelectedItemsIncluding = function(list, item) {
  // console.log("jhghfghghdsghsgdhgdhsghdgshdghsgdhg")
  item.selected = true;
  var dummy=angular.copy(list.items.filter(function(item) { return item.selected; }))
      return dummy;
};

/**
 * We set the list into dragging state, meaning the items that are being
 * dragged are hidden. We also use the HTML5 API directly to set a custom
 * image, since otherwise only the one item that the user actually dragged
 * would be shown as drag image.
 */
$scope.onDragstart = function(list, event) {
  // console.log("drag Start")
  if(list.listName=="All Songs"){
    $scope.draggedFrom="All Songs"
  }
  else {
    $scope.draggedFrom="Your Playlist"
  }
   list.dragging = true;
   if (event.dataTransfer.setDragImage) {
     var img = new Image();
     img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
     event.dataTransfer.setDragImage(img, 0, 0);
   }

};

/**
 * In the dnd-drop callback, we now have to handle the data array that we
 * sent above. We handle the insertion into the list ourselves. By returning
 * true, the dnd-list directive won't do the insertion itself.
 */
 $scope.onDrop = function(list, items, index) {
   var array=[];
        // console.log(list,items,index);
        // console.log("list.items b4",list.items);
        // console.log("items",items);
        // console.log("index",index);
        // console.log("list is",list);

        $scope.draggedTo=list.listName;
        // console.log("$scope.draggedTo",$scope.draggedTo);
        // console.log("$scope.draggedFrom",$scope.draggedFrom);
        if(($scope.draggedTo==$scope.draggedFrom) && ($scope.draggedTo=="Your Playlist")){

          // console.log("do nothing");
        }
        else {
          // console.log("do something");

             if(list.listName!= "All Songs"){
               items.forEach(function(item){
                 var notThere = true;
                 list.items.forEach(function(l){
                     if(l.songId == item.songId){
                       notThere = false;
                     }
                 });
                 if(notThere){
                   array.push(item.songId);
                 }
               })
             }else{
               items.forEach(function(item){
                   array.push(item.songId);
               })

               // console.log($scope.models)
             }

             // console.log("listname",list.listName)
             if(index>$scope.requestedByLastIndex){
               // console.log("index greater than requestedByLastIndex");
               // console.log("$scope.requestedByLastIndex",$scope.requestedByLastIndex);
               // console.log("index",index);
               $scope.changePlaylist(array,index,list.listName!= "All Songs" ? 1:-1,$scope.draggedFrom,$scope.draggedTo)
                // console.log(player)
             }
             else {
               // console.log("index  less than requestedByLastIndex");
               // console.log("$scope.requestedByLastIndex",$scope.requestedByLastIndex);
               // console.log("index",index);
               $scope.changePlaylist(array,$scope.requestedByLastIndex,list.listName!= "All Songs" ? 1:-1,$scope.draggedFrom,$scope.draggedTo);
                // console.log(player)
             }
             if(list.listName== "All Songs"){

               // console.log(list);
             }
             if(list.listName!= "All Songs"){
              // console.log(list);
              // console.log(list.listName)
              // console.log($scope.models);
              list.items=list.items.filter(function(item, pos) {
                  return list.items.indexOf(item) == pos;
                })

             }

              // $scope.$apply();
              // console.log(player)
             angular.forEach(items, function(item) { item.selected = false; });
             return true;

        }
  


 }

/**
 * Last but not least, we have to remove the previously dragged items in the
 * dnd-moved callback.
 */
$scope.onMoved = function(list) {
  // console.log("hfjgfhg")
  if (list.listName=="All Songs") {

  }else {
    list.items = list.items.filter(function(item) { return !item.selected; });

  }
};

});