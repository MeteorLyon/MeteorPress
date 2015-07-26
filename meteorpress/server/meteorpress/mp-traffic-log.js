/*
 * Method to return nicely formatted object of header values
 */
mpGetHeaders = function (connectionObject) {

    // Local vars
    var o = connectionObject;
    var h = null;
    var chain = o.httpHeaders['x-forwarded-for'].split(',');
    var languages = o.httpHeaders['accept-language'].split(',');
    var languagePrimary = languages.slice(0,1);
    var languageSecondary = languages.slice(-1).toString();
    var proxies = null;

    // Strip languages
    languageSecondary = languageSecondary.split(';');
    languageSecondary = languageSecondary.slice(0,1);

    // Set proxy count
    if (typeof(process.env.HTTP_FORWARDED_COUNT) == 'undefined') {
                proxies = 1;
            } else if (process.env.HTTP_FORWARDED_COUNT) {
                proxies = parseInt(process.env.HTTP_FORWARDED_COUNT);
            } else {
                proxies = false;
            }

    // Set proxy count
    if (typeof(process.env.HTTP_FORWARDED_COUNT) == 'undefined') {
        proxies = 1;
    } else if (process.env.HTTP_FORWARDED_COUNT) {
        proxies = parseInt(process.env.HTTP_FORWARDED_COUNT);
    } else {
        proxies = false;
    }

    // Populate header object
    h = {
        browser:            o.httpHeaders['user-agent'],
        host:               o.httpHeaders.host,
        id:                 o.id,
        ipChain:            chain,
        ipPublic:           o.clientAddress,
        ipSource:           chain[0],
        ipTotal:            proxies,
        languagePrimary:    languagePrimary,
        languageSecondary:  languageSecondary,
        languages:          languages,
    }
    return h;

}


/*
 * This needs to be cleaned up
 */
