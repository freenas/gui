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

    useEmptyHomedir: {
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

    // homeDirectory: {
    //     get: function () {
    //         if (!this._homeDirectory) {
    //             if (this._object._isNew) {
    //                 if (this._object.home) {
    //                     this._homeDirectory = this._object.home;
    //                 } else if (this.systemAdvanced && this.systemAdvanced.home_directory_root) {
    //                     this._homeDirectory = this.systemAdvanced.home_directory_root;
    //                 } else {
    //                     this._homeDirectory = "/mnt";
    //                 }
    //             } else if (this._object.home) {
    //                 this._homeDirectory = this._object.home.slice(0, this._object.home.indexOf("/" + this._object.username));
    //             } else {
    //                 this._homeDirectory = this._object.home;
    //             }
    //         }

    //         return this._homeDirectory;
    //     },
    //     set: function (home) {
    //         this._homeDirectory = home;
    //     }
    // },

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

            this.treeController.open().then(function(){
                if (self._object._isNew || self.object.home === "/nonexistent") {
                    self.object.home = null;
                }
            });

            if (isFirstTime) {
                loadingPromises.push(this._getShellOptions());
            }

            this.userType = this.object.builtin && this.object.uid !== 0 ? "system" : "user";

            Promise.all(loadingPromises).then(function() {
                self.isLoading = false;
            });
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this.userType = null;
            this.useEmptyHomedir = null;
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
            if (this.object._isNew) {
                if (!this.useEmptyHomedir) {
                    this.object.home += '/' + this.object.username;
                } else {
                    this.object.home = null;
                }
            }

            return this.application.dataService.saveDataObject(this.object);
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

    // _openHomeDirectory: {
    //     value: function(user) {
    //         if (this.treeController) {
    //             var self = this,
    //                 path = user.home || this.homeDirectory;
    //                 if (path === "/nonexistent") {
    //                     path = systemAdvanced.home_directory_root || "/mnt";
    //                 }

    //             return this.treeController.open(path).then(function() {
    //                 return user.home = self.treeController.selectedPath;
    //             });
    //         }
    //     }
    // },

    _loadGroups: {
        value: function() {
            var self = this;
            this.application.dataService.fetchData(Model.Group).then(function (groups) {
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
            return this.application.accountsService.getShells().then(function(shells){
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
