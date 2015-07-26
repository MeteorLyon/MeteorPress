console.log('INFO Loading #MeteorPress schemas');
/****************************************************************************** 
 *
 * Schemas
 *
 * Putting this here let's us use MP in default & auto values
 *
 * TODO:
 *      Convert these autoform schemas to objects
 *      to be used manually.. sort of like faux-schemas ;)
 *
 *****************************************************************************/ 

// if (MP && MP.debug) SimpleSchema.debug = MP.debug;
SimpleSchema.debug = true;

/**
 * Configuration
 *
 */
mpSchemas.mpConfiguration = new SimpleSchema ({
    
    'debug': {
        optional: true,
        type: Boolean,
    },
    'enableAutoLoad': {
        optional: true,
        type: Boolean,
    },
    'enableAutoReader': {
        optional: true,
        type: Boolean,
    },
    'enableBanWords': {
        optional: true,
        type: Boolean,
    },
    'enableBanWordsReplace': {
        optional: true,
        type: Boolean,
    },
    'enableFeatured': {
        optional: true,
        type: Boolean,
    },
    'enableGoogleAnalytics': {
        optional: true,
        type: Boolean,
    },
    'enableKadira': {
        optional: true,
        type: Boolean,
    },
    'enableLogin': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithFacebook': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithGithub': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithGoogle': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithMeetup': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithMeteorDeveloper': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithPassword': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithTwitter': {
        optional: true,
        type: Boolean,
    },
    'enableLoginWithWeibo': {
        optional: true,
        type: Boolean,
    },
    'enableMPMarkDown': {
        optional: true,
        type: Boolean,
    },
    'enableMaintenanceMode': {
        optional: true,
        type: Boolean,
    },
    'enableNews': {
        optional: true,
        type: Boolean,
    },
    'enablePages': {
        optional: true,
        type: Boolean,
    },
    'enablePlugins': {
        optional: true,
        type: Boolean,
    },
    'enablePosts': {
        optional: true,
        type: Boolean,
    },
    'enableSticky': {
        optional: true,
        type: Boolean,
    },
    'enableThemes': {
        optional: true,
        type: Boolean,
    },
    'enableTwitter': {
        optional: true,
        type: Boolean,
    },
    'limitGetters': {
        type: Number,
    },
    'limitPublish': {
        type: Number,
    },
    'logLevel': {
        type: Number,
    },
    'webmasterEmail': {
        optional: true,
        type: String,
    },
    'revision': {
        autoValue: function () {
            return (this.value) ? this.value++ : 1;
        },
        type: Number,
    },
    'siteTitle': {
        type: String,
    },
    'siteTagLine': {
        type: String,
    },
    'siteDescription': {
        type: String,
    },
    'stamp': {
      autoValue: function () {
            return new Date;
        },
        type: Date,
    },

});
mpConfiguration.attachSchema(mpSchemas.mpConfiguration);

/**
 * Log
 *
 */
mpSchemas.mpLogLog = new SimpleSchema ({
    
    level: {
        type: Number,
    },
    message: {
        type: String,
    },
    stamp: {
        autoValue: function () {
            return new Date;
        },
        type: Date,
    },

});
mpLogLog.attachSchema(mpSchemas.mpLogLog);

/**
 * Contact Log
 *
 */
mpSchemas.mpLogContact = new SimpleSchema ({
    
    name: {
        type: String,
    },
    twitter: {
        optional: true,
        type: String,
        regEx: /^@?\w{1,15}/,
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
    },
    message: {
        type: String,
    },
    ip: {
        autoValue: function() {
            return Meteor.userIp;
        },
        type: String,
    },
    stamp: {
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
          },
          type: Date,
    },

});
mpLogContact.attachSchema(mpSchemas.mpLogContact);

/**
 * News
 *
 */
