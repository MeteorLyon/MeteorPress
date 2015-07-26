console.log ('INFO Loading #MeteorPress API');
/**************************************************************************************************
 *
 *
 * @Summary             #MeteorPress by iDoMeteor
 *
 * @Class
 * @Description         #MeteorPress
 * @File                mp-api.js  #MeteorPress Server-side API
 * @Version             v1.0.0-beta.3 {{Paranoid::Pete}}
 *
 *
 *
 * @Blocking
 *
 *          This is not standard in JSDoc (which I'm still learning
 *          to use properly, and considering switching to YUI :>),
 *          but will be used in all appropriate methods.
 *          I find it a rather important thing to know about
 *          one's method calls, particularly in Meteor.
 *
 *          By default, one should be able to rely on any blocking
 *          methods to require a callback function as their last
 *          parameter.  They will either receive true/false
 *          based upon success, or the standard Node/Meteor
 *          (error, result) parameters, where error should be
 *          a string and result can be of any type it wants to be.
 *
 * @DOs
 *
 *          DO do whatever you want in your separate, modularized & distinct
 *              plugin or theme code. :D
 *              That being said, I will hold curated plugins and themes hosted
 *               on our official repos & subdomains must be pretty close to these
 *               or judged to be of high quality by myself or the community
 *          Do feel free to make sexy ternary magic, but try to
 *              figure out and follow my patterns
 *          Do hoist your variables as far to the top as logical,
 *              I don't mind if they come immediately after validation
 *              or have complexity within them, just don't bury them somewhere
 *              within a nested code block (unless they are local to a
 *              callback function of course) or off screen of the function
 *              declaration.. and please align their assignment operators
 *          Do name your anonymous functions & callbacks.. even if I am not (see @exceptions)
 *          Do make frequent and proper use of the logging functions
 *              MP.log for console logs
 *              ... there's other logging stuff I'll detail later
 *          Do make friends with vertical space.. but not excessively..
 *              a good policy is to know that moving lines around is
 *              a lot easier than going through long lines, so break
 *              around concatenations, commas, and operators
 *          Do make notes about your ideas along the way!
 *          Do name all boolean return values 'result'
 *          Do name object parameters coming in from clients 'submission' to
 *              clearly mark it as needing careful validation
 *          Do please test your code locally using meteor shell & logs
 *              I will not accept code that throws nasty messages, junk,
 *              is crashy, does not handle improperly formed requests,
 *              clashes with MP naming convention *or* I feel they
 *              are generic and therefore probably not very well thought
 *              out and probably going to cause others problems.
 *          Do put code with code and comments with comments
 *          Do talk with me if you intend to submit pull requests with
 *              any kind of major structural changes, there is a lot
 *              going on in my head still. |D
 *          Do try to not only use ecma/javasripty naming conventions, but
 *              also try to be Meteory :>
 *          Do use a non-clashing yet consistent naming pattern
 *          Do use if (Meteor.isClient) return; to start any methods which should
 *              never be accessible from the front.. although these methods are
 *              ultimately meant to be global utilities, so I have not found cause
 *              to do so yet.
 *          Do use proper camel case upInHurr
 *          Do use 4 spaces for indenting
 *          Do validate in every method! (See @Exceptions if you spot one :p)
 *
 * @DON'Ts
 *
 *          Thou shalt not add packages of any kind to the base without a thorough
 *              discussion.  The less, the better.
 *          Thou shalt not use @TODO, just use todo, todo: or // todo[:]
 *              ... but in CAPS!  All caps todo highlights nicely for me,
 *              and @TODO is removed from JSDocs and I prefer that they
 *              be available for viewing there.
 *          Thou shalt not put excessive comments within code blocks, use a
 *              comment block above it and make your *code* clean and readable.
 *          Thou shalt not throw errors unless something catastrophic happens, I hate that!
 *              Instead, return false or undefined and handle it mangggggg
 *              In other words, I hate check.
 *
 * @Exceptions
*
 *          I either make them or approve them, please and thank you. :)
 *
 *
 * @Globals
 *
 *          mpXyyZyy vars are globals that are mostly going to evaporate
 *          MP.xyyZyy should be all the global anyone needs for code coding
 *              Since MP is global, it can be used in it's own methods'
 *              callbacks, but don't use MP for storing state.  It will
 *              be doomed to an implosion.. somwhere.. eventually.  Pass
 *              around your state in a parameter named 'context'.
 *
 * @Example
 *
 *      How the config system works:
 *          It may not be apparant, so let me make it so here.
 *          Firstly, on first run, if you skip the installer,
 *              the default config will load from MP.configDefault
 *          On subsequent runs, the most recently saved version
 *              of the config will be loaded from the database..
 *              every save creates a new document, this would
 *              theoretically allow for system downgrades/rollbacks,
 *              allow for accountability, and enhance upgradability
 *          Both of these will load the full, current config document
 *              into MP.config.  This object should only be modified
 *              programmatically by the config altering methods.
 *          After being saved to the config member of MP, the whole
 *              object is then injected into the root level of the
 *              MP class.  All methods and functions (not of plugins)
 *              should look for their global needs there.  The root
 *              level elements are considered to be the most valid
 *              'active running configuration'.  They may be modified
 *              dynamically in a way that does not need to be saved
 *              during run time.
 *          When the values of the running config are updated, in
 *              general, they will update both MP.config and save
 *              those changes to the database.  Using MP.config
 *              to do this makes the database interactions easy peasy
 *              and I like that.
 *
 * TODO:
 *
 *      All limits should probably become min/max for paging
 *      Find MP.user & MP.userId, lol
 *      Installer (use default configuration & content or configure yourself?)
 *      Generate navigation! lol
 *      Gonna need a parseMPMarkDown on client side
 *      Load default config, edit config and ....initialize roles
 *      Make *all* content dynamic (a page..err..template, u know)
 *          all content things could theoretically be 'pages'
 *      Options for
 *          allow anonymous editors *          allow anonymous creators
 *          allow registered users only
 *      Need to load T
 *      Pages and Posts add {allowSpiders}
 *      Permissions for roles
 *      Products collection wouldn't be a bad idea, eh? :)
 *          virtual/physical/downloadable/membership/adverts
 *      Rearrange admin menu, pages (add/edit/inactive/removed for super admins)
 *      robots.txt?
 *      Start making all parameter passing object based, ala setConfig
 *              .... same w/returns
 *      Startup should check for config in mpConfiguration and if not
 *          found, simply call an insert w/no values and theoretically
 *          if the schema has all the proper default values, it should
 *          pop right in! :)
 *      Will need some hooks here and there
 *      Will need ignore words and replacements for public postings
 *
 *
 * ***********************************************************************************************/


