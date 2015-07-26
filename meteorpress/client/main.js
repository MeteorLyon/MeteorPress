Meteor.autorun(function () {

  // This is terrible, lol
  document.title = Strings.siteTitle;

});

/** Global helpers */
Template.registerHelper("MP", MP);
Template.registerHelper("mpSchemas", mpSchemas);

Template.mpFooter.rendered = function() {
  // External links
  $('a[rel="external"]').attr('target', '_blank');
}

