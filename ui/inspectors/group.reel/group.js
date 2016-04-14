var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Group
 * @extends Component
 */
exports.Group = Component.specialize({
    _object: {
        value: null
    },

    nextGroupId: {
        value: null
    },

    editMode: {
        value: null
    },

    object: {
        get: function () {
            return this._object;
        },
        set: function (group) {
            if (this._object !== group) {
                this._object = group;
                if (typeof group.gid !== "number") {
                    this._getNextAvailableGroupID();
                }
                if (typeof group.id === "undefined" || (typeof group.id === "object" && group.id === null )) {
                    this.editMode = "creating";
                } else {
                    this.editMode = "editing";
                }
            }
        }
    },

    _getNextAvailableGroupID: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Group).then(function (Group) {
                return Group.constructor.nextGid();
            }).then(function(groupId) {
                self.nextGroupId = groupId;
            });
        }
    }
});
