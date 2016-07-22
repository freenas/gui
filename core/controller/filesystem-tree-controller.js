var Montage = require("montage").Montage,
    Promise = require("montage/core/promise").Promise;

var DIRECTORY = 'DIRECTORY',
    FILE = 'FILE';

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
            if (this.entry) {
                return this.entry.path;
            }
        }
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

    open: {
        value: function(path) {
            var self = this,
                root = this.root || '/',
                isDefault = !path;
            path = path || root;
            if (path.length > 1 && path[path.length-1] == '/') {
                path = path.substr(0, path.length-1);
            }

            // FIXME: @pierre there is an issue here when switching between shares
            // self.entry.children can be undefined. Ticket: #16098
            if (this._isPathChildOfCurrentEntry(path)) {
                this._addCurrentEntryToAncestors();
            } else if (this._isPathLastAncestor(path)) {
                self.ancestors.pop();
            } else {
                self.ancestors = null
            }
            return this._service.listDir(path).then(function(children) {
                self.entry = {
                    path: path,
                    name: self._service.basename(path),
                    children: self._filterChildren(children.map(function(x) { return self._childToEntry(path, x); }))
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
                return self.entry;
            });
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