mpSchemas.mpNews = new SimpleSchema ({
    

    // Tried using omit here several ways but it puts in a weird field you can't edit
    // for the array itself (even tho array elements are indeed omitted)
    'author.$._id': {
        autoValue: function() {
            if (MP.user) {
                return MP.userID;
            } else {
                MP.log ('Error: Attempting to add news with invalid user ID', 2);
                return;
            }
        },
        regEx: SimpleSchema.RegEx.Id,
        type: String,
    },
    'author.$.name': {
        autoValue: function() {
            if (MP.user) {
                return MP.user.profile.name;
            } else {
                MP.log ('Error: Attempting to add news with invalid name', 2);
                return;
            }
        },
        type: String,
    },
    'author.$.image': {
        autoValue: function() {
            if (MP.user) {
                return mpUser.profile.image;
            }
        },
        optional: true,
        type: String,
    },
    headline: {
        max: 100,
        type: String,
    },
    active: {
        type: Boolean,
    },
    sticky: {
        defaultValue: true,
        type: Boolean,
    },
    tweet: {
        defaultValue: true,
        type: Boolean,
    },
    summary: {
        max: 420,
        type: String,
    },
    body: {
        autoform: {
            afFieldInput: {
                type: "textarea",
                rows: 10,
            }
        },
        type: String,
    },
    stamp: {
        autoform: {
            omit: true
        },
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        },
        type: Date,
    },
    rendered: {
        autoform: {
            omit: true
        },
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        type: Number,
    },

});
mpNews.attachSchema(mpSchemas.mpNews);

/**
 * Pages
 *
 */
