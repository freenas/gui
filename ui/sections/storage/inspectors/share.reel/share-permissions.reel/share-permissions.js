var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model").Model;

 var SearchController = function SearchController(service, model) {
    this.service = service;
    this.model = model
 };

 SearchController.prototype.search = function (value) {
    if (this.model === Model.User) {
        return this.service.searchUser(value);
    }

    return this.service.searchGroup(value);
 }

exports.SharePermissions = AbstractInspector.specialize(/** @lends SharePermissions# */ {

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.groupsSearchController = new SearchController(this._sectionService, Model.Group);
                this.usersSearchController = new SearchController(this._sectionService, Model.User);
            }
        }
    }

});
