angular.module('sbAdminApp',['ui.bootstrap','dndLists'])
.controller('musicPlayer', function($scope, $http) {
    
         var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'playlistBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
         elms.forEach(function(elm) {
           window[elm] = document.getElementById(elm);
         });
         $scope.parlorId=parlorId;
         $scope.oldSongId=0;
         $scope.newSongId=0;
         $scope.songIndex={};
         $scope.songIndex.index=0
         $scope.models = {
          selected: null,
          list:  [{
            "songId" : 5,
            "name" : "Attention",
            "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518430885/220px-Charlie_Puth_-_Attention__28Official_Single_Cover_29_eavjzw.png",
            "description" : "Charlie Puth",
            "title":"Attention",
            "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Charlie+Puth+-+Attention%245.mp3"
            },
            {
              "songId" : 25,
              "name" : "A Sky Full Of Stars",
              "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518431598/f3b8be2429573f13e944839b31995eb3_aw150j.jpg",
              "description" : "Coldplay",
              "title":"A Sky Full Of Stars",
              "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Coldplay+-+A+Sky+Full+Of+Stars%2425.mp3"
          },
          {
            "songId" : 17,
            "name" : "Beyonce",
            "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518431376/26f353f4bd747128b4895c0793af173c--beyonce-album-beyonce-beyonce_pfrnvm.jpg",
            "description" : "Beyonce",
            "title":"Beyonce",
            "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Beyonce%2417.mp3"
        }]
        };
       
         /**
          * Player class containing the state of our playlist and where we are in it.
          * Includes all methods for playing, skipping, updating the display, etc.
          * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
          */
         var Player = function(playlist) {
           this.playlist = playlist;
           this.index = 0;
         
           // Display the title of the first track.
           track.innerHTML = '1. ' + playlist[0].title;
         
           // Setup the playlist display.
           playlist.forEach(function(song) {
             var div = document.createElement('div');
             div.className = 'list-song';
             div.innerHTML = song.title;
             div.onclick = function() {
               player.skipTo(playlist.indexOf(song));
             };
             list.appendChild(div);
           });
         };
         var sound;
         Player.prototype = {
           /**
            * Play a song in the playlist.
            * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
            */
            
           play: function(index) {
             var self = this;
            $scope.songIndex.index=0;
             index = typeof index === 'number' ? index : self.index;
             var data = self.playlist[index];
             // console.log($scope.oldSongId)
                 if($scope.oldSongId==0){
                   socket.emit ('songStarted', {songId:data.songId,parlorId:$scope.parlorId});
                   $scope.oldSongId=data.songId;
                   // $scope.models[1].items.splice(0,1);
                   // self.playlist.splice(0,1);
                   // self.index=0;
                   $scope.$apply(function () {
                    $scope.songIndex.index=0;
                  });
                 }else if($scope.oldSongId==data.songId){
                   // console.log("same song/");
                   // socket.emit ('songStarted',{songId:data.songId,parlorId:"594a359d9856d3158171ea4f"});
                      // socket.emit ('songStarted', {songId:data.songId,parlorId:"594a359d9856d3158171ea4f"});
                 }else{
                   // console.log("New Song");
                   $scope.oldSongId=data.songId;
                   // console.log(data);
                   $scope.$apply(function () {
                    $scope.songIndex.index=index;
                });

                   
                   // console.log($scope.songIndex);
                   socket.emit ('songStarted', {songId:data.songId,parlorId:$scope.parlorId}); 
                  }
             
         
             // If we already loaded this track, use the current one.
             // Otherwise, setup and load a new Howl.
             if (data.howl) {
               if(data.howl._state=="loading"){
                 // console.log("load ho raha")
               }
               sound = data.howl;
             } else {
               sound = data.howl = new Howl({
                 src: data.songUrl,
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
                 },
                 onpause: function() {
                   // Stop the wave animation.
                   wave.container.style.display = 'none';
                   bar.style.display = 'block';
                 },
                 onstop: function() {
                   // Stop the wave animation.
                   wave.container.style.display = 'none';
                   bar.style.display = 'block';
                 }
               });
             }
         
             // Begin playing the sound.
             sound.play();
         
             // Update the track display.
             track.innerHTML = (index + 1) + '. ' + data.title;
         
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
         
             // Get the Howl we want to manipulate.
            //  var sound = self.playlist[self.index].songUrl;
         
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
         
             // Get the next track based on the direction of the track.
             var index = 0;
             if (direction === 'prev') {
               index = self.index - 1;
               if (index < 0) {
                 index = self.playlist.length - 1;
               }
             } else {
               index = self.index + 1;
               if (index >= self.playlist.length) {
                 index = 0;
               }
             }
         
             self.skipTo(index);
           },
         
           /**
            * Skip to a specific track based on its playlist index.
            * @param  {Number} index Index in the playlist.
            */
           skipTo: function(index) {
             var self = this;
         
             // Stop the current track.
             if (sound) {
               sound.stop();
             }
         
             // Reset progress.
             progress.style.width = '0%';
         
             // Play the new track.
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
             //var sound = self.playlist[self.index].songUrl;
         
             // Convert the percent into a seek position.
             if (sound.playing()) {
               sound.seek(sound.duration() * per);
             }
           },
         
           /**
            * The step called within requestAnimationFrame to update the playback position.
            */
           step: function() {
             var self = this;
         
             // Get the Howl we want to manipulate.
            // var sound = self.playlist[self.index].songUrl;
         
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
             }, (display === 'block') ? 0 : 500);
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
            * @return {String} Formatted time.
            */
           formatTime: function(secs) {
             var minutes = Math.floor(secs / 60) || 0;
             var seconds = (secs - minutes * 60) || 0;
         
             return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
           }
         };
         
        //  Setup our new audio player class and pass it the playlist.
         var player = new Player(angular.copy($scope.models.list));
         
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
           player.togglePlaylist();
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
         
           //Update the position of the slider.
           var sound = player.playlist[player.index].howl;
           if (sound) {
             var vol = sound.volume();
             var barWidth = (vol * 0.9);
             sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
           }
         };
         window.addEventListener('resize', resize);
         resize()

         $scope.parlorId=parlorId
         // console.log("inside player controller");
         $http.get("/mp3/songs").success(function (res) {
            // console.log("all songs",res);
            $scope.allSongs=res.data.songs
          });
         var socket = io.connect('http://35.154.199.167:4000', {transports : ['websocket', 'polling']});
         socket.on("connect",function(data){
             // console.log("SDAdsa");
             socket.emit('musicroom', $scope.parlorId+ 'music');
         })
         socket.on ('musicRoomJoined', function (data) {
           // console.log("Music Room Joined");
           // console.log(data);
          });
          socket.on("userRequest",function(data){
            // console.log("Insert user request in playlist",data);
            var array=[];
            array[0]=data.songId;
            var songRequest=$scope.getSongsFromIds(array);
            // console.log("song reuest at index",$scope.songIndex.index);
            $scope.playlistChanged(songRequest,$scope.songIndex.index+1,"user",array)
        })
        $scope.initializePlaylist=function(){
          $http.get("/mp3/playlist?parlorId=" + $scope.parlorId).success(function (res) {
            // console.log(res);
            if (res.success) {
              // console.log(res.data.playlist);
              $scope.models.list=angular.copy(res.data.playlist);
              player.playlist=angular.copy(res.data.playlist);
            }else{
              var initialSongs=[];
              $scope.models.list.forEach(function(song){
              initialSongs.push(song.songId)
              });
              player.playlist=angular.copy($scope.models.list);
              console.log("socket object",{songIds:initialSongs,index:0,type:1,parlorId:$scope.parlorId});
              socket.emit ('changePlaylistPlayer', {songIds:initialSongs,index:0,type:1,parlorId:$scope.parlorId});
            }
          });
        }
        $scope.initializePlaylist();
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
        
      $scope.transferToPlaylist=function(){
        var len=$scope.models.list.length;
        // console.log("model length",len)
        var trans=[];
        var counter=0;
        var songIds=[];
        $scope.allSongs.forEach(function(song){
          counter++;
          if(song.transfer){
              trans.push(song)
              songIds.push(song.songId)
              song.transfer=false;
          }
        })
        if(counter==$scope.allSongs.length) {
        // console.log("change playlist funtion called");
        // console.log("model length",len)
        $scope.playlistChanged(trans,len,"salon",songIds)
        }
      }
        $scope.$watch('models.list', function(model) {
          // console.log("watch called")
          $scope.modelAsJson = angular.toJson(model, true);

        }, true);
        $scope.getSongsFromIds=function(songIds){
          var songs=[];
          songIds.forEach(function(songI){
            $scope.allSongs.forEach(function(allSong){
              if(allSong.songId==songI){
                songs.push(allSong)
              }
            })
          })
          return songs
        }

        $scope.playlistChanged=function(songs,index,source,songIds){
          var counter= 0;
          if(player !== undefined){
            // console.log("songs",songs)
           var list=angular.copy($scope.models.list);
            songs.forEach(function(song,i){
              var flag=false
              list.forEach(function(play){
                if(song.songId==play.songId){
                  songs.splice(i,1);
                  songIds.splice(i,1);
                  flag=true
                }
              })
              if(source=="salon"){
                $scope.models.list.splice(index,0,angular.copy(song));
                player.playlist.splice(index,0,angular.copy(song));
                socket.emit ('changePlaylistPlayer', {songIds:songIds,index:index,type:0,parlorId:$scope.parlorId});
              }
              if(source=="user"){
                $scope.$apply(function(){
                  $scope.models.list.splice(index,0,angular.copy(song));
                  player.playlist.splice(index,0,angular.copy(song));
              });
              }
                
                index++;
                counter++;
              
                
              
            })
            // console.log("final songs array",songs);
            // console.log("playlist 123",$scope.models.list)
            // console.log("playlist new",player.playlist);
          }
          
        }
        $scope.selectAll=function(){
          $scope.allSongs.forEach(function(song){
            song.transfer=true
          })
        }
        $scope.deletePlaylist=function(){
          $scope.models.list=[];
          player.playlist=[];
          $http.get("/mp3/deletePlaylist?parlorId="+parlorId).success(function (res) {
            // console.log("all songs deleted");
            $scope.models = {
              selected: null,
              list:  [{
                "songId" : 5,
                "name" : "Attention",
                "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518430885/220px-Charlie_Puth_-_Attention__28Official_Single_Cover_29_eavjzw.png",
                "description" : "Charlie Puth",
                "title":"Attention",
                "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Charlie+Puth+-+Attention%245.mp3"
                },
                {
                  "songId" : 25,
                  "name" : "A Sky Full Of Stars",
                  "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518431598/f3b8be2429573f13e944839b31995eb3_aw150j.jpg",
                  "description" : "Coldplay",
                  "title":"A Sky Full Of Stars",
                  "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Coldplay+-+A+Sky+Full+Of+Stars%2425.mp3"
              },
              {
                "songId" : 17,
                "name" : "Beyonce",
                "imageUrl" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1518431376/26f353f4bd747128b4895c0793af173c--beyonce-album-beyonce-beyonce_pfrnvm.jpg",
                "description" : "Beyonce",
                "title":"Beyonce",
                "songUrl" : "https://s3.ap-south-1.amazonaws.com/songsforbeu/Beyonce%2417.mp3"
            }]
            };
            $scope.initializePlaylist();
          });
        }
        
});