mpSchemas.mpPages = new SimpleSchema ({
    
    'accessRoles': {
        type: [Object],
    },
    'accessRoles.$.id': {
        type: String,
    },
    'accessRoles.$.role': {
        type: String,
    },
    'author': {
        type: [Object],
    },
    'author.$.ID': {
        regEx: SimpleSchema.RegEx.Id,
        type: Number,
    },
    'author.$.name': {
        optional: true,
        type: String,
    },
    'author.$.image': {
        optional: true,
        type: String,
    },
    'active': {
        type: Boolean,
    },
    'navigation.bsg': {
        type: String,
    },
    'navigation.fai': {
        type: String,
    },
    'navigation.parent': {
        type: String,
    },
    'navigation.slug': {
        type: String,
    },
    'navigation.sort': {
        optional: true,
        type: Number,
    },
    'navigation.title': {
        type: String,
    },
    'content.headline': {
        max: 100,
        type: String,
    },
    'content.summary': {
        type: String,
    },
    'content.body': {
        type: String,
    },
    'content.spoken': {
        optional: true,
        type: String,
    },
    'tweet.text': {
        optional: true,
        type: String,
    },
    'enable': {
        type: Object,
    },
    'enable.collapseHeaders': {
        type: Boolean,
    },
    'enable.comments': {
        type: Boolean,
    },
    'enable.featured': {
        type: Boolean,
    },
    'enable.markdown': {
        type: Boolean,
    },
    'enable.pdf': {                 // This would enable the PDF icon and download a possibly cached PDF
        type: Boolean,
    },
    'enable.ratings': {
        type: Boolean,
    },
    'enable.sticky': {
        type: Boolean,
    },
    'enable.share': {
        type: Boolean,
    },
    'enable.text2speech': {
        type: Boolean,
    },
    'enable.tableOfContents': {
        type: Boolean,
    },
    'audio.$.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'audio.$.link': {
        max: 100,
        optional: true,
        type: String,
    },
    'images.$.alt': {
        optional: true,
        max: 50,
        type: String,
    },
    'images.$.description': {
        optional: true,
        max: 250,
        type: String,
    },
    'images.$.name': {
        optional: true,
        max: 250,
        type: String,
    },
    'images.$.sort': {
        optional: true,
        allowedValues: _.range(0,100),
        defaultValue: 0,
        type: Number,
    },
    'images.$.title': {
        optional: true,
        max: 100,
        type: String,
    },
    'images.$.url': {
        optional: true,
        type: String,
    },
    'images.$.urlHuge': {
        optional: true,
        type: String,
    },
    'images.$.urlLarge': {
        optional: true,
        type: String,
    },
    'images.$.urlSmall': {
        optional: true,
        type: String,
    },
    'images.$.urlThumbnail': {
        optional: true,
        type: String,
    },
    'code.$.code': {
        optional: true,
        type: String,
    },
    'code.$.description': {
        optional: true,
        type: String,
    },
    'code.$.name': {
        optional: true,
        type: String,
    },
    'code.$.urlDemo': {
        optional: true,
        type: String,
    },
    'code.$.urlSource': {
        optional: true,
        type: String,
    },
    'code.$.urlVideo': {
        optional: true,
        type: String,
    },
    'pageImage.alt': {
        max: 50,
        optional: true,
        type: String,
    },
    'pageImage.description': {
        max: 250,
        optional: true,
        type: String,
    },
    'pageImage.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'pageImage.urlHuge': {
        optional: true,
        type: String,
    },
    'pageImage.urlLarge': {
        optional: true,
        type: String,
    },
    'pageImage.urlSmall': {
        optional: true,
        type: String,
    },
    'pageImage.urlThumbnail': {
        optional: true,
        type: String,
    },
    'remove': {
        optional: true,
        type: Boolean,
    },
    'revision': {
        type: Object,
    },
    'revision.number': {
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        type: Number,
    },
    'revision.type': {
        allowedValues: [
            'Major',
            'Minor',
        ],
        defaultValue: 'Major',
        type: String,
    },
    'sitemap.include': {
        defaultValue: true,
        type: Boolean,
    },
    'sitemap.frequency': {
        defaultValue: 'weekly',
        allowedValues: [
            'always',
            'hourly',
            'daily',
            'weekly',
            'monthly',
            'yearly',
            'never',
        ],
        type: String,
    },
    'sitemap.priority': {
        allowedValues: _.range(0, 10),
        defaultValue: 5,
        type: Number,
    },
    'stale': {
        optional: true,
        type: Boolean,
    },
    'template.custom': {
        optional: true,
        type: String,
    },
    'template.type': {
        allowedValues: [
            'Audio',
            'Blog',
            'Images',
            'News',
            'Page',
            'Product',
            'Standard',
            'Video',
        ],
        defaultValue: 'Page',
        type: String,
    },
    'video.$.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'video.$.link': {
        max: 100,
        optional: true,
        type: String,
    },
    'rendered': {
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        type: Number,
    },
    'stamp': {
      autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        },
        type: Date,
    },


});
// mpPages.attachSchema(mpSchemas.mpPages);

/**
 * Posts
 *
 */
