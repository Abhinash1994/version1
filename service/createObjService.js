module.exports = {

    response: function(error, messageOrError){
        if(error)return {success : false, message : messageOrError};
        else return { success : true, data : messageOrError};
    },
};
