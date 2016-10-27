var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model,
    SystemSectionDao = require("core/dao/system-section-dao").SystemSectionDao;

/**
 * @class System
 * @extends Component
 */
exports.Settings = Component.specialize({
    templateDidLoad: {
        value: function() {
            var self = this;
            return SystemSectionDao.instance.list().then(function(systemSections) {
                self.sections = systemSections;
            });
        }
    }
});
