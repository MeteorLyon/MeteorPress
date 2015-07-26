console.log ('INFO Loading #MeteorPress MarkDown parser');
/**************************************************************************************************
 * 
 *
 * @Summary             #MeteorPress MarkDown by @iDoMeteor
 *
 * @Author              @iDoMeteor, iDoMeteor@Gmail.com, @TwiefBot, @iDoMeteorPress
 * @Blocking            No methods provided within shall block
 * @Class
 * @Description         #MeteorPress MarkDown
 *                      This is fairly specific to MP collection schema,
 *                      but could be adapted to other projects fairly easily
 *
 * @Disclaimer          I have never bothered to really learn any form of markdown, so..
 *                          I am open to suggestions :>
 * @File                mp-markdown.js
 * @Version             v1.0.0-beta.3 {{Paranoid::Pete}}
 *
 *
 * @Example
 *
 * TODO:    Just paragraphs & videos I think! :D
 *          Allow passing of custom parameters
 *              ie; class/id/data attribs
 *          Auto mode (start w/#auto)
 *              Single lines become headings
 *              Paragraphs Ps
 *              Inline still parsed (bold/em/links)
 *              UL lists only
 *                  *items
 *          Allow putting src attribs directly into #media shortcuts
 *
 * ***********************************************************************************************/

/**
 *
 * @Description 
 * This is the only method that needs to be called externally, it will utilize other
 * methods herein.  It simply takes a string and returns that string with MeteorPress
 * Markdown elements replaced by the appropriate HTML wrappings.
 *
 * It will attempt to process a string of any size, so you know.. don't send it /dev/random.
 * 
 * If the parameter is not a string or an empty string, it will return undefined.
 *
 * @Method      parseMarkDown
 * @Blocking    false
 * @Param       {string|object}      context
 *              This needs to be a markdown string or a valid
 *              news/page/posts compatible object that will
 *              pass MP.validateContext
 * @Returns     {string}
 *
 */
MP.parseMarkDown = function (context) {

    // iS we haz permission
    if (!MP || !MP.enableMPMarkdown) {
        console.log ('#MeteorPress is not loaded, MP Markdown disabled');
        return;
    }

    // Validate (all other methods may assume string to be a string)
    if ('string' == typeof(context)) {
        // Convert to object for further processing
        context = {body: context};
    } else if (MP.isNotValidContext(context)) {
        // Context is an object with a valid body member
        MP.log ('WARNING Useless use of cat when attempting to parse MP MarkDown');
        return;
    }

    // Contextuals
    context.blockOpen   = null; // Expects ### to follow
    context.lines       = context.body.split('\n');
    context.newLine     = null;
        // punny eh?
    context.oldLine     = null;

    // Locals
    newLines    = [];
    finishLines = [];

    // Parse lines for full line tags
    _.each(lines, function sendLinesToParser (line) {

        context.words = line.split('\s');

        // Push a new line on to the return stack
        if (context.blockOpen && ('##' == line.substr(0,2))) {
            // Close it
            newLines.push(context.blockOpen);
            context.blockOpen = null;
        } else { 
            // Send it to line parser and add to stack
            context.oldLine = line;
            context = MP.parseMarkDownLine (context);
            if (context.newLine) newLines.push(context.newLine);
            context.newLine, context.oldLine = null;
        }

    });

    // Parse lines for inline font style tags
    context.tagOpen = null;
    _.each(newLines, function parseLinesToWords (line) {

        var words = line.split(' ');
        var newWords = [];

        _.each(words, function sendWordsToParser (word) {

            // Push a new word on to the return stack
            if (context.tagOpen && (/(\*|\/|--|\~\~)$/.test(word))) {
                // Close it
                newWords.push(word + context.tagOpen);
                context.tagOpen = null;
            } else if (/^(\*|\/|--|\~\~)/.test(word)) {
                // Send it to line parser and add to stack
                switch (word.substr(0,1)) {
                    case '*':
                        word = '<strong>' + word;
                        context.tagOpen = '</strong>';
                        break;
                    case '/':
                        word = '<italic>' + word;
                        context.tagOpen = '</italic>';
                        break;
                    case '-':
                        word = '<del>' + word;
                        context.tagOpen = '</del>';
                        break;
                    case '~':
                        word = '<' + word + '>';
                        context.tagOpen = '</' + word + '>';
                        break;
                }
                newWords.push(word);
            }

        });

        finishLines.push (newWords.join(' '));

    });
    
    return (finishLines.join('\n'));

};


