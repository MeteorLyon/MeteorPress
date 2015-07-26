console.log ('INFO Loading #MeteorPress routes');
/**
 * Root Route
 *
 * TODO:
 *      Any non-existent route should open that route's edit template
 *      Any existing route should be able to be edited in place
 *          by switching to that route's edit template
 *      Any text content should eventually be editable in place
 *      Options allowAnonymousCreating
 *      Options allowAnonymousEditing
 *
 *      Obviously, all edit templates should be predictably named
 *
 *      Eventually, each template should have a loading template
 *         which is actually a cached version of itself w/static
 *         html, eh!
 *
 */
    // Normal Routing
    Router.configure({

        /*
       onBeforeAction: function () {
            if (MP.isInMaintenanceMode()) {
                // If admin, this.next()
                // If this.route == 'mpAuthentication', this.next()
                // else
                    // this.go('mpMaintenanceMode');
            } else if (MP.forceLogin() && !Meteor.userId()) {
                // Could also use this.route.layoutTemplate or some ish
                this.go('mpAuthentication');
            } else {
                // Startup is nominal
                this.next();
            }
        },
        waitOn: function () {
            return [
                Meteor.subscribe('mpconfiguration'),
            ];
        },
        */
            

    });

    Router.route('/admin', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminDashboard',
    });

    Router.route('/admin/config', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminConfiguration',
    });

    Router.route('/admin/news', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminNews',
    });

    Router.route('/admin/pages', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminPages',
    });

    Router.route('/admin/posts', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminPosts',
    });

    Router.route('/admin/roles', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminRoles',
    });

    Router.route('/admin/users', {
        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAdminUsers',
    });

    Router.route('/authenticate', {

        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpAuthenticate',

    });

    Router.route('/', {

        layoutTemplate: 'mpRoot',
        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpHome',

        /*
         * could do this from template renders if it
         * continues to be a problem
         *
        onRun: function () {
            if (MP.enableGoogleAnalytics) {
                Meteor.setTimeout (function () {
                    // This thing is suuuuper slow
                    GAnalytics.pageview('/');
                }, 3000);
            }
        },
        */

    });

    // Installation routes
    Router.route('/install', {

        loadingTemplate: 'mpLoadingFullScreen',
        name: 'mpInstallWelcome',

    });

    Router.route('/install/loginkeys', {

        onBeforeAction: function () { 
            if (MP.isInstalled()) {
                Router.go('mpHome');
            } else {
                this.next() 
            }
        },
        name: 'mpInstallLoginKeys',

    });

    Router.route('/install/googleanalytics', {

        onBeforeAction: function () { 
            if (MP.isInstalled()) {
                Router.go('mpHome');
            } else {
                this.next() 
            }
        },
        name: 'mpInstallGoogleAnalytics',

    });

    Router.route('/install/kadira', {

        onBeforeAction: function () { 
            if (MP.isInstalled()) {
                Router.go('mpHome');
            } else {
                this.next() 
            }
        },
        name: 'mpInstallKadira',

    });

    Router.route('/install/configuration', {

        onBeforeAction: function () { 
            if (MP.isInstalled()) {
                Router.go('mpHome');
            } else {
                this.next() 
            }
        },
        name: 'mpInstallConfiguration',

    });

    Router.route('/install/defaultcontent', {

        name: 'mpInstallDefaultContent',

    });

    Router.route('/install/success', {

        name: 'mpInstallSuccess',

    });

    Router.route('/install/failure', {

        name: 'mpInstallFailure',

    });

    Router.route('/install/superuser', {

        onBeforeAction: function () { 
            if (MP.isInstalled()) {
                Router.go('mpHome');
            } else {
                this.next() 
            }
        },
        name: 'mpInstallSuperUser',

    });




/*
Router.route('mpPostPage', {
    path: '/blog/:_id',
    path: '/blog/:slug',
    waitOn: function() {
        return [
            Meteor.subscribe('mpposts'),
            // Meteor.subscribe('postSingle', this.params._id),
            // Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    },
});


Router.route('mpPageSingle', {
    path: '/:slug',
    waitOn: function() {
        return [
            Meteor.subscribe('pages'),
            Meteor.subscribe('pageSingle', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    },
});

Router.route('pageList', {
    path: '/:pageLimit?',
    controller: PageListController,
})

Router.route('postList', {
    path: '/:postLimit?',
    controller: PostListController,
})
*/
