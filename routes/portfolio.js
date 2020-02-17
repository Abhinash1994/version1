'use strict';



var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var request = require('request');


router.get('/', function(req, res) {
    return res.json(CreateObjService.response(false, 'Successfully Called'));
})

//Create New Position
router.post('/createNewPosition', function(req, res) {
    Port_Position.create(Port_Position.getNewPositionObj(req), function(err, position) {
        if (position)
            return res.json(CreateObjService.response(false, 'Successfully Created'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
})

//Create New Collection
router.post('/createNewCollection', function(req, res) {
    Port_Collection.create(Port_Collection.getNewCollectionObj(req), function(err, collec) {
        if (collec)
            return res.json(CreateObjService.response(false, 'Successfully Created'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
})

//Create Tags
router.post('/createNewTags', function(req, res) {
    Port_Tag.create(Port_Tag.getNewTagsObj(req), function(err, tags) {
        console.log(err)
        if (tags)
            return res.json(CreateObjService.response(false, 'Successfully Created'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
});

//Get Tags
router.get('/getTagsAndCollection', function(req, res) {
    var position = req.query.positionId
    var data = {};
    Port_Tag.find({ positionId: position }, { tagName: 1 }, function(err, tags) {
        console.log(tags)
        Port_Collection.find({ positionId: position }, { collName: 1 }, function(err, coll) {
            data.tags = tags;
            data.collection = coll;
            return res.json(CreateObjService.response(false, data));
        })
    })
})

//HomePage
router.get('/getHomePage', function(req, res) {

    var skipp = req.query.page == undefined ? 0 : req.query.page;

    console.log(req.query);

    if (req.query.artistId) {

        console.log("coming here");

        var data = {};
        PortfolioUser.findOne({ _id: ObjectId(req.query.artistId) }, { portfolioRating: 1, restrictPortfolio: 1, firstName: 1, portfolioProfile: 1, portfolioPosition: 1, portfolioLikes: 1, portfolioPosts: 1, portfolioCollection: 1, parlorId: 1 }, function(err, artist) {


            console.log(err);

            console.log(artist);

            if (artist) {
                console.log("///////////User found/////////")
                data.name = artist.firstName;
                data.portfolioRating = artist.portfolioRating;
                data.portfolioProfile = artist.portfolioProfile;
                data.portfolioLikes = artist.portfolioLikes;
                data.portfolioPosts = artist.portfolioPosts;
                data.portfolioCollection = artist.portfolioCollection;
                Port_Position.find({ _id: artist.portfolioPosition }, { positionName: 1 }, function(err, position) {
                        data.portfolioPosition = position;
                        Port_Post.find({}, { portfolioLikes: 1, artistPic: 1, artistName: 1, images: 1, coverImage: 1, likes: 1, comments: 1, postTitle: 1, tags: 1, postDescription: 1, collec: 1 }, function(err, posts) {
                            if (posts.length > 0) {
                                var new_data = _.filter(posts, function(f) {
                                    return f != null;
                                })
                                var final_data = _.map(new_data, function(d) {
                                    var check = _.some(d.likes, function(s) {
                                        return s.userId == req.query.artistId
                                    });
                                    var hideStatus = _.some(artist.restrictPortfolio, function(k) {
                                        console.log(k)
                                        return k == d._id
                                    })
                                    return {
                                        _id: d._id,
                                        coverImage: d.coverImage,
                                        artistName: d.artistName,
                                        postTitle: d.postTitle,
                                        postDescription: d.postDescription,
                                        collec: d.collec,
                                        comments: d.comments,
                                        likes: d.likes,
                                        hideStatus: hideStatus,
                                        images: d.images,
                                        artistPic: d.artistPic,
                                        likedStatus: check,
                                        portfolioLikes: d.portfolioLikes,
                                        tags: d.tags,
                                        collec: d.collec,
                                        collectionName: d.collec.collectionName

                                    }

                                })
                                console.log(final_data)
                                return res.json(CreateObjService.response(false, final_data));
                            } else {
                                return res.json(CreateObjService.response(true, "There is no post for you. "));
                            }
                        }).skip(parseInt(skipp)).limit(15)
                    })
                    // })
            }
        })
    } else {
        console.log("else")
        var page = req.query.page
        var d = [];
        var async = require('async');
        Port_Post.find({}, { likes: 1, comments: 1, coverImage: 1, tags: 1, postLocation: 1, artistId: 1 }).sort({ createdAt: -1 }).exec(function(err, posts) {
            // console.log(posts)
            async.parallel([
                function(done) {
                    async.each(posts, function(post, callback) {
                        console.log(post._id)
                        if (post) {
                            Port_Post.getPost(post, function(err, data) {
                                d.push(data);
                                callback();

                            })
                        } else {
                            callback();

                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                // console.log('done');
                var new_data = _.filter(d, function(f) {
                    return f != null;
                })

                return res.json(CreateObjService.response(false, { collections: new_data }));

            });
        }).skip(skipp).limit(15);
    }
})

var AWS = require('aws-sdk');


// load aws config
AWS.config.loadFromPath('./config.json');
var rekognition = new AWS.Rekognition();

// load AWS SES
var ses = new AWS.SES({ apiVersion: '2010-12-01' });

var s3 = new AWS.S3();

var s3Bucket = new AWS.S3({ params: { Bucket: 'portfolioappbeu1' } })
    //Create New Post
router.post('/createNewPost', function(req, res) {

    var tags = [];

    async.each(req.body.tags, function(tag, cbs) {

        Port_Tag.findOne({ _id: tag }, function(err, data) {

            tags.push({ tagId: tag, tagName: data.tagName })
            cbs();
        })


    }, function(done) {


        Port_Collection.findOne({ _id: req.body.collection }, function(err, pc) {
            PortfolioUser.findOne({ _id: req.body.artistId }, function(err, artist) {
                var images = []
                if (req.body.images.length > 0) {
                    images = req.body.images
                } else {
                    images.push(req.body.coverImage)
                }
                console.log("imagesssssss", images)
                var imagesUrl = [];
                var imagesName = [];


                async.each(images, function(img, cbm) {



                    var params = {
                        Bucket: 'portfolioappbeu1',
                        Key: 'uploads/' + img

                    };
                    console.log(params)
                    s3.getObject(params, function(err, data3) {
                        if (err) { console.log(err, err.stack); } // an error occurred
                        else {
                            console.log(data3);
                            var params1 = {
                                Image: { /* required */
                                    S3Object: {
                                        Bucket: 'portfolioappbeu1',
                                        Name: 'uploads/' + img

                                    }

                                },
                                MinConfidence: 1
                            };
                            rekognition.detectModerationLabels(params1, function(err, data) {
                                if (err) { console.log(err, err.stack); } // an error occurred
                                else {
                                    console.log("Successssssssssssssss", data);
                                    if (data.ModerationLabels.length == 0) {
                                        s3Bucket.getSignedUrl('getObject', params, function(err, url) {
                                            imagesUrl.push(url)
                                            imagesName.push(img);
                                            console.log('the url of the image is', url);
                                            cbm();
                                        })

                                    } else {
                                        cbm();

                                    }


                                } // successful response
                            });

                        } // successful response
                    });



                }, function() {


                    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", imagesUrl.length)
                    var params2 = {
                        Bucket: 'portfolioappbeu1',
                        Key: 'uploads/' + req.body.coverImage
                    };
                    s3Bucket.getSignedUrl('getObject', params2, function(err, Coverurl) {
                        console.log('the url of the image is', Coverurl);

                        var postss = {
                            artistId: req.body.artistId,
                            artistName: artist.firstName + ' ' + artist.lastName,
                            images: imagesUrl,
                            coverImage: Coverurl,
                            likes: req.body.likes,
                            comments: req.body.comments,
                            postTitle: req.body.title,
                            postDescription: req.body.description,
                            postLatitude: req.body.latitude,
                            postLongitude: req.body.longitude,
                            postLocation: req.body.location,
                            tags: tags,
                            artistPic: artist.profilePic,
                            collec: {
                                collecId: req.body.collection,
                                collectionName: pc.collName

                            }
                        }
                        if (imagesUrl.length > 0) {
                            Port_Post.create(postss, function(err, post) {
                                if (post) {
                                    // console.log(post)

                                    console.log("artistId ", req.body.artistId)
                                    PortfolioUser.findOne({ _id: req.body.artistId }, function(err, adminData) {
                                        console.log(err)
                                            // console.log("---------------", adminData)
                                        if (adminData) {
                                            if (adminData.portfolioPosts == null) {
                                                console.log("sahinaaayayya")
                                                PortfolioUser.update({ _id: req.body.artistId }, { portfolioPosts: 1 }, function(err, update) {
                                                    if (update)
                                                        return res.json(CreateObjService.response(false, 'Successfully Created'));
                                                    else
                                                        return res.json(CreateObjService.response(true, 'There is some error'));
                                                })
                                            } else {

                                                console.log("aayaa")
                                                    // var oldPostNo = adminData.portfolioPosts, newPostNo = oldPostNo + 1;
                                                PortfolioUser.update({ _id: req.body.artistId }, { $inc: { portfolioPosts: 1 } }, function(err, update) {
                                                    if (update)
                                                        return res.json(CreateObjService.response(false, 'Successfully Created'));
                                                    else
                                                        return res.json(CreateObjService.response(true, 'There is some error'));
                                                })
                                            }

                                        } else {
                                            return res.json(CreateObjService.response(true, 'No Data found for  artist'));

                                        }
                                    })
                                } else
                                    return res.json(CreateObjService.response(true, 'There is some error'));
                            })
                        } else {
                            return res.json(CreateObjService.response(false, 'Uploaded '));

                        }


                    })


                })

            })

        })

    })

})

//Post Like
router.post('/likePost', function(req, res) {
    var user = req.body.artistId,
        userName = req.body.name,
        postId = req.body.postId,
        artistId = req.body.artistId;
    console.log("=================================================================================================================================================")
    console.log(req.body)
    Port_Post.findOne({ _id: postId }, { likes: 1 }, function(err, liked) {

        var checkForliked = _.some(liked.likes, function(d) {
            return d.userId == artistId;
        })
        console.log("checkingggggggggggggggggggggggggggg", checkForliked)
        if (checkForliked) {
            console.log("already Liked")
            Port_Post.update({ _id: postId }, { $pull: { 'likes': { userId: artistId } } }, function(err, updatedLikes) {
                console.log("updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", updatedLikes)
                if (updatedLikes) {

                    Port_Post.update({ _id: postId }, { $inc: { portfolioLikes: -1 } }, function(err, likes) {
                        // var oldLikeNo = likes.portfolioLikes, newLikeNo = oldLikeNo - 1;
                        console.log("liked increasedssssssssssssssssssssssssssssss", likes)

                        if (likes)
                            return res.json(CreateObjService.response(false, 'liked'));
                        else
                            return res.json(CreateObjService.response(true, 'There is some error'));

                    })

                }
            })
        } else {
            console.log("already unLiked")

            Port_Post.update({ _id: postId }, { $push: { 'likes': { userId: user, name: userName } } }, function(err, updatedLikes) {
                if (!err) {
                    Port_Post.find({ _id: postId }, { portfolioLikes: 1, likes: 1 }, function(err, likes) {
                        // var oldLikeNo = likes.portfolioLikes, newLikeNo = oldLikeNo + 1;
                        Port_Post.update({ _id: postId }, { $inc: { portfolioLikes: 1 } }, function(err, updated) {
                            console.log("liked increasedssssssssssssssssssssssssssssss", updated)
                            if (updated)
                                return res.json(CreateObjService.response(false, 'liked'));
                            else
                                return res.json(CreateObjService.response(true, 'There is some error'));
                        })
                    })
                } else {
                    return res.json(CreateObjService.response(true, 'There is some error'));

                }
            })
        }

    })

})

//Unlike Post
router.post('/unlikePost', function(req, res) {
    var user = req.body.userId,
        postId = req.body.postId,
        artistId = req.body.artistId;
    Port_Post.update({ _id: postId }, { $pull: { 'likes': { userId: user } } }, function(err, updatedLikes) {
        if (updatedLikes) {
            Admin.find({ _id: artistId }, { $inc: { portfolioLikes: -1 } }, function(err, likes) {
                // var oldLikeNo = likes.portfolioLikes, newLikeNo = oldLikeNo - 1;
                Admin.update({ _id: artistId }, { portfolioLikes: newLikeNo }, function(err, updated) {
                    if (updated)
                        return res.json(CreateObjService.response(false, 'liked'));
                    else
                        return res.json(CreateObjService.response(true, 'There is some error'));
                })
            })
        }
    })
})


//Post Comment
router.post('/commentPost', function(req, res) {
    var userId = req.body.userId,
        name = req.body.name,
        postId = req.body.postId,
        comment = req.body.comment;
    Port_Post.update({ _id: postId }, { $push: { comments: { userId: userId, name: name, comment: comment } } }, function(err, updatedComments) {
        if (updatedComments)
            return res.json(CreateObjService.response(false, 'liked'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
})

//Post Comment
router.post('/unCommentPost', function(req, res) {
    var userId = req.body.userId,
        postId = req.body.postId,
        commentId = req.body.id
    Port_Post.update({ _id: postId }, { $pull: { comments: { userId: userId } } }, function(err, updatedComments) {
        if (updatedComments)
            return res.json(CreateObjService.response(false, 'liked'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
})

router.post('/viewProfile', function(req, res) {
    var data = {};
    var query = [{ $match: { "_id": ObjectId(req.body.artistId) } },
        { $lookup: { from: "port_posts", localField: "_id", foreignField: "artistId", as: "posts" } },
        { $project: { portfolioProfile: 1, gender: 1, profilePic: 1, phoneNumber: 1, emailId: 1, profilePic: 1, firstName: 1, lastName: 1, portfolioProfile: 1, portfolioPosition: 1, portfolioRating: 1, portfolioPosts: 1, portfolioLikes: 1, portfolioDescription: 1, portfolioCollection: 1, likedPosts: 1, projects: "$posts" } }
    ];
    console.log(JSON.stringify(query))
    PortfolioUser.aggregate(query).exec(function(err, adminData) {
        if (adminData) {
            data = adminData[0];
            var psData = [];
            async.each(data.projects, function(d, cb) {
                    var data2 = {};

                    var comments = []
                    _.forEach(d.comments, function(c) {
                        var arr = {};
                        var diffDays = HelperService.getNoOfDaysDiff(new Date(), new Date(c.createdAt));
                        // console.log(diffDays)
                        var date = "";
                        if (diffDays < 1) {
                            var then = new Date(c.createdAt);
                            var diff = HelperService.getTimeFromToday(then)
                            date = diff;
                        } else {
                            date = diffDays + (diffDays == 1 ? " day" : " days") + " ago";
                        }
                        arr.userId = c.userId,
                            arr.name = c.name,
                            arr.comment = c.comment,
                            arr.createdAt = c.createdAt,
                            arr.date = date

                        comments.push(arr)
                    })
                    data2.comments = comments;
                    var likedStatus = _.some(d.likes, function(s) {
                        return s.userId == req.body.artistId
                    })
                    data2.id = d._id,
                        data2.likes = d.likes,
                        data2.date = d.createdAt,
                        data2.coverImage = d.coverImage,
                        data2.postTitle = d.postTitle,
                        data2.postDescription = d.postDescription,
                        data2.images = d.images,
                        data2.collectionName = d.collec.collectionName,
                        data2.tags = d.tags;
                    data2.likedStatus = likedStatus
                    data2.artistName = data.firstName + " " + data.lastName

                    if (data2.totalLikes == 1) {
                        data2.totalLikes = (data.likes[0].name) + " liked your post";
                    } else if (data2.totalLikes == 2) {
                        data2.totalLikes = (data2.likes[0].name) + " and " + (data2.likes[1].name) + " liked your post";
                    } else if (data2.totalLikes > 2) {
                        data2.totalLikes = (data2.likes[0].name) + " and " + (postData[0].totalLikes - 1) + "others liked your post";
                    } else {
                        data2.totalLikes = ""
                    }
                    psData.push(data2);

                    cb();


                },
                function(done) {
                    // psData.push(data2);
                    if (adminData[0].portfolioPosition) {
                        console.log(adminData[0]);
                        Port_Position.findOne({ _id: adminData[0].portfolioPosition }, function(err, posi) {
                            if (posi) {
                                data.positionName = posi.positionName;
                            } else {
                                data.positionName = "";

                            }
                            data.portfolioPosts = psData.length;
                            data.projects = psData;
                            return res.json(CreateObjService.response(false, data));
                        })
                    } else {
                        data.portfolioPosts = psData.length;
                        data.projects = psData;
                        return res.json(CreateObjService.response(false, data));
                    }


                })


        } else
            return res.json(CreateObjService.response(true, 'There is some error'));

    })
});

router.post('/hidePost', function(req, res) {
    var postId = req.body.postId;
    var userId = req.body.userId;
    PortfolioUser.update({ _id: userId }, { $push: { restrictPortfolio: postId } }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, "error"))

        } else {
            res.json(CreateObjService.response(false, updated))
        }
    })
})
router.post('/unHidePost', function(req, res) {
    var postId = req.body.postId;
    var userId = req.body.userId;
    PortfolioUser.update({ _id: userId }, { $pull: { restrictPortfolio: postId } }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, "error"))

        } else {
            console.log("uuununununununununununununnnnnnnnnnnnnnnnnnuuuuuuuuuuuuuuuuuuuuu", updated)
            res.json(CreateObjService.response(false, updated))
        }
    })
})
router.post('/viewProfile2', function(req, res) {

    Admin.aggregate([{ $match: { "_id": ObjectId(req.body.artistId) } },
        { $project: { portfolioProfile: 1, firstName: 1, lastName: 1, portfolioProfile: 1, portfolioPosition: 1, portfolioRating: 1, portfolioPosts: 1, portfolioLikes: 1, portfolioDescription: 1, portfolioCollection: 1, likedPosts: 1 } }
    ]).exec(function(err, adminData) {
        if (adminData)
            return res.json(CreateObjService.response(false, adminData[0]));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    });
});

//View Post
router.post('/fullPost', function(req, res) {
    console.log(req.body.postId)
    var data = {};
    var postId = req.body.postId
    var artistId = req.body.artistId
    var query = [
            { "$match": { "_id": ObjectId(postId) } },
            {
                "$project": {
                    "date": { "$dateToString": { "format": "%m/%d/%Y", "date": "$createdAt" } },
                    "postId": "$_id",
                    "artistId": 1,
                    "artistName": 1,
                    "likesCount": { "$size": "$likes" },
                    "totalLikes": "",
                    "totalComments": { "$size": "$comments" },
                    "comments": 1,
                    "tags": 1,
                    "likes": 1,
                    "coverImage": 1,
                    "postTitle": 1,
                    "postDescription": 1,
                    "images": 1,
                    "tagNames": "$tagName.tagName",
                    "collectionName": "$collec.collectionName"
                }
            },

        ]
        // console.log(JSON.stringify(query))
    Port_Post.aggregate(query).exec(function(err, postData) {

        if (postData) {
            data = postData[0];
            console.log("postttttttttttttttttt", data)
            var comments = []
            if (postData[0].comments.length > 0) {
                _.forEach(postData[0].comments, function(c) {
                    var arr = {};
                    var diffDays = HelperService.getNoOfDaysDiff(new Date(), new Date(c.createdAt));
                    console.log(diffDays)
                    var date = "";
                    if (diffDays < 1) {
                        var then = new Date(c.createdAt);
                        var diff = HelperService.getTimeFromToday(then)
                        date = diff;
                    } else {
                        date = diffDays + (diffDays == 1 ? " day" : " days") + " ago";
                    }
                    arr.userId = c.userId,
                        arr.name = c.name,
                        arr.comment = c.comment,
                        arr.createdAt = c.createdAt,
                        arr.date = date


                    comments.push(arr)
                })
            }
            data.comments = comments
            if (data.likes.length > 0) {
                if (data.likes.length == 1) {
                    data.totalLikes = (data.likes[0].name) + " liked your post";
                } else if (data.likes.length == 2) {
                    data.totalLikes = (data.likes[0].name) + " and " + (data.likes[1].name) + " liked your post";
                } else if (data.likes.length > 2) {
                    data.totalLikes = (data.likes[0].name) + " and " + (postData[0].totalLikes - 1) + "others liked your post";
                }
            }
            var likedStatus = _.some(postData[0].tags, function(d) {
                return d.userId == artistId
            })
            var t = data.images.some(function(s) {
                return s === data.coverImage

            })
            if (!t) {

                data.images.push(data.coverImage)
            }

            data.likedStatus = likedStatus

            return res.json(CreateObjService.response(false, data));

        } else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
})


router.get('/getPositions', function(req, res) {
    Port_Position.find({}, function(err, data) {
        Port_Tag.find({}, function(err, data2) {


            if (err) res.json(CreateObjService.response(true, "error while fetching data"));
            else
                res.json(CreateObjService.response(false, { collection: data, position: data }));

        })
    })
})

//Edit Profile
router.post('/editProfile', function(req, res) {
    var description = req.body.description,
        firstName = req.body.firstName,
        gender = req.body.gender,
        portfolioPosition = req.body.portfolioPosition,
        emailId = req.body.emailId;
    var profilePic = req.body.profilePic;
    PortfolioUser.update({ _id: req.body.userId }, { profilePic: profilePic, portfolioPosition: portfolioPosition, portfolioDescription: description, firstName: firstName, gender: gender, emailId: emailId }, function(err1, updated) {
        PortfolioUser.findOne({ _id: req.body.userId }, function(err, users) {
            if (!err)
                return res.json(CreateObjService.response(false, { portfolioPosition: users.portfolioPosition }));
            else
                return res.json(CreateObjService.response(true, 'Profile not updation failed. Please check all fields'));
        })
    })
})




//Sign-In
router.post('/user', function(req, res) {
    console.log("-------------------------------------- User Api -------------------------------")
    if (req.body.phoneNumber && !req.body.accessToken) {
        console.log("//////////////////Registering New User Without Access token/////////////////////")
        registerNewUser(req, function(response) {
            return res.json(response);
        });
    } else if (req.body.phoneNumber && req.body.accessToken && req.body.socialLoginType == 1) { // Facebook
        console.log("//////////////////Registering New User With Access token FB/////////////////////")

        console.log(req.body)

        getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
            if (userData) {
                req.body.name = userData.name;
                req.body.gender = userData.gender;
                req.body.emailId = userData.emailId;
                req.body.profilePic = userData.profilePic;
                req.body.facebookId = userData.id;
                req.body.password = req.body.accessToken.substring(0, 10);
                registerNewUser(req, function(response) {
                    PortfolioUser.findOne({ phoneNumber: req.body.phoneNumber }, function(Err, newUser) {
                        if (!Err) {
                            res.json(CreateObjService.response(false, newUser));
                        } else {
                            res.json(CreateObjService.response(true, "getting error in user api"));

                        }
                    });
                });
            } else {
                res.json(CreateObjService.response(true, 'Invalid Fb access Token'));
            }
        });
    } else if (req.body.phoneNumber && req.body.accessToken && req.body.socialLoginType == 2) {
        console.log("//////////////////Registering New User With Access token GOOGLE/////////////////////")

        getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
            if (userData) {
                req.body.name = userData.name;
                req.body.gender = req.body.gender;
                req.body.emailId = userData.emailId;
                req.body.profilePic = userData.profilePic;
                req.body.googleId = userData.id;
                req.body.password = req.body.accessToken.substring(0, 10);
                registerNewUser(req, function(response) {
                    return res.json(response);
                });
            } else {
                res.json(CreateObjService.response(true, 'Invalid google access Token'));
            }
        });
    } else {
        res.json(CreateObjService.response(true, 'Phone Number Required'));
    }
});


function registerNewUser(req, callback) {
    console.log("----------------------------------Register Function------------------------")
    var accessToken = require('crypto').createHash('sha1').update(req.body.firstName + (new Date()).valueOf().toString() + "dassda687%%^^").digest('base64');
    if (req.body.phoneNumber.length == 10) {
        console.log(accessToken);
        console.log(req.body.password);
        var password = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        console.log(password);
        PortfolioUser.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
            // if (user && user.password) {
            //     return callback(CreateObjService.response(true, 'PortfolioUser already Registered'));
            // } else
            if (user && user.password) {
                var updateObj = {
                    firstName: req.body.name,
                    emailId: req.body.emailId,
                    password: password,
                    profilePic: req.body.profilePic,
                    gender: req.body.gender,
                    accesstoken: accessToken,
                    facebookId: req.body.facebookId,
                    firstTimeVerified: 0,
                    googleId: req.body.googleId,
                    mobile: req.body.mobile ? req.body.mobile : 0,
                };
                console.log(updateObj);
                var mobile = req.body.mobile;

                PortfolioUser.update({ phoneNumber: req.body.phoneNumber }, updateObj, function(err, update) {
                    console.log(err);
                    if (update) {
                        return callback(CreateObjService.response(false, 'PortfolioUser registered'));
                    } else return callback(CreateObjService.response(true, 'Form Validation error'));
                });

            } else {
                var newUserObj = {
                    firstName: req.body.name,
                    gender: req.body.gender,
                    emailId: req.body.emailId,
                    phoneNumber: req.body.phoneNumber,
                    password: password,
                    profilePic: req.body.profilePic,
                    facebookId: req.body.facebookId,
                    googleId: req.body.googleId,
                    firstTimeVerified: 0,
                    accesstoken: accessToken,
                    customerId: 0,
                    mobile: req.body.mobile ? req.body.mobile : 0,
                };

                var mobile = req.body.mobile;

                PortfolioUser.findOne({}, {}, { sort: { 'customerId': -1 } }, function(err, s) {
                    if (!s) {
                        s = {};
                        s.customerId = 1;
                    }
                    newUserObj.customerId = s.customerId + 1;
                    var usermessage = getUserRegistrationUrl(req.body.name, req.body.phoneNumber, mobile);
                    PortfolioUser.create(newUserObj, function(err, newUser) {
                        console.log(err);
                        if (newUser) {
                            return callback(CreateObjService.response(false, 'PortfolioUser registered'));
                        } else
                            return callback(CreateObjService.response(true, 'Form Validation error'));
                    });
                });

            }
        });
    } else
        return callback(CreateObjService.response(true, 'Invalid Phone Number'));
}

router.post('/sendOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var resetPassword = req.body.resetPassword;

    Admin.findOne({phoneNumber : phoneNumber} , function(err , existingOwner){
        console.log("existingOwner" , existingOwner)
        Beu.findOne({phoneNumber : phoneNumber} , function(err , existingBeu){
        if(existingOwner || existingBeu){
            Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get60secBefore() } }, function(err, otps) {
                if (otps.length > 1)
                    return res.json(CreateObjService.response(true, 'Please wait for 45 sec'));
                else {
                    Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get24HrsBefore() } }, function(err, data) {
                        if (data.length > 1000)
                            return res.json(CreateObjService.response(true, 'Maximum limit exceed for your number'));
                        else {
                            PortfolioUser.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                                if (user) {
                                    var otp = Math.floor(Math.random() * 9000) + 1000;
                                    if (phoneNumber == "9501551079") otp = 1234;
                                    var retry = 0;
                                    if (parseInt(req.body.retry)) {
                                        otp = user.realOtp;
                                        if (parseInt(req.body.retry) == 2) retry = 0;
                                        else retry = 1;
                                    }
                                    var message = Otp.getMessage(otp);
                                    Otp.create({ used: 0, otp: otp, userId: user.id, phoneNumber: phoneNumber, message: message }, function(err, newOtp) {
                                        // var url = getSmsUrlForOtp('BEUSLN', message, [phoneNumber], 'T', otp, retry);
                                        var url = "https://control.msg91.com/api/sendotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&message=" + message + "&otp=" + otp + "&sender=BEUSLN";

                                        console.log("-------------------------------------------------message Api Url ----------------------------------------------")
                                        console.log(url)
                                        console.log(phoneNumber)
                                        console.log(otp)
                                        console.log("-----------------------------------------------------------------------------------------------")
                                        request(url, function(error, response, body) {
                                            if (error)
                                                return res.json(CreateObjService.response(true, 'Error sending OTP'));
                                            else {
                                                PortfolioUser.update({ phoneNumber: phoneNumber }, { realOtp: otp, phoneVerification: 0 }, function(err, u) {
                                                    return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    return res.json(CreateObjService.response(true, 'PortfolioUser not registered'));
                                }
                            });
                        }
                    });
                }
            });
        } else {
console.log("right elseeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            SalonPassPayments.findOne({phoneNumber : phoneNumber , 'paymentObj.status' : 'captured' , status :0} , function(err , payment){
                if(payment){
                    Admin.create({phoneNumber : phoneNumber , firstName: "newOwner" , role: 7, gender : "M"} , function(err , newOwner){
                        if(newOwner){
                            // var otp = Math.floor(Math.random() * 9000) + 1000;
                            // var message = Otp.getMessage(otp);
                            Otp.update({phoneNumber: phoneNumber},{userId: newOwner.id}, function(err, newOtp) {
                            //     var url = "https://control.msg91.com/api/sendotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&message=" + message + "&otp=" + otp;
                            //     request(url, function(error, response, body) {
                            //         if (error == null) {
                                        return res.json(CreateObjService.response(false, 'Please enter the otp'));
                            //         } else {
                            //             return res.json(CreateObjService.response(true, 'Error in sending sms'));
                            //         }
                            //     });
                            });
                        } else
                             return res.json(CreateObjService.response(true, 'Error in creating owner'));
                    })
                } else {
                    return res.json(CreateObjService.response(true, 'SalonPass Payment not received'));
                }
            })

        }
    })
})

});



router.post('/verifyOtp', function(req, res) {
    console.log("--------------------------------Verify Otp Api")
    console.log(req.body)
    var phoneNumber = req.body.phoneNumber;
    Otp.find({ phoneNumber: phoneNumber, otp: req.body.otp, used: 0, createdAt: { $gt: HelperService.get5minBefore() } }, function(err, otps) {
        if (otps.length >= 1) {
            // console.log("found otp", otps)
            var eligible = false;
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {

                var accessToken = require('crypto').createHash('sha1').update('sadd%^^^^sdasdsd3423F$TTTGGasd' + (new Date()).valueOf().toString()).digest('hex');
                var updateObj = { phoneVerification: 1, accesstoken: accessToken, messageSent: 1, firstTimeVerified: 1 };
                if (req.body.newPassword) updateObj.password = require('crypto').createHash('sha1').update(req.body.newPassword).digest('base64');

                console.log("phoneNumber", phoneNumber)
                PortfolioUser.findOne({ phoneNumber: phoneNumber }, function(err, user1) {
                    var mobile = 0;
                    if (!user1.firstTimeVerified) eligible = true;
                    if (user1.mobile && !user1.messageSent) mobile = 1;
                    console.log("req.body.socialLoginType----verify", req.body.socialLoginType)
                    console.log("req.body.accessToken----verify", req.body.accessToken)
                    getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userDatas) {

                        if (userDatas) {
                            updateObj.name = userDatas.name;
                            updateObj.gender = req.body.socialLoginType == 1 ? userDatas.gender : req.body.gender;
                            updateObj.emailId = userDatas.emailId;
                            updateObj.profilePic = userDatas.profilePic;
                            if (req.body.socialLoginType == 2)
                                updateObj.googleId = userDatas.id;
                            else
                                updateObj.facebookId = userDatas.id;
                            updateObj.password = req.body.accessToken.substring(0, 10);

                            PortfolioUser.update({ phoneNumber: phoneNumber }, updateObj, function(err, u) {
                                PortfolioUser.findOne({ phoneNumber: phoneNumber }, function(err, userData2) {

                                    // console.log("portfolio----------------------->", userData)

                                    var usermessage = getUserRegistrationUrl(userData2.firstName, userData2.phoneNumber, userData2.freeServices, mobile);
                                    if (mobile) {

                                        Beu.findOne({ phoneNumber: userData2.phoneNumber }, function(err, user) {
                                            // console.log(user);

                                            if (user != null) {
                                                if (user.parlorIds.length > 0) {

                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    // console.log(result);
                                                    var m = [];
                                                    async.parallel([
                                                        function(done) {
                                                            async.each(user.parlorIds, function(employee, callback) {
                                                                Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                                    console.log("2nd", result);
                                                                    if (result == null) {
                                                                        callback();
                                                                    } else {
                                                                        m.push({ parlorid: result._id, parlorName: result.name });
                                                                        callback();
                                                                    }
                                                                });
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {
                                                        var userData = PortfolioUser.getUserObjApp(userData2)
                                                        var newData = {
                                                            portfolioId: userData.portfolioId,
                                                            name: userData.name,
                                                            emailId: userData.emailId,
                                                            gender: userData.gender,
                                                            phoneNumber: userData.phoneNumber,
                                                            userDataType: userData.userDataType,
                                                            accessToken: userData2.accesstoken,
                                                            phoneVerification: userData.phoneVerification,
                                                            profilePic: userData.profilePic,
                                                            isCorporateuserData: userData.isCorporateuserData,
                                                            isEmployee: 1,
                                                            role: user.role,
                                                            employeeId: user._id,
                                                            parlorIds: m,
                                                            uType: 1,
                                                            parlorType : user.parlorType ? user.parlorType : 1
                                                        };
                                                        console.log("ye bhejjjjjjjjjjjjaaaaaaaaaaaaaaaaaaaaaaaaaaa1", newData)
                                                        return res.json(CreateObjService.response(false, newData));
                                                    })
                                                } else {
                                                    Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                                                        var userData = PortfolioUser.getUserObjApp(userData2)

                                                        var newData = {
                                                            portfolioId: userData.portfolioId,
                                                            name: userData.name,
                                                            emailId: userData.emailId,
                                                            gender: userData.gender,
                                                            phoneNumber: userData.phoneNumber,
                                                            userDataType: userData.userDataType,
                                                            accessToken: userData.accesstoken,
                                                            phoneVerification: userData.phoneVerification,
                                                            profilePic: userData.profilePic,
                                                            isCorporateuserData: userData.isCorporateuserData,
                                                            isEmployee: 1,
                                                            role: user.role,
                                                            employeeId: user._id,
                                                            parlorIds: [{
                                                                parlorid: user.parlorId,
                                                                parlorName: result.name
                                                            }],
                                                            uType: 1,
                                                            parlorType : user.parlorType ? user.parlorType : 1
                                                        };
                                                        console.log("77777777777777777777777777", newData)
                                                        return res.json(CreateObjService.response(false, newData));
                                                    })
                                                }
                                            } else {
                                                Admin.findOne({ phoneNumber: req.body.phoneNumber }).exec(function(err, user) {
                                                    console.log( "my user" , user);
                                                    var response = { error: true };
                                                    if (user != null) {
                                                        if (user.parlorIds.length > 0) {

                                                            if (err) {
                                                                console.log(err)
                                                            }
                                                            // console.log(result);
                                                            var m = [];
                                                            async.parallel([
                                                                function(done) {
                                                                    async.each(user.parlorIds, function(employee, callback) {
                                                                        Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                                            console.log("2nd", result);
                                                                            if (result == null) {
                                                                                callback();
                                                                            } else {
                                                                                m.push({ parlorid: result._id, parlorName: result.name });
                                                                                callback();
                                                                            }
                                                                        });
                                                                    }, done);
                                                                }
                                                            ], function allTaskCompleted() {
                                                                var userData = PortfolioUser.getUserObjApp(userData2)
                                                                var newData = {
                                                                    portfolioId: userData.portfolioId,
                                                                    name: userData.name,
                                                                    emailId: userData.emailId,
                                                                    gender: userData.gender,
                                                                    phoneNumber: userData.phoneNumber,
                                                                    userDataType: userData.userDataType,
                                                                    accessToken: userData.accesstoken,
                                                                    phoneVerification: userData.phoneVerification,
                                                                    profilePic: userData.profilePic,
                                                                    isCorporateuserData: userData.isCorporateuserData,
                                                                    isEmployee: 1,
                                                                    role: user.role,
                                                                    employeeId: user._id,
                                                                    parlorIds: m,
                                                                    uType: 0,
                                                                    parlorType : user.parlorType ? user.parlorType : 1
                                                                };
                                                                console.log("ye bhejjjjjjjjjjjjaaaaaaaaaaaaaaaaaaaaaaaaaaa2", newData)

                                                                return res.json(CreateObjService.response(false, newData));
                                                            })
                                                        }else if (user.firstName == "newOwner"){
                                                            console.log("----------nikita---------------")
                                                            var userData = PortfolioUser.getUserObjApp(userData2)

                                                                var newData = {
                                                                    portfolioId: userData.portfolioId,
                                                                    name: userData.name,
                                                                    emailId: userData.emailId,
                                                                    gender: userData.gender,
                                                                    phoneNumber: userData.phoneNumber,
                                                                    userDataType: userData.userDataType,
                                                                    accessToken: userData.accesstoken,
                                                                    phoneVerification: userData.phoneVerification,
                                                                    profilePic: userData.profilePic,
                                                                    isCorporateuserData: userData.isCorporateuserData,
                                                                    isEmployee: 1,
                                                                    role: user.role,
                                                                    employeeId: user._id,
                                                                    parlorIds: [],
                                                                    uType: 0,
                                                                    salonPassPayment : true,
                                                                    parlorType : 4
                                                                };
                                                                console.log("----data----" , newData)
                                                                // SalonPassPayments.update({phoneNumber : userData.phoneNumber} , {status :1}, function(err , updateSalonPass){

                                                                    return res.json(CreateObjService.response(false, newData));
                                                                // })

                                                        } else {
                                                            Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                                                                var userData = PortfolioUser.getUserObjApp(userData2)

                                                                var newData = {
                                                                    portfolioId: userData.portfolioId,
                                                                    name: userData.name,
                                                                    emailId: userData.emailId,
                                                                    gender: userData.gender,
                                                                    phoneNumber: userData.phoneNumber,
                                                                    userDataType: userData.userDataType,
                                                                    accessToken: userData.accesstoken,
                                                                    phoneVerification: userData.phoneVerification,
                                                                    profilePic: userData.profilePic,
                                                                    isCorporateuserData: userData.isCorporateuserData,
                                                                    isEmployee: 1,
                                                                    role: user.role,
                                                                    employeeId: user._id,
                                                                    parlorIds: [{
                                                                        parlorid: user.parlorId,
                                                                        parlorName: result.name
                                                                    }],
                                                                    uType: 0,
                                                                    parlorType : user.parlorType ? user.parlorType : 1
                                                                };
                                                                console.log("77777777777777777777777777", newData)

                                                                return res.json(CreateObjService.response(false, newData));
                                                            })
                                                        }
                                                    } else {
                                                        console.log("problem yhan hai")
                                                        var f_data = PortfolioUser.getUserObjApp(userData2)
                                                        f_data.isEmployee = 0;
                                                        return res.json(CreateObjService.response(false, f_data));

                                                    }
                                                });
                                            }
                                        });

                                        // } else {

                                    }

                                });
                            })
                        }

                    });

                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid otp'));
        }
    });
});


router.get('/deletePost', function(req, res) {

    var id = req.query.id;
    Port_Post.remove({ _id: id }, function(err, removed) {
        if (err) {
            res.json("err")
        } else {
            res.json("done")
        }
    })

})


router.post('/socialLogin', function(req, res) {

    getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData1) {
        // console.log("social login", userData1)
        if (userData1) {
            var query = { facebookId: userData1.id };
            if (req.body.socialLoginType == 2) query = { googleId: userData1.id };
            console.log(query)
            PortfolioUser.findOne(query, function(err, user) {
                var userData = PortfolioUser.getUserObjApp(userData1)
                console.log("------------------------------->>>>>>>>>>", userData)
                if (user) {
                    var userData = PortfolioUser.getUserObjApp(user)

                    if (req.body.socialLoginType == 1) {
                        getFacebookFriendList(req.body.accessToken, user.id, function(friends) {
                            updateUserFriends(friends, user.id, function() {
                                var userData = PortfolioUser.getUserObjApp(user)

                                Beu.findOne({ phoneNumber: userData.phoneNumber }, function(err, user) {
                                    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user);

                                    if (user != null) {
                                        console.log("entered");
                                        if (user.parlorIds.length > 0) {
                                            var m = [];
                                            async.parallel([
                                                function(done) {
                                                    async.each(user.parlorIds, function(employee, callback) {
                                                        Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                            console.log("2nd", result);
                                                            if (result == null) {
                                                                callback();
                                                            } else {
                                                                m.push({ parlorid: result._id, parlorName: result.name });
                                                                callback();
                                                            }
                                                        });
                                                    }, done);
                                                }
                                            ], function allTaskCompleted() {
                                                userData.role = user.role;
                                                userData.isEmployee = 1;
                                                userData.employeeId = user._id;
                                                userData.parlorIds = m;
                                                userData.uType = 1;
                                                console.log("ye bhejjjjjjjjjjjjaaaaaaaaaaaaaaaaaaaaaaaaaaa4", userData)

                                                return res.json(CreateObjService.response(false, userData));
                                            })


                                        } else {

                                            Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {

                                                userData.role = user.role;
                                                userData.isEmployee = 1;

                                                userData.employeeId = user._id;
                                                userData.parlorIds = [{
                                                    parlorid: user.parlorId,
                                                    parlorName: result.name
                                                }];
                                                userData.uType = 1;
                                                return res.json(CreateObjService.response(false, userData));
                                            })
                                        }
                                    } else {
                                        Admin.findOne({ phoneNumber: req.body.phoneNumber }).exec(function(err, user) {
                                            console.log(user);
                                            var response = { error: true };
                                            if (user) {

                                                if (user.parlorIds.length > 0) {
                                                    // res.json(user.parlorIds);
                                                    var m = [];

                                                    async.parallel([
                                                        function(done) {
                                                            async.each(user.parlorIds, function(employee, callback) {
                                                                // console.log(employee);
                                                                Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, resultt) {
                                                                    console.log('result', resultt);
                                                                    if (resultt == null) {
                                                                        callback();
                                                                    } else {
                                                                        m.push({ parlorid: resultt._id, parlorName: resultt.name });
                                                                        callback();
                                                                    }
                                                                });
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {

                                                        userData.role = user.role;
                                                        userData.isEmployee = 1;

                                                        userData.employeeId = user._id;
                                                        userData.parlorIds = m;
                                                        userData.uType = 0;
                                                        return res.json(CreateObjService.response(false, userData));
                                                    })

                                                } else {
                                                    Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {

                                                        userData.role = user.role;
                                                        userData.employeeId = user._id;
                                                        userData.isEmployee = 1;

                                                        userData.parlorIds = [{
                                                            parlorid: user.parlorId,
                                                            parlorName: result.name
                                                        }];
                                                        userData.uType = 0;
                                                        return res.json(CreateObjService.response(false, userData));
                                                    })
                                                }


                                                // return res.json(response);



                                            } else {
                                                userData.isEmployee = 0;
                                                return res.json(CreateObjService.response(false, userData));

                                            }
                                        });
                                    }
                                });


                            })
                        });
                    } else {

                        Beu.findOne({ phoneNumber: userData.phoneNumber }, function(err, user) {
                            // console.log(user);

                            if (user != null) {
                                console.log("entered");
                                if (user.parlorIds.length > 0) {

                                    if (err) {
                                        console.log(err)
                                    }
                                    // console.log(result);
                                    console.log("first", result)
                                    var m = [];
                                    async.parallel([
                                        function(done) {
                                            async.each(user.parlorIds, function(employee, callback) {
                                                Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                    console.log("2nd", result);
                                                    if (result == null) {
                                                        callback();
                                                    } else {
                                                        m.push({ parlorid: result._id, parlorName: result.name });
                                                        callback();
                                                    }
                                                });
                                            }, done);
                                        }
                                    ], function allTaskCompleted() {
                                        userData.role = user.role;
                                        userData.employeeId = user._id;
                                        userData.parlorIds = m;
                                        userData.uType = 1;
                                        userData.isEmployee = 1;
                                        console.log("ye bhejjjjjjjjjjjjaaaaaaaaaaaaaaaaaaaaaaaaaaa3", userData)

                                        return res.json(CreateObjService.response(false, userData));
                                    })


                                } else {
                                    Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, resultss) {

                                        userData.role = user.role;
                                        userData.employeeId = user._id;
                                        userData.parlorIds = [{
                                            parlorid: user.parlorId,
                                            parlorName: resultss.name
                                        }];
                                        userData.uType = 1;
                                        userData.isEmployee = 1;

                                        return res.json(CreateObjService.response(false, userData));
                                    })
                                }
                            } else {
                                Admin.findOne({ phoneNumber: req.body.phoneNumber }).exec(function(err, user) {
                                    console.log(user);
                                    var response = { error: true };
                                    if (user) {

                                        Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                                            if (user.parlorIds.length > 0) {
                                                // res.json(user.parlorIds);
                                                var m = [];

                                                async.parallel([
                                                    function(done) {
                                                        async.each(user.parlorIds, function(employee, callback) {
                                                            // console.log(employee);
                                                            Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, resultt) {
                                                                console.log('result', resultt);
                                                                if (resultt == null) {
                                                                    callback();
                                                                } else {
                                                                    m.push({ parlorid: resultt._id, parlorName: resultt.name });
                                                                    callback();
                                                                }
                                                            });
                                                        }, done);
                                                    }
                                                ], function allTaskCompleted() {

                                                    userData.role = user.role;
                                                    userData.employeeId = user._id;
                                                    userData.parlorIds = m;
                                                    userData.uType = 0;
                                                    userData.isEmployee = 1;

                                                    return res.json(CreateObjService.response(false, userData));
                                                })

                                            } else {
                                                userData.role = user.role;
                                                userData.employeeId = user._id;
                                                userData.parlorIds = [{
                                                    parlorid: user.parlorId,
                                                    parlorName: result.name
                                                }];
                                                userData.uType = 0;
                                                userData.isEmployee = 1;
                                                return res.json(CreateObjService.response(false, userData));
                                            }
                                        });

                                    } else {
                                        userData.isEmployee = 0;
                                        return res.json(CreateObjService.response(false, userData));

                                    }
                                });
                            }
                        });

                    }

                } else {
                    var obj = {
                        userId: null,
                        firstName: userData.name,
                        emailId: userData.email,
                        phoneNumber: null,
                        gender: userData.gender,
                        accessToken: null,
                        phoneVerification: 0,
                        profilePic: userData.profilePic,
                    };
                    return res.json(CreateObjService.response(false, obj));
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid accessToken'));
        }
    });
});



