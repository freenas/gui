var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class Group
 * @extends Component
 */
exports.Group = AbstractInspector.specialize({
    _object: {
        value: null
    },

    nextGroupId: {
        value: null
    },

    editMode: {
        value: null
    },

    groupType: {
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

    enterDocument: {
        value: function() {
            this.super();
            this.groupType = this.object.builtin && this.object.gid !== 0 ? "system" : "user";
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this.groupType = null;
        }
    },

    _getNextAvailableGroupID: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Group).then(function (Group) {
                return Group.constructor.services.nextGid();
            }).then(function(groupId) {
                self.nextGroupId = self.object.gid = groupId;
            });
        }
    }
});
