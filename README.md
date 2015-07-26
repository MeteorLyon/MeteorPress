# #MeteorPress v1.0.0-beta.3 (in progress)

# TL;DR

A robust Meteor based hybrid content management system.  I say 'hybrid' because it has a markdown editor, options for anonymous editing, revision history and eventually will bring up the page editor when a user with appropriate permissions (could be anonymous) lands on a non-existent route much like a wiki.  However, it also has all the robustness of a full-blown content management system.

Another hybrid quality comes from being built upon Meteor which means that you could also use #MeteorPress as a framework for a mobile application with minimal effort!

Screen shots @ the bottom of this page and [on twitter](http://twitter.com/idometeor/media), video playlist on [YouTube here](https://www.youtube.com/playlist?list=PLz5iYsoODTu4bkLLkUf6yEk2LCCvO7ua8).

# Coding Style & Layout

It is kind of messy right now.  It's also very big.  I moved to [#OnePageWonder](http://github.com/idometeor/onepagewonder) to finely hone my Meteor style and architecture and it is close to what I'm striving for.  You can get a concise view by looking at the [tree.txt](https://github.com/iDoMeteor/meteorpress/blob/master/notes/tree.txt) or [tree-d.txt (directories only)](https://github.com/iDoMeteor/meteorpress/blob/master/notes/tree-d.txt).

# Why?

After spending a lot of time on [#Twiefbot](http://github.com/idometeor/twiefbot), I decided to challenge myself to make an app a day for seven days and then blog about it.  Well, I made the first day's mission setting up a Meteor based blog because I absolutely refuse to use Wordpress and I didn't even think of using my old one.

Let's just say that it did not go well.  The ones I did get to work did not work well or even come close to doing what I wanted.  I guess I have high standards after spending so many years using my own custom CMS.

Therefore, I made it my mission to solve that problem not just for myself but for everyone.

# Why the change to [#OnePageWonder](http://github.com/idometeor/onepagewonder)

This system is super complex.  I put it on pause for two reasons.
A) I needed to produce something I could profit from, faster.
B) I needed to really nail down a few of the more esoteric Meteor concepts in a ... simpler environment.

I shall love them both equally, forever (or until I move into my 2045 avatar!).  I promise.

# Current Status

Beta three is quite stable right now, but the customized page editor is not complete and does not save.  The first two betas worked well with auto-forms, current mission is to finish the page editor.  The file structure is still in very beta mode. :>

* [Main Site](http://meteorpress.org) (in maintenance mode atm)
* [Demo Site](http://demo.meteorpress.org) (resets daily, go ahead and install it!)
* [Trello development board](https://trello.com/b/cMAulFo4/development)

* Installer works (/install).
    1. Installs admin email/password user (required, rest are skippable).
    2. Installs social login keys.
    3. Installs Google Analytics keys.
    3. Installs Kadira keys.
        * Coming soon: Rollbar & Atmosphere keys
    4. Allows customization of all settings (strings still mixed between hard code & 'constants' and non-databased).
    5. Offers to install default content (might not be done?).
    6. Eventually will offer theme & plug-in selection.
    * Caveat: I have been wrestling with getting it to intelligently run the installer when required (no config in database) without showing it to a client first.  Currently I think it is route based, I might have a solution in my head but execution of that may be a while.
* Administration
    * Configuration editor works but is quick-formed
    * News & article/post editor work as auto-forms.
    * Page editor is (soon to be super duper awesome) where I left off to work on [#OnePageWonder](http://github.com/idometeor/onepagewonder), I will return the autoform version as a fallback until complete as soon as I can
    * Post editor works via autoform
    * Roles editor, works and is meant to be extensible
    * Service key editors... are probably autoformed.
    * User editor has been designed (views: single, large cards, small cards, table) but lacks functionality
* MP Markdown
    * I wrote a really nice markdown parser before I found the GFM Javascript library.  I may use that instead, or alter my code a bit to more closely resemble it.
* Consumer output
    * Pages, posts & news will all be sensibly output if you manage to get them in. :)
    * Current semantic, unstyled output is presented in the following order:
        1. 3 most recent news items.
        2. Page title & summary data (so you can make sexy full-width front page designs predicatably w/bg image from page settings).  Audio & image attachments are working, I forget about videos & such.  Also, I forget if they are sorted or just alphabetical right now.
        3. A limited set of posts/articles are output, not sure if it's a togglable header list that expands summaries or not yet. :D
* Navigation
    * All navigation & routes are currently static. I am awesome at navigation design though, you can read a little story about the design and implication of a tertiary navigation system into my PHP CMS circa 2007 here, and the custom Smarty plug-in I wrote to assist it here.
    * The #MeteorPress navigation style is pretty well tested but I did introduce a bug right (in unrelated code! :|) before I finished (just something w/the icon).  It will be the standard navigation for MP until 2.0 or later but still has some indentation & icon work to do.
* File structure
    * Is b3 status which means chunky and kind of .. prone to wandering around.  In other words, it's a mess right now. :D  [#OnePageWonder](http://github.com/idometeor/onepagewonder) is much cleaner and the lessons I'm learning there will be transferred here before beta.3 is complete.
* Database structure
    * Is where I began and pretty thorough although I intend to drop autoforms/collection2/etc in favor of the new one I recently found (or might write my own).
* Dynamic Plug-ins and Themes
    * Integral features near and dear to my heart, but quite complex to work out in within the bounds of Meteor.  I am still mapping out the specifics in my head but am most certainly open to suggestions!

> Previous betas work just fine as skeletons and are in my tarballs repository.

> Thanks to a tip I read by Matt DeBergalis I anticipate ES6 modules to help me clean up the namespacing, load order & file system quite a bit!

# Installation

I am working on Meteor-style cURL installers that will allow one to choose between tarball, tarball with example data or Github install for both #MeteorPress and [#OnePageWonder](http://github.com/idometeor/onepagewonder).

Until then:

    $ git clone ssh://git@github.com:iDoMeteor/meteorpress.git
      * iDoMeteor is case sensitive (thx Github :p)!
    $ cd meteorpress
    $ meteor
    Open localhost:3000 (or localhost:3000/install?) in your browser and go from there!

Template Steps

    mpInstallWelcome
    mpInstallSuperUser
    mpInstallLoginKeys
    mpInstallGoogleAnalytics
    mpInstallKadira
    mpInstallConfiguration
    mpInstallDefaultContent
    _/- mpInstallSuccess
     \- mpInstallFailure

# The Magic

Is all over the place (it's Meteor after all!), but fairly dusty.

# Procedural View

* Server side view

  * Server side code executes
      * Default configuration is read from ./opw/init
      * API loads and together with above provide everything needed to continue
      * Collections are instantiated, including general publications and allow/deny model
      * Global initialization tries to run installer if required but needs to init
      * Error methods are loaded (not used yet, may not be)
      * Iron Router loads (static, switching to Flow soon asap anyway)
      * Schemas are loaded (I went to town, going to switch packages though)
      * Strings are loaded (going to database eventually)
  * Library loading begins
      * Plug-in engine theoretically fires up ;> (ie; lib/plug-ins)
      * Server library fires
  * Server plug-ins load
  * Root level plugins load (where you might put custom, client-specific plugs on a set it & forget it profit oriented job)
  * Meteor "server environment" starts up on the server fires (meteorpress/server/main.js)
  * Meteor startup from the library fires (meteorpress/lib/main.js) (this doesn't log the env atm, so who knows)
  * Meteor.startup in meteorpress/server/main.js actually fires

* Client side load order

    * Defaults
    * Client init (GAnalytics lives here currently)
    * API
    * Collections
    * Global init
    * Global methods
    * Routes
    * Schemas
    * Strings
    * Global subscriptions (template subs on load ofc)
    * Plugin engine
    * Selected theme (typically /client in a Meteor project)
    * Installation check (obviously out of order)
    * Markdown parser
    * Theme engine (placeholder)
    * Lazy plugins (drop-ins, placeholder)
    * Main shared env
    * Meteor figures out if we're logged in and does role check



#Feedback:

Tweet it to .@iDoMeteor with #MeteorPress. Customized sites w/screenshots ftw!

Please provide general feedback to me via Twitter public mention, for bug reports
use DM with your favorite pasting service of choice with the console logs from both
the server & client, your browser & OS, and description of problem.  Preferably in
a such a way that will allow me to reproduce it.

Bug and feature requests on Github or Trello, please.

# Caveats

* Yes, I could easily control file loading if/when I package this.  *However*, there are distinct disadvantages (and advantages) to providing this system as a package.  I intend to offer both and therefore tight control over natural load order is integral.  And still being nailed down.  Beginners and profit hackers will appreciate being able to rip right into the code on a per-project basis.
* Some of these files are currently just place holders so I can shuffle them around and see where I would like them to eventually load from.

# Screen Shots

[Check them on Twitter](http://twitter.com/iDoMeteor/media)

# Videos on YouTube

They average 10-12 minutes but are quite thorough!

* Installation: https://www.youtube.com/watch?v=dLk5XEyjTR8
* Front end: https://www.youtube.com/watch?v=hCNImgOzNN4
* Role editor: https://www.youtube.com/watch?v=aqzA-\_X7iGM
* Page editor (audio): https://www.youtube.com/watch?v=Ega-e5D3Ir4
* Page editor (images): https://www.youtube.com/watch?v=HIZIwZT7ISo

# Extraneous

All user profile objects can be counted on to provide:
    created     date
    email       string  *
    image       string  *
    ips         array
    name        string
    username    string

> May be null, otherwise it will have value

Things I *really* don't have time for, maybe ever:

    A bunch of awesome themes, custom web icon font set
    Front-end & unit testing
    Mobile testing
