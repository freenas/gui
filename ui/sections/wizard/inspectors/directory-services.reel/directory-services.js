/**
 * @module ui/directory-services.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DirectoryServices
 * @extends Component
 */
var DirectoryServices = exports.DirectoryServices = Component.specialize(/** @lends DirectoryServices# */{

    templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
        }
    },

});
