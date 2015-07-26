Template.mpChat.helpers ({

    lines: function () {
        return mpChat.find({}, {sort: {stamp: 1}});
    },
    prompt: function () {
        return 'Chat it up!';
    },
    moment: function () {
        return moment(this.stamp).fromNow();
    },

});

Template.mpChat.events ({

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
    
    // Add new line to chat
    'keypress #chat-input': function (e) {
        if (e.which === 13) {
            
            line = $('#chat-input').val().trim(),

            // Add string to database
            Meteor.call ('chatAdd', line, function (error) {
                if (error) {
                    errorThrow(error.reason);
                } else {
                    // Clear chat input
                    $('#chat-input').val("");
                }
            });

        }
    // End keypress
    },

    // Prevent form submission
    'submit': function(e) {
        e.preventDefault();
        return false;
    }

// End chat events
});
