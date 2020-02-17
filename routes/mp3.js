

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var request = require('request');


//Create New Position
router.get('/songs', function(req, res) {
    Song.find({}, function(err, songs){
        songs = _.map(songs, function(s){
            return{
                name : s.name,
                songId : parseInt(s.songId),
                imageUrl : s.imageUrl,
                songUrl : s.songUrl,
                howl:null,
                title:s.name,
                description : s.description,
                _id : s._id
            }
        })
        return res.json(CreateObjService.response(false, {songs  : songs }));
    });
});

router.post("/editSong",  function(req, res){
      Song.update({_id : req.body._id}, {$set : {imageUrl : req.body.imageUrl, songUrl : req.body.songUrl}}, function(err, updated){
        if(err){
          return res.json(CreateObjService.response(true, "Server Error."));
        }else{
          return res.json(CreateObjService.response(false, "Successfully Done."));
        }
      })
})

router.get('/deletePlaylist', function(req, res){
  Playlist.remove({parlorId : ObjectId(req.query.parlorId)}, function(err, f){
          return res.json(CreateObjService.response(false, "Deleted"));
  });
})

router.get('/playlist', function(req, res) {
    // Playlist.findOne({parlorId : ObjectId(req.query.parlorId)},function(err, d) {
    Playlist.aggregate([{$match :{parlorId: ObjectId(req.query.parlorId)}},
                        {$unwind :'$list'},
                        {$lookup : {from : "songs" , localField :"list.songId" , foreignField : "songId" , as: "song"}},
                        {$group :{_id: "$parlorId" , playingSongIndex :{$first : "$playingSongIndex"} ,
                            list: {$push : {requestedBy:"$list.requestedBy" ,active:"$list.active" , songId:"$list.songId" ,
                                title: {$arrayElemAt: ["$song.name", 0]}, name: {$arrayElemAt: ["$song.name", 0]}, songUrl : {$arrayElemAt: ["$song.songUrl", 0]}
                                } 
                            }}}
              ],function(err, d) {


        if(d.length>0){
            
            if(d[0].list.length>0){

                var obj = _.map(d[0].list, function(l){
                    return l;
                });

                var activeSong = _.filter(obj, function(s) {
                    return s.active == true;
                });

                var activeSongDetail = _.filter(obj, function(s) {
                    return s.active == true;
                });

                var requestedSongs = _.filter(obj, function(s) {
                    return s.requestedBy != null && s.active != true;
                });

                var remainingList = _.filter(obj, function(s){
                    return s.active == false && s.requestedBy == null;
                });

                var list = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt)}), remainingList);

                var requestedByLastIndex = activeSong.length + requestedSongs.length;

            
                var fList = list.map(function(o){
                  if(o.requestedBy == null){
                      o.requestedBy = "Salon";
                  }
                  return o;
                })

                var data = {
                  playlist : fList,
                  requestedByLastIndex : requestedByLastIndex
                }

                return res.json({success : true, data : data});

          }else{
            res.json({success : false, data : "No playlist found."})
          }
        }else{
          res.json({success : false, data : "No playlist found."})
        }
    });
});


//type :  1 - add, 2- interchange, 3- remove, 4 - remove all
router.post('/playlist', function(req, res) {
    var songIds = [];
    _.forEach(req.body.actions, function(a){
        if(a.type == 1){
            _.forEach(a.songIds, function(s){
                songIds.push(s);
            });
        }
    });
    Song.find({songId : {$in : songIds}}, {name : 1, songId : 1}, function(err, songs){
        Playlist.findOne({parlorId : "594a359d9856d3158171ea4f"},function(err, d) {
            var obj = Playlist.getNewList(d, "594a359d9856d3158171ea4f", req.body.actions);
            console.log(obj);
            if(d){
                Playlist.update({parlorId : "594a359d9856d3158171ea4f"}, {list : obj.list}, function(err, d){
                    return res.json(CreateObjService.response(false, 'Done'));
                });
            }else{
                Playlist.create(obj, function(err, d){
                    return res.json(CreateObjService.response(false, 'Done'));
                });
            }
        });
    });

});

router.get('/uplodSongs', function(req, res) {
//     var newSongs = [{
//     name : "55 flo rida right ro",
//     songId : 1,
//     description : "55 flo rida right ro",
//     createdAt : new Date(),
// }];
    Song.create(newSongs, function(err, songs){
        return res.json(CreateObjService.response(false, {songs  : songs, err :err }));
    });
});

