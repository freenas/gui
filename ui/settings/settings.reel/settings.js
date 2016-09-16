var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class System
 * @extends Component
 */
exports.Settings = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                var sectionsPromises = [],
                    i = 0;
                sectionsPromises.push(this._createSection("system", "System", "path", i++));
                sectionsPromises.push(this._createSection("bootPool", "Boot Pool", "path", i++));
                sectionsPromises.push(this._createSection("updates", "Updates", "path", i++));
                sectionsPromises.push(this._createSection("languageAndRegion", "Language & Region", "path", i++));
                sectionsPromises.push(this._createSection("WebUI", "WebUI", "path", i++));
                sectionsPromises.push(this._createSection("mail", "Alerts & Reporting", "path", i++));
                sectionsPromises.push(this._createSection("serialConsole", "Console", "path", i++));
                sectionsPromises.push(this._createSection("dockerSettings", "Docker", "path", i++));
                sectionsPromises.push(this._createSection("debug", "Debug", "path", i++));
                sectionsPromises.push(this._createSection("tunable", "Tunables", "path", i++));
/* FIXME: Uncomment when implemented
                sectionsPromises.push(this._createSection("kernel", "kernel", "path", i++));
                sectionsPromises.push(this._createSection("hardware", "Hardware", "path", i++));
                sectionsPromises.push(this._createSection("advanced", "Hardware", "path", i++));
                sectionsPromises.push(this._createSection("powerManagement", "Power Management", "path", i++));
                sectionsPromises.push(this._createSection("dateAndTime", "Date & Time", "path", i++));
*/
                Promise.all(sectionsPromises).then(function(sections) {
                    self.sections = sections;
                });
            }
        }
    },

    _createSection: {
        value: function(identifier, label, icon, order) {
            return this.application.dataService.getNewInstanceForType(Model.SystemSection).then(function(section) {
                section._isNew = false;
                section.identifier = identifier;
                section.label = label;
                section.icon = icon;
                section.order = order;
                return section;
            });
        }
    }
});