MP = {

  /*

  insert/get/set methods for:
  users/banips/banusers/banwords/logs/etc

  FUNCTIONS ONLY AUTO EXPORTED!

  */


  /**
   *
   * @Description Get ActivePages
   *
   * @Method      getActivePages
   * @Blocking    false
   * @Param       number      [limit=MP.limitGetters]
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getActivePages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get ActivePosts
   *
   * @Method      getActivePosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getActivePosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AllNews
   *
   * @Method      getAllNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAllNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AllPages
   *
   * @Method      getAllPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAllPages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AllPosts
   *
   * @Method      getAllPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAllPosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get page audio attachments for an ID
   *
   * @Method      getPageAudioAttachments
   * @Blocking    false
   * @Param       id          limit
   * @Param       boolean     [fetch=true]
   * @Returns     {cursor|object}
   *
   */
  getPageAudioAttachments: function(id) {

    /*
    fetch = (MP.isBoolean(fetch))
        ? MP.convertToBoolean(fetch)
        : true;
        */

    return mpPages.find(
        {_id: id},
            {
              fields: {
                audio: 1,
              },
            }).fetch();

  },

  /**
   *
   * @Description Get AuthorNews
   *
   * @Method      getAuthorNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   * TODO: I have no idea how this is going to work yet :D
   *
   *      It prolly just needs to select edits from news,
   *      pages & posts and collate them
   */
  getAuthorEdits: function(limit, userId) {

    // Validate user
    if (isNotValidUser(userId)) {

      MP.log ('ERROR: Cannot get author news with invalid author', 2);
      return false;

    }

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      authorId:   user._id,
      removed:    false,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AuthorNews
   *
   * @Method      getAuthorNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAuthorNews: function(limit, userId) {

    // Validate user
    if (isNotValidUser(userId)) {

      MP.log ('ERROR: Cannot get author news with invalid author', 2);
      return false;

    }

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      authorId:   user._id,
      removed:    false,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AuthorPages
   *
   * @Method      getAuthorPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAuthorPages: function(limit, user) {

    // Validate user
    if (isNotValidUser(userId)) {

      MP.log ('ERROR: Cannot get author news with invalid author', 2);
      return false;

    }

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    false,
      authorId:   user._id,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get AuthorPosts
   *
   * @Method      getAuthorPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getAuthorPosts: function(limit, user) {

    // Validate user
    if (isNotValidUser(userId)) {

      MP.log ('ERROR: Cannot get author news with invalid author', 2);
      return false;

    }

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    false,
      authorId:   user._id,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get configuration value(s)
   *
   * @Blocking    false
   * @Returns     {Any}
   *              Valid config value or undefined
   *
   */
  getConfig: function(key) {

    return (MP.isString(key)) ? (
        MP[key]
    ) : (
        _.omit(MP.config, '_id')
    );

  },

  /**
   *
   * @Description Get configuration value(s)
   *
   * @Blocking    false
   * @Returns     {Any}
   *              Valid config value or undefined
   *
   */
  getConfigSaved: function() {

    return mpConfiguration.findOne({}, {sort: {stamp: -1}});

  },

  /**
   *
   * @Description Get the currently logged in user's profile, _id & roles as an object
   *
   * @Blocking    true
   * @Returns     {Object|Boolean}
   *              Valid user object or false
   *
   */
  getCurrentUser: function() {

    var user = {};

    // Check for logged in
    return (Meteor.user()) ? (

        // Formulate object
            user = {
              _id: Meteor.user._id,
              created: Meteor.user.createdAt,  // My preference, lacks redundancy
              createdAt: Meteor.user.createdAt,
              emails: Meteor.user.emails,     // For compatability, should be avoided
              profile: Meteor.user.emails,     // For those who forget and try this
              roles: Meteor.user.roles,
            },

            // Add profile keys as root level keys
            _.extend(user, Meteor.user.profile),

            // Debug
            MP.log ('Info: Retrieved current user data for '
                + user.username
                + ' (' + user._id + ')', 1),

            // This should only run once after all (reactivity <3)
            MP.currentUser = user,

            // For the caller
            user

        ) : (

            // Nobody home
            MP.log ('WARNING: Attempting to get current user status while not logged in'),
            false
        )

  },

  /**
   *
   * @Description Get FeaturedNews
   *
   * @Method      getFeaturedNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getFeaturedNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      featured:   true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get FeaturedPages
   *
   * @Method      getFeaturedPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getFeaturedPages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      featured:   true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get FeaturedPosts
   *
   * @Method      getFeaturedPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getFeaturedPosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      featured:   true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get InactiveNews
   *
   * @Method      getInactiveNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getInactiveNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     false,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get InactivePages
   *
   * @Method      getInactivePages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getInactivePages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     false,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get InactivePosts
   *
   * @Method      getInactivePosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getInactivePosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     false,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RecentNews
   *
   * @Method      getRecentNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRecentNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RecentPages
   *
   * @Method      getRecentPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRecentPages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RecentPosts
   *
   * @Method      getRecentPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRecentPosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RemovedNews
   *
   * @Method      getRemovedNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRemovedNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    true,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RemovedPages
   *
   * @Method      getRemovedPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRemovedPages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    true,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RemovedPosts
   *
   * @Method      getRemovedPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRemovedPosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    true,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get RemovedPosts
   *
   * @Method      getRemovedPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRemovedUsers: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      removed:    true,
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpUsers.find(selector, options).fetch()
    ) : (
        mpUsers.find(selector, options)
    );

  },

  /**
   *
   * @Description Get MeteorPress roles
   *
   * @Method      getRoles
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getRoles: function(limit, fields, fetch) {

    // Formulate selector & options
    var selector = {
      removed:   {$not: true},
      stale:     {$not: true},
    }
    var options = {
      limit: limit || MP.limitGetters,
      sort: {
      },
    }
    if (MP.isObject(fields)) {
      options.fields = fields;
    }
    fetch = (MP.isBoolean(fetch)) ? fetch : true;


    // Do it
    return (fetch)
        ? mpRoles.find(selector, options).fetch()
        : mpRoles.find(selector, options);

  },

  /**
   *
   * @Description Get StickyNews
   *
   * @Method      getStickyNews
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getStickyNews: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      sticky:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpNews.find(selector, options).fetch()
    ) : (
        mpNews.find(selector, options)
    );

  },

  /**
   *
   * @Description Get StickyPages
   *
   * @Method      getStickyPages
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getStickyPages: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      sticky:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPages.find(selector, options).fetch()
    ) : (
        mpPages.find(selector, options)
    );

  },

  /**
   *
   * @Description Get StickyPosts
   *
   * @Method      getStickyPosts
   * @Blocking    false
   * @Param       number      limit
   * @Param       boolean     [fetch=false]
   * @Returns     cursor
   *
   */
  getStickyPosts: function(limit, fetch) {

    // TODO
    var currentUserRoles = Roles.getRolesForUser(MP.userId());

    // Locals
    fetch = fetch || false;

    // Formulate selector & options
    var selector = {
      active:     true,
      sticky:     true,
      removed:    false,
      roles:      {$in: currentUserRoles},
    }
    var options = {
      fields: {
      },
      limit: limit || MP.limitGetters,
      sort: {
      },
    }

    // Do it
    return (fetch) ? (
        mpPosts.find(selector, options).fetch()
    ) : (
        mpPosts.find(selector, options)
    );

  },

  /**
   *
   * @Description Get another user's public info
   *
   * @Blocking    true
   *
   */
  getUser: function(param) {

    var id      = null;
    var user    = {};

    // Validate (users must always be queried by _id only)
    if (param) {
      if (MP.isString(param)) {
        id = param;
      } else if (MP.isObject(param)) {
        id = param._id || null;
      }
    } else {

      MP.log ('ERROR: Improper attempt to get user');
      return;

    }

    // Check for logged in
    return (Meteor.users.findOne({_id: id})) ? (

        // Formulate object
            user = {
              _id: Meteor.user._id,
              created: Meteor.user.createdAt,  // My preference, lacks redundancy
              createdAt: Meteor.user.createdAt,
              emails: Meteor.user.emails,     // For compatability, should be avoided
              profile: Meteor.user.emails,     // For those who forget and try this
              roles: Meteor.user.roles,
            },

            // Add profile keys as root level keys
            _.extend(user, Meteor.user.profile),

            // Debug
            MP.log ('Info: Retrieved current user data for '
                + user.username
                + ' (' + user._id + ')', 1),

            // For the caller
            user

        ) : (

            // Nobody home
            MP.log ('Info: Attempting to get info on non-existent user id:'
                   + JSON.stringify(param, null, 4), 1),
            false
        )

  },

  /**
   *
   * Manually insert configuration item
   *
   */
  insertConfiguration: function(submission, callback) {

    // Check permissions
    // ..also validates user object
    // TODO: uncomment
    // if (MP.isNotAdmin()) return;

    // Validate
    check(submission, Schema.mpConfiguration);

    // Localize
    var user = MP.user();

    // Assign user details
    var config = {

      author:             user,
      headline:           headline,
      tweet:              tweet,
      summary:            summary,
      body:               body,

    }

    // Do it
    mpConfiguration.insert(config, function(error, id) {

      // Log it
      (id) ? (
          MP.log ('Success: ' + user.name
                  + '(' + user.id + ') inserted a new config item', 2)
      ) : (
          MP.log ('Failure: ' + author.username
                  + '(' + author.id + ') failed to insert a new config item', 2)
      )

      return;

    });

    return;

  },

  /**
   *
   * Manually insert contact form
   *
   */
  insertContact: function(submission, callback) {

    // Check permissions
    // ..also validates user object
    if (
        MP.contactRegisteredOnly
        && MP.isRegistered()
    ) return;

    // Validate
    check(submission, Schema.mpLogContact);

    // Localize
    var user = MP.getCurrentUser();

    // Assign user details
    var news = {

      name:       name,
      twitter:    twitter,
      email:      email,
      message:    message,

    }

    // Do it
    mpLogContact.insert(news, function(error, id) {

      // Log it
      (id) ? (
          MP.log ('Success: ' + author.username
                  + '(' + author.id + ') inserted a new contact form', 2)
      ) : (
          MP.log ('Failure: ' + author.username
                  + '(' + author.id + ') failed to insert a new contact form', 2)
      )

      return;

    });

    return;

  },

  /**
   *
   * Manually insert news item
   *
   */
  insertNews: function(submission, callback) {

    // Check permissions
    // ..also validates user object
    if (MP.isNotAdmin()) return;

    // Validate
    check(submission, Schema.mpNews);

    // Localize
    var user = MP.getCurrentUser();

    // Assign user details
    var news = {

      author:             user,
      headline:           headline,
      tweet:              tweet,
      summary:            summary,
      body:               body,

    }

    // Do it
    mpNews.insert(news, function(error, id) {

      // Log it
      (id) ? (
          MP.log ('Success: ' + author.username
                  + '(' + author.id + ') inserted a new news item', 2)
      ) : (
          MP.log ('Failure: ' + author.username
                  + '(' + author.id + ') failed to insert a new news item', 2)
      )

      return;

    });

    return;

  },

  /**
   *
   * Manually insert page
   *
   */
  insertPage: function(submission, callback) {

    // Check permissions
    // ..also validates user object
    if (MP.isNotAdmin()) return;

    // Validate
    check(submission, Schema.mpPages);

    // Localize
    var user = MP.getCurrentUser();

    // Assign user details
    var news = {

      accessRoles:        submission.accessRoles,
      author:             user,
      navigation:         submission.navigation,
      content:            submission.content,
      tweet:              submission.tweet,
      enable:             submission.enable,
      audio:              submission.audio,
      images:             submission.images,
      code:               submission.code,
      pageImage:          submission.pageImage,
      revision:           submission.revision,
      sitemap:            submission.sitemap,
      template:           submission.template,
      video:              submission.video,

    }

    // Send tweet
    if (submission.tweet.now) {


    }

    // Do it
    mpPages.insert(news, function(error, id) {

      // Log it
      (id) ? (
          MP.log ('Success: ' + author.username
                  + '(' + author.id + ') inserted a new page', 2)
      ) : (
          MP.log ('Failure: ' + author.username
                  + '(' + author.id + ') failed to insert a new page', 2)
      )

      return;

    });

    return;

  },

  /**
   *
   * Manually insert post
   *
   */
  insertPost: function(submission, callback) {

    // Check permissions
    // ..also validates user object
    if (MP.isNotAdmin()) return;

    // Validate
    check(submission, Schema.mpPosts);

    // Localize
    var user = MP.user();

    // Assign user details
    var news = {

      accessRoles:        submission.accessRoles,
      author:             user,
      navigation:         submission.navigation,
      content:            submission.content,
      tweet:              submission.tweet,
      enable:             submission.enable,
      audio:              submission.audio,
      images:             submission.images,
      code:               submission.code,
      pageImage:          submission.pageImage,
      revision:           submission.revision,
      sitemap:            submission.sitemap,
      template:           submission.template,
      video:              submission.video,

    }

    // Send tweet
    if (MP.enableTwitter && (submission.tweet.now)) {

      // Send it
      snTwitterSendTweet (tweet.text);

    }

    // Do it
    mpPosts.insert(news, function(error, id) {

      // Log it
      (id) ? (
          MP.log ('Success: ' + author.username
                  + '(' + author.id + ') inserted a new post', 2)
      ) : (
          MP.log ('Failure: ' + author.username
                  + '(' + author.id + ') failed to insert a new post', 2)
      )

      return;

    });

    return;

  },

  /**
   *
   * Insert new role document
   *
   */
  insertRole: function(submission, user, callback) {

    var role = null;  // Until validated

    // Check permissions
    if (!user || !user._id) {
      MP.log ('ERROR Must be logged in to insert new roles');
      return false;
    }
    /*
     * this would eliminate need for above
    if (isNotAllowed(user._id)) {
        MP.log ('ERROR You are not allowed to insert new roles');
        return false;
    }
    */

    // Validate
    /*
    submission.name
    submission.description
    submission.features features.label
        features.perms
    */

    // Looks good, mark as safe
    role = submission;

    // Add user data
    role.username = user.username;
    role.userid   = user._id;

    // Debug
    MP.log('DEBUG Attempting to insert role:\n' + JSON.stringify(role, null, 4), 2);

    // Inserting new or updating old
    if (
        (MP.isString(role.id))
        && (role.id.length)
    ) {

      // Set stale flag on old doc
      mpRoles.update({_id: role.id}, {$set: {stale: true}}, function(error, affected) {

        // Log it
        var result = (1 == affected) ? (
            MP.log ('SUCCESS: ' + user.username
                    + '(' + user._id + ') expired existing role', 2),
            true
        ) : (
            MP.log ('FAIL: ' + user.username
                    + '(' + user._id + ') failed to expire existing role', 2),
            false
        )

        return (MP.isFunction(callback)) ? callback(result) : null;

      });

    }

    // Insert fresh doc
    mpRoles.insert(role, function(error, id) {

      // Log it
      var result = (id) ? (
          MP.log ('SUCCESS ' + user.username
                  + '(' + user._id + ') inserted a new role: ' + role.name, 2),
          true
      ) : (
          MP.log ('FAIL ' + user.username
                  + '(' + user._id + ') failed to insert a new role: ' + role.name, 2),
          false
      )

      return (MP.isFunction(callback)) ? callback(result) : null;

    });

    return;

  },

  isIn: function(key, value, collection) {
    return (0 < collection.find({key: value}).count())
        ? true : false;
  },

  isUnique: function(value, collection, key) {
    return (2 > collection.find({key: value}).count())
        ? true : false;
  },

  isValidAccessRole: function(value) {

    if (MP.isString(value, 1)) {
      return (mpRoles.find({_id: value}).count())
          ? true : false;
    } else if (MP.isObject(value)) {
      if (
          (MP.isString(value.id, 1))
          && (MP.isString(value.name, 1))
      ) {
        return (mpRoles.find({_id: value.id}).count())
            ? true : false;
      }
    }

    return false;

  },

  isValidAccessRoleArray: function(array) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (isValidAccessRole(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidAudioArray: function(value) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (isValidAudioObject(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidAudioObject: function(value) {

    if (
        (MP.isObject(value))
        && (MP.isString(value.title, 1))
        && (MP.isString(value.link, 1))
    ) {
      return true;
    }

    return false;

  },

  isValidAuthor: function(value) {

    if (MP.isString(value, 1)) {
      return (mpUsers.find({_id: value}).count())
          ? true : false;
    } else if (MP.isObject(value)) {
      if (
          (MP.isString(value.id, 1))
          && (MP.isString(value.name, 1))
      ) {
        return (mpUsers.find({_id: value.id}).count())
            ? true : false;
      }
    }

    return false;

  },

  isValidAuthorArray: function(array) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (MP.isValidAuthor(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidCodeArray: function(value) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (isValidCodeObject(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidCodeObject: function(value) {

    if (
        (MP.isObject(value))
        && (MP.isString(value.code, 1))
        && (MP.isString(value.description, 1))
        && (MP.isString(value.name, 1))
        && (MP.isString(value.title, 1))
    ) {
      return true;
    }

    return false;

  },

  /**
   * TODO
   **/
  isValidContentObject: function(value) {
    return;
  },

  isValidContentObject: function(value) {

    if (
        (MP.isObject(value))
        && (MP.isString(value.title, 1, 100))
        && (MP.isString(value.summary, 20, 255))
        && (MP.isString(value.body))
    ) {
      return true;
    }

    return false;

  },

  isValidHeadline: function(value) {
    // Expects UNIQUE string 1 <> 100
    if (MP.isString(value.trim(), 1, 100)) {
      return true;
    }
    return false;
  },

  isValidImagesArray: function(value) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (isValidImageObject(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidImageObject: function(value) {

    if (
        (MP.isObject(value))
        && (MP.isString(value.description, 1))
        && (MP.isString(value.name, 1))
        && (MP.isString(value.title, 1))
        && (MP.isString(value.url, 1))
    ) {
      return true;
    }

    return false;

  },

  isValidNavParent: function(value) {
    // TODO: Add extra selector props to other validations (users/roles/etc)

    if (MP.isString(value, 1)) {
      return (mpPages.find({
        _id: id,
        removed: {$not: true},
        stale: {$not: true},
      }).count()) ? true : false;
    } else if (MP.isObject(value)) {
      if (MP.isString(value.id, 1)) {
        return (mpPages.find({
          _id: value.id,
          removed: {$not: true},
          stale: {$not: true},
        }).count()) ? true : false;
      }
    }

    return false;

  },

  isValidNavTitle: function() {
    if (MP.isString(value, 25)) {
      return true;
    }
    return false;
  },

  isValidNewsObject: function(value) {

    return MP.isValidContentObject(value);

  },

  isValidPageId: function() {

    if (MP.isString(value, 1)) {
      return (mpPages.find({_id: value}).count())
          ? true : false;
    } else if (MP.isObject(value)) {
      if (MP.isString(value.id, 1)) {
        return (mpPages.find({_id: value.id}).count())
            ? true : false;
      }
    }

    return false;
  },

  isValidPageObject: function(value) {

    if (
        (MP.isObject(value))
    ) {
      return true;
    }

    return false;

  },

  isValidPostObject: function(value) {

    if (
        (MP.isObject(value))
    ) {
      return true;
    }

    return false;

  },

  isValidSitemapObject: function(value) {

    if (MP.isObject(value)) {
      if (MP.isString(value.frequency)) {
        switch (value.frequency) {
          case 'always':
          case 'daily':
          case 'hourly':
          case 'monthly':
          case 'weekly':
          case 'yearly':
          case 'never':
            if (
                (MP.isNumber(value.priority))
                && (/^(10|\d{1})$/.test(value.priority.trim()))
            ) {
              return true;
            }
        }
      }
    }

    return false;

  },

  isValidSlug: function(value) {
    return (
        (/[^\w\._~-]/.test(value))
        || (/--/.test(value))
    ) ? false : true;
  },

  isValidSort: function(value) {
    if (MP.isNumber(value)) {
      return true;
    }
    if (MP.isString(value, 1)) {
      if (/^\d$/.test(value)) {
        return true;
      }
      switch (value) {
        case 'Alpha':
        case 'R-Alpha':
        case 'Chrono':
        case 'R-Chrono':
          return true;
      }
    }

    return false;

  },

  isValidSummary: function(value) {
    // Expects summary string 20 <> 255
    if (MP.isString(value, 20, 255)) {
      return true;
    }
    return false;
  },

  isValidTemplate: function(value) {
    // TODO: Validate template..after theme engine is coded
    if (MP.isString(value, 1)) {
      return true;
    }
    return false;
  },

  isValidTitle: function(value) {
    if (MP.isString(value, 1, 100)) {
      return true;
    }
    if (
        (MP.isObject(value))
        && (MP.isString(value.title, 1, 100))
    ) {
      return true;
    }
    return false;
  },

  isValidTweet: function(value) {
    if (MP.isString(value, 1, 140)) {
      return true;
    }
    if (
        (MP.isObject(value))
        && (MP.isString(value.text, 1, 140))
    ) {
      return true;
    }
    return false;
  },

  isValidUser: function(value) {

    if (MP.isString(value, 1, 100)) {
      return (mpUsers.find({_id: value}).count());
    }
    if (
        (MP.isObject(value))
        && (MP.isString(value._id, 1, 100))
    ) {
      return (mpUsers.find({_id: value._id}).count());
    }
    if (
        (MP.isObject(value))
        && (MP.isString(value.id, 1, 100))
    ) {
      return (mpUsers.find({_id: value.id}).count());
    }

    return false;

  },

  isValidVideosArray: function(value) {

    if (!MP.isArray(array)) {
      return false;
    }

    var trueCount = 0;
    var arrLength = array.length;

    _.each (array, function(value, key) {
      if (isValidVideoObject(value)) {
        trueCount++;
      }
    });

    return (trueCount == arrLength) ? true : false;

  },

  isValidVideoObject: function(value) {

    if (
        (MP.isObject(value))
        && (MP.isString(value.description, 1))
        && (MP.isString(value.name, 1))
        && (MP.isString(value.title, 1))
        && (MP.isString(value.url, 1))
    ) {
      return true;
    }

    return false;
  },

  /**
   *
   * Remove role document
   *
   */
  removeRole: function(id, user, callback) {

    // Check permissions
    if (!user._id) {
      MP.log ('ERROR Must be logged in to insert new roles');
      return false;
    }
    /*
     * this would eliminate need for above
    if (isNotAllowed(user._id)) {
        MP.log ('ERROR You are not allowed to insert new roles');
        return false;
    }
    */

    // Validate
    if (!MP.isString(id)) {
      MP.log('ERROR Invalid attempt to remove role by '
             + user.username + ' (' + user._id + ')');
      return (MP.isFunction(callback))
          ? callback(false)
          : null;
    }

    // Formulate update options
    options = {
      removed:  true,
      userid:   user._id,
      username: user.username,
    }

    // Debug
    MP.log('DEBUG Attempting to remove role:\n' + JSON.stringify([id, options], null, 4), 1);

    // Do it
    mpRoles.update({_id: id}, {$set: options}, function(error, affected) {

      // Log it
      var result = (affected) ? (
          MP.log ('SUCCESS ' + user.username
                  + '(' + user._id + ') removed role: '
                  + id, 2),
          true
      ) : (
          MP.log ('FAIL ' + user.username
                  + '(' + user._id + ') failed to remove role:'
                  + id, 2),
          false
      )

      return (MP.isFunction(callback)) ? callback(result) : null;

    });

    return;

  },

  /**
   * Check for admin privileges
   *
   * This obviously needs work
   *
   * @Param   string      [id=MP.userId()]
   *
   */
  isAdmin: function(id) {

    var user = mpUsers.findOne({_id: id});
    if (!user) return false;

    // Look for them
    if (
        (mpSuperUsers.findOne({_id: id}))
        || (false) // todo: fix role check here
    ) {

      // Passed admin check
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ')  passed admin check', 2);
      return true;

    } else {

      // Failed admin check
      MP.log ('WARNING: ' + user.profile.name + ' (' + id + ') failed admin check', 2);
      return false;

    }

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isAllowed
   * @Blocking    false
   * @Param       {string}            uid
   *              The user being presented for role challenge
   * @Param       {array|string}     role
   *              String or array of role strings or IDs
   * @Param       {string}     [feature=null]
   *              The feature which triggered the request
   * @Param       {array|string}     [perms=null]
   *              The permissions the user must possess for access
   * @Returns     boolean
   *              True if user possesses the qualifying characteristics
   * @Example
   *              MP.isAllowed (uid, role)
   *              MP.isAllowed (uid, role, feature)
   *              MP.isAllowed (uid, role, feature, perms)
   *              MP.isAllowed (uid, role, feature, readOwn)
   *              MP.isAllowed (uid, role, feature, readOthers)
   *              .... maybe should pass an object?
   *
   */
  isAllowed: function(uid, role, feature, perms) {

    var id   = MP.userId();
    var user = (MP.isValidUser(user)) || MP.user();

    // Validate
    if (isNotValidUser(user)) {
      return false;
    }


    // Look for them
    // TODO: Super admin check is total weak sauce, should use IDs instead of nicks :x
    if (
        (-1 != mpSuperAdmins.indexOf(user.profile.nick))
        || (Roles.userIsInRole(MP.userId(), roles))
    ) {

      // Passed admin check
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ')  passed role check', 1);
      return true;

    } else {

      // Failed admin check
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ') failed role check', 1);
      return false;

    }

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isBannedIP
   * @Blocking    false
   * @Param       {string}     ip
   *              A TCP/IP 4 address
   * @Returns     boolean
   *
   */
  isBannedIP: function(ip) {

    // Skipping validation for now
    //
    // Formulate selector & options
    return (mpBannedIPs.findOne({ip: ip})) ? (
        MP.log ('WARNING: Found banned IP ' + ip, 2),
        true
    ) : (
        MP.log ('DEBUG: Checked for banned IP ' + ip, 1),
        false
    );

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isBannedUser
   * @Blocking    false
   * @Param       {object}    [user=Meteor.User()]
   *              A user object, defaults to currently logged in user
   * @Returns     cursor
   *
   */
  isBannedUser: function(id) {

    // Skipping validation for now
    //
    // Formulate selector & options
    return (mpBannedUsers.findOne({id: MP.userId()})) ? (
        MP.log ('WARNING: Found banned user ' + id, 2),
        // TODO: Perform mean things
        true
    ) : (
        MP.log ('DEBUG: Checked for banned user ' + id, 1),
        false
    );

  },

  /**
   * @Description Check installation setting
   * @Returns     {Boolean}
   *              Returns true #MeteorPress seems to be installed :>
   *
   */
  isInstalled: function() {

    return (mpConfiguration.find().count());

  },

  /**
   * @Description Check installation setting
   * @Returns     {Boolean}
   *              Returns true #MeteorPress seems to be installed :>
   *
   */
  isNotInstalled: function() {

    return !(mpConfiguration.find().count());

  },

  /**
   * @Description Check maintenance mode setting
   * @Returns     {Boolean}
   *              Returns true enableMaintenanceMode is true
   *
   */
  isInMaintenanceMode: function() {

    return MP.enableMaintenanceMode;

  },

  /**
   * Check for admin privileges
   *
   * This obviously needs work
   *
   */
  isNotAdmin: function(id) {

    var user = mpUsers.findOne({_id: id});
    if (!user) return true;

    // Look for them
    // TODO: Super admin check is total weak sauce, should use IDs instead of nicks :x
    if (
        (-1 != mpSuperAdmins.indexOf(user.profile.nick))
        || (true) // todo: fix role check
    ) {

      // They are indeed an admin
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ')  is an administrator!', 1);
      return false;

    } else {

      // Nope, they're not
      MP.log ('WARNING: ' + user.profile.name + ' (' + id + ') is not an administrator!', 2);
      return true;

    }

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isNotAllowed
   * @Blocking    false
   * @Param       {array}     roles
   *              An array of roles (strings)
   * @Param       {object}    [user=Meteor.User()]
   *              A user object, defaults to currently logged in user
   * @Returns     boolean
   *
   */
  isNotAllowed: function(roles, user) {

    var id   = MP.userId();
    var user = (MP.isValidUser(user)) || MP.user();

    // Validate
    if (isNotValidUser(user)) {
      return false;
    }


    // Look for them
    // TODO: Super admin check is total weak sauce, should use IDs instead of nicks :x
    if (
        (-1 != mpSuperAdmins.indexOf(user.profile.nick))
        || (Roles.userIsInRole(MP.userId(), roles))
    ) {

      // Passed admin check
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ')  passed role check', 1);
      return false;

    } else {

      // Failed admin check
      MP.log ('INFO: ' + user.profile.name + ' (' + id + ') failed role check', 1);
      return true;

    }

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isNotBannedIP
   * @Blocking    false
   * @Param       {string}     ip
   *              A TCP/IP 4 address
   * @Returns     boolean
   *
   */
  isNotBannedIP: function(ip) {

    // Skipping validation for now
    //
    // Formulate selector & options
    return (mpBannedIPs.findOne({ip: ip})) ? (
        MP.log ('WARNING: Found banned IP ' + ip, 2),
        false
    ) : (
        MP.log ('DEBUG: Checked for banned IP ' + ip, 1),
        true
    );

  },

  /**
   *
   * Check to see if current user belongs to roles being passed
   *
   * @Method      isNotBannedUser
   * @Blocking    false
   * @Param       {object}    [user=Meteor.User()]
   *              A user object, defaults to currently logged in user
   * @Returns     cursor
   *
   */
  isNotBannedUser: function(id) {

    // Skipping validation for now
    //
    // Formulate selector & options
    return (mpBannedUsers.findOne({id: MP.userId()})) ? (
        MP.log ('WARNING: Found banned user ' + id, 2),
        // TODO: Perform mean logging and stuff
        false
    ) : (
        MP.log ('DEBUG: Checked for banned user ' + id, 1),
        true
    );

  },

  /**
   * Check for super user privileges
   *
   * @Param   string      [id=MP.userId()]
   *
   */
  isNotSuperUser: function(id) {

    var user = mpSuperUsers.find({_id: id}).count();
    if (user) {

      // Passed admin check
      user = mpSuperUsers.findOne({_id: id});
      MP.log ('INFO: ' + id + ' passed super user check', 2);
      return false;

    } else {

      // Failed admin check
      user = mpUsers.findOne({_id: id});
      MP.log ('WARNING: ' + id + ' failed super user check', 1);
      return true;

    }

  },

  /**
   *
   * Check to see if current user is active
   *
   * @Method      isNotUserActive
   * @Blocking    false
   * @Param       {string}     ip
   *              A TCP/IP 4 address
   * @Returns     cursor
   *
   */
  isNotUserActive: function(user) {

    return ('undefined' == typeof (param)) ? (
        MP.log ('false', 1),
        false
    ) : (
        MP.log ('true', 1),
        true
    );

  },

  /**
   *
   * Check to see if current user is active
   *
   * @Method      isNotValidUser
   * @Blocking    false
   * @Param       {string}     ip
   *              A TCP/IP 4 address
   * @Returns     cursor
   *
   */
  isNotValidUser: function(user) {

    return ('undefined' == typeof (param)) ? (
        MP.log ('false', 1),
        false
    ) : (
        MP.log ('true', 1),
        true
    );

  },

  /**
   * @Description Returns true
   * @Returns     {Boolean}
   *              Returns true enableMaintenanceMode is true
   *
   */
  isRunning: true,

  /**
   * Check for super user privileges
   *
   * @Param   string      [id=MP.userId()]
   *
   */
  isSuperUser: function(id) {

    var user = mpSuperUsers.find({_id: id}).count();
    if (user) {

      // Passed admin check
      user = mpSuperUsers.findOne({_id: id});
      MP.log ('INFO: ' + id + ' passed super user check', 2);
      return true;

    } else {

      // Failed admin check
      user = mpUsers.findOne({_id: id});
      MP.log ('WARNING: ' + id + ' failed super user check', 1);
      return false;

    }

  },

  /**
   *
   * Log stuff
   *
   * @Method      log
   * @Blocking    false
   * @Param       {string}     message
   *              XXX
   * @Param       {number}     level
   *              XXX
   * @Param       {string}     userId
   *              to notify
   * @Param       {array}     roles
   *              XXX
   * @Returns     cursor
   *
   * TODO
   *      Log to DB
   *
   */
  log: function(message, level) {

    level = level || MP.logLevel || 2;

    // Do it
    switch (level) {
      case 1:
        if (MP.debug) {
          console.log (message);
        }
        break;
      case 2:
        console.log (message);
        break;
    }

    // Insert into database
    mpLogLog.insert ({message: message, level: level});


    return;

  },

  increment: function(count, direction, step) {

    return;

  },

  remove: function(collection, selection, modifier, callback) {

    // Set removed: true on X

    return;

  },

  /**
   *
   * Set configuration value(s)
   *
   * @Blocking    true
   * @Returns     {undefined}
   *
   */
  setConfig: function(parm, callback) {

    var uid     = parm.uid      || null;
    var key     = parm.key      || null;
    var value   = ('undefined' == typeof (parm.value)) ? null : parm.value;
    var obj     = MP.getConfigSaved();
    obj         = _.omit(obj, '_id');

    // Access check
    /* TODO
    if (!uid || MP,isNotAllowed(uid)) {
        MP.log ('ERROR You are not allowed to change configuration', 2);
        return (MP.isFunction(callback)) ? callback(false) : false;
    }
    */

    // Validate
    if (!MP.isString(key)) {
      MP.log ('ERROR Invalid attempt to change configuration', 2);
      return (MP.isFunction(callback)) ? callback(false) : false;
    }

    // Convert values
    if (/^\d?$/.test(value)) value = parseInt(value);
    if ('false' == value) value = false;
    if ('true' == value) value = true;

    // Formulate
    obj[key] = value;

    // Do it
    mpConfiguration.insert (obj, function(error, id) {

      var result = (id) ? (
          MP.log ('SUCCESS Updated configuration key ' + key + 'with value: ' + value, 2),
          MP[key]     = value,
          MP.config   = obj,
          true
      ) : (
          MP.log ('FAILURE Attempting to set configuration key ' + key + 'with value: ' + value, 2),
          false
      );

      return (MP.isFunction(callback)) ? callback(result) : null;
    });

    return false;

  },

  /**
   * @method                  tweet
   * @description             Tweet a little tweet through the tweeter
   * @param       {string}    text
   *              A string 140 characters or less to send to Twitter
   * @param       {function}  callback
   *              Function is called with boolean result of method action
   * @returns     {undefined}
   *
   */
  snTwitterSendTweet: function(text, callback) {

    // Check for permission
    if (false == MP.enableTwitter) {
      MP.log ('WARNING: Sending of tweets is disabled', 2);
      return false;
    }

    // Validate data
    if ((!MP.isString(text)) || (140 < text.length)) {
      MP.log ('ERROR: Trying to send an invalid tweet: ' + text, 2);
      return false;
    }
    callback = (MP.isFunction(callback)) ? callback : null;

    // Setup options
    options.status = text;

    // Send it to Twitter
    T.post ('statuses/update', options,
                Meteor.bindEnvironment (function(error, tweet) {

                  // U already know
                  if (/duplicate/i.test(error)) {
                    MP.log ('ERROR Trying to send duplicate tweet: ' + text, 2);
                    return false;
                  }

                  result = (tweet) ? (
                      // Log it
                      MP.log ('SUCCESS Sent tweet: ' + text, 1),
                      true
                  ) : (
                      // Log it
                      MP.log ('ERROR\nError sending tweet\n' + error + '\nError tweet: ' + text + '\n', 2),
                      false
                  )

                  return (callback) ? callback (result) : false;

                }));

    return;

  },

  /**
   * @method                  tweet
   * @description             Tweet a little tweet through the tweeter
   * @param       {string}    text
   *              A string 140 characters or less to send to Twitter
   * @param       {string}    user
   *              A valid Twitter screen name, with or without @
   * @param       {function}  callback
   *              Function is called with boolean result of method action
   * @returns     {undefined}
   *
   */
  snTwitterSendMessage: function(text, user, callback) {

    // Check for permission
    if (false == MP.enableTwitter) {
      MP.log ('WARNING: Sending of tweets is disabled', 2);
      return false;
    }

    // Validate data
    if ((!MP.isString(text)) || (140 < text.length)) {
      MP.log ('ERROR: Trying to send an invalid tweet: ' + text, 2);
      return false;
    }
    callback = (MP.isFunction(callback)) ? callback : null;

    // Setup options
    options.status = text;

    // Send it to Twitter
    T.post ('statuses/update', options,
                Meteor.bindEnvironment (function(error, tweet) {

                  // U know dey already know
                  if (/duplicate/i.test(error)) {
                    MP.log ('ERROR Trying to send duplicate tweet: ' + text, 2);
                    return false;
                  }

                  result = (tweet) ? (
                      // Log it
                      MP.log ('SUCCESS Sent tweet: ' + text, 1),
                      true
                  ) : (
                      // Log it
                      MP.log ('ERROR\nError sending tweet\n' + error + '\nError tweet: ' + text + '\n', 2),
                      false
                  )

                  return (callback) ? callback (result) : false;

                }));

    return;

  },

  /**
   *
   * Validate Context
   *
   * @Blocking    false
   * @Description
   *          This takes a parameter and makes sure that is an object
   *          with properties that MeteorPress can rely upon for standard
   *          processing functions.  That means that it is either a valid
   *          news item, page or post... for now.
   *
   *
   */
  isNotValidContext: function(test) {
    },

  /**
   *
   * Validate Context
   *
   * @Blocking    false
   * @Description
   *          This takes a parameter and makes sure that is an object
   *          with properties that MeteorPress can rely upon for standard
   *          processing functions.  That means that it is either a valid
   *          news item, page or post... for now.
   *
   *
   */
  isValidContext: function(test) {
    },

  /**
   * @Description     Returns current time & date
   */
  now: function() {
    return new Date();
  },

  clearAlert: function(parm, callback) {

    // TODO
    var uid     = parm.uid  || null;
    var type    = parm.type || null;
    var msg     = parm.msg  || null;

    return (MP.isFunction(callbacK)) ? callback() : null;

  },

  setAlert: function(parm, callback) {

    // TODO
    var uid     = parm.uid  || null;
    var type    = parm.type || null;
    var msg     = parm.msg  || null;

    return (MP.isFunction(callbacK)) ? callback() : null;

  },

  user: function() {
    return Meteor.user();
  },

  userEmails: function() {
    return MP.user().profile.emails;
  },

  userId: function() {
    return Meteor.userId();
  },

  userIp: function() {
    // It was nice of them to add this :>
    return Meteor.userIp();
  },

  userIps: function() {
    // TODO
    return
  },

  userName: function() {
    return MP.user().profile.name;
  },

  userNick: function() {
    return MP.user().profile.nick;
  },



  /**
   *
   * Meta Utilities
   * Stolen from JWSF
   *
   */
  convertToBoolean: function(value) {
    if ('boolean' == typeof (value)) {
      return value;
    }
    if ('date' == typeof (value)) {
      return true;
    }
    if ('number' == typeof (value)) {
      if (
          (0 === value)
          || (-1 == value)
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (
        ('object' == typeof (value))
        && (Array.isArray(value))
    ) {
      if (value.length) {
        return true;
      } else {
        return false;
      }
    }
    if (
        ('object' == typeof (value))
        && (!Array.isArray(value))
    ) {
      if (value.length) {
        return true;
      } else {
        return false;
      }
    }
    if ('string' == typeof (value)) {
      if (
          ('false' == value.trim().toLowerCase())
          || (!value.trim().length)
      ) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  },

  isArray: function(value) {
    // Expects string
    if (
        ('object' == typeof (value))
        && (Array.isArray(value))
    ) {
      return true;
    }
    return false;
  },

  isBoolean: function(value) {

    if ('string' == typeof (value)) {

      return (('false' == value) || ('true' == value)) ? true : false;

    } else if ('boolean' == typeof (value)) {

      return true;

    } else if ('number' == typeof (value)) {

      if (
          (1 == value)
          || (0 === value)
          || (-1 == value)
      ) {
        return true;
      } else {
        return false;
      }

    }

    return false;

  },

  isDate: function(value) {
    // TODO: This could do a lot more obv
    if ('date' == typeof (value)) {
      return true;
    }
    return false;
  },

  isFunction: function(value) {
    if ('function' == typeof (value)) {
      return true;
    }
    return false;
  },

  isInteger: function(value) {

    if ('number' == typeof (value)) {
      return true;
    } else if (/^\d*$/.test(value)) {
      return true;
    }

    return false;

  },

  isNAN: function(value) {
    // Expects string
    if (value !== value) {
      return true;
    }
    return false;
  },

  isObject: function(value) {
    // Expects string
    if (
        ('object' == typeof (value))
        && (!Array.isArray(value))
    ) {
      return true;
    }
    return false;
  },

  isString: function(value, min, max) {

    if ('string' == typeof (value)) {
      value = value.trim();
      // Check vs min & max length
      if (MP.isInteger(min) && MP.isInteger(max)) {
        if (
            (min <= value.length)
            && (max >= value.length)
        ) {
          return true;
        } else {
          return false;
        }
      }
      // Check vs min length
      if (MP.isInteger(min)) {
        if (min <= value.length) {
          return true;
        } else {
          return false;
        }
      }
      // Check vs max length
      if (MP.isInteger(max)) {
        if (max <= value.length) {
          return true;
        } else {
          return false;
        }
      }
      // Nothing passed, still string
      if (!min && !max) {
        return true;
      }
    }

    // Not a string
    return false;

  },

  localFileExists: function(value) {
    // Expects string
    // TODO: Ultimately this should check for file existence
    if ('string' == typeof (value)) {
      return true;
    }
    return false;
  },

  stringToSlug: function(string) {

    if (!MP.isString(string)) {
      return false;
    }
    var slug = string.toLowerCase().trim();

    // TODO: Node transliterate

    // Convert non-alpha chars to - cuz I hate typing _
    slug = slug.replace(/[\W]/g, '-');
    // Consolidate multiple hyphens
    slug = slug.replace(/-{2,}/g, '-');

    return slug;

  },

  urlExists: function(value) {
    //TODO
  },

  events: {

    pageEditorNavigationValidation: function(event) {

      var item    = $(event.target).attr('name');
      var isEmpty = function(name) {
        if (!$('[name=' + name + ']').val().length) return true;
      }
      var isValid = {
        'contentHeadline': function() {
          var headline = $('[name=contentHeadline]').val().trim();
          return (MP.isValidHeadline(headline)) ? true : false;
        },
        'contentSummary': function() {
          var summary = $('[name=contentSummary]').val().trim();
          return (MP.isValidSummary(summary)) ? true : false;
        },
        'navigationTitle': function() {
          // return headline xor title empty, auto-fill
          var title = $('[name=navigationTitle]').val().trim();
          return (MP.isValidTitle(title)) ? true : false;
        },
        'navigationSlug': function() {
          var slug = $('[name=navigationSlug]').val().trim();
          return (MP.isValidSlug(slug)) ? true : false;
        },
        'navigationBSG': function() {
          var bsg = $('[name=navigationBSG]').val().trim();
          return (MP.isValidBSG(bsg)) ? true : false;
        },
        'navigationFAI': function() {
          var fai = $('[name=navigationFAI]').val().trim();
          return (MP.isValidFAI(fai)) ? true : false;
        },

      }

      if (!$(event.target).val().length) {
        // Reset
        $(event.target).prev().children('.fa').removeClass('fa-flag text-danger fa-flag-checkered text-success');
        $(event.target).prev().children('.fa').addClass('fa-flag-o');
      } else if (MP.isString(item) && MP.isFunction(isValid[item]) && isValid[item]()) {
        // Compliant with validation rules
        $(event.target).prev().children('.fa').removeClass('fa-flag fa-flag-o text-danger');
        $(event.target).prev().children('.fa').addClass('fa-flag-checkered text-success');
      } else {
        // Non-compliant
        $(event.target).prev().children('.fa').removeClass('fa-flag-o text-danger fa-flag-checkered text-success');
        $(event.target).prev().children('.fa').addClass('fa-flag text-danger');
      }

      if (
          isValid['contentHeadline']()
          && isValid['contentSummary']()
          && isValid['navigationTitle']()
          && isValid['navigationSlug']()
      ) {
        // Set bar icon to checkered
        $('#mp-page-editor-toggle-navigation').children('i').removeClass('fa-flag-o fa-flag-checkered');
        $('#mp-page-editor-toggle-navigation').children('i').addClass('fa-flag-checkered');
      } else if (
          isEmpty('contentHeadline')
          && isEmpty('contentSummary')
          && isEmpty('navigationTitle')
          && isEmpty('navigationSlug')
      ) {
        // Set bar icon to empty
        $('#mp-page-editor-toggle-navigation').children('i').removeClass('fa-flag fa-flag-checkered');
        $('#mp-page-editor-toggle-navigation').children('i').addClass('fa-flag-o');
      } else {
        // Set bar icon to full
        $('#mp-page-editor-toggle-navigation').children('i').removeClass('fa-flag-o fa-flag-checkered');
        $('#mp-page-editor-toggle-navigation').children('i').addClass('fa-flag');
      }


    },

  },

}
