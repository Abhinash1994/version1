/**
 * Created by Nikita on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var port_postSchema = new Schema({

    // artistId: {type: Schema.ObjectId},
    artistId: { type: Schema.ObjectId, required: true },
    // artistId: {type: Schema.ObjectId, ref : 'owner'},

    // categoryId: {type: Schema.ObjectId, ref : 'port_position'}

    images: { type: 'array', defaultsTo: [] },

    coverImage: { type: 'string', defaultsTo: "" },

    likes: {
        type: [{
            userId: { type: Schema.ObjectId },
            name: { type: 'string' }
        }],
        defaultsTo: []
    },

    comments: {
        type: [{
            userId: { type: Schema.ObjectId },
            name: { type: 'string' },
            comment: { type: 'string' },
            createdAt: { type: 'date', default: Date.now() }
        }],
        defaultsTo: []
    },

    postTitle: { type: 'string' },

    postDescription: { type: 'String' },
    artistName: { type: 'String' },

    postLocation: { type: 'number' },

    postLatitude: { type: 'number' },

    postLongitude: { type: 'number' },

    portfolioLikes: { type: 'number', default: 0 },

    createdAt: { type: 'date', default: Date.now() },

    tags: [{
        tagId: { type: Schema.ObjectId, ref: 'port_post' },
        tagName: { type: 'String' }
    }],

    collec: {
        collecId: { type: Schema.ObjectId, ref: 'port_collections' },
        collectionName: 'String'
    },
    artistPic: { type: 'string', default: '' },


});


port_postSchema.statics.getNewPostObj = function(req) {
    return {
        artistId: req.body.artistId,
        images: req.body.images,
        coverImage: req.body.coverImage,
        likes: req.body.likes,
        comments: req.body.comments,
        postTitle: req.body.title,
        postDescription: req.body.description,
        postLatitude: req.body.latitude,
        postLongitude: req.body.longitude,
        postLocation: req.body.location,
        tags: req.body.tags,
        collec: req.body.collection,

    }
};

port_postSchema.statics.getPost = function(post, callback) {
    var data = {};
    // console.log("first nameeeeeeeeeeeee111111", post)

    PortfolioUser.findOne({ _id: post.artistId }, { firstName: 1, portfolioRating: 1, portfolioPosition: 1, likedPosts: 1 }, function(err, owner) {
        if (owner) {
            data.name = owner.firstName;
            data.id = post.id;
            data.artistId = post.artistId;
            data.portfolioRating = owner.portfolioRating;
            data.portfolioPosition = owner.portfolioPosition;
            data.coverImage = post.coverImage;
            data.likes = post.likes.length;
            data.comments = post.comments;
            data.location = post.location;
            data.likedPosts = _.filter(owner.likedPosts, function(f) { return f.postId == post.id; })[0] ? true : false,
                // console.log(post.tags);
                Port_Tag.find({ _id: { $in: post.tags } }, { tagName: 1 }, function(err, tag) {
                    data.tags = _.map(tag, function(t) {
                        return {
                            tagName: t.tagName
                        }
                    });
                    // console.log(data)
                    return callback(err, data);
                })
        } else {
            return callback(true, null);

        }
    })
}


//  on every save, add the date
port_postSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Port_Post = mongoose.model('port_post', port_postSchema);


module.exports = Port_Post;