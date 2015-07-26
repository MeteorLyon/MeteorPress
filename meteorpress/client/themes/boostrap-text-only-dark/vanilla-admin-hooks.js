Template.mpAdminConfiguration.helpers ({

    collectionConfiguration: function () {
        return mpConfiguration;
    },

});

Template.mpAdminNews.helpers ({

    collectionNews: function () {
        return mpNews;
    },

});

Template.mpAdminPosts.helpers ({

    collectionPosts: function () {
        return mpPosts;
    },

});

Template.mpAdminPosts.helpers ({

    collectionPosts: function () {
        return mpPosts;
    },

});

Template.mpAdminRoles.events ({

    'focus input': function (event) {
       $(event.target).parent().siblings('i').removeClass('fa-caret-right');
       $(event.target).parent().siblings('i').addClass('fa-caret-down');
       $(event.target).parent().parent().next().show('blind', {direction: 'up', easing: 'easeInCirc'}, 1000);
    },

    'keyup .mp-admin-role-inputs': function (event) {
        var name = ($('#mp-admin-roles-qa-name').val().trim().length);
        var desc = ($('#mp-admin-roles-qa-desc').val().trim().length);
        if (name && desc) {
            $('#mp-admin-button-add-role').removeClass('disabled');
        } else {
            $('#mp-admin-button-add-role').addClass('disabled');
        }
    },

    'click .mp-re-toggle': function (event) {
        var target = $(event.target).parent();

       $(target).children('i').toggleClass('fa-caret-right');
       $(target).children('i').toggleClass('fa-caret-down');
       $(target).next().toggle('blind', {direction: 'up', easing: 'easeInOutCirc'}, 1000);
    },

    'click .close-role': function (event) {
       $(event.target).closest('dd').prev().children('.fa').removeClass('fa-caret-down');
       $(event.target).closest('dd').prev().children('.fa').addClass('fa-caret-right');
       $(event.target).closest('dd').hide('blind', {direction: 'up', easing: 'easeOutCirc'}, 1000);
    },

    // This processes an attempt to save a role
    'click #mp-admin-button-add-role': function (event) {
        
        var fName       = null;
        var fSet        = {};
        var fSets       = [];
        var features    = mpRoleFeatures.find({}, {sort: {label: 1, name: 1}}).fetch();
        var permValue   = null; // Set to true if toggle has 'perm-true' class
        var perms       = mpRolePerms.find().fetch();
        var rSet        = {
            name:       $('#mp-admin-roles-qa-name').val(),
            description:$('#mp-admin-roles-qa-desc').val(),
            features:   [],
        };
        var user         = Meteor.user();
        MP.log('DEBUG: User attempting to add role:\n' + JSON.stringify(user, null, 4), 1);

        // Construct insertion object (based on roleTemplate helper)
        _.each(features, function (value) {
            fSet = {
                label: value.label,
                name:  value.name,
            }
            fName = value.name;
            _.each(perms, function (v) {
                k = v.name;
                if (
                    $('#mp-admin-roles-quick-add').find('.mp-role-' 
                        + fName + '-' + k).hasClass('perm-true')
                ) {
                    permValue = true;
                } else {
                    permValue = false;
                }
                fSet[k.toString()] = permValue;
            });
            fSets.push(fSet);
        });
        rSet.features = fSets;

        // Insert it
        MP.insertRole (rSet, user, function (result) {

            return (result) ? (
                // Success, set response and reset form
                MP.log('SUCCESS Inserted new role: ' + rSet.name),
                $('#mp-admin-roles-quick-add').find('.mp-toggle-perm').removeClass('text-success text-warning text-danger'),
                $('#mp-admin-roles-quick-add').find('input').val(''),
                true
            ) : (
                // Failure, set error message and wait
                MP.log('FAIL Trying to insert new role: ' + rSet.name),
                false
            );

        });

        // Debug
        MP.log('DEBUG: QA role set:\n' + JSON.stringify(rSet, null, 4), 1);
        return false;
    },

});

Template.mpAdminRoles.helpers ({

    // This sets up the QA role table values
    roleTemplate: function () {
        
        var perms       = mpRolePerms.find().fetch();
        var features    = mpRoleFeatures.find({}, {sort: {label: 1}}).fetch();
        var fSet        = {};
        var fSets       = [];
        var rSet        = {
            name:       'Name',
            description:'Description',
            features:   [],
        };
        _.each(features, function (value) {
            fSet = {
                label: value.label,
                name: value.name,
            }
            _.each(perms, function (v) {
                k = v.label;
                fSet[k.toString()] = false;
            });
            fSets.push(fSet);
        });
        rSet.features = fSets;
        return rSet;
    },

    roles: function () {
        return mpRoles.find(
            {
                removed: {$not: true}, 
                stale: {$not: true}
            }, 
            {
                sort: {name: 1, stamp: -1}
            }
        ).fetch();
    },


});

