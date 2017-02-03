var Montage = require("montage").Montage,
    Promise = require("montage/core/promise").Promise;

var DIRECTORY = 'DIRECTORY',
    FILE = 'FILE',
    FAKE = 'FAKE';

var FilesystemTreeController = exports.FilesystemTreeController = Montage.specialize({
    _service: {
        value: null
    },

    service: {
        get: function() {
            return this._service;
        },
        set: function(service) {
            if (this._service !== service) {
                this._service = service;
            }
            if (this._root && this._service) {
                this.open(this._root);
            }
        }
    },

    type: {
        value: "DIRECTORY"
    },

    entry: {
        value: null
    },

    ancestors: {
        value: null
    },

    parent: {
        get: function() {
            if (this.ancestors) {
                return this.ancestors.slice(-1)[0];
            }
        }
    },

    selectedPath: {
        get: function() {
            if (this.canListFiles && this._selectedFile) {
                return this._selectedFile.path;
            } else if (this._selectedFake) {
                return this._selectedFake.path;
            } else if (this.entry) {
                return this.entry.path;
            }
        }
    },

    _selectedFake: {
        value: null
    },

    _selectedFile: {
        value: null
    },

    _root: {
        value: null
    },

    root: {
        get: function() {
            return this._root;
        },
        set: function(root) {
            if (this._root !== root) {
                this._root = root;

                if (root && this._service) {
                    this.open(this._root);
                }
            }
        }
    },

    isPathInvalid: {
        value: false
    },

    open: {
        value: function(path, isPathInvalid) {
            var self = this,
                root = this.root || '/',
                isDefault = !path;
            path = path || root;
            if (path.length > 1 && path[path.length-1] == '/') {
                path = path.substr(0, path.length-1);
            }

            var selectedEntry = this._getPathEntry(path);
            if (selectedEntry && selectedEntry.type === FILE && this.canListFiles) {
                this._selectedFile = selectedEntry;
            } else if (selectedEntry && selectedEntry.type == FAKE) {
                this._selectedFake = selectedEntry;
            } else {
                this._selectedFile = null;
                this._selectedFake = null;
                // FIXME: @pierre there is an issue here when switching between shares
                // self.entry.children can be undefined. Ticket: #16098
                if (selectedEntry) {
                    this._addCurrentEntryToAncestors();
                } else if (this._isPathLastAncestor(path)) {
                    self.ancestors.pop();
                } else {
                    self.ancestors = null
                }
                return this._service.listDir(path).then(function(children) {
                    self.isPathInvalid = !!isPathInvalid;
                    self.entry = {
                        path: path,
                        name: self._service.basename(path),
                        children: self._buildChildrenList(path, children)
                    };
                    if (!self.ancestors) {
                        path = self._service.dirname(path);
                        self.ancestors = [];
                        while (path.indexOf(root) == 0) {
                            self.ancestors.unshift({
                                path: path,
                                name: self._service.basename(path),
                                type: DIRECTORY
                            });
                            path = self._service.dirname(path);
                        }
                    }
                    self.dispatchOwnPropertyChange("parent", self.parent);
                    return self.entry;
                },
                function() {
                    self.open(root, true);
                });
            }
        }
    },

    _buildChildrenList: {
        value: function(path, children) {
            var self = this;
            var result = this._filterChildren(children.map(function(x) { return self._childToEntry(path, x); }));
            if (this.fakeEntries) {
                var fakeEntry;
                for (var i = 0, length = this.fakeEntries.length; i < length; i++) {
                    fakeEntry = this.fakeEntries[i];
                    if (this._service.dirname(fakeEntry) === path) {
                        result.push({
                            path: fakeEntry,
                            name: this._service.basename(fakeEntry),
                            type: FAKE
                        });
                    }
                }
            }
            return result;
        }
    },

    _isPathLastAncestor: {
        value: function(path) {
            return this.ancestors &&
                this.ancestors.length &&
                this.ancestors.slice(-1)[0].path === path;
        }
    },

    _addCurrentEntryToAncestors: {
        value: function() {
            if (!this.ancestors) {
                this.ancestors = [];
            }
            this.ancestors.push(this.entry);
        }
    },

    _isPathChildOfCurrentEntry: {
        value: function(path) {
            return this.entry &&
                    this.entry.children &&
                    this.entry.children.map(function(x) {
                        return x.path;
                    }).indexOf(path) != -1;
        }
    },

    _getPathEntry: {
        value: function(path) {
            return this.entry &&
                    this.entry.children &&
                    this.entry.children.filter(function(x) { return x.path === path; })[0];
        }
    },

    _filterChildren: {
        value: function(children) {
            return this.canListFiles ? children : children.filter(function(x) { return x.type === DIRECTORY });
        }
    },

    _childToEntry: {
        value: function(parentPath, child) {
            return {
                path: this.service.join(parentPath, child.name),
                name: child.name,
                type: child.type
            }
        }
    }
});
