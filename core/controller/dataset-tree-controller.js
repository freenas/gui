    var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise;

exports.DatasetTreeController = Montage.specialize({
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
        value: "DATASET"
    },

    _datasetsPromise: {
        value: null
    },

    entry: {
        value: null
    },

    ancestors: {
        value: null
    },

    parent: {
        get: function() {
            if (this.entry && this.entry.path !== this._root) {
                return this.entry.parent;
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

    selectedVolume: {
        value: null
    },

    _root: {
        value: null
    },

    root: {
        get: function () {
            return this._root;
        },
        set: function (root) {
            if (this._root !== root) {
                this._root = root;

                if (root && this._service) {
                    this.open(root);
                }
            }
        }
    },

    open: {
        value: function (path) {
            var self = this;
            path = path || this.root;
            if (!this._datasetsPromise) {
                this._datasetsPromise = this._service.fetchData(Model.VolumeDataset);
            }

            var treePromise = this._datasetsPromise.then(function (rawDatasets) {
                self._datasets = rawDatasets;
                self._datasetsPromise = null;
                self._buildDatasetsTree();
                if (!self._hasDatasetListener) {
                    self.addRangeAtPathChangeListener("_datasets", self, "_buildDatasetsTree");
                    self._hasDatasetListener = true;
                }
                return null;
            });

            return treePromise.then(function () {
                self.entry = path ? self._findEntry(path) : self._tree;
                self.dispatchOwnPropertyChange("parent", self.parent);
                return self.selectedVolume = self.entry ? self.entry.volume : self._tree;
            });
        }
    },

    _buildDatasetsTree: {
        value: function() {
            var datasets = this._datasets || [],
                orphanEntries = [],
                dataset, entry, name, volume,
                depth, pathParts, ancestorEntry;

            this._tree = {
                name: '',
                path: '',
                children: []
            };
            for (var i = 0, length = datasets.length; i < length; i++) {
                dataset = datasets[i];
                name = dataset.name;
                volume = dataset.volume;
                pathParts = name.split('/');
                entry = {
                    name: pathParts.slice(-1)[0],
                    path: name,
                    volume: volume,
                    children: []
                };
                if (name.indexOf('/') == -1) {
                    entry.parent = this._tree;
                    this._tree.children.push(entry);
                } else {
                    ancestorEntry = this._tree;
                    depth = 0;
                    while (depth < pathParts.length - 1 && ancestorEntry) {
                        ancestorEntry = this._findAncestorEntry(ancestorEntry.children, pathParts[depth]);
                        depth++;
                    }
                    if (ancestorEntry) {
                        entry.parent = ancestorEntry;
                        ancestorEntry.children.push(entry);
                    } else {
                        orphanEntries.push();
                    }
                }
            }
            if (this.entry) {
                var newEntry = this._findEntry(this.entry.path);
                if (newEntry) {
                    this.entry = newEntry;
                } else {
                    this.entry = this._findEntry(this.root);
                }
            }
        }
    },

    _findAncestorEntry: {
        value: function(children, ancestorName) {
            var child;
            for (var i = 0, length = children.length; i < length; i++) {
                child = children[i];
                if (child.name == ancestorName) {
                    return child;
                }
            }
        }
    },

    _findEntry: {
        value: function(path) {
            var entry = this._tree;
            if (path) {
                var pathParts = path.split('/'),
                    depth = 0;
                while (depth < pathParts.length && entry) {
                    entry = entry.children.filter(function(x) { return x.name == pathParts[depth]; })[0];
                    depth++;
                }
            }
            return entry;
        }
    }
});
