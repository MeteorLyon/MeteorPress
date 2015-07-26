console.log ('INFO Loading #MeteorPress theme: Bootstrap-Text-Only');
/******************************************************************************
 *
 * MeteorPress Template Things
 *
 * TODO:
 *      This should eventually determine the selected theme and load
 *      appropriately.  Theme files will be provided with sane, super
 *      easy ways to tell if they are the active theme and should not
 *      run any code or load any html/css if not.  It might take a few
 *      magic tricks, but I'll figure it out shortly. :)
 *      .. and each admin interface should prominently feature
 *      a simple enable/disable function (MP intends to provide
 *      a standard slider interface for you!
 *
 * ***************************************************************************/

/** Global helpers **/
UI.registerHelper ('mpIsAdmin', function () {
    return MP.isAdmin(Meteor.userId());
});

UI.registerHelper ('mpIsSuperUser', function () {
    return MP.isSuperUser(Meteor.userId());
});

// Shot in the dark
UI.registerHelper ('mpIsInstalled', function () {
   return (
       (mpSuperUsers.findOne())
       && (mpConfiguration.findOne())
   ) ? true : Router.go('mpInstallWelcome'), false;

});

// Register global toggles
/* it seems to hate this, check later
_.each(function (value, key) {
    UI.registerHelper(key, function () {
        return MP[key];
    });
});
*/


/** Template specific hooks */
/*
Template.mpAuthenticate.created(function () {

    if (MP.user()) {
        // Set message
        // Go back to where you came from
    }

});
*/

Template.mpAuthenticate.events ({

    'click #mp-auth-email-create': function () {
        var email    = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.call ('validateEmailAddress', email, function (error, response) {
            
        });
    },

    'click #mp-auth-email-login': function () {
        var email    = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword (email, password, function (error) {
            return (error) ? (
                // Set mpError
                MP.log('#MeteorPress login error: ' + error, 2),
                false
            ) : (
                Router.go('/'), 
                true
            )
        });
    },

    'click .mp-auth-email-form': function () {
        return false;
    },

    'click #mp-auth-facebook': function () {
        Meteor.loginWithFacebook({requestPermissions: ['email']}, function (error) {
            return (error) ? (
                // Set mpError
                MP.log('#MeteorPress login error: ' + error, 2),
                false
            ) : (
                // TODO: Count login
                Router.go('/'), // TODO: This should be breadcrumb'd 
                true
            )
        });
    },

    'click #mp-auth-twitter': function () {
        Meteor.loginWithTwitter(function (error) {
            return (error) ? (
                // Set mpError
                MP.log('#MeteorPress login error: ' + error, 2),
                false
            ) : (
                // TODO: Count login
                Router.go('/'), // TODO: This should be breadcrumb'd 
                true
            )
        });
    },

    'click .mp-lightbox-close': function () {
        $('.mp-lightbox').hide('fade');
    },


});

