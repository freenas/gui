var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

/**
 * @class User
 * @extends Component
 */
exports.User = Component.specialize({

    _object: {
        value: null
    },

    additionalGroups: {
        value: null
    },

    groupOptions: {
        value: null
    },

    object: {
        set: function (user) {
            var self = this;
            this._object = user;

            this.application.dataService.fetchData(Model.Group).then(function (groups) {
                self.groupOptions = groups;
                self.additionalGroups = user.groups ? groups.filter(function (x) { return user.groups.indexOf(x.id) > -1; }) : [];
            });
        },
        get: function () {
            return this._object;
        }
    },

    save: {
        value: function() {
            this.object.groups = this.additionalGroups.map(function(x) { return x.id; });
            this.application.dataService.saveDataObject(this.object);
        }
    }
});

exports.AdditionalGroupsConverter = Converter.specialize({
    convert: {
        value: function (groupId) {
            return this.groupOptions.find(function(x){ return x.id === groupId });
        }
    },

    revert: {
        value: function (name) {
            var newGroupValue = this.groupOptions.find(function(x) { return x.name === name });
            return newGroupValue ? newGroupValue.id : null;
        }
    }
});

exports.AdditionalGroupsValidator = Validator.specialize({
    validate: {
        value: function (name) {
            return !!this.groupOptions.find(function(x) { return x.name === name });
        }
    }
});
