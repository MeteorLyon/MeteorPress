console.log ('Welcome to #MeteorPress by @iDoMeteor');
console.log ('Thank you for reading my logs! :D');
console.log ('INFO Reading #MeteorPress object defaults');
/******************************************************************************
 * 
 * #MeteorPress defaults
 *
 *
 * ***************************************************************************/


/** Collection prefix */
mpPrefix = 'mp';

/**
 *
 * Default configuration object
 *
 */
mpDefaultConfig = {

    // Debug
    debug                   : true,

    // Toggles
    enableAutoLoad          : true,
    enableAutoReader        : true,
    enableBanWords          : true,
    enableBanWordsReplace   : true,
    enableFeatured          : true,
    enableGoogleAnalytics   : false,
    enableKadira            : false,
    enableLogin             : true,
    enableLoginWithFacebook : false,
    enableLoginWithGithub   : false,
    enableLoginWithGoogle   : false,
    enableLoginWithMeetup   : false,
    enableLoginWithMeteorDeveloper : false,
    enableLoginWithPassword : true,
    enableLoginWithTwitter  : false,
    enableLoginWithWeibo    : false,
    enableMPMarkDown        : true,
    enableMaintenanceMode   : false,
    enableNews              : true,
    enablePages             : true,
    enablePlugins           : true,
    enablePosts             : true,
    enableSticky            : true,
    enableThemes            : true,
    enableTwitter           : false,

    // Limits
    limitGetters            : 100,
    limitPublish            : 100,

    // Logging
    logLevel                : 2,        

}

/*
 * Default objects should go into singletons
 *  and be drawn from there when needed, including
 *  roles, features & perms, then they can be reset
 *  at any time..but not have to be in memory
 */

/**
 *
 * Default Page Object
 *
 */
var mpDefaultPage = {

    /** All pages have these */
    active: true,
    hidden: false,
    rendered: 0,
    removed: false,
    stale: false,
    content: {
        headline: '',
        summary: '',
        body: '',
        spoken: '',
    },
    accessRoles: [{
        id: '',
        role: '',
    }],
    authors: [{
        id: '',
        name: '',
        image: '',
    }],
    enable: {
        audio: true,
        banner: true,
        collapsible: false,
        comments: false,
        featured: false,
        images: false,
        markdown: true,
        pdf: false,
        ratings: false,
        sticky: false,
        share: true,
        tts: false,
        toc: true,
        videos: true,
    },
    navigation: {
        bsg: '',
        fai: '',
        parent: 'Root',
        slug: '',
        sort: 'Alpha',
        title: '',
    },
    revisions: {
        current: '', // id
        first: '',   // id
        previous: '',// previous current
        major: 0,
        minor: 0,
    },
    sitemap: {
        include: true,
        frequency: 'monthly',
        priority: 5,
    },
    template: {
        custom: '',
        name: 'Page',
    },
    stamps: {
        createdAt: new Date(),
        modified: [],
    },

    /** Pages may or may not have these */
    audio: [{
        title: '',
        link: '',
    }],
    code: [{
        code: '',
        description: '',
        name: '',
        sort: '',
        title: '',
        urlDemo: '',
        urlSource: '',
        urlVideo: '',
    }],
    images: [{
        alt: '',
        description: '',
        isFeatureImage: '',
        link: '',
        name: '',
        sort: '',
        title: '',
        url: '',
        urlHuge: '',
        urlLarge: '',
        urlSmall: '',
        urlThumbnail: '',
    }],
    tweet: {
        text: '',
        sent: 0,
    },
    videos: [{
        description: '',
        link: '',
        name: '',
        title: '',
    }],

}

// Default role features
mpDefaultFeatures = [ 
    { _id: 'B45rSjT8iEawoeLKP',
        name: 'mailingList',
        label: 'Mailing List' },
    { _id: 'FCjWuGP3Chq3tYAff',
        name: 'utilities',
        label: 'Utilities' },
    { _id: 'S3pwcW5m2aQu4xPMj',
        name: 'news',
        label: 'News' },
    { _id: 'ZyC6xvjXgzmiBEDcW',
        name: 'roles',
        label: 'Roles' },
    { _id: 'c9Qi76QhFeXKjCunn',
        name: 'posts',
        label: 'Posts' },
    { _id: 'gQD2PSKo6Rwa2e553',
        name: 'pages',
        label: 'Pages' },
    { _id: 'hAtMymZvR63hCDX3L',
        name: 'config',
        label: 'Configuration' },
    { _id: 'qasZ8qBwLARhJFXmE',
        name: 'themes',
        label: 'Themes' },
    { _id: 'xXtch3ptqBaSKxtog',
        name: 'plugins',
        label: 'Plugins' },
    { _id: 'yDS4XQgZyXEhEGFs5',
        name: 'users',
        label: 'Users' },
]

