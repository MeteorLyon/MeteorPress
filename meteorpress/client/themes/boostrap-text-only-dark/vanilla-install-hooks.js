/** Normally, I organize my files alphabetically, but this
        and its complimentary hooks are in procedural order */

Template.mpInstallWelcome.events ({

    'click #mp-install-welcome-next': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallSuperUser');

    },

});

Template.mpInstallSuperUser.onRendered (function () {

    $('.mp-fc-required').attr('placeholder', 'Required');
    $('.mp-fc-optional').attr('placeholder', 'Optional');
    $('.mp-fc-required').before('<i class="fa fa-flag-o"></i>');
    $('.mp-fc-optional').before('<i class="fa fa-flag-o invisible"></i>');

});

Template.mpInstallSuperUser.events ({

    'blur .form-control': function (event, template) {
        $(event.target).siblings('.mp-form-help').hide(200);
    },

    'focus .form-control': function (event, template) {
        $(event.target).siblings('.mp-form-help').show(300);
    },

    'blur .mp-fc-required': function (event, template) {

        // TODO: All this validation stuff should be MP methods

        var item    = $(event.target).attr('name');
        var value   = $(event.target).val();
        var isValid = {
            // Note: Any changes here need to also be made in following
            //       event until re-factored
            'username': function () {
                if (/^\w{1,15}$/.test(value)) return true;
            },
            'email': function () {
                if (/[^@]{1,}[@]{1}[^@]{1,}/.test(value)) return true;
            },
            'password': function () {
                if (/^.{8,255}$/.test(value)) return true;
            },
            'password-confirm': function () {
                if (
                    (/^.{8,255}$/.test(value))
                    && ($('[name=password]').val() == value)
                ) return true;
            },
            'imageURL': function () {
                return true;
            },
        }

        if (!value) {
            // Reset
            $(event.target).siblings('.fa').removeClass('fa-flag');
            $(event.target).siblings('.fa').removeClass('fa-flag-checkered');
            $(event.target).siblings('.fa').addClass('fa-flag-o');
        } else if (isValid[item]()) {
            // Show green check
            $(event.target).siblings('.fa').removeClass('fa-flag-o');
            $(event.target).siblings('.fa').removeClass('fa-flag');
            $(event.target).siblings('.fa').addClass('fa-flag-checkered');
        } else {
            // Show red X
            $(event.target).siblings('.fa').removeClass('fa-flag-o');
            $(event.target).siblings('.fa').removeClass('fa-flag-checkered');
            $(event.target).siblings('.fa').addClass('fa-flag');
        }
        
    },

    'keyup .mp-fc-required': function (event, template) {

        // TODO: All this validation stuff should be MP methods

        var item    = $(event.target).attr('name');
        var value   = $(event.target).val();
        var isValid = {
            // Note: Any changes here need to also be made in following
            //       event until re-factored
            'username': function () {
                if (/^\w{1,15}$/.test(value)) return true;
            },
            'email': function () {
                if (/[^@]{1,}[@]{1}[^@]{1,}/.test(value)) return true;
            },
            'password': function () {
                if (/^.{8,255}$/.test(value)) return true;
            },
            'password-confirm': function () {
                if (
                    (/^.{8,255}$/.test(value))
                    && ($('[name=password]').val() == value)
                ) return true;
            },
            'imageURL': function () {
                return true;
            },
        }

        if (!value) {
            // Reset
            $(event.target).siblings('.fa').removeClass('fa-flag');
            $(event.target).siblings('.fa').removeClass('fa-flag-checkered');
            $(event.target).siblings('.fa').addClass('fa-flag-o');
        } else if (isValid[item]()) {
            // Show green check
            $(event.target).siblings('.fa').removeClass('fa-flag-o');
            $(event.target).siblings('.fa').removeClass('fa-flag');
            $(event.target).siblings('.fa').addClass('fa-flag-checkered');
        } else {
            // Show red X
            $(event.target).siblings('.fa').removeClass('fa-flag-o');
            $(event.target).siblings('.fa').removeClass('fa-flag-checkered');
            $(event.target).siblings('.fa').addClass('fa-flag');
        }
        
    },

    'click #mp-install-super-user-next': function (event, template) {

        var email    = $('[name=email]').val()      || '';
        var imageURL = $('[name=imageURL]').val()      || '';
        var password = $('[name=password]').val()   || '';
        var passwordC= $('[name=password-confirm]').val()   || '';
        var user     = {};
        var username = $('[name=username]').val()   || '';

        var isValid = {
            // Note: Any changes here need to also be reflected server-side
            'username': function () {
                if (/^\w{1,15}$/.test(username)) return true;
            },
            'email': function () {
                if (/[^@]{1,}[@]{1}[^@]{1,}/.test(email)) return true;
            },
            'password': function () {
                if (/^.{8,255}$/.test(password)) return true;
            },
            'password-confirm': function () {
                if (
                    (/^.{8,255}$/.test(passwordC))
                    && (password == passwordC)
                ) return true;
            },
            'imageURL': function () {
                return true;
            },
        }


        // Validate data
        if (
            isValid['username']()
            && isValid['email']()
            && isValid['password']()
            && isValid['password-confirm']()
            && isValid['imageURL']()
        ) {
            
            // Formulate user object
            user = {
                username:   username,
                email:      email,
                password:   password,
                profile:    {
                    name:   username,
                    image: imageURL
                },
            };

            // Create user
            Accounts.createUser (user, function (error) {

                var id = null;

                // Check it
                if (error) {
                    // Failure
                    MP.log ('INFO Failed to create super user account', 2);
                } else {

                    // Success, add roles
                    newUser = mpUsers.findOne();
                    newUser = _.omit(newUser, 'services');
                    newUser.createdAt = new Date();
                    newUser.IPs = [Meteor.userIp];

                    if (newUser) {
                        // Add user to admin roles
                        // Roles.addUsersToRoles(newUser._id, ['Administrator', 'SuperUser'], 'mpAdmins');
                        // Save to super users
                        mpSuperUsers.insert(newUser, function (error, id) {
                            if (id) { 
                                Router.go('mpInstallLoginKeys'); 
                            }
                        });
                    } else {
                        // Failure
                        MP.log ('INFO Failed to retrieve new super user details', 2);
                    }

                }

            });

            return false;

        } else {

            // Did not pass validation
            // Show help & checks/Xs
            MP.log ('ERROR Improper parameters in attempt to create super user', 2);
            return false;

        }

    },

    'click #mp-install-super-user-back': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallWelcome');

    },

});

