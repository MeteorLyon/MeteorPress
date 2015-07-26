console.log ('INFO Loading #MeteorPress global methods');
/*
 * Allow errors for all
 */
mpErrors.allow ({
    insert: function(){return true;},
    update: function(){return true;}
});

/*
 * Throw an error message
 */
errorThrow = function (message) {
    // Don't insert dupes
    // Not using IDs, check to make sure they are not displayed for other users
    var exists = mpErrors.findOne({message: message});
    if (!exists) {
        mpErrors.insert ({message: message, seen: false})
    }
    // Hack to get iron router's spinner out of the way
    $('#iron-router-progress').hide();
}

/*
 * Remove single error that has been flagged as viewed
 */
errorClear = function(id) {
    mpErrors.update(id, {$set: {seen: true}});
}

/*
 * Flag all errors as seen
 */
errorClearAll = function() {
    for (var error in errors) {
        mpErrors.update(error._id, {$set: {seen: true}});
    }
}
