var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise,
    Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

/**
 * @class User
 * @extends Component
 */
exports.User = AbstractInspector.specialize({

    shellOptions: {
        value: null
    },

    userType: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        get: function () {
            return this._object;
        },
        set: function (object) {
            if (this._object != object) {
                this._object = object;
                this.homeDirectory = null;
                this._loadGroups(object);

                if (object && typeof object.uid != 'number') {
                    this._getNextAvailableUserId();
                }
            }
        }
    },

    additionalGroups: {
        value: null
    },

    groupOptions: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this.application.dataService.fetchData(Model.SystemAdvanced).then(function (systemAdvancedCollection) {
                self.systemAdvancedCollection = systemAdvancedCollection;
                self.addRangeAtPathChangeListener("systemAdvancedCollection", self, "handleSystemAdvancedCollectionChange");
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();

            var self = this,
                loadingPromises = [],
                shell;

            this.isLoading = true;

            this._cleanupHomeDirectory(this.object);

            if (isFirstTime) {
                this.addPathChangeListener('object.home', this, '_handleHomeChange');
                loadingPromises.push(this._getShellOptions());
            }

            this.userType = (this.object.builtin && this.object.uid !== 0) || (this.object.origin && this.object.origin.read_only)  ? "system" : "user";

            Promise.all(loadingPromises).then(function() {
                self.isLoading = false;
            });
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this.userType = null;
        }
    },

    handleSystemAdvancedCollectionChange: {
        value: function () {
            this.systemAdvanced = this.systemAdvancedCollection[0];

            if (this._object._isNew) {
                this.homeDirectory = this.systemAdvanced.home_directory_root;
            }
        }
    },

    save: {
        value: function() {
            var self = this;

            this.object.groups = this.additionalGroups.map(function(x) { return x.id; });
            if (this.object._isNew && this.object.home) {
                this.object.home += '/' + this.object.username;
            }

            return this.application.dataService.saveDataObject(this.object);
        }
    },

    delete: {
        value: function() {
            var self = this;

            return this.inspector.delete(this.extraDeleteFlags[0].checked, this.extraDeleteFlags[1].checked);
        }
    },

    revert: {
        value: function() {
            var self = this;
            return this.inspector.revert().then(function() {
                if (self._object._isNew) {
                    self._getNextAvailableUserId();
                }
                self._object.password = null;
                return null;
            });
        }
    },

    _handleHomeChange: {
        value: function() {
            this._cleanupHomeDirectory(this.object);
        }
    },

    _cleanupHomeDirectory: {
        value: function(object) {
            if (object && object.home === "/nonexistent") {
                object.home = null;
            }
        }
    },

    _loadGroups: {
        value: function() {
            var self = this;
            this._sectionService.listGroups().then(function (groups) {
                self.groupOptions = groups;
                self.additionalGroups = self._object.groups ? groups.filter(function (x) { return self.object.groups.indexOf(x.id) > -1; }) : [];
            });
        }
    },

    _getNextAvailableUserId: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.User).then(function (User) {
                return User.constructor.services.nextUid(true);
            }).then(function(userId) {
                self.nextUserId = self.object.uid = userId;
            });
        }
    },

    _getShellOptions: {
        value: function() {
            var self = this;
            this.shellOptions = [];
            return this._sectionService.listShells().then(function(shells){
                for (var i=0, length=shells.length; i<length; i++) {
                    shell = shells[i].split("/");
                    self.shellOptions.push({label: shell[shell.length -1], value: shells[i]});
                }
            });
        }
    }
});

exports.AdditionalGroupsConverter = Converter.specialize({
    convert: {
        value: function (groupId) {
            return this.groupOptions.find(function(x){ return x.id === groupId; });
        }
    },

    revert: {
        value: function (name) {
            var newGroupValue = this.groupOptions.find(function(x) { return x.name === name; });
            return newGroupValue ? newGroupValue.id : null;
        }
    }
});

exports.AdditionalGroupsValidator = Validator.specialize({
    validate: {
        value: function (name) {
            return !!this.groupOptions.find(function(x) { return x.name === name; });
        }
    }
});
