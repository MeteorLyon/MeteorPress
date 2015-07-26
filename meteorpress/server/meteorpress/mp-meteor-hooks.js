Accounts.onLogin (function(info) {

    MP.log('Successful login information object:\n' + info, 1);
    var type            = info.type;
    var allowed         = info.allowed;
    var error           = info.error;
    var user            = info.user;

    var id              = user._id;
    var isAdministrator = Roles.userIsInRole(id, ['Administrator']);
    var isSuperUser     = (mpSuperUsers.findOne({_id: id}));

    // Look for them
    if (
        isAdministrator
        || isSuperUser
    ) {
    
        // Passed admin check
        MP.log ('INFO: ' + user.profile.username + ' (' + id + ')  passed admin check', 2);
        // MP.logAuthenticationAdmins (MP.userId(), true);

    } else {
        
        // Failed admin check
        MP.log ('INFO: ' + user.profile.username + ' (' + id + ') is not an admin', 2);

    }

    // Log successful logins
    if (MP.isAdmin()) {
        UI.registerHelper('mpIsAdmin', function () {
            return MP.isAdmin();
        });
    }

    // MP.logAuthentication (MP.userId(), true);

    return true;

});

Accounts.onLoginFailure (function(info) {

    MP.log('Failed login information object:\n' + info, 1);
    var type            = info.type;
    var allowed         = info.allowed;
    var error           = info.error;
    var user            = info.user;

    // Set error appropriately ambiguous user message

    // Log login failures
    // MP.logAuthentication (MP.userId(), false);

    return false;

});

// Hook into create user and customize a bit
Accounts.onCreateUser(function(options, user) {

    // This prevents these mods from running during install
    // if (MP.isNotInstalled()) {
    //     return user;
    // }

    if (!options || !user) {
        MP.log ('Invalid attempt to hook into create user', 2);
        return;
    }

    var profile = options.profile || {};

    // Debug
    MP.log ('Create user options object:' + JSON.stringify(options, null, 4), 1);
    MP.log ('Create user user object:' + JSON.stringify(user, null, 4), 1);

    /* 
     * Things we want in our profile:
     *
     * From Options:
     *      Name
     *          g/md/t - profile.name
     *          services.github.username
     *
     * From User:
     *      Username
     *          services.twitter.screenname
     *          services.github.username
     *          services.google.name
     *          services.meteor-developer.username
     *      Image
     *          services.twitter.profile_image_url
     *          services.twitter.profile_image_url_https
     *          services.google.picture
     *      Email
     *          services.github.email
     *          services.google.email
     *          services.meteor-developer.emails[0]
     *
     * Priority should fall to the service
     *
     */

    // Tried to do this sexy, taking the 3am git'er done route
    if (user.services.twitter && user.services.twitter.profile_image_url) {
        profile.image = user.services.twitter.profile_image_url;
    } else if (user.services.google && user.services.google.picture) {
        profile.image = user.services.google.picture;
    } else {
        // Validate image existence
    }

    if (user.services.google && user.services.google.email) {
        profile.email = user.services.google.email;
    } else if (user.services.github && user.services.github.email) {
        profile.email = user.services.github.email;
    } else if (user.services['meteor-developer'] 
               && user.services['meteor-developer'].emails
               && user.services['meteor-developer'].emails[0].address) {
        profile.email = user.services['meteor-developer'].emails[0].address;
    } else {
        // Validate email
    }

    if (user.services.twitter && user.services.twitter.screenname) {
        profile.username = user.services.twitter.screenname;
    } else if (user.services.google && user.services.google.name) {
        profile.username = user.services.google.name;
    } else if (user.services.github && user.services.github.username) {
        profile.username = user.services.github.username;
    } else if (user.services['meteor-developer'] && user.services['meteor-developer'].username) {
        profile.username = user.services['meteor-developer'].username;
    } else {
        profile.name = profile.name || user.name || profile.email || null;
    }
    
    // Replace provided
    user.profile = profile;

    // Everyone deserves a chance
    // user.roles = MP.roleNewUser;

    // Notify admins if they have this notication on
    if (MP.notifyOnNewUser) {
        // TODO: Send the email :)
        MP.log ('Trying to send new user email', 1);
    }

    // Add IP
    user.IPs = [Meteor.userIp];
    // Debug
    MP.log (JSON.stringify(profile, null, 4), 1);
    // Add to permanent record
    mpUsersLifetime.insert(_.omit(user, 'services'));

    // Send it along
    return user;

});