Template.mpInstallSuperUser.helpers ({

    'mpInstallSuperUserSchema': function () {

        return mpSchemas.mpInstallSuperUser;

    },

});

Template.mpInstallSuperUser.onRendered (function () {

    // If there is already users in the database, do not allow user to proceed
    if (mpUsers.find().count()) {

        alert ('User accounts exist, cannot run this procedure twice!');
        Router.go('mpInstallLoginKeys');

    }

});

Template.mpInstallLoginKeys.events ({

    'click .mp-install-toggle': function (event, template) {

        $(event.target).next().toggle(250);

    },

    'click .mp-install-help-content': function (event, template) {
        
        $('.mp-install-help-content').hide(300);

    },

    'click .vert-center': function (event, template) {
        
        return false;

    },

    'click #trigger-facebook': function (event, template) {
        
        $('#help-facebook').toggle(300);

    },

    'click #trigger-github': function (event, template) {
        
        $('#help-github').toggle(300);

    },

    'click #trigger-google': function (event, template) {
        
        $('#help-google').toggle(300);

    },

    'click #trigger-meetup': function (event, template) {
        
        $('#help-meetup').toggle(300);

    },

    'click #trigger-meteor-developer': function (event, template) {
        
        $('#help-meteor-developer').toggle(300);

    },

    'click #trigger-twitter': function (event, template) {
        
        $('#help-twitter').toggle(300);

    },

    'click #trigger-weibo': function (event, template) {
        
        $('#help-weibo').toggle(300);

    },

    'click #mp-install-login-keys-next': function (event, template) {

        // TODO: Validate keys properly

        var error                   = false;
        var sets                    = [];
        var facebookKey             = $('[name=facebookKey]').val()             || '';
        var facebookSecret          = $('[name=facebookSecret]').val()          || '';
        var githubKey               = $('[name=githubKey]').val()               || '';
        var githubSecret            = $('[name=githubSecret]').val()            || '';
        var googleKey               = $('[name=googleKey]').val()               || '';
        var googleSecret            = $('[name=googleSecret]').val()            || '';
        var meetupKey               = $('[name=meetupKey]').val()               || '';
        var meetupSecret            = $('[name=meetupSecret]').val()            || '';
        var meteorDeveloperKey      = $('[name=meteorDeveloperKey]').val()      || '';
        var meteorDeveloperSecret   = $('[name=meteorDeveloperSecret]').val()   || '';
        var twitterKey              = $('[name=twitterKey]').val()              || '';
        var twitterSecret           = $('[name=twitterSecret]').val()           || '';
        var weiboKey                = $('[name=weiboKey]').val()                || '';
        var weiboSecret             = $('[name=weiboSecret]').val()             || '';

        // Create insertion sets
        if (facebookKey && facebookSecret) {
            sets.push({
                service: 'facebook',
                key: facebookKey,
                secret: facebookSecret
            });
        }
        if (githubKey && githubSecret) {
            sets.push({
                service: 'github',
                key: githubKey,
                secret: githubSecret
            });
        }
        if (googleKey && googleSecret) {
            sets.push({
                service: 'google',
                key: googleKey,
                secret: googleSecret
            });
        }
        if (meetupKey && meetupSecret) {
            sets.push({
                service: 'meetup',
                key: meetupKey,
                secret: meetupSecret
            });
        }
        if (meteorDeveloperKey && meteorDeveloperSecret) {
            sets.push({
                service: 'meteor-developer',
                key: meteorDeveloperKey,
                secret: meteorDeveloperSecret
            });
        }
        if (twitterKey && twitterSecret) {
            sets.push({
                service: 'twitter',
                key: twitterKey,
                secret: twitterSecret
            });
        }
        if (weiboKey && weiboSecret) {
            sets.push({
                service: 'weibo',
                key: weiboKey,
                secret: weiboSecret
            });
        }

        // Validate data
        if (sets.length) {
            // Remove pre-existing if found
            _.each(ServiceConfiguration.configurations.find().fetch(), function (object) {
                if (object._id) {
                    ServiceConfiguration.configurations.remove({_id: object._id});
                }
            });

            // Insert service configurations
            _.each(sets, function (object) {
                switch(object.service) {
                case 'facebook':
                    ServiceConfiguration.configurations.insert({
                            service: object.service,
                            clientId: object.key, 
                            loginStyle: 'popup',
                            secret: object.secret
                        },
                        function (error, id) {
                            if (!id)  error = true;
                        }
                    );
                    break;
                case 'twitter':
                    ServiceConfiguration.configurations.insert({
                            service: object.service,
                            consumerKey: object.key, 
                            loginStyle: 'popup',
                            secret: object.secret
                        },
                        function (error, id) {
                            if (!id)  error = true;
                        }
                    );
                    break;
                default:
                    ServiceConfiguration.configurations.insert({
                            service: object.service,
                            consumerKey: object.key, 
                            loginStyle: 'popup',
                            secret: object.secret
                        },
                        function (error, id) {
                            if (!id)  error = true;
                        }
                    );
                } // End switch
            });

            // Check it
            if (error || !ServiceConfiguration.configurations.findOne()) {

                // Failure
                MP.log ('ERROR Errors trying to process login keys', 2);
                ServiceConfiguration.configurations.remove({});
                return false;

            } else {

                // Success
                $('#mp-installer-container').hide(300);
                Router.go('mpInstallGoogleAnalytics'); 

            }

        } else {

            // Did not pass validation
            MP.log ('ERROR Improper parameters in attempt to install service keys', 2);
            return false;

        }

    },

    'click #mp-install-login-keys-back': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallSuperUser');

    },

});

