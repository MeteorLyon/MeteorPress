console.log ('INFO Loading #MeteorPress main server environment');
/**
 *
 * Meteor initialization
 *
 */

Meteor.startup(function fnMSU () {

    console.log ('INFO Firing #MeteorPress server startup');
    /** 
     * @description         Instantiate TwitMaker object
     * @external            TwitMaker
     * @see                 {@link https://atmospherejs.com/mrt/twit|Twit documentation on Atmosphere}
     * TODO:                Move this
     *
    T = new TwitMaker(twitterCredentials);
    if (!T) {
        throw new Error ('Could not instantiate TwitMaker, cannot continue');
    }
     */

    /** Instantiate TwiefBot object */
    // bot = TwiefBot; bot.launch();






    /**************************************************************************
     * Register DDP connection callback function
     * Use this.stop() if it goes batty
     *
     * This provides site statistics logging
     *
     * TODO:
     *          Separate counts from logs
     *          Add logging to each template
     *          Move onConnection mess into a function
     *
     *************************************************************************/
    Meteor.onConnection(function (o) {

        mpLogConnection (o);

    // End logging
    });

    /**
     * Copy roles into #MeteorPress object
     *
     * TODO: Probably shouldn't send this to the client
     */
    MP.roles = Meteor.roles.find({}, {fields: {_id: false}}).fetch();


    /**
     * Connect to Kadira
     */
    if (MP.enableKadira) {
        kk = mpSingletons.findOne({name: 'kadiraKeys'});
        if (kk && kk.key && kk.secret) {
            Kadira.connect(kk.key, kk.secret)
        }
    }


// End Meteor.startup
});