Template.mpAdminRolesTable.events ({

    'click .mp-lock-toggle': function (event) {
        
        var success = false;

        // Unlocking the lock
        if ($(event.target).children('i').hasClass('fa-lock')) {

            // Toggle the lock
            $(event.target).children('i').switchClass('fa-lock', 'fa-unlock', 750);

            // Enable refresh (uncomment upon coding it :)
            // $(event.target).next().removeClass('disabled');

            // And enable remove
            $(event.target).next().next().removeClass('disabled');
            // Change table bg
            $(event.target).closest('table').addClass('bg-warning', 1000);
            // Enable icons
            $('.mp-toggle-perm').removeClass('disabled');

            // TODO: Turn text into inputs
            // Show warning (needs to be last)

            $('.mp-lightbox').show('fade');

            return;

        // Locking up
        } else {

            // Toggle & spin the lock
            $(event.target).children('i').switchClass('fa-unlock', 'fa-lock', 750);
            // Disable refresh button
            $(event.target).next().addClass('disabled');
            // Disable remove button
            $(event.target).next().next().addClass('disabled');

            // Process changes
            var fName       = null;
            var fSet        = {};
            var fSets       = [];
            var features    = mpRoleFeatures.find({}, {sort: {label: 1, name: 1}}).fetch();
            var permValue   = null; // Set to true if toggle has 'perm-true' class
            var perms       = mpRolePerms.find().fetch();
            var rSet        = {
                id:         $(event.target).closest('dd').find('.mp-admin-role-id').val(),
                name:       $(event.target).closest('dd').prev().find('.mp-admin-role-name').text(),
                description:$(event.target).closest('dd').prev().find('.mp-admin-role-desc').text(),
                features:   [],
            };
            var user         = Meteor.user();
            MP.log('DEBUG: User attempting to update role:\n' + JSON.stringify(user, null, 4), 1);

            // Construct insertion object (based on roleTemplate helper)
            _.each(features, function (value) {
                fSet = {
                    label: value.label,
                    name:  value.name,
                }
                fName = value.name;
                _.each(perms, function (v) {
                    k = v.name;
                    if (
                        $(event.target).closest('tbody').find('.mp-role-' 
                            + fName + '-' + k).hasClass('perm-true')
                    ) {
                        permValue = true;
                    } else {
                        permValue = false;
                    }
                    fSet[k.toString()] = permValue;
                });
                fSets.push(fSet);
            });
            rSet.features = fSets;

            // Insert it
            MP.log('DEBUG: User attempting to update role with set:\n' + JSON.stringify(rSet, null, 4), 2);
            MP.insertRole (rSet, user, function (result) {

                return (result) ? (
                    // Success, TODO: set response

                    // Log it
                    MP.log('Update role: ' + rSet.name),
                    // Disable icons
                    $('.mp-toggle-perm').addClass('disabled'),
                    // Stop spinning the lock & lock it up
                    $(event.target).children('i').removeClass('fa-unlock fa-spin', 750),
                    // Lock it up
                    $(event.target).children('i').addClass('fa-lock', 750),
                    // Change table bg
                    $(event.target).closest('table').removeClass('bg-warning', 1000),
                    true
                ) : (
                    // Failure, TODO: set error messages

                    // Log it
                    MP.log('Failed to update role: ' + rSet.name),
                    // Stop spinning
                    $(event.target).children('i').removeClass('fa-lock fa-spin', 750),
                    // Unlock
                    $(event.target).children('i').addClass('fa-unlock', 750),
                    false
                );

            });
        }

    },

    'click .mp-role-refresh': function (event, template) {
        // TODO: & tricky i bet :p
    },

    'click .mp-role-remove': function (event) {

            // Toggle & spin
            $(event.target).children('i').addClass('fa-spin', 750);
            // Disable lock
            $(event.target).prev().addClass('disabled');
            // Disable refresh
            $(event.target).addClass('disabled');
            // Disable remove
            $(event.target).next().next().addClass('disabled');

            // Process changes
            var rSet        = {
                id:   $(event.target).closest('dd').find('.mp-admin-role-id').val(),
                name: $(event.target).closest('dd').prev().find('.mp-admin-role-name').text(),
            };
            var user         = Meteor.user();
            MP.log('DEBUG: User attempting to remove role:\n' + JSON.stringify(user, null, 4), 1);
            MP.log('DEBUG: User attempting to remove role with set:\n' + JSON.stringify(rSet, null, 4), 1);

            // Insert it
            MP.removeRole (rSet.id, user, function (result) {

                return (result) ? (
                    // TODO: Success, set response message
                    // Log it
                    MP.log('SUCCESS Removed role: ' + rSet.name),
                    true
                ) : (
                    // TODO: Failure, set error messages
                    // Log it
                    MP.log('FAIL Trying to remove role: ' + rSet.name),
                    // Stop spinning
                    $(event.target).children('i').removeClass('fa-spin', 750),
                    // Enable lock
                    $(event.target).prev().removeClass('disabled'),
                    // Enable refresh
                    // $(event.target).removeClass('disabled'),
                    // Enable remove
                    $(event.target).next().next().removeClass('disabled'),
                    false
                );

            });

    },

    'click #mp-admin-role-qa-reset': function (event, template) {
        $(event.target).closest('dd').find('.mp-toggle-perm').removeClass('text-success text-info text-danger');
        $(event.target).closest('dd').find('.mp-toggle-perm').addClass('text-muted');
    },

    'click .readOwn': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-success');
    },

    'click .createOwn': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-success');
    },

    'click .editOwn': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-success');
    },

    'click .deleteOwn': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-danger');
    },

    'click .readOthers': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-info');
    },

    'click .createOthers': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-info');
    },

    'click .editOthers': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-info');
    },

    'click .deleteOthers': function (event, template) {
        if ($(event.target).hasClass('disabled')) return false;
        $(event.target).toggleClass('perm-true bold text-muted text-danger');
    },

});

