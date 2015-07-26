console.log ('INFO Loading #MeteorPress global initialization');
/**
 * Load system config
 */
if (!MP) {
    // This is a valid reason to throw an error :p
    throw new Meteor.Error ('meteorpress-not-loaded',
                            'ERROR Trying to configure before MP has initialized!');
}

// UGH! Stupid installer
// maybe move this to meteor.startup
// if (Meteor.isServer) {
    /** Look for existing config */
    // TODO: Fix this to sort properly
    mpConfig = mpConfiguration.findOne();

    if (mpConfig && mpConfig._id) {

        MP.log ('INFO Loading #MeteorPress configuration', 2);
        mpConfig = _.omit(mpConfig, '_id');
        _.extend(MP, mpConfig);
        MP.config = mpConfig;
        MP.installed = true;
        mpIsInstalled = true;
        mpIsNotInstalled = false;

    } else {

        // Launch installer
        if (Meteor.isServer) {
            MP.log ('INFO #MeteorPress is not installed', 2);
        }
        MP.installed = false;
        mpIsInstalled = false;
        mpIsNotInstalled = true;

    };
//}