mpSchemas.mpPosts = new SimpleSchema ({
    
    'accessRoles.$.role': {
        allowedValues: function () {
            var roles  = Meteor.roles.find().fetch();
            var values = [];
            if (roles) {
                _.each(roles, function (role) {
                    values.push(role);
                });
            } else {
                Roles.createRole('Public');
                values = ['Public'];
            }
            return values;
        },
        defaultValue: 'Public',
        type: String,
    },
    'author.$.ID': {
        optional: true,
        regEx: SimpleSchema.RegEx.Id,
        type: Number,
    },
    'author.$.name': {
        optional: true,
        type: String,
    },
    'author.$.image': {
        optional: true,
        type: String,
    },
    'active': {
        type: Boolean,
    },
    'content.headline': {
        max: 100,
        type: String,
    },
    'content.summary': {
        type: String,
    },
    'content.body': {
        type: String,
    },
    'content.spoken': {
        optional: true,
        type: String,
    },
    'tweet.text': {
        optional: true,
        type: String,
    },
    'tweet.now': {
        defaultValue: true,
        type: Boolean,
    },
    'tweet.image': {
        optional: true,
        type: String,
    },
    'enable.collapseHeaders': {
        defaultValue: false,
        optional: true,
        type: Boolean,
    },
    'enable.comments': {
        type: Boolean,
    },
    'enable.featured': {
        type: Boolean,
    },
    'enable.ratings': {
        type: Boolean,
    },
    'enable.markdown': {
        type: Boolean,
    },
    'enable.pdf': {
        type: Boolean,
    },
    'enable.share': {
        type: Boolean,
    },
    'enable.sticky': {
        type: Boolean,
    },
    'enable.text2speech': {
        type: Boolean,
    },
    'audio.$.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'audio.$.link': {
        max: 100,
        optional: true,
        type: String,
    },
    'images.$.alt': {
        optional: true,
        max: 50,
        type: String,
    },
    'images.$.description': {
        optional: true,
        max: 250,
        type: String,
    },
    'images.$.sort': {
        allowedValues: _.range(0,100),
        defaultValue: 0,
        optional: true,
        type: Number,
    },
    'images.$.title': {
        optional: true,
        max: 100,
        type: String,
    },
    'images.$.urlHuge': {
        optional: true,
        type: String,
    },
    'images.$.urlLarge': {
        optional: true,
        type: String,
    },
    'images.$.urlSmall': {
        optional: true,
        type: String,
    },
    'images.$.urlThumbnail': {
        optional: true,
        type: String,
    },
    'code.$.demo': {
        optional: true,
        type: String,
    },
    'code.$.source': {
        optional: true,
        type: String,
    },
    'code.$.video': {
        optional: true,
        type: String,
    },
    'pageImage.alt': {
        max: 50,
        optional: true,
        type: String,
    },
    'pageImage.description': {
        max: 250,
        optional: true,
        type: String,
    },
    'pageImage.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'pageImage.urlHuge': {
        optional: true,
        type: String,
    },
    'pageImage.urlLarge': {
        optional: true,
        type: String,
    },
    'pageImage.urlSmall': {
        optional: true,
        type: String,
    },
    'pageImage.urlThumbnail': {
        optional: true,
        type: String,
    },
    'removed': {
        optional: true,
        defaultValue: false,
        type: Boolean,
    },
    'revision.number': {
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        optional: true,
        type: Number,
    },
    'revision.type': {
        allowedValues: [
            'Major',
            'Minor',
        ],
        defaultValue: 'Major',
        optional: true,
        type: String,
    },
    'sitemap.include': {
        defaultValue: true,
        optional: true,
        type: Boolean,
    },
    'sitemap.frequency': {
        defaultValue: 'weekly',
        allowedValues: [
            'always',
            'hourly',
            'daily',
            'weekly',
            'monthly',
            'yearly',
            'never',
        ],
        optional: true,
        type: String,
    },
    'sitemap.priority': {
        allowedValues: _.range(0, 10),
        defaultValue: 5,
        optional: true,
        type: Number,
    },
    'template.custom': {
        optional: true,
        type: String,
    },
    'template.type': {
        allowedValues: [
            'Audio',
            'Blog',
            'Images',
            'News',
            'Page',
            'Product',
            'Standard',
            'Video',
        ],
        defaultValue: 'Blog',
        optional: true,
        type: String,
    },
    'video.$.title': {
        max: 100,
        optional: true,
        type: String,
    },
    'video.$.link': {
        max: 100,
        optional: true,
        type: String,
    },
    'rendered': {
        autoValue: function () {
            if (this.isInsert) {
                return 0;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        optional: true,
        type: Number,
    },
    stamp: {
      autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        },
        type: Date,
    },


});
mpPosts.attachSchema(mpSchemas.mpPosts);

/**
 * Relationships
 *
 */
mpSchemas.mpRelationships = new SimpleSchema ({
    
    'parent': {
        regEx: SimpleSchema.RegEx.Id,
        type: Number,
    },
    'child': {
        regEx: SimpleSchema.RegEx.Id,
        type: Number,
    },
    'description': {
        optional: true,
        type: String,
    },

});
// mpRelationships.attachSchema(mpSchemas.mpRelationships);

/**
 * Roles
 *
 */