function getSocialDetails(socialLoginType, accessToken, callback) {
    if (socialLoginType == 1) {
        console.log("ffffffffffffffffff", socialLoginType, accessToken)
        var FB = require('fb'),
            fb = new FB.Facebook({});
        // https://graph.facebook.com/me?access_token=EAAEumq6snoUBAKBZACtpSZAcLFibOZAW3tEhiwlRRo9CcOiIfBGDcl0tpQHJbp0CRhZBZA70M1vkT8fF6rha0nZCGRdMzFBMDGYdeU9F9NfBORZAUDyisZAdWT3DYaqkmeDZAwIi6y0gwZCMIAwjOZBJlvYZCHTo9uyE02OEbZCpDnDls8J6cn1ZCZAOVo7exXGl19FkbteQfU8zHmupBH1zPCDZBaCoZBJSOw78cXZAgZD&fields=id,name,email,picture,gender,timezone
        FB.api('me', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: accessToken }, function(res2) {
            console.log("rrrrrrrr=--------------->", res2);
            if (!res2.error) {
                return callback({
                    id: res2.id,
                    name: res2.name,
                    emailId: res2.email,
                    gender: res2.gender == 'male' ? 'M' : 'F',
                    profilePic: "https://graph.facebook.com/" + res2.id + "/picture?type=large",
                });
            } else return callback(null);
        });
    } else {
        console.log("ggggggggggggggggggg", socialLoginType, accessToken)

        var request = require("request");
        request({ url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken, json: true }, function(error, res2) {
            console.log(res2.body);

            if (res2.body.sub) {
                return callback({
                    id: res2.body.sub,
                    name: res2.body.name,
                    emailId: res2.body.email,
                    gender: null,
                    profilePic: res2.body.picture,
                });
            } else return callback(null);
        });
    }
}