router.post("/emptyPlaylist", function(req, res){

    var parlorId = req.body.parlorId;

    Playlist.update({parlorId : ObjectId(parlorId)}, {$set : {list : []}}, function(err, updated){
      if(err){
        res.json(CreateObjService.response(true, "Failed to empty playlist."));
      }else{
        res.json(CreateObjService.response(false, "Executed Successfully."));
      }
    });
})

router.post("/addSong", function(req, res){

  Song.find({}).count(function(err, count) {

    if(err){
      res.json(CreateObjService.response(true, "Server Error."));
    }else{
      Song.create({
        songId : (count + 1),
        name : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
      }, function(err, created){

        if(err){
          res.json(CreateObjService.response(true, "Server Error."));
        }else{
          res.json(CreateObjService.response(false, "Created Successfully"));
        }

      });
    }

  });

})

router.get('/downloadSong', (req, res) => {

// var data =   [{
//     songId:"105",
//     songName:"hehehe",
//     fileName:"urfile$105.mp3",
//     url:"http://res.cloudinary.com/dyqcevdpm/video/upload/br_1766/v1520667879/01_Mundiyan_-_Baaghi_2_-_320Kbps_1_qfokdg.mp3"
//   },{
//     songId:"106",
//     songName:"hahaha",
//     fileName:"urfile$106.mp3",
//     url:"http://res.cloudinary.com/dyqcevdpm/video/upload/v1520845470/Tamma_Tamma_Again_Badrinath_Ki_Dulhania_-_MirchiFun.com_dsbquv.mp3"
//   }]

  var data = [];

  res.json(CreateObjService.response(false, data));
});

router.post("/newSongAdded", (req, res) => {

  console.log("function called");

  let obj = {
    parlorId : req.body.parlorId,
    songId : req.body.songId,
    songName : req.body.songName,
    downloadUrl : req.body.downloadUrl
  }

  NewSongs.create(obj, (err, created) => {
    if(err){
      res.json({success : false, data : "Server Error."});
    }else{
      res.json({success : true, data : "Successfully  Added"});
    }
  })
})

router.post("/songRequest", function(req, res){
  console.log("Song Requested");
  // console.log(data);
  var roomName = (ObjectId("594a359d9856d3158171ea4f")).toString()+"music";
  User.findOne({"_id" : ObjectId("5a4f2a12569de12e3b1fdb2a")}, {firstName : 1, lastName : 1}, function(err, user){
    if(err){
      console.log("err fetching user");
    }else{
      Playlist.update({parlorId : ObjectId("594a359d9856d3158171ea4f")}, {$push : {list : {songId : "7", requestedById : user._id, createdAt : new Date(), requestedBy : user.firstName}}}, function(err, updated){
        if(err){
          io.sockets.in(roomName).emit('userRequest', CreateObjService.response(true, "Could not be submitted."));
        }else{
          updatePlaylist("5a4f2a12569de12e3b1fdb2a", "7", "594a359d9856d3158171ea4f", function(err, index, songId, resp){
            if(err){
              console.log("error in updating playlist");
            }else{
                  // io.sockets.in(roomName).emit('userRequest', {index : index, songId : songId, success : true, message : "Requested Successfully", userId : data.userId});

                  var userRequestData = {
                    index : index,
                    songId : songId,
                    message : "Requested Successfully",
                    userId : "5a4f2a12569de12e3b1fdb2a"
                  }

                  res.json(CreateObjService.response(false, userRequestData));

                  // io.sockets.in(roomName).emit('userRequest', CreateObjService.response(false, userRequestData));

                  // listForApp("594a359d9856d3158171ea4f", function(err, list){
                  //     if(err){
                  //       console.log("error in fetching list for app");
                  //     }else{ //user request accepted submitted to be written
                  //        res.json(CreateObjService.response(false, list));
                  //     }
                  // })
            }
          });
        }
      });
    }
  });
})

function updatePlaylist(userId, songId, parlorId, callback){
  console.log("update player called");
  console.log(userId, songId, parlorId);
  Playlist.find({parlorId : ObjectId(parlorId)}, function(err, playlist){
    if(err){
      callback(1, null, null, null);
    }else{
      var list = playlist[0].list;

      var activeSong = _.filter(list, function(s) {
          return s.active == true;
      });

      var requestedSongs = _.filter(list, function(s) {
          return s.requestedBy != null;
      });

      var remainingList = _.filter(list, function(s){
        return s.active == false && s.requestedBy == null;
      });

      var list = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt)}), remainingList);

      var reqIndex = null;

      for(var i = 0; i < list.length; i++){
        if((list[i].requestedById).toString() == userId.toString() && list[i].songId == songId){
          reqIndex = i;
          break;
        }
      }

      Playlist.update({parlorId : ObjectId(parlorId)}, {$set : {list : list}}, function(err, updated){
        if(err){
          callback(null, reqIndex, songId, false);
        }else{
          callback(null, reqIndex, songId, true);
        }
      });
    }
  });
}