Template.mpAuthenticate.helpers ({

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

Template.mpContact.events ({
    
    /**
     *  User interacting w/contact form inputs
     */
    'focus .form-control': function(e) {
        // Clear prompt on entry
        $(e.target).val("");
    },

    'click .form-control': function(e) {

        // Prevent bootstrap from closing contact form
        $(e.currentTarget).parent().parent().on('hide.bs.dropdown', function () {
            return false;
        });
        e.stopPropagation();
        
        return false;

    },

    /**
     * Insert contact data into log
     *
     * TODO:
     *      Only need message if logged in!
     */
    'keypress .form-control': function (e) {

        // Do nothing unless enter pressed
        if (e.which === 13) {

            // Populate stuff we need
            var id = e.currentTarget.id;
            var name = $('#contact-name').val().trim();
            var twitter = $('#contact-twitter').val().trim();
            var mail = $('#contact-mail').val().trim();
            var mesg = $('#contact-mesg').val().trim();
            var defaultName = Strings.contactName;
            var defaultTwitter = Strings.contactTwitter;
            var defaultMail = Strings.contactMail;
            var defaultMesg = Strings.contactMesg;
            var successMesg = Strings.contactRcpt;

            // Check everything
            switch (id) {
                case 'mp-contact-name':
                    if (!name) {
                        errorThrow("Please enter your name");
                        $('#mp-contact-name').focus();
                        return false;
                    } else {
                        $('#' + id).next().focus();
                        return false;
                    }
                    break;
                case 'mp-contact-twitter':
                        $('#' + id).next().focus();
                        return false;
                    break;
                case 'mp-contact-mail':
                    if (!mail) {
                        errorThrow("Please provide your email, I will not send you unsolicited messages");
                        $('#mp-contact-mail').focus();
                        return false;
                    } else {
                        $('#' + id).next().focus();
                        return false;
                    }
                    break;
                case 'mp-contact-mesg':
                    if (!name) {
                        errorThrow("Please enter your name");
                        $('#mp-contact-name').focus();
                        return false;
                    }
                    if (!mail) {
                        errorThrow("Please provide your email");
                        $('#mp-contact-mail').focus();
                        return false;
                    }
                    if (!mesg) {
                        errorThrow("Please provide a message");
                        $('#mp-contact-mesg').focus();
                        return false;
                    }
                    break;
            }

            // They made it, format document
            contactId = mpLogContact.insert({
                name: name,
                twitter: twitter,
                email: mail,
                message: mesg,
                ip: Meteor.userIp,
                stamp: new Date().getTime()
            });

            if (!contactId) {
                // Failure
                errorThrow("Failure, please try again");
                $('#contact-mesg').focus();
                return false;
            } else {
                // Success, clear values and close form
                $('#contact-name').val("");
                $('#contact-twitter').val("");
                $('#contact-mail').val("");
                $('#contact-mesg').val(successMesg);
                Meteor.setTimeout (function() {
                    $('#mp-contact').parent().dropdown('toggle');
                }, 2000);
                return true;
            }

        // End keypress === 13
        }
       
   // End keypress
   }

// End events
});

Template.mpContact.helpers ({

    promptName: function () {
        return Strings.contactName;
    },
    promptTwitter: function () {
        return Strings.contactTwitter;
    },
    promptMail: function () {
        return Strings.contactMail;
    },
    promptMesg: function () {
        return Strings.contactMesg;
    }
});

/*
 * Errors template helpers
 */
Template.mpErrors.helpers({
    errors: function() {
        var e = mpErrors.find();
        if (e.count() > 0) {
            // $('#iron-router-progress').hide();
        }
        return e;
    }
});

/*
 * Error template triggers
 */
Template.mpError.events({
    
    /*
     * Change error seen flag to true when dismissed
     */
    'click button': function(e) {
        errorClear(e.currentTarget.id);
    },

});

Template.mpFooter.helpers ({

    MeteorPressVersion: function () {
        return Strings.MPVersion;
    },

});

Template.mpFooter.rendered = function () {

    // External links
    $('a[rel="external"]').attr('target', '_blank');

}

Template.mpHome.helpers ({
    

    mpPagesFeatured: function () {
        return mpPages.find({}, {sort: {'content.sort': 1, 'content.headline': 1}});
    },

    mpPostsFeatured: function () {
        return mpPosts.find({}, {sort: {stamp: -1}});
    },


});

Template.mpHome.rendered = function () {

    /*
        if (!MP.isInstalled) {
            Router.go('mpInstallWelcome');
        }
    */

}

Template.mpMakePayment.rendered = function () {

    // Git Tip
    // !function(){"use strict";function a(a){return document.querySelectorAll(a)}var b=a("[data-gittip-username]"),c=b.length,d=window.Gittip||{},e=window.gttpAPI||"//gttp.co/v1/";if(window._gttp=window._gttp||[],!d.widgets&&!a('script[src="'+e+'api.js"]').length){var f=document.createElement("script");f.src=e+"api.js",a("head")[0].appendChild(f)}for(var g=0;c>g;g++){var h=b[g];h.getAttribute("data-gittip-readystatus")||(d.widgets?d.widgets.load(h):_gttp.push(h),h.setAttribute("data-gittip-readystatus","loading"))}}();

    // Coinbase donate Bitcoins
    // ((function(){var a;a=function(a,b,c,d){var e,f,g,h,i,j,k,l,m,n;n=[null,null,!1],g=n[0],f=n[1],j=n[2];if(g=a.jQuery)l=parseInt(c.split(".")[0])||0,m=parseInt(c.split(".")[1])||0,h=parseInt(g.fn.jquery.split(".")[0])||0,i=parseInt(g.fn.jquery.split(".")[1])||0,e=h>l||h===l&&i>=m;if(!g||!e||d(g,j))return k=b.createElement("script"),k.type="text/javascript",k.src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js",k.onload=k.onreadystatechange=function(){if(!j&&(!(f=this.readyState)||f==="loaded"||f==="complete"))return d((g=a.jQuery).noConflict(1),j=!0),g(k).remove()},(b.getElementsByTagName("head")[0]||b.documentElement).appendChild(k)},a(window,document,"1.7",function(a,b){var c,d,e,f;return d="https://coinbase.com",f=function(a){if(a==="development")return d="http://localhost:2000";if(a==="test")return d="http://"+window.document.location.host},e=function(b){var c,e,f;f=b.data.split("|"),e=f[0],c=f[1],c=escape(c);if(b.origin!==d)return;if(e==="show modal iframe")return a("#coinbase_modal_iframe_"+c).show();if(e==="mark paid")return a("#coinbase_button_iframe_"+c).attr("src",d+"/buttons/paid"),a(document).trigger("coinbase_payment_complete",c);if(e==="hide modal")return a("#coinbase_modal_iframe_"+c).hide(),a(document).trigger("coinbase_modal_closed",c);if(e==="signup redirect")return document.location=d+"/users/verify"},c=function(a){switch(a){case"custom_large":return 249;case"custom_small":return 190;case"subscription_large":return 243;case"subscription_small":return 190;case"donation_large":return 189;case"donation_small":return 148;case"buy_now_small":return 150;default:return 191}},window.addEventListener("message",e,!1),f(a("body").data("env")),a(".coinbase-button").each(function(b){return function(b,e){var g,h,i,j,k,l;return g=a(e),i=g.data(),i.referrer=document.domain,k=a.param(i),h=g.data("code"),l=g.data("width")||c(g.data("button-style")),j=g.data("height")||46,f(g.data("env")),g.data("button-style")!=="none"&&g.replaceWith("<iframe src='"+d+"/buttons/"+h+"?"+k+"' id='coinbase_button_iframe_"+h+"' name='coinbase_button_iframe_"+h+"' style='width: "+l+"px; height: "+j+"px; border: none; overflow: hidden;' scrolling='no' allowtransparency='true' frameborder='0'></iframe>"),a("body").append("<iframe src='"+d+"/buttons/"+h+"/widget?"+k+"' id='coinbase_modal_iframe_"+h+"' name='coinbase_modal_iframe_"+h+"' style='background-color: transparent; border: 0px none transparent; overflow: hidden; display: none; position: fixed; visibility: visible; margin: 0px; padding: 0px; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;' scrolling='no' allowtransparency='true' frameborder='0'></iframe>")}}(this)),a(document).on("coinbase_show_modal",function(b,c){return a("#coinbase_modal_iframe_"+c).length>0?(a("#coinbase_modal_iframe_"+c).show(),frames["coinbase_modal_iframe_"+c].postMessage("show modal|"+c,d)):console.log("Could not find Coinbase modal with id 'coinbase_modal_iframe_"+c+"'.  Does this match the data-code attribute in your embed HTML?")})})})).call(this);

    // Gratipay
    // PayPal

}

Template.mpNavigationAdminMenu.events ({

    'click .mp-submenu-toggle': function (event) {
        if ('none' == $(event.target).next().css('display')) {
            $(event.target).siblings('ul').hide(200);
            $(event.target).next().toggle(200);
        } else {
            $(event.target).next().hide(200);
        }
    },

});

Template.mpNavigationRoot.events ({

    'click #mp-authenticate': function () {
        $('#mp-navigation-container').hide('slide', {direction: 'left'}, 750);
        $('#mp-navigation-closer').fadeOut(1000);
        $('#mp-tabs').show(300);
        // TODO: Should lightbox this (and just jquery toggle divs for email)
        Router.go('mpAuthenticate');
    },

    'click #mp-clear-authentication': function () {
        $('#mp-navigation-container').hide('slide', {direction: 'left'}, 750);
        $('#mp-navigation-closer').fadeOut(1000);
        $('#mp-tabs').show(300);
        Meteor.logout();
    },

    'click #mp-admin-toggle-maintenance': function () {

        // Check permissions
        if (MP.isNotSuperUser(MP.userId())) {
            MP.log('WARNING Unauthorized attempt to toggle maintenance mode by '
                   + MP.userName() + ' (' + MP.userId() + ')', 2);
        }

        // Show loading icon
        $('#mp-admin-toggle-maintenance').children('i').addClass('fa-spinner fa-pulse');

        // Assign values
        var uid     = MP.userId();
        var uname   = MP.userName();
        var current = MP.getConfig('enableMaintenanceMode');
        var future  = {
            uid: uid,
            key: 'enableMaintenanceMode',
            value: (current) ? false : true,    // Swap
        }
        var text    = (current) ? 'Enable Maintenance' : 'Disable Maintenance';

        // Validate
        MP.setConfig(future, function (result) {

            var msg = null;

            (result) ? (
                // Log it
                msg = 'SUCCESS Maintenance mode changed to ' + future.value
                        + ' by ' + uname,
                MP.log (msg, 2),
                // Flip menu classes
                $('#mp-admin-toggle-maintenance').toggleClass('text-warning text-danger', 500),
                // Alter menu text
                $('#mp-admin-toggle-maintenance-text').html(text),
                // Set alert
                MP.setAlert({uid: uid, 
                            type: 'Success', 
                            message: msg})
            ) : (
                // Log it
                msg = 'FAILURE Attempt to change maintenance mode to ' + future.value
                        + ' by ' + uname,
                MP.log (msg, 2),
                // Set alert
                MP.setAlert({uid: uid, 
                            type: 'Failure', 
                            message: msg})
            )

            // Remove loading icon
            $('#mp-admin-toggle-maintenance').children('i').removeClass('fa-spinner fa-pulse');

            return;

        });
    },

    'click .mp-root-toggle': function (event) {
        if ('none' == $(event.target).next().css('display')) {
            $(event.target).next().toggle(500);
        } else {
            $(event.target).next().hide(500);
        }
    },

});

Template.mpNavigationRoot.helpers({

    'maintenanceModeClass': function () {
        var uid = MP.userId();
        var config = mpConfiguration.findOne();
        var current = config.enableMaintenanceMode;
        if (MP.isSuperUser(uid)) {
            return (current) ? 'text-danger' : 'text-warning';
        }
    },

    'maintenanceModeText': function () {
        var uid = MP.userId();
        var config = mpConfiguration.findOne();
        var current = config.enableMaintenanceMode;
        if (MP.isSuperUser(uid)) {
            return (current) ? 'Disable Maintenance' : 'Enable Maintenance';
        }
    },

});

Template.mpNavigationUserMenu.events ({

    'click .mp-submenu-toggle': function (event) {
        if ('none' == $(event.target).next().css('display')) {
            $(event.target).siblings('ul').hide(200);
            $(event.target).next().toggle(200);
        } else {
            $(event.target).next().hide(200);
        }
    },

});

Template.mpNews.helpers ({
    

    mpNewsRecent: function () {
        return mpNews.find({}, {
            sort: {stamp: -1},
        });
    },

});

Template.mpMarkDownBar.events ({

    'click #mp-markdownbar-undo': function (event) {
        // TODO
    },

    'click #mp-markdownbar-redo': function (event) {
        // TODO
    },

    'click #mp-markdownbar-auto': function (event) {
        var value = '#auto\n' + $('#mp-page-editor-body').val();
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-header': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n#3';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-ul': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n\n\t*';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-audio': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n#audio name=';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-image': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n#image name=';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-video': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n#video name=';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-code': function (event) {
        var value = $('#mp-page-editor-body').val() + '\n#code\n\n##';
        $('#mp-page-editor-body').val(value);
    },

    'click #mp-markdownbar-help': function (event) {
    },

    'click #mp-markdownbar-more': function (event) {
    },

});

Template.mpPageEditor.events({

    'blur .form-control': function (event) {
        // ... ugly
        // $(event.target).siblings('.mp-form-help').hide('fade', 200);
        
        // Run keyup validations

    },

    'focus .form-control': function (event) {
        // $(event.target).siblings('.mp-form-help').show('fade', 300);
    },

    'keyup textarea': function (event) {

        /* TODO: Finish :)
        // Instantiate history buffer
        hBuff           = hBuff             || {};
        hBuff.curIndex  = hBuff.curIndex    || 0;
        hBuff.vals      = hBuff.vals        || [];

        // Locals
        var curIndex    = hBuff.curIndex;
        var curVal      = $(event.target).val();
        var keypress    = event.XXX;
        var state       = null;

        // Determine state
        if (
            ('^z' == keypress)
            || ('^u' == keypress)
        ) {
            state = 'undo';
        } else if (
            ('^y' == keypress)
            || ('^Sy' == keypress)
            || ('^r' == keypress)
        ) {
            state = 'redo';
        }

        // Decision tree
        switch (state) {
            case 'redo':
                // Step forward in history
                break;
            case 'undo':
                // Step backword in history
                break;
            default:
                hBuff.push(curVal);
        }
        */

    },

});

Template.mpPageEditor.helpers ({

    data: function () {
        return _.range(0,2);
    },

    mpDefaultPage: function () {
        return mpDefaultPage;
    },

    mpPETarget: function () {
        return mpExamplePage;
    },

});

Template.mpPageEditor.onRendered(function () {

    $('.mp-form-help').hide();

    $('.mp-fc-required').attr('placeholder', 'Required');
    $('.mp-fc-optional').attr('placeholder', 'Optional');
    $('.mp-fc-required').prev().append('<i class="float-right fa fa-flag-o"></i>');
    $('.mp-fc-optional').prev().append('<i class="float-right fa fa-flag-o invisible"></i>');

    if ($('#mp-pe-markdown-on').hasClass('btn-primary')) {
        $('#mp-pe-markdown-bar').removeClass('hide');
    } else {
        $('#mp-pe-markdown-bar').addClass('hide');
    }

});

Template.mpPageEditorAudio.events ({

    'click .mp-pe-add-audio': function (event) {

        // Locals
        var row    = $(event.target).closest('.mp-pe-audio-attachment');
        var link   = $(row).find('.mp-pe-audio-link').val();
        var title  = $(row).find('.mp-pe-audio-title').val();

        // Validate

        // Duplicate add card
        $(row).clone().insertAfter(row);

        // Reset original inputs
        $(row).find('.form-control').val('');
        $(row).find('audio').addClass('hide');

        // Set audio tag attributes and show
        $(row).next().find('audio').attr('title', title);
        $(row).next().find('audio').attr('src', link);
        $(row).next().find('audio').removeClass('hide');

        // Change new row's plus to minus
        $(row).next().find('.mp-pe-add-audio').addClass('hide');
        $(row).next().find('.mp-pe-remove-audio').removeClass('hide');

        // Assign events
        $(row).next().find('.mp-pe-remove-audio').on('click', function () {
            $(this).closest('.mp-pe-audio-attachment').remove();
        });

    },

    'keyup .mp-pe-audio-link': function (event) {

        var row     = $(event.target).closest('.mp-pe-audio-attachment');
        var url     = $(event.target).val();
        var target  = $(row).find('audio');

        if (url.length) {
            $(row).find('audio').attr('src', url);
            $(row).find('audio').removeClass('hide');
        } else {
            $(row).find('audio').attr('src', '');
            $(row).find('audio').addClass('hide');
        }

    },

});

Template.mpPageEditorAudio.helpers ({

    audioAttachments: function () {
        // return MP.getPageAudio();
    },

});

Template.mpPageEditorAudio.onRendered (function () {

    return true;

});

Template.mpPageEditorDashboard.events({

    'click .mp-toggle-parent-next': function (event) {
        $(event.target).parent().next().toggleClass('hide');
    },

});

Template.mpPageEditorImages.events ({

    'click .mp-pe-add-image': function (event) {

        // Locals
        var row             = $(event.target).closest('.mp-pe-image-attachment');
        var alt             = $(row).find('.mp-pe-image-alt').val();
        var description     = $(row).find('.mp-pe-image-description').val();
        var featured        = $(row).find('.mp-pe-image-featured').val();
        var link            = $(row).find('.mp-pe-image-link').val();
        var name            = $(row).find('.mp-pe-image-name').val();
        var title           = $(row).find('.mp-pe-image-title').val();
        var url             = $(row).find('.mp-pe-image-url').val();
        var urlHuge         = $(row).find('.mp-pe-image-url-huge').val();
        var urlLarge        = $(row).find('.mp-pe-image-url-large').val();
        var urlSmall        = $(row).find('.mp-pe-image-url-small').val();
        var urlSquare       = $(row).find('.mp-pe-image-url-square').val();
        var sort            = $(row).find('.mp-pe-image-sort').val();

        // Validate

        // Duplicate add card
        $(row).clone().insertAfter(row);

        // Reset original inputs
        $(row).find('.form-control').val('');
        $(row).find('.mp-pe-image').attr('src', '');
        $(row).find('.mp-pe-image').attr('title', '');
        $(row).find('.mp-pe-image').addClass('hide');
        $(row).find('.mp-pe-image-huge').addClass('hide');
        $(row).find('.mp-pe-image-large').addClass('hide');
        $(row).find('.mp-pe-image-small').addClass('hide');
        $(row).find('.mp-pe-image-square').addClass('hide');

        // Set image tag attributes and show
        $(row).next().find('img').attr('title', title);
        if (url.length) {
            $(row).next().find('.mp-pe-image').attr('src', url);
            $(row).next().find('.mp-pe-image').removeClass('hide');
        }
        if (urlHuge.length) {
            $(row).next().find('.mp-pe-image-huge').attr('src', urlHuge);
            $(row).next().find('.mp-pe-image-huge').removeClass('hide');
        }
        if (urlLarge.length) {
            $(row).next().find('.mp-pe-image-large').attr('src', urlLarge);
            $(row).next().find('.mp-pe-image-large').removeClass('hide');
        }
        if (urlSmall.length) {
            $(row).next().find('.mp-pe-image-small').attr('src', urlSmall);
            $(row).next().find('.mp-pe-image-small').removeClass('hide');
        }
        if (urlSquare.length) {
            $(row).next().find('.mp-pe-image-square').attr('src', urlSquare);
            $(row).next().find('.mp-pe-image-square').removeClass('hide');
        }

        // Change new row's plus to minus
        $(row).next().find('.mp-pe-add-image').addClass('hide');
        $(row).next().find('.mp-pe-remove-image').removeClass('hide');

        // Assign events
        $(row).next().find('.mp-pe-remove-image').on('click', function () {
            $(this).closest('.mp-pe-image-attachment').remove();
        });

    },

    'click .mp-pe-image-toggle-feature': function (event) {
        $(event.target).siblings().removeClass('btn-primary');
        $(event.target).siblings().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

    'keyup .mp-pe-image-title': function (event) {

        var title = $(event.target).val();
        var alt = $(event.target).closest('.card').find('.mp-pe-image-alt');
        var name = $(event.target).closest('.card').find('.mp-pe-image-name');

        alt.val(title);
        name.val(title.replace(/\W/g, ''));

    },

    'keyup .mp-pe-image-input': function (event) {

        var row             = $(event.target).closest('.mp-pe-image-attachment');
        var alt             = $(row).find('.mp-pe-image-alt').val();
        var title           = $(row).find('.mp-pe-image-title').val();
        var url             = $(event.target).val();
        var target          = ($(event.target).hasClass('mp-pe-image-url'))
            ? $(row).find('.mp-pe-image-primary')
            : $(event.target).parent().find('img');

        // TODO: If image loads successfully, try guessing others
        /*
        $(target).load(function () {
        }).error(function () {
        });
        */

        // Set target attributes
        $(target).attr('alt', alt);
        $(target).attr('title', title);
        $(target).attr('src', url);
        if (url.length) {
            $(target).removeClass('hide');
        } else {
            $(target).addClass('hide');
        }

    },

});

Template.mpPageEditorImages.helpers ({

    imageAttachments: function () {
        // return MP.getPageImage();
    },

    so: _.range(100),

});

Template.mpPageEditorImages.onRendered (function () {

    return true;

});

Template.mpPageEditorMetadata.events({

    'click .mp-pe-sitemap-toggle': function (event) {
        $(event.target).siblings().removeClass('btn-primary');
        $(event.target).siblings().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

});

Template.mpPageEditorMetadata.helpers({

    authors: function () {

        // var authors = MP.getAuthorPotentials(null, {name: 1}) || {};
        var authors = mpUsers.find().fetch();

        // TODO: Eliminate self
        // authors = _.without(authors, XXX);

        if (!authors.length) {
            authors = [{_id: 0, username: 'N/A'}]
        }

        // Return 
        return authors;
    },

    groups: function () {
        var roles = MP.getRoles(null, {name: 1}) || {};
        return roles;
    },

    roles: function () {
        var roles = MP.getRoles(null, {name: 1}) || {};
        return roles;
    },

});

Template.mpPageEditorNavigation.events({

    'click #mp-page-editor-active-off': function (event) {
        $(event.target).prev().removeClass('btn-primary');
        $(event.target).prev().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

    'click #mp-page-editor-active-on': function (event) {
        $(event.target).next().removeClass('btn-primary');
        $(event.target).next().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

    'click #mp-page-editor-hidden-off': function (event) {
        $(event.target).prev().removeClass('btn-primary');
        $(event.target).prev().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

    'click #mp-page-editor-hidden-on': function (event) {
        $(event.target).next().removeClass('btn-primary');
        $(event.target).next().addClass('btn-default');
        $(event.target).removeClass('btn-default');
        $(event.target).addClass('btn-primary');
    },

    'blur .form-control': function (event) {

        MP.events.pageEditorNavigationValidation (event);

    },

    'keyup .form-control': function (event) {

        MP.events.pageEditorNavigationValidation (event);

    },

    'keyup #mp-pe-navigation-title': function (event) {

        // If slug xor title empty, auto-fill
        var title = $('[name=navigationTitle]').val().trim();
        if (
            ($('[name=navigationSlug]').val().trim() != title)
        ) {
            $('[name=navigationSlug]').val(MP.stringToSlug(title));
        }

    },

});

Template.mpPageEditorNavigation.helpers({

    parents: function () {
        mpPages.find({
            active: true,
            removed: {$not: true},
            stale: {$not: true},
        }, {
            fields: {name: 1},
            sort: {name: 1},
        }).fetch();
    },

    so: _.range(100),

});

Template.mpPageEditorNavigation.onRendered(function () {

    $('#mp-page-editor-context-panel').hide();
    $('.mp-admin-page-card').hide();
    $('#mp-admin-page-card-navigation').show();

});

Template.mpPageEditorToggles.events({

    'click .mp-page-editor-toggle-toggle': function (event) {
            // Make sure all is as it should be
            $(event.target).siblings().removeClass('btn-primary');
            $(event.target).siblings().addClass('btn-default');
            $(event.target).removeClass('btn-default');
            $(event.target).addClass('btn-primary');
        // var this.isDepressed = ($(event.target).hasClass('btn-primary'));
        // if (this.isDepressed) {
        // }
    },

});

Template.mpPageEditorNavigation.helpers({


});

Template.mpPageEditor.events ({

    'click #mp-page-editor-toggle': function (event) {

        var isOpen = $(event.target).children('i').hasClass('fa-caret-down');

        if (isOpen) {
            $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-down');
            $('#mp-page-editor-toggle').children('i').addClass('fa-caret-right');
            $('#mp-page-editor-context-panel').hide('blind', 700);
        } else {
            $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-right');
            $('#mp-page-editor-toggle').children('i').addClass('fa-caret-down');
            $('#mp-page-editor-context-panel').show('blind', 700);
        }

    },

    'click .mp-page-editor-tab': function (event) {

        var frags           = event.target.id.split('-');
        var toShow          = '#mp-admin-page-card-' + _.rest(frags, 4).join('-');

        var cardIsActive    = ('block' == $(toShow).css('display')) ? true : false;
        var panelIsOpen     = ('block' == $('#mp-page-editor-context-panel').css('display')) ? true : false;

        if (panelIsOpen && cardIsActive) {
            // Panel & card currently active, close panel
            MP.log('Trying to close everything', 1);
            $('#mp-page-editor-context-panel').hide('blind', 700);
            $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-down');
            $('#mp-page-editor-toggle').children('i').addClass('fa-caret-right');
            return;
        }

        if (panelIsOpen && !cardIsActive) {
            // Panel is open but showing other card
            MP.log('Trying to change cards', 1);
            $('.mp-admin-page-card').hide();
            $(toShow).show('fade', 700);
            return;
        }

        if (!panelIsOpen && cardIsActive) {
            // Card is open but panel is closed
            MP.log('Trying to show panel', 1);
            $('#mp-page-editor-context-panel').show(700);
            $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-down');
            $('#mp-page-editor-toggle').children('i').addClass('fa-caret-right');
            return;
        }

        // Panel is closed and this card not showing
        MP.log('Trying to open everything', 1);
        $('.mp-admin-page-card').hide();
        $(toShow).show('fade', 700);
        $('#mp-page-editor-context-panel').show('blind', 700);
        $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-right');
        $('#mp-page-editor-toggle').children('i').addClass('fa-caret-down');

    },

    'click #mp-toggle-bar': function (event) {
            // Panel open, close it
            MP.log('Closing panel', 1);
            $('#mp-page-editor-context-panel').hide('blind', 700);
            $('#mp-page-editor-toggle').children('i').removeClass('fa-caret-down');
            $('#mp-page-editor-toggle').children('i').addClass('fa-caret-right');
    },

    'click #mp-page-editor-publish-publish': function (event) {

        // Toggle spinner

        // Get values

        // Validate

        // Formulate

        // Insert

            // Log

            // Toggle spinner

            // Go to new page


            // Log

            // Toggle spinner

            // Set alert messages

    },

    'click #mp-page-editor-trash': function (event) {

        // Toggle spinner

        // Get values

        // Validate

        // Formulate

        // Toggle flag

            // Log

            // Toggle spinner

            // Go to new page


            // Log

            // Toggle spinner

            // Set alert messages

    },

});

Template.mpPageEditorVideo.events ({

    'click .mp-pe-add-video': function (event) {

        // Locals
        var row    = $(event.target).closest('.mp-pe-video-attachment');
        var link   = $(row).find('.mp-pe-video-link').val();
        var title  = $(row).find('.mp-pe-video-title').val();

        // Validate

        // Duplicate add card
        $(row).clone(true, true).insertAfter(row);

        // Reset original inputs
        $(row).find('.form-control').val('');

        // Set video tag attributes and show
        $(row).next().find('video').attr('title', title);
        $(row).next().find('video').attr('src', link);
        $(row).next().find('video').removeClass('hide');

        // Change new row's plus to minus
        $(row).next().find('.mp-pe-add-video').addClass('hide');
        $(row).next().find('.mp-pe-remove-video').removeClass('hide');

        // Assign events
        $(row).next().find('.mp-pe-remove-video').on('click', function () {
            $(this).closest('.mp-pe-video-attachment').remove();
        });

    },

});

Template.mpPageEditorVideo.helpers ({

    videoAttachments: function () {
        // return MP.getPageVideo();
    },

});

Template.mpPageEditorVideo.onRendered (function () {

    return true;

});

Template.mpRoot.events ({

    'click #mp-nav-close': function () {
        if ($('#mp-navigation-container').hasClass('mp-navigation-container-left')) {
            $('#mp-navigation-container').hide('slide', {direction: 'left'}, 750);
        } else {
            $('#mp-navigation-container').hide('slide', {direction: 'right'}, 750);
        }
        $('#mp-navigation-closer').fadeOut(1000);
        $('#mp-tabs').show(300);
    },

    'click #mp-trigger-nav': function () {
        if ($('#mp-navigation-container').hasClass('mp-navigation-container-left')) {
            $('#mp-navigation-container').show('slide', {direction: 'left'}, 750);
        } else {
            $('#mp-navigation-container').show('slide', {direction: 'right'}, 750);
        }
        $('#mp-tabs').hide(300);
        $('#mp-navigation-closer').fadeIn(2000);
    },

    'mouseover #mp-trigger-nav': function () {
        if ($('#mp-navigation-container').hasClass('mp-navigation-container-left')) {
            $('#mp-navigation-container').show('slide', {direction: 'left'}, 750);
        } else {
            $('#mp-navigation-container').show('slide', {direction: 'right'}, 750);
        }
        $('#mp-navigation-closer').fadeIn(2000);
        $('#mp-tabs').hide(300);
    },

    'mouseover #mp-navigation-closer': function () {
        if ($('#mp-navigation-container').hasClass('mp-navigation-container-left')) {
            $('#mp-navigation-container').hide('slide', {direction: 'left'}, 750);
        } else {
            $('#mp-navigation-container').hide('slide', {direction: 'right'}, 750);
        }
        $('#mp-navigation-closer').fadeOut(1000);
        $('#mp-tabs').show('fade');
    },

    'click #mp-navigation-closer': function () {
        if ($('#mp-navigation-container').hasClass('mp-navigation-container-left')) {
            $('#mp-navigation-container').hide('slide', {direction: 'left'}, 750);
        } else {
            $('#mp-navigation-container').hide('slide', {direction: 'right'}, 750);
        }
        $('#mp-navigation-closer').fadeOut(1000);
        $('#mp-tabs').show('fade');
    },

    'mouseover #mp-trigger-nav-switch': function (event) {

        // Trigger movement indicator
        if ($('#mp-trigger-nav-glyph').hasClass('glyphicon-chevron-right')) {
            $('#mp-trigger-nav-glyph').css('margin-right', '0px');
            $('#mp-trigger-nav-glyph').css('margin-left', '.5em');
        } else {
            $('#mp-trigger-nav-glyph').css('margin-left', '-1px');
            $('#mp-trigger-nav-glyph').css('margin-right', '.5em');
        }
    },

    'mouseout #mp-trigger-nav-switch': function (event) {

        // Reset movement indicator
        $('#mp-trigger-nav-glyph').css('margin-left', '-1px');
        $('#mp-trigger-nav-glyph').css('margin-right', '0px');
    },

    'click #mp-trigger-nav-switch': function (event) {

        if ($('#mp-trigger-nav-glyph').hasClass('glyphicon-chevron-right')) {
            // Move nav tabs
            $('#mp-tabs').switchClass('mp-navigation-tabs-left',
                                      'mp-navigation-tabs-right',
                                      1200);
            // Switch glyphs
            $('#mp-trigger-nav-glyph').switchClass('glyphicon-chevron-right',
                                                   'glyphicon-chevron-left');
            // Move nav bar
            $('#mp-navigation-container').switchClass('mp-navigation-container-left',
                                                   'mp-navigation-container-right');
            // Move nav closer
            $('#mp-navigation-closer').switchClass('mp-navigation-closer-left',
                                                   'mp-navigation-closer-right');
        } else if ($('#mp-trigger-nav-glyph').hasClass('glyphicon-chevron-left')) {
            // Move nav tabs
            $('#mp-tabs').switchClass('mp-navigation-tabs-right',
                                      'mp-navigation-tabs-left',
                                      1200);
            // Switch glyphs
            $('#mp-trigger-nav-glyph').switchClass('glyphicon-chevron-left',
                                                   'glyphicon-chevron-right');
            // Move nav bar
            $('#mp-navigation-container').switchClass('mp-navigation-container-right',
                                                   'mp-navigation-container-left');
            // Move nav closer
            $('#mp-navigation-closer').switchClass('mp-navigation-closer-right',
                                                   'mp-navigation-closer-left');
        }
    },

    'click .vert-center': function (event) {
        // Intercept light box closer
    },

    'click .mp-lightbox': function (event) {
        $(event.target).hide('fade');
    },

});

Template.mpRoot.helpers ({

});

Template.mpRoot.onRendered(function () {

    $('#mp-tabs').addClass('mp-navigation-tabs-left');
    $('#mp-trigger-nav-glyph').addClass('glyphicon-chevron-right');
    $('#mp-navigation-container').addClass('mp-navigation-container-left');
    $('#mp-navigation-closer').addClass('mp-navigation-closer-left');

});
