var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    _ = require("lodash"),
    Promise = require("montage/core/promise").Promise;

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

                if (object && typeof object.uid != 'number') {
                    this._getNextAvailableUserId();
                }
            }
        }
    },

    additionalGroups: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.getSystemAdvanced().then(function (systemAdvanced) {
                self.systemAdvanced = systemAdvanced;
                self.homeDirectory = systemAdvanced.home_directory_root;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();

            var self = this,
                loadingPromises = [];

            this.isLoading = true;
            this._cleanupHomeDirectory(this.object);

            if (isFirstTime) {
                this.addPathChangeListener('object.home', this, '_handleHomeChange');
                loadingPromises.push(this._getShellOptions());
            }

            this.userType = (this.object.builtin && this.object.uid !== 0) || (this.object.origin && this.object.origin.read_only)  ? "system" : "user";

            Promise.all(loadingPromises).finally(function() {
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

    save: {
        value: function() {
            var self=this;

            if (this.object.home) {
                if (this.object._isNew && !_.endsWith('/' + this.object.username)) {
                    this.object.home += '/' + this.object.username;
                }
            } else {
                delete this.object.home;
            }

            this.object.group = this.context.primaryGroup ? this.context.primaryGroup : null;
            this.object.groups = this.context.secondaryGroups ? this.context.secondaryGroups.map(function (groups) {
                return groups.id;
            }, this) : null;

            return this._sectionService.searchGroupWithCriteria({name: 'wheel'}).then(function (groups) {
                var wheel = groups[0],
                    object = self.object,
                    groups = object.groups || (object.groups = []),
                    hasWheel = _.includes(groups, wheel.id);

                if (object.sudo && !hasWheel) {
                    groups.push(wheel.id);
                } else if (!object.sudo && hasWheel) {
                    for (var i = groups.length - 1; i >= 0; i--) {
                        if (groups[i] === wheel.id) {
                            groups.splice(i, 1);
                        }
                    }
                }

                return self._sectionService.saveUser(object).then(function(taskSubmission) {
                    return taskSubmission.taskPromise;
                });
            });
        }
    },

    delete: {
        value: function() {
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

    _getNextAvailableUserId: {
        value: function() {
            var self = this;
            return this._sectionService.getNextUid().then(function(nextUid) {
                self.nextUserId = self.object.uid = nextUid;
            })
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