function updateUserFriends(friends, userId, callback) {
    UserFbFriend.remove({ userId: userId }, function(erm, d) {
        UserFbFriend.create(friends, function(err, d) {
            console.log(err);
            console.log(d);
            return callback();
        });
    });
}


function getFacebookFriendList(accesstoken, userId, callback) {
    var FB = require('fb');
    FB.api('me/friends', { limit: 100, access_token: accesstoken }, function(e) {
        if (e.data) {
            var data = _.map(e.data, function(e) {
                return {
                    name: e.name,
                    facebookId: e.id,
                    userId: userId,
                }
            });
            return callback(data);
        } else {
            return callback([]);
        }
    });
}


// function getSocialDetails(socialLoginType, accessToken, callback) {
//     if (socialLoginType == 1) {
//         var FB = require('fb'),
//             fb = new FB.Facebook({});
//         // https://graph.facebook.com/me?access_token=EAAEumq6snoUBAKBZACtpSZAcLFibOZAW3tEhiwlRRo9CcOiIfBGDcl0tpQHJbp0CRhZBZA70M1vkT8fF6rha0nZCGRdMzFBMDGYdeU9F9NfBORZAUDyisZAdWT3DYaqkmeDZAwIi6y0gwZCMIAwjOZBJlvYZCHTo9uyE02OEbZCpDnDls8J6cn1ZCZAOVo7exXGl19FkbteQfU8zHmupBH1zPCDZBaCoZBJSOw78cXZAgZD&fields=id,name,email,picture,gender,timezone
//         FB.api('me', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: accessToken }, function(res) {
//             console.log(res);
//             if (!res.error) {
//                 return callback({
//                     id: res.id,
//                     name: res.name,
//                     emailId: res.email,
//                     gender: res.gender == 'male' ? 'M' : 'F',
//                     profilePic: "https://graph.facebook.com/" + res.id + "/picture?type=large",
//                 });
//             } else return callback(null);
//         });
//     } else {
//         var request = require("request");
//         request({ url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken, json: true }, function(error, res) {
//             console.log(res.body);