mpSchemas.mpRoles = new SimpleSchema ({
    
    'id': {
        optional: true,
        type: String, // of pre-existing doc if this has been expired
    },
    'name': {
        type: String,
    },
    'description': {
        type: String,
    },
    'features': {
        type: [Object],
    },
    // Maybe just read these and loop them in template would be easy peasy
    'features.$.label': {
        type: String,
    },
    'features.$.name': {
        type: String,
    },
    'features.$.readOwn': {
        type: Boolean,
    },
    'features.$.createOwn': {
        type: Boolean,
    },
    'features.$.editOwn': {
        type: Boolean,
    },
    'features.$.deleteOwn': {
        type: Boolean,
    },
    'features.$.readOthers': {
        type: Boolean,
    },
    'features.$.createOthers': {
        type: Boolean,
    },
    'features.$.editOthers': {
        type: Boolean, },
    'features.$.deleteOthers': {
        type: Boolean,
    },
    'stamp': {
        autoValue: function () {
            return new Date;
        },
        type: Date,
    },
    'removed': {
        optional: true,
        type: Boolean,
    },
    'stale': {
        optional: true,
        type: Boolean,
    },
    'userid': {
        type: String,
    },
    'username': {
        type: String,
    },

});
mpRoles.attachSchema(mpSchemas.mpRoles);

/**
 * Service Keys
 *
 */
mpSchemas.mpServiceKeys = new SimpleSchema ({
    
    'kadiraKey': {
        optional: true,
        type: String,
    },
    'kadiraSecret': {
        optional: true,
        type: String,
    },
    'twitterKey': {
        optional: true,
        type: String,
    },
    'twitterKeySecret': {
        optional: true,
        type: String,
    },
    'twitterToken': {
        optional: true,
        type: String,
    },
    'twitterTokenSecret': {
        optional: true,
        type: String,
    },
});
mpConfiguration.attachSchema(mpSchemas.mpConfiguration);

/**
 * Words from Posts
 *
 */
mpSchemas.mpWords = new SimpleSchema ({
    
    'word': {
        type: String,
    },
    'count': {
        autoValue: function () {
            if (this.isInsert) {
                return 1;
            } else if (
                (this.isUpdate)
                || (this.isUpsert)
            ) {
                return (this.value)
                    ? this.value++
                    : 0;
            }
        },
        type: Number,
    },

});
mpWords.attachSchema(mpSchemas.mpWords);

/**
 * Declare installation schemas if required
 *
 */
if (!MP.config) {
    /**
     * Install Super User
     *
     */
    mpSchemas.mpInstallSuperUser = new SimpleSchema ({
        
        'username': {
            type: String,
        },
        'email': {
            type: String,
        },
        'password': {
            type: String,
        },
        'imageURL': {
            optional: true,
            type: String,
        },

    });

    /**
     * Install Login Service Keys
     *
     */
    mpSchemas.mpInstallLoginKeys = new SimpleSchema ({
        
        'facebookKey': {
            type: String,
        },
        'facebookSecret': {
            type: String,
        },
        'githubKey': {
            type: String,
        },
        'githubSecret': {
            type: String,
        },
        'googleKey': {
            type: String,
        },
        'googleSecret': {
            type: String,
        },
        'meetupKey': {
            type: String,
        },
        'meetupSecret': {
            type: String,
        },
        'meteorDeveloperKey': {
            type: String,
        },
        'meteorDeveloperSecret': {
            type: String,
        },
        'twitterKey': {
            type: String,
        },
        'twitterSecret': {
            type: String,
        },
        'weiboKey': {
            type: String,
        },
        'weiboSecret': {
            type: String,
        },

    });

    /**
     * Install Google Analytics
     *
     */
    mpSchemas.mpInstallGoogleAnalytics = new SimpleSchema ({
        
        'key': {
            type: String,
        },

    });

    /**
     * Install Kadira
     *
     */
    mpSchemas.mpInstallKadira = new SimpleSchema ({
        
        'key': {
            type: String,
        },
        'secret': {
            type: String,
        },

    });

}