// Default role permissions
mpDefaultFeatures = [ 
    { _id: '5RkHYkFrXmwDDNZcA',
        name: 'deleteOthers',
        label: 'Delete others',
        group: 'others',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'EQxoeHvT8derFaAEb',
        name: 'createOthers',
        label: 'Create others',
        group: 'others',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'QjTXBdutb292KBWeq',
        name: 'editOthers',
        label: 'Create others',
        group: 'others',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'QoTyLcqwbp2aXznGK',
        name: 'readOwn',
        label: 'Read own',
        group: 'own',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'bnchyCGMDPCyh9uPH',
        name: 'createOwn',
        label: 'Create own',
        group: 'own',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'gCW7mi6nqmqpgtJ98',
        name: 'readOthers',
        label: 'Read others',
        group: 'others',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'iqfFB8NzyC3ZNESpH',
        name: 'deleteOwn',
        label: 'Delete own',
        group: 'own',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
    { _id: 'nFqPsLrc5Wp5nP2be',
        name: 'editOwn',
        label: 'Create edit',
        group: 'own',
        help: 'Force user to login when this trigger is activated',
        cssId: 'mp-admin-role-force-login',
        class: 'mp-admin-checkbox',
        sort: 0,
        faIconCode: 'fa-lock' },
]

/**
 *
 * Example Page Object
 *
 */
var mpExample = {

    /** All pages have these */
    active: true,
    hidden: false,
    rendered: 0,
    removed: false,
    stale: false,
    content: {
        headline: '#MeteorPress Example Page',
        summary: 'This page demonstrates a #MeteorPress page with the standard template full of content.',
        body: 'This could be a full MP MarkDown example..',
        spoken: '/meteorpress/examples/audio/example-spoken.wav',
    },
    accessRoles: [
        {
            id: '',
            role: '',
        },
        {
            id: '',
            role: '',
        },
    ],
    authors: [
        {
            id: '',
            name: '',
            image: '',
        },
        {
            id: '',
            name: '',
            image: '',
        },
    ],
    enable: {
        audio: true,
        banner: true,
        collapsible: false,
        comments: false,
        featured: true,
        images: true,
        markdown: true,
        pdf: false,
        ratings: false,
        sticky: false,
        share: true,
        tts: false,
        toc: true,
        videos: true,
    },
    navigation: {
        bsg: 'glyphicon-circle',
        fai: 'fa-circle',
        parent: 'Root',
        slug: '/examples/page-1',
        sort: 'Alpha',
        title: 'Example Page 1',
    },
    revisions: {
        current: '', // id
        first: '',   // id
        previous: '',// previous current
        major: 0,
        minor: 0,
    },
    sitemap: {
        include: true,
        frequency: 'never',
        priority: 10,
    },
    template: {
        custom: '',
        name: 'Page',
    },
    stamps: {
        createdAt: new Date(),
        modified: [],
    },

    /** Pages may or may not have these */
    audio: [
        {
            title: 'Audio Example 1',
            link: '/meteorpress/examples/audio/example-1.wav',
        },
        {
            title: 'Audio Example 2',
            link: '/meteorpress/examples/audio/example-2.wav',
        },
    ],
    code: [
        {
            code: 'var tricky = js(stuff);',
            description: 'This code is an example.',
            name: 'example-code-1',
            sort: '0',
            title: 'Example Code 1',
            urlDemo: 'http://demo.meteorpress.com',
            urlSource: 'http://github.com/idometeor/meteorpress-official',
            urlVideo: 'http://youtube.com/idometeor',
        },
        {
            code: 'var tricky = js(stuff);',
            description: 'This code is an example.',
            name: 'example-code-1',
            sort: '1',
            title: 'Example Code 1',
            urlDemo: 'http://demo.meteorpress.com',
            urlSource: 'http://github.com/idometeor/meteorpress-official',
            urlVideo: 'http://youtube.com/idometeor',
        },
    ],
    images: [
        {
            alt: 'Image 1',
            description: 'Example image 1 description',
            isFeatureImage: true,
            link: 'http://MeteorPress.org',
            name: 'example-image-1',
            sort: '0',
            title: 'Example Image 1',
            url: '/meteorpress/example/images/example-image-1.png',
            urlHuge: '/meteorpress/example/images/example-image-1-src.png',
            urlLarge: '/meteorpress/example/images/example-image-1-lg.png',
            urlMedium: '/meteorpress/example/images/example-image-1-md.png',
            urlSmall: '/meteorpress/example/images/example-image-1-sm.png',
            urlThumbnail: '/meteorpress/example/images/example-image-1-sq.png',
        },
        {
            alt: 'Image 2',
            description: 'Example image 2 description',
            isFeatureImage: true,
            link: 'http://MeteorPress.org',
            name: 'example-image-2',
            sort: '0',
            title: 'Example Image 2',
            url: '/meteorpress/example/images/example-image-2.png',
            urlHuge: '/meteorpress/example/images/example-image-2-src.png',
            urlLarge: '/meteorpress/example/images/example-image-2-lg.png',
            urlMedium: '/meteorpress/example/images/example-image-2-md.png',
            urlSmall: '/meteorpress/example/images/example-image-2-sm.png',
            urlThumbnail: '/meteorpress/example/images/example-image-2-sq.png',
        },
    ],
    tweet: {
        text: '',
        sent: 0,
    },
    videos: [
        {
            description: 'Example video 1 description',
            link: 'http://youtube.com/watch?v=09a0sef',
            name: 'example-video-1',
            title: 'Example Video 1',
        },
        {
            description: 'Example video 2 description',
            link: 'http://youtube.com/watch?v=09a0sef',
            name: 'example-video-2',
            title: 'Example Video 2',
        },
    ],

}

// TODO!! 
// Confirmation/actionable modal
// Read from default page object || passed document from router
// Collect values into object, insert!
//      Use/check MP methods!
