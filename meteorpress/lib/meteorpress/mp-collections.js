console.log ('INFO Loading #MeteorPress collections');
/******************************************************************************
 *
 * Locals
 *
 *****************************************************************************/

// Schema object
mpSchemas = {};

/******************************************************************************
 *
 * Collections
 *
 * Schemas are at the end of global init
 *
 * TODO:
 *      More schemas
 *      Collections for user history, admin actions, errors
 *      Tags collection for tagging
 *          with autocomplete
 *          and  autotags (5 highest word count > 1)
 *
 *****************************************************************************/

mpBannedIPs     = new Meteor.Collection (mpPrefix + 'bannedips');
mpBannedUsers   = new Meteor.Collection (mpPrefix + 'bannedusers');
mpBSElements    = new Meteor.Collection (mpPrefix + 'bselements');
mpChat          = new Meteor.Collection (mpPrefix + 'chat');
mpConfiguration = new Meteor.Collection (mpPrefix + 'configuration');
mpErrors        = new Meteor.Collection (mpPrefix + 'errors');
mpGroups        = new Meteor.Collection (mpPrefix + 'groups');
mpLogLog        = new Meteor.Collection (mpPrefix + 'loglog');  // Yep, iJustDid
mpLogContact    = new Meteor.Collection (mpPrefix + 'logcontact');
mpNews          = new Meteor.Collection (mpPrefix + 'news');
mpPages         = new Meteor.Collection (mpPrefix + 'pages');
mpPosts         = new Meteor.Collection (mpPrefix + 'posts');
mpRoleFeatures  = new Meteor.Collection (mpPrefix + 'rolefeatures');
mpRolePerms     = new Meteor.Collection (mpPrefix + 'roleperms');
mpRoles         = new Meteor.Collection (mpPrefix + 'roles');
mpServiceKyes   = new Meteor.Collection (mpPrefix + 'servicekeys');
mpSingletons    = new Meteor.Collection (mpPrefix + 'singletons');
mpSuperUsers    = new Meteor.Collection (mpPrefix + 'superuser');
mpStrings       = new Meteor.Collection (mpPrefix + 'strings');
mpTrafficLog    = new Meteor.Collection (mpPrefix + 'sitelog');
mpUsers         = Meteor.users;
mpUsersLifetime = new Meteor.Collection (mpPrefix + 'userslifetime');
mpWords         = new Meteor.Collection (mpPrefix + 'words');
