/*
 * Error publications
 */
Meteor.publish('mperrors', function() {
    // Should check user's specific flags in addition to site flagged
    return mpErrors.find({
            seen: false
        });
});

Meteor.methods ({

    /*
     * Remove single error that has been flagged as viewed
     */
    errorClear: function() {
        alert("trying: " + this._id);
        mpErrors.update(this._id, {$set: {seen: true}});
    },

    /*
     * Flag all errors as seen
     */
    errorClearAll: function() {
        for (var error in errors) {
            mpErrors.update(this._id, {seen: true});
        }
    }

});