//             if (res.body.sub) {
//                 return callback({
//                     id: res.body.sub,
//                     name: res.body.name,
//                     emailId: res.body.email,
//                     gender: null,
//                     profilePic: res.body.picture,
//                 });
//             } else return callback(null);
//         });
//     }
// }

function getUserRegistrationUrl(name, phoneNumber, freeServices, mobile) {
    if (!mobile)
        return getSmsUrl('BEUSLN', 'Hi ' + name + ', Welcome to the world of Beauty Ninjas. Treat yourself with incredible beauty treatments and much more like never before.', [phoneNumber], 'T');
    else {
        return getSmsUrl('BEUSLN', 'Congrats! Thank You For Signing Up. Get 15% Cashback On Your Digital Payments Through The App. Avail Now!', [phoneNumber], 'T');
    }
}

function getSmsUrl(messageId, message, phoneNumbers, type) {
    return ParlorService.getSMSUrl(messageId, message, phoneNumbers, type);
}

function getSmsUrlForOtp(messageId, message, phoneNumbers, type, otp, retry) {
    return ParlorService.getSMSUrlForOtp(messageId, message, phoneNumbers, type, otp, retry);
}


router.get('/test', function(req, res) {

    var accessToken = req.query.token;

    var request = require("request");
    request({ url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken, json: true }, function(error, res) {
        console.log(res.body);
        console.log(error);
    })


})

router.get('/getData',function(req,res){


var d=['1']
var ids=[];
LuckyDrawModel.find({},{parlorId:1},function(err,draw){
async.each(d,function(s,cbs){

_.forEach(draw,function(p){
ids.push(ObjectId(p.parlorId))
})
cbs();

},function(){
    console.log(ids)

    Parlor.find({_id:{$nin:ids}},function(err,data){
        console.log(data.length)
        res.json(data)

    })

})


    })
})

module.exports = router;