/**
 *
 * @Description XXX
 *
 * @Method      XXX
 * @Blocking    false
 * @Param       string      string
 * @Returns     string 
 *              This *will* return what it is passed, with substitutions
 * TODO         This could take class/id params..as could the others
 *
 */
MP.parseMarkDownBlockCommands = {

    'code': function () {
        // set blockOpen
        return '<code>';
    },    
    'definitions': function () {
        return '<dl>';
    },    
    'list': function () {
        return '<ul>';
    },    
    'ordered': function () {
        return '<ol>';
    },    
    'pre': function () {
        return '<pre>';
    },    

};

/**
 *
 * @Description XXX
 *
 * @Method      XXX
 * @Blocking    false
 * @Param       string      string
 * @Returns     string 
 *              This *will* return what it is passed, with substitutions
 *
 */
MP.parseMarkDownCommands = {

    '1': function (string) {
        return '<h1>' + string + '</h1>';
    },    
    '2': function (string) {
        return '<h2>' + string + '</h2>';
    },    
    '3': function (string) {
        return '<h3>' + string + '</h3>';
    },    
    '4': function (string) {
        return '<h4>' + string + '</h4>';
    },    
    '5': function (string) {
        return '<h5>' + string + '</h5>';
    },    
    '6': function (string) {
        return '<h6>' + string + '</h6>';
    },    
    'audio': function (context) {
        // Assuming context is known to be valid

        // Locals
        var string  = context.line;
        var words   = string.split(' ');
        if (!words.length) return string;
        var src     = (/^(http|\/)/i.test(words[words.length-1]))
                    ? words.pop()
                    : null;
        var title   = words.join(' ');

        // Validate & assign string parameters
        if (!src) {

            // Check for matching title in context object
            if (context.audio.length) {

                // Loop for title match
                _.some(context.audio, function (array) {

                    if (title.toLowerCase() == array.title.toLowerCase()) {

                        // Match
                        src = array.link;
                        return true;

                    } else {
                        // No match, keep going
                        return false
                    }

                });

            } else {
                // No source
                return string;
            }

        }

        // Formulate return string
        // TODO: Make controls optional
        string = '<audio '
               + 'title="' + title + '" '
               + 'src="' + src + '" controls>'
               + 'Download: <a href="' + src + '">'
               + title + '</a>'
               + '</audio>';

        // Send it back
        return string;

    },    
    'def': function (string) {
        return '<dd>' + string + '</dd>';
    },    
    'hr': function (string) {
        return '<hr />';
    },    
    'image': function (context) {
        // Assuming context is known to be valid
        // TODO: Finish

        // Locals
        var string  = context.line;
        var words   = string.split(' ');
        if (!words.length) return string;
        var src     = (/^(http|\/)/i.test(words[words.length-1]))
                    ? words.pop()
                    : null;
        var title   = words.join(' ');

        // Validate & assign string parameters
        if (!src) {

            // Check for matching title in context object
            if (context.images.length) {

                // Loop for title match
                _.some(context.images, function (array) {

                    if (title.toLowerCase() == array.title.toLowerCase()) {

                        // Match
                        // TODO src = array.X;
                        return true;

                    } else {
                        // No match, keep going
                        return false
                    }

                });

            } else {
                // No source
                return string;
            }

        }

        // Formulate return string
        // TODO: Add link to largest quality
        string = '<img '
               + 'alt="' + title + '" '
               + 'title="' + title + '" '
               + 'src="' + src + '"'
               + ' />';

        // Send it back
        return string;

    },    
    'item': function (string) {
        return '<li>' + string + '</li>';
    },    
    'link': function (context) {
        // Assuming context is known to be valid

        // Locals
        var string  = context.line;
        var words   = string.split(' ');
        if (!words.length) return string;
        var href    = (/^(http|\/)/i.test(words[words.length-1]))
                    ? words.pop()
                    : null;
        var title   = words.join(' ');

        // Validate & assign string parameters
        if (!src) return string;

        // Formulate return string
        // TODO: Make controls optional
        string = '<a '
               + 'title="' + title + '" '
               + 'href="' + href + '">'
               + title
               + '</a>';

        // Send it back
        return string;
    },    
    'term': function (string) {
        return '<dt>' + string + '</dt>';
    },    
    'video': function (context) {
        // Assuming context is known to be valid
        // TODO: Finish

        // Locals
        var string  = context.line;
        var words   = string.split(' ');
        if (!words.length) return string;
        var src     = (/^(http|\/)/i.test(words[words.length-1]))
                    ? words.pop()
                    : null;
        var title   = words.join(' ');

        // Validate & assign string parameters
        if (!src) {

            // Check for matching title in context object
            if (context.video.length) {

                // Loop for title match
                _.some(context.video, function (array) {

                    if (title.toLowerCase() == array.title.toLowerCase()) {

                        // Match
                        src = array.link;
                        return true;

                    } else {
                        // No match, keep going
                        return false
                    }

                });

            } else {
                // No source
                return string;
            }

        }

        // Formulate return string
        // TODO: This will be trickier :)

        // Send it back
        return string;

    },    

};

