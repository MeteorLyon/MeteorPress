console.log ('INFO Loading #MeteorPress server plugin: MP Chat Engine');
/*
 * Chat
 */
Meteor.publish('mpchat', function() {

    // Set a reasonable limit
    var options = {
        userId:     0,
        ip:         0,
        sort:       {stamp: -1}, 
        limit:      100
    };
    
    return mpChat.find({}, options);

});

/*
 * Permissions for Chat collection
 */
mpChat.allow({
    insert: function () {
        // Must be logged in to flag
        return true;
    },
    update: function () {
       // Not used yet
       return false;
    },
    remove: function () {
       // Not used yet
       return isadmin();
    }
});

/*
 * Chat methods
 */
Meteor.methods ({

    /*
     * Insert chat line
     */
    chatAdd: function (s) {

        check (s, String);

        if (!s) {
            throw new Meteor.Error (
                422, "Chat line cannot be blank"
            );
        }

        // Populate chat object
        if (this.userId) {
            // Registered user
            var user = Meteor.user()
            console.log (JSON.stringify(user, null, 4));
            var line = {
                line:       s,
                stamp:      new Date().getTime(),
                ip:         Meteor.userIp,
                username:   Meteor.displayName(user),
                userId:     this.userId
            };
        } else {
            // Anonymous user
            var line = {
                line:       s,
                stamp:      new Date().getTime(),
                ip:         Meteor.userIp,
                username:   'anon'
            };
        }

        var lineId = mpChat.insert(line);
        
        if (lineId) {
            return lineId;
        }

    },

    /*
     * Remove chat line
     */
    chatRemove: function (id) {

        mpChat.remove({objectId: id});

    },

});
