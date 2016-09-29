var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

exports.MainNavigation = AbstractComponentActionDelegate.specialize({
    templateDidLoad: {
        value: function() {
            this._loadSections();
            this.application.section = this.application.section || this.sections[0];
        }
    },

    _loadSections: {
        value: function() {
            this.sections = [];
            var sectionsDescriptors = this.application.sectionsDescriptors,
                sectionsIds = Object.keys(sectionsDescriptors),
                sectionId, sectionDescriptor;
            for (var i = 0, length = sectionsIds.length; i < length; i++) {
                sectionId = sectionsIds[i];
                sectionDescriptor = sectionsDescriptors[sectionId];
                this.sections.splice(sectionDescriptor.index, 0, sectionDescriptor);
            }
        }
    }
});