Template.mpInstallLoginKeys.helpers ({

    'mpInstallLoginKeysSchema': function () {

        return mpSchemas.mpInstallLoginKeys;

    },

});

Template.mpInstallLoginKeys.onRendered (function () {

    template = this;

    $('.mp-install-toggle').next().hide();

    // TODO: Look for existing values
        // Set values as form values

});

Template.mpInstallGoogleAnalytics.events ({

    'click #mp-install-google-analytics-next': function (event, template) {

        var set       = {};
        var key       = $('[name=key]').val();

        // User may skip
        if (!key.length) {
            $('#mp-installer-container').hide(300);
            Router.go('mpInstallKadira'); 
        }

        // Create insertion set
        // TODO: Validate better
        if (key) {
            set = {
                name: 'gaKey',
                key: key,
            }
        } else {

            // Did not pass validation
            MP.log ('ERROR Improper parameters in attempt to install GA keys', 2);
            return false;

        }


        // Remove pre-existing if found
        _.each(mpSingletons.find({name: 'gaKey'}).fetch(), function (object) {
            if (object._id) {
                mpSingletons.remove({_id: object._id});
            }
        });

        mpSingletons.insert(set, function (error, id) {
            if (id) {

                // Success
                $('#mp-installer-container').hide(300);
                Router.go('mpInstallKadira'); 
                
            } else {

                // Failure
                MP.log ('ERROR Errors trying to insert GA keys', 2);
                mpSingletons.remove({name: 'gaKey'});
                return false;

            }
        });

    },

    'click #mp-install-google-analytics-back': function () {

        // Move to next installation route
        Router.go('mpInstallLoginKeys');

    },

    'click .mp-install-help-content': function () {
        
        $('.mp-install-help-content').hide(300);

    },

    'click #trigger-instructions': function () {
        
        $('#help-google').toggle(300);

    },

});