function getFinalList(listToApp){
  var fList = listToApp.map(function(o){
    if(o.requestedBy == null){
        o.requestedBy = "Salon";
    }
    return o;
  })
  return fList;
}

function listForApp(parlorId, callback){
  console.log("lis for app called");
  Playlist.aggregate([{$match : {parlorId : ObjectId(parlorId)}},
                      {$unwind : "$list"},
                      {$match : {$or: [ { "list.active": true }, { "list.requestedBy" : {$ne : null} } ]}},
                      {
                        $lookup: {
                            from: "songs",
                            localField: "list.songId",
                            foreignField: "songId",
                            as: "songData"
                        }
                      },
                      {$unwind : "$songData"},
                      {$group : {"_id" : "$parlorId",
                        list : {$push : {
                           "requestedBy" : "$list.requestedBy",
                           "active" : "$list.active",
                           "_id" : "$list._id",
                           "createdAt" : "$list.createdAt",
                           "requestedById" : "$list.requestedById",
                           "songId" : "$list.songId",
                           "songName" : "$songData.name",
                           "imageUrl" : "$songData.imageUrl"
                      }}, parlorId : {$first : "$parlorId"}, playingSongIndex : {$first : "$playingSongIndex"}}}
                    ], function(err, list){

    if(err){
      console.log("error in fetching list for app");
      callback(1, null);
    }else{

      console.log(list);

      if(list.length == 0){

        var activeSong = [];
        var requestedSongs = [];

      }else{
        var list = list[0].list;

        var activeSong = _.filter(list, function(s) {
            return s.active == true;
        })

        var requestedSongs = _.filter(list, function(s) {
            return  s.active == false;
        })
      }

      if(list.length >= 3){
        var listToApp = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt)}));
        callback(null, getFinalList(listToApp));
      }else{
        var listRes = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt)}));
        var fromLen = listRes.length;
        Playlist.aggregate([{$match : {parlorId : ObjectId(parlorId)}},
                            {$unwind : "$list"},
                            {$match :  { "list.requestedBy" : {$eq : null}, "list.active" : false }},
                            { $limit: (3 - fromLen) },
                            {
                              $lookup: {
                                  from: "songs",
                                  localField: "list.songId",
                                  foreignField: "songId",
                                  as: "songData"
                              }
                            },
                            {$unwind : "$songData"},
                            {$group : {"_id" : "$parlorId",
                              list : {$push : {
                                 "requestedBy" : "$list.requestedBy",
                                 "active" : "$list.active",
                                 "_id" : "$list._id",
                                 "createdAt" : "$list.createdAt",
                                 "requestedById" : "$list.requestedById",
                                 "songId" : "$list.songId",
                                 "songName" : "$songData.name",
                                 "imageUrl" : "$songData.imageUrl"
                            }}, parlorId : {$first : "$parlorId"}, playingSongIndex : {$first : "$playingSongIndex"}}},
                          ], function(err, newList){

                            if(newList.length == 0){
                              var listToApp = listRes;
                              callback(null, getFinalList(listToApp));
                            }else{
                              var listToApp = listRes.concat(newList[0].list);
                              callback(null, getFinalList(listToApp));
                            }

          });
      }
    }
  })
}

router.post("/songStarted", function(req, res){

  var data = {
    parlorId : "594a359d9856d3158171ea4f",
    songId : "5"
  }

  var roomName = (data.parlorId).toString()+"music";
  Playlist.update({"list.active" : true}, {$set : {"list.$.active" : false}}, function(err, updated){
    if(err){

      console.log(err);

      console.log("err in removing active");
    }else{
      Playlist.update({"list.songId" : data.songId}, {$set : {"list.$.active" : true}}, function(err, updated){
        if(err){
          console.log("err in setting active");
        }else{
          listForApp(data.parlorId, function(err, list){
              if(err){
                console.log(err);
                console.log("error in fetching list for app");
              }else{ //user request accepted submitted to be written
                res.json(CreateObjService.response(false, list));
              }
          })
        }
      });
    }
  })

})

router.get("/getThings", (req, res) => {

  listForApp("594a359d9856d3158171ea4f", function(err, list){
      if(err){
        console.log(err);
        console.log("error in fetching list for app");
      }else{ //user request accepted submitted to be written
        res.json(CreateObjService.response(false, list));
      }
  })

})


module.exports = router;