Template.mpAdminRolesTable.helpers ({

    // Tells the table template how to proceed
    isQA: function () {
        if ('Name' == Template.currentData().name) {
            return true;
        }
        return false;
    },

});

Template.mpAdminRolesTable.onRendered(function () {

    // Disable QA button
    $('#mp-admin-button-add-role').addClass('disabled');
    // Disable icons
    $('.mp-admin-role-container').children('.mp-toggle-perm').addClass('disabled');

});

Template.mpAdminUsers.events({
});

Template.mpAdminUserTable.helpers({

    roles: function () {
        
        var returnArray = [];
        var orphans     = {};

        // Get roles array
        var roles = mpRoles.find({
            removed: {$not: true}, 
            stale: {$not: true}
        }, {
            fields: {
                name: 1, 
                description: 1
            }, 
            sort: {
                name: 1
            },
            limit: 100,
        }).fetch();

        // Debug
        MP.log('User table roles array:\n' + JSON.stringify(roles, null, 4), 2);

        // Add users
        if (MP.isSuperUser()) {
            _.each (roles, function (role) {
                role.users = mpUsers.find({
                                            roles: {$in: [role._id]},
                                          }, 
                                          {
                                             sort: {username: 1},
                                             limit: 100
                                          }).fetch();
                if (role.users.length) {
                    returnArray.push(role);
                }
                // Debug
                MP.log('Users in role ' + role.name + '\n' + JSON.stringify(role.users, null, 4), 2);
            });
            // Get orphans
            orphans       = {
                name:       'Orphans',
                description:'These users have no role assigned.',
            }
            orphans.users = mpUsers.find({
                                        roles: {$exists: false},
                                      }, 
                                      {
                                          sort: {username: 1},
                                          limit: 100
                                      }).fetch();
            if (orphans.users.length) {
                returnArray.push(orphans);
            }

        } else {
            _.each (roles, function (role) {
                role.users = mpUsers.find({
                                            roles: {$in: [role._id]},
                                            removed: {$not: true},
                                          }, 
                                          {
                                             sort: {username: 1},
                                             limit: 100
                                          }).fetch();
                if (role.users.length) {
                    returnArray.push(role);
                }
                // Debug
                MP.log('Users in role ' + role.name + '\n' + JSON.stringify(role.users, null, 4), 2);
            });
            // Get orphans
            orphans       = {
                name:       'Orphans',
                description:'These uses have no role assigned.',
            }
            orphans.users = mpUsers.find({
                                        roles: {$exists: false},
                                        removed: {$not: true},
                                      }, 
                                      {
                                          sort: {username: 1},
                                          limit: 100
                                      }).fetch();
            if (orphans.users.length) {
                returnArray.push(orphans);
            }

        }

        // Debug
        MP.log('Orphan users\n' + JSON.stringify(orphans, null, 4), 2);

        // Debug
        MP.log('User table roles array:\n' + JSON.stringify(roles, null, 4), 2);
        return returnArray;

    },

});

Template.mpAdminUsers.onRendered(function () {
});

Template.mpAdminUserHoverCard.events({
});

Template.mpAdminUserTable.events({
});

Template.mpAdminUser.events({
});

Template.mpAdminUserCards.events({
});

Template.mpAdminUserTiles.events({
});

Template.mpAdminUserTiles.helpers({

    user: function () {
    }

});

Template.mpAdminUserTiles.onRendered(function () {
});

