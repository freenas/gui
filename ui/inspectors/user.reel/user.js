var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise,
    Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

/**
 * @class User
 * @extends Component
 */
exports.User = AbstractComponentActionDelegate.specialize({

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
    
    homeDirectory: {
        get: function () {
            if (!this._homeDirectory) {
                if (this._object._isNew && this.systemAdvanced && this.systemAdvanced) {
                    this._homeDirectory = this.systemAdvanced.home_directory_root || '/';
                } else {
                    this._homeDirectory = this._object.home;
                }
            }

            return this._homeDirectory;
        },
        set: function (home) {
            this._homeDirectory = home;
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
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            var self = this,
                loadingPromises = [],
                shell;

            this.isLoading = true;

            if (this._object._isNew) {
                loadingPromises.push(this._openHomeDirectory(this._object));
            }

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
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);
            this.userType = null;
            this._needsSaveSystemAdvanced = false;
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

    handleCheckboxAction: {
        value: function () {
            if (this._defaultHomeDirectoryComponent.checked) {
                this._needsSaveSystemAdvanced = this.systemAdvanced.home_directory_root !== this.homeDirectory;
            } else {
                this._needsSaveSystemAdvanced = !!this.systemAdvanced.home_directory_root;
            }
        }
    },

    save: {
        value: function() {
            var self = this;

            this.object.groups = this.additionalGroups.map(function(x) { return x.id; });
            if (this.object._isNew) {
                this.object.home += '/' + this.object.username;
            }

            return this.application.dataService.saveDataObject(this.object).then(function () {
                if (self._needsSaveSystemAdvanced) {
                    self.systemAdvanced.home_directory_root = self._defaultHomeDirectoryComponent.checked ? 
                        self.homeDirectory : null;

                    self._needsSaveSystemAdvanced = false;

                    return self.application.dataService.saveDataObject(self.systemAdvanced);
                }
            });
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

    _openHomeDirectory: {
        value: function(user) {
            if (this.treeController) {
                var self = this,
                    path = user.home || this.homeDirectory;
                return this.treeController.open(path).then(function() {
                    return user.home = self.treeController.selectedPath;
                });
            }
        }
    },

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
                return User.constructor.services.nextUid();
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
