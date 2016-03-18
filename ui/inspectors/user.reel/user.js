var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class User
 * @extends Component
 */
exports.User = Component.specialize({

    _object: {
        value: null
    },

    groupOptions: {
        value: null
    },

    create: {
        value: function () {
            // @thibault create montage-data call here
        }
    },

    save: {
        value: function () {
            this.application.dataService.saveDataObject(this.object);
        }
    },

    delete: {
        value: function () {
            this.application.dataService.deleteDataObject(this.object);
        }
    },

    object: {
        set: function (user) {
            if (user) {
                this._object = user;

                this.application.dataService.fetchData(Model.Group).then(function (groups) {
                    if (groups) {
                        this.groupOptions = groups;
                    } else {
                        this.groupOptions = null;
                    }
                }.bind(this));

            } else {
                this._object = null;
            }
        },

        get: function () {
            return this._object;
        }
    },

    groupOptionConverter: {
        convert: function (name) {
            return this.groupOptions.find({name:name});
        },

        revert: function (group) {
            return group.id;
        },

        validator: {
            validate: function (name) {
                return !!this.groupOptions.find({name:name});
            }
        }
    }
});
