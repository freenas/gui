/**
 * @module ui/ldap-service.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class LdapService
 * @extends Component
 */
exports.LdapService = Component.specialize(/** @lends LdapService# */ {

    enterDocument: {
        value: function () {
            this._populateObjectIfNeeded();
        }
    },

    _populateObjectIfNeeded: {
        value: function () {
            if (this.object && !this.object.parameters) {
                var self = this;

                return this.application.dataService.getNewInstanceForType(Model.LdapDirectoryParams).then(function (ldapDirectoryParams) {
                    return self.object.parameters = ldapDirectoryParams;
                });
            }
        }
    }
});