mpLogConnection = function (connectionObject) {
    // Get header info we can work with
    var h = null;
    h = mpGetHeaders(connectionObject);

    // Local vars for logging in order of usage
    var ip = null;
    var isProxied = 1 < h.ipTotal ? true : false;
    var numProxies = h.ipTotal;
    // This is so impractical to be so difficult
    //  How is iron-router doing it, cuz it's not loaded yet!
    var url = process.env.ROOT_URL;
    var browser = h.browser;
    var userActive = this.userId;
    var visitor = null;
    var ipObject = null;
    var urlObject = null;
    var counter = null;
    var uniqueIP = null;
    var countUniqueIPs = null;
    var uniqueExistsURL = null;
    var countUniqueURLs = null;
    var uniqueBrowser = null;
    var countBrowser = null;
    var languagePrimary = null;
    var languageSecondary = null;
    var stamp = new Date;
    stamp = stamp.getTime();
    
    // Determine IP to log
    if (1 == h.ipTotal) {
        ip = h.ipPublic;
        isProxied = false;
    } else if (1 < ipTotal) {
        ip = ipSource;
        isProxied = true;
        numProxies = h.ipTotal;
    } 

    // Register IP for global access
    Meteor.userIp = ip;
    
    // Populate user data
    if (userActive) {
        var userId = Meteor.userId();
        var username = Meteor.user().username;
        visitor = ({visitors: {
                ip: ip,
                stamp: stamp,
                id: userId,
                username: username,
                landing: url,
                browser: browser,
            }
        });
    } else {
        // #todo
        // If they register we should update this with an id 
        visitor = ({visitors: {
                ip: ip,
                stamp: stamp,
                landing: url,
                browser: browser,
            }
        });
    }

    // Formulate IP log object
    if (userActive) {
        ipObject = {
            ip: ip,
            stamp: stamp,
            uid: userId,
            username: username,
            landing: url,
            browser: browser,
        };
    } else {
        ipObject = {
            ip: ip,
            stamp: stamp,
            landing: url,
            browser: browser,
        };
    }

    // Formulate URL log object
    if (userActive) {
        urlObject = {
            url: url,
            stamp: stamp,
            uid: userId,
            username: username,
        };
    } else {
        urlObject = {
            url: url,
            stamp: stamp,
        };
    }

    /*
     * Logs are unique for accountability
     * Counts are strictly one identifying field w/an integer
     * Uniques are detailed records with a count value
     * Might add unique ip object to users as well using $addToSet
     * Might also want to consider seperate collections instead of nesting
     */

    // Connections
    // Essentially, how many times Meteor.onConnect has ran
    if (countConnections = mpTrafficLog.findOne({countConnections: {$exists: true}})) {
        // Increment connection count
        countConnections = 1 + parseInt(countConnections.countConnections);
        mpTrafficLog.update ({countConnections: {$exists: true}},
                        {countConnections: countConnections});
    } else {
        // First connection, w00t!
        mpTrafficLog.insert ({countConnections: 1});
    }
    // IPs
    // This was super buggy but I think I got it, so check it latz
    counter = 0;
    mpTrafficLog.insert ({logIPs: ipObject}, function (error, id) {
        if (id) {
            // console.log('Success');
        } else {
            console.log('Failed');
        }
    }); 
    if (mpTrafficLog.find({uniqueIPs: {$exists: true}})
            && (uniqueIP = mpTrafficLog.findOne({'uniqueIPs.ip': ip}))) {
        // ID of record to update
        id = uniqueIP._id;
        // Increment visit count for this ip
        counter = uniqueIP.uniqueIPs.count + 1;
        // Updte existing record
        mpTrafficLog.update ({_id: id}, 
                        {uniqueIPs: {ip: ip, count: counter, stamp: stamp}});
    } else {
       // Insert new unique IP record!
        mpTrafficLog.insert ({uniqueIPs: {ip: ip, count: 1, stamp: stamp}});
        // Increment or initialize unique IP count
        if (!mpTrafficLog.update ({countUniqueIPs: {$exists: true}}, 
                            {$inc: {countUniqueIPs: 1}})) {
            mpTrafficLog.insert ({countUniqueIPs: 1});
        }
    }
    // URLs
    // A URL's count is page views/url loads (I think)
    // countUniqueURLS is lifetime # of URLs that have existed
    // Strange, right?  Meteor. <3
    counter = 0;
    mpTrafficLog.insert ({logURLs: urlObject});
    if (mpTrafficLog.find({uniqueURLs: {$exists: true}})
            && (uniqueURL = mpTrafficLog.findOne({'uniqueURLs.url': url}))) {
        // Get ID of record to update
        id = uniqueURL._id;
        // Increment count for this url
        counter = 1 + uniqueURL.count;
        // Updte existing record
        mpTrafficLog.update ({_id: id},
                        {uniqueURLs: {url: url, count: counter, stamp: stamp}});
    } else {
        // Insert new unique URL record
        mpTrafficLog.insert ({uniqueURLs: {url: url, count: 1, stamp: stamp}});
        // Incremement or initialize unique URL count
        if (!mpTrafficLog.update ({countUniqueURLs: {$exists: true}}, 
                            {$inc: {countUniqueURLs: 1}})) {
            mpTrafficLog.insert ({countUniqueURLs: 1});
        }
    }
    // Browser (user agent) log
    counter = 0;
    if (mpTrafficLog.find({browsers: {$exists: true}})
            && (uniqueBrowser = mpTrafficLog.findOne({'browsers.browser': browser}))) {
        // Get ID of record to update
        id = uniqueBrowser._id;
        // Increment count for this url
        counter = 1 + uniqueBrowser.count;
        // Updte existing record
        mpTrafficLog.update ({_id: id},
                        {browsers: {browser: browser, count: counter, stamp: stamp}});
    } else {
        // Insert new browser
        mpTrafficLog.insert ({browsers: {browser: browser, count: 1, stamp: stamp}});
        // Incremement or initialize browser count
        if (!mpTrafficLog.update ({countUniqueBrowsers: {$exists: true}}, 
                            {$inc: {countUniqueBrowsers: 1}})) {
            mpTrafficLog.insert ({countUniqueBrowsers: 1});
        }
    }
    // Visitors
    mpTrafficLog.insert ({logVisitors: visitor});
    // This probably needs to change when user logs in
    if (userActive) {
        // Registered Visitors
        if (!mpTrafficLog.update ({countVisitorsRegistered: {$exists: true}}, 
                            {$inc: {countVisitorsRegistered: 1}}, true)) {
            mpTrafficLog.insert ({countVisitorsRegistered: 1});
        }
    } else {
        // Anonymous Visitors
        if (!mpTrafficLog.update ({countVisitorsAnonymous: {$exists: true}}, 
                            {$inc: {countVisitorsAnonymous: 1}}, true)) {
            mpTrafficLog.insert ({countVisitorsAnonymous: 1});
        }
    }
    // Primary language
    counter = 0;
    if (uniqueLanguage = mpTrafficLog.find({'languages.language': languagePrimary})) {
        // Grab ID
        id = uniqueLanguage._id;
        // Increment count for this language
        counter = 1 + uniqueLanguage.count;
        // Update count for this language
        mpTrafficLog.update ({_id: id}, 
                        {language: languagePrimary, count: counter, stamp: stamp});
    } else {
        // Insert new language
        mpTrafficLog.update ({languages: {$exists: true}},
                        {$addToSet: {languages: languagePrimary, count: 1, stamp: stamp}},
                        true);
    }
    // Secondary language
    counter = 0;
    if (uniqueLanguage = mpTrafficLog.find({'languages.language': languageSecondary})) {
        // Grab ID
        id = uniqueLanguage._id;
        // Increment count for this language
        counter = 1 + uniqueLanguage.count;
        // Update count for this language
        mpTrafficLog.update ({_id: id}, 
                        {language: languageSecondary, count: counter, stamp: stamp});
    } else {
        // Insert new language
        mpTrafficLog.insert ({languages: {language: languageSecondary, count: 1, stamp: stamp}});
    }

    // Template count?

    // This is probably an appropriate place for stop()..
    //   but what other ramifications are there?
    //   What about things I /do/ want to do every time?
    //   Would anything even make sense to do like that? :>
}



Meteor.methods ({
/*
    // Template rendering logger
    logRenders: function () {
    .each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;
 
      template.rendered = function () {
        console.log(name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
  }
*/

});

/*
 * This should only run once, right?
 */

/*
 *if (stats.pageLoadsFull) {
 *    Stats.pageLoadFull();
 *} else {
 *    // First run
 *    Stats.insert({pageLoadsFull: 1});
 *}
 *
 *Stats.pageLoadFull = function() {
 *    Stats.update({$inc: {pageLoadsFull: 1}});
 *    //Stats.insert({uniqueIPs: {visitorsUniqueIP: 1, ip:  }});
 *}
 */