Template.mpInstallGoogleAnalytics.helpers ({

});

Template.mpInstallGoogleAnalytics.onRendered (function () {

    template = this;


    // Look for existing values
        // Set values as form values

});

Template.mpInstallKadira.events ({

    'click #mp-install-kadira-next': function (event, template) {

        var set       = {};
        var key       = $('[name=key]').val();
        var secret    = $('[name=secret]').val();

        // User may skip
        if (!key.length && !secret.length) {
            $('#mp-installer-container').hide(300);
            Router.go('mpInstallConfiguration'); 
        }

        // Create insertion set
        // TODO: Validate better
        if (key && secret) {
            set = {
                name: 'kadiraKeys',
                key: key,
                secret: secret
            }
        } else {

            // Did not pass validation
            MP.log ('ERROR Improper parameters in attempt to install Kadira keys', 2);
            return false;

        }


        // Remove pre-existing if found
        _.each(mpSingletons.find({name: 'kadiraKeys'}).fetch(), function (object) {
            if (object._id) {
                mpSingletons.remove({_id: object._id});
            }
        });

        mpSingletons.insert(set, function (error, id) {
            if (id) {

                // Success
                $('#mp-installer-container').hide(300);
                Router.go('mpInstallConfiguration'); 
                
            } else {

                // Failure
                MP.log ('ERROR Errors trying to insert Kadira keys', 2);
                mpSingletons.remove({name: 'kadiraKeys'});
                return false;

            }
        });

    },


    'click #mp-install-kadira-back': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallGoogleAnalytics');

    },

    'click .mp-install-help-content': function (event, template) {
        
        $('.mp-install-help-content').hide(300);

    },

    'click #trigger-instructions': function (event, template) {
        
        $('#help-google').toggle(300);

    },

});

Template.mpInstallKadira.helpers ({

});

Template.mpInstallKadira.onRendered (function () {

    template = this;

});

Template.mpInstallConfiguration.events ({

    'click #mp-install-configuration-next': function (event, template) {

        // Collect form data object for submission
        var config = {

            debug:                  $('[name=debug]').val()                   || false,
            enableAutoLoad:         $('[name=enableAutoLoad]').val()          || false,
            enableAutoReader:       $('[name=enableAutoReader]').val()        || false,
            enableBanWords:         $('[name=enableBanWords]').val()          || false,
            enableBanWordsReplace:  $('[name=enableBanWordsReplace]').val()   || false,
            enableFeatured:         $('[name=enableFeatured]').val()          || false,
            enableKadira:           $('[name=enableKadira]').val()            || false,
            enableLogin:            $('[name=enableLogin]').val()             || false,
            enableLoginWithFacebook:$('[name=enableLoginWithFacebook]').val() || false,
            enableLoginWithGithub:  $('[name=enableLoginWithGithub]').val()   || false,
            enableLoginWithGoogle:  $('[name=enableLoginWithGoogle]').val()   || false,
            enableLoginWithMeetup:  $('[name=enableLoginWithMeetup]').val()   || false,
            enableLoginWithMeteorDeveloper: $('[name=enableLoginWithMeteorDeveloper]').val() || false,
            enableLoginWithPassword:$('[name=enableLoginWithPassword]').val() || false,
            enableLoginWithTwitter: $('[name=enableLoginWithTwitter]').val()  || false,
            enableLoginWithWeibo:   $('[name=enableLoginWithWeibo]').val()    || false,
            enableMPMarkDown:       $('[name=enableMPMarkDown]').val()        || false,
            enableMaintenanceMode:  $('[name=enableMaintenanceMode]').val()   || false,
            enableNews:             $('[name=enableNews]').val()              || false,
            enablePages:            $('[name=enablePages]').val()             || false,
            enablePlugins:          $('[name=enablePlugins]').val()           || false,
            enablePosts:            $('[name=enablePosts]').val()             || false,
            enableSticky:           $('[name=enableSticky]').val()            || false,
            enableThemes:           $('[name=enableThemes]').val()            || false,
            enableTwitter:          $('[name=enableTwitter]').val()           || false,
            limitGetters:           $('[name=limitGetters]').val()            || 100,
            limitPublish:           $('[name=limitPublish]').val()            || 100,
            logLevel:               $('[name=logLevel]').val()                || 2,
            siteDescription:        $('[name=siteDescription]').val()         || 'Free & open source software using cutting edge #MeteorJS technology to provide the ultimate in content management systems for the real-time web',
            siteTagLine:            $('[name=siteTagLine]').val()             || 'Revolutionizing content management',
            siteTitle:              $('[name=siteTitle]').val()               || '#MeteorPress by @iDoMeteor',
            webmasterEmail:         $('[name=webmasterEmail]').val()          || 'idometeor@gmail.com',
        
        };

        _.each(config, function (value, key) {
            if ('true' == value) config[key] = true;
            if ('false' == value) config[key] = false;
            if (/^\d*$/.test(value)) config[key] = parseInt(value);
            if (value !== value) config[key] = null;
        });

        // Remove pre-configuration if found
        _.each(mpConfiguration.find({}).fetch(), function (object) {
            if (object._id) {
                mpConfiguration.remove({_id: object._id});
            }
        });

        // Do it
        AutoForm.debug();
        mpConfiguration.insert(config, function (error, id) {
            if (id) {

                // Success
                $('#mp-installer-container').hide(300);
                Router.go('mpInstallDefaultContent'); 
                
            } else {

                // Failure
                MP.log ('ERROR Errors trying to insert configuration', 2);
                MP.log (JSON.stringify(config, null, 4), 2);
                return false;

            }
        });

    },

    'click #mp-install-configuration-back': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallKadira');

    },

});

