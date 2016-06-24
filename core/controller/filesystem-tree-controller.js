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

    _isDatasetMode: {
        value: null
    },

    isDatasetMode: {
        get: function() {
            return this._isDatasetMode;
        },
        set: function(isDatasetMode) {
            if (this._isDatasetMode !== isDatasetMode) {
                this._isDatasetMode = isDatasetMode;
                if (this.entry) {
                    this.open(this.entry.path);
                }
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
            if (this.isDatasetMode) {
                return this.entry.path.replace(this._root, this.service.basename(this._root));
            }
            return this.entry.path;
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
            }
            if (this._root && this._service) {
                this.open(this._root);
            }
        }
    },

    open: {
        value: function(path) {
            if (path) {
                var self = this,
                    root = this.root || '/';
                if (path.length > 1 && path[path.length-1] == '/') {
                    path = path.substr(0, path.length-1);
                }

                // FIXME: @pierre there is an issue here when switching between shares
                // self.entry.children can be undefined. Ticket: #16098
                if (self.entry && self.entry.children && self.entry.children.map(function(x) { return x.path; }).indexOf(path) != -1) {
                    if (!self.ancestors) {
                        self.ancestors = [];
                    }
                    self.ancestors.push(self.entry);
                } else if (self.ancestors && self.ancestors.length && self.ancestors.slice(-1)[0].path === path) {
                    self.ancestors.pop();
                } else {
                    self.ancestors = null
                }
                self.entry = {
                    path: path,
                    name: self._service.basename(path)
                };
                return this._service.listDir(path).then(function(children) {
                    self.entry.children = children
                        .filter(function(x) { return self.canListFiles || x.type == DIRECTORY; })
                        .map(function(x) { return self._childToEntry(path, x); })
                        .filter(function(x) { return !self.isDatasetMode || self._isEntryADataset(x); });
                    if (!self.ancestors) {
                        path = self._service.dirname(path);
                        self.ancestors = [];
                        while (path.indexOf(root) == 0) {
                            self.ancestors.unshift({
                                path: path,
                                name: self._service.basename(path),
                                type: DIRECTORY
                            })
                            path = self._service.dirname(path);
                        }
                    }
                    return self.entry;
                });
            } else {
                return Promise.resolve();
            }
        }
    },

    _isEntryADataset: {
        value: function(entry) {
            return this.datasetsPaths.indexOf(entry.path) != -1;
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
