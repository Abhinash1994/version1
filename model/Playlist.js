var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({

    parlorId : { type: Schema.Types.ObjectId, required: true },

    playingSongIndex : {type : 'string', default : 0},

    list : {
    	type: [{

            songId: { type: 'string' },

            requestedBy: { type: 'string', default : null },

            requestedById : { type: Schema.Types.ObjectId},

            active : { type : 'boolean', default : false},

            createdAt: { type: 'date' }

        }]
		, defaultsTo : []},
});


//type :  1 - add, 2- interchange, 3- remove, 4 - remove all

//{type : 1, songIds : [2,3,4,5], index : 0}


playlistSchema.statics.getNewList = function(d, parlorId, actions) {
	var obj = {parlorId : parlorId, list : []};
	if(d){
		obj.list = d.list;
	}
	_.forEach(actions, function(a){
		if(a.type == 1){
			_.forEach(a.songIds, function(s, key){
				obj.list.splice(a.index+key, 0, s);
			});
		}else if(a.type == 2 && obj.list.length > a.index && obj.list.length > a.index){
			// obj.list.splice(a.index], 1);
			// obj.list.splice(a.index]+key, 0, s);
		}else if(a.type == 3 && obj.list.length > a.index){
			 obj.list.splice(a.index, 1);
		}else if(a.type == 4){
			obj.list = [];
		}
	});
	return obj;
};

var Playlist = mongoose.model('playlist', playlistSchema);
module.exports = Playlist;