Template.mpInstallConfiguration.helpers ({

    collectionConfiguration: function () {
        return mpConfiguration;
    },

    defaultConfigObject: function () {
        return mpDefaultConfig;
    },

    siteTitle: function () {
        return '#MeteorPress by @iDoMeteor';
    },

    siteTagLine: function () {
        return 'Content Management for the real-time web';
    },

    siteDescription: function () {
        return '#MeteorPress is a free and open source content management solution based on #MeteorJS by @iDoMeteor';
    },

    webmasterEmail: function () {
        return 'Critical@Notifications.com';
    },

    enableGoogleAnalytics: function () {

        // Check for service keys
        ga = mpSingletons.findOne({name: 'gaKey'});

        return (ga && ga._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableKadira: function () {

        // Check for service keys
        kadira = mpSingletons.findOne({name: 'kadiraKeys'});

        return (kadira && kadira._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithFacebook: function () {

        // Check for service keys
        fb = ServiceConfiguration.configurations.findOne({service: 'facebook'});

        return (fb && fb._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithGithub: function () {

        // Check for service keys
        gh = ServiceConfiguration.configurations.findOne({service: 'github'});

        return (gh && gh._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithGoogle: function () {

        // Check for service keys
        g = ServiceConfiguration.configurations.findOne({service: 'google'});

        return (g && g._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithMeetup: function () {

        // Check for service keys
        m = ServiceConfiguration.configurations.findOne({service: 'meetup'});

        return (m && m._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithMeteorDeveloper: function () {

        // Check for service keys
        md = ServiceConfiguration.configurations.findOne({service: 'meteor-developer'});

        return (md && md._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithTwitter: function () {

        // Check for service keys
        t = ServiceConfiguration.configurations.findOne({service: 'twitter'});

        return (t && t._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

    enableLoginWithWeibo: function () {

        // Check for service keys
        w = ServiceConfiguration.configurations.findOne({service: 'weibo'});

        return (w && w._id) ? (
            // Enable
            true
        ) : (
            // Disable
            false
        )

    },

});

Template.mpInstallDefaultContent.events ({

    'click #mp-install-default-content-back': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallConfiguration');

    },

    'click #mp-install-default-content-no': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallSuccess');

    },

    'click #mp-install-default-content-yes': function (event, template) {

        // TODO:
        // Run default content installation
        alert ('There is no default content yet! :x');

        // Move to next installation route
        Router.go('mpInstallSuccess');
        // Router.go('mpInstallFailure');

    },

});

Template.mpInstallSuccess.events ({

    'click #mp-install-success': function (event, template) {

        // Activate everything
        var config = mpConfiguration.findOne();
        MP.config = config;
        _.extend(MP, config);

        // Go home! :D
        Router.go('/');
        // TODO: Might need to force reload

    },

});

Template.mpInstallFailure.events ({

    'click #mp-install-failure': function (event, template) {

        // Move to next installation route
        Router.go('mpInstallWelcome');

    },

});