/**
 *
 * @Description Parses individual lines of text and wraps things in HTML
 *
 * @Method      parseUtilLine
 * @Blocking    false
 * @Param       string      string
 * @Returns     string 
 *              This *will* return what it is passed, with substitutions
 *
 */
MP.parseMarkDownLine = function (context) {

    // Locals
    var line            = context.oldLine;
    var command         = null;
    var ignore          = ('#' == /^#/.test(line)) ? false : true;
    var isCommand       = ('# ' == line.substr(0,1)) ? true : false;
    var isComment       = ('## ' == line.substr(0,2)) ? true : false;
    var isLineBreak     = ('' == line) ? true : false;

    // Ignore it if it does not start with a #
    // ... actually, this could be the start of a paragraph (open a block tag) 
    // or inside of a paragraph ending marked by blank line
    if (ignore) {
        context.newLine = line;
        return context;
    }

    // Is it a comment?
    if (isComment) {
        context.newLine = null;
        return context;
    }

    // Is it a line break
    if (isLineBreak) {
        context.newLine = '<br />';
        return context;
    }

    // Strip #
    command = context.words[0].substr(1);
    // Is it registered markdown block command?
    if (_.findKey(MP.parseMarkDownBlockCommands, command)) {

        // Open it up
        context.blockOpen = '</' + command + '>'; // Er, close it up :D
        context.newLine = MP.parseMarkDownBlockCommands[command]();

    // or a registered markdown self-closing command?
    } else if (_.findKey(MP.parseMarkDownCommands, command)) {

        // Get rid of command trigger
        context.words.shift();
        // Formulate new line to be wrapped
        line = context.words.join(' ');
        // Put the jimmy on
        switch (command) {
            case 'audio':
            case 'image':
            case 'link':
            case 'video':
                context.line    = line;
                context.newLine = MP.parseMarkDownCommands[command](context);
                break;
            default:
                context.newLine = MP.parseMarkDownCommands[command](line);
        }

    // Custom tag
    } else {

        // Provide open flag (closing tag) 
        context.blockOpen = '</' + command + '>';
        // Open a new custom tag
        context.newLine = '<' + command + '>';

    }

    // Send it home
    return context;

};
