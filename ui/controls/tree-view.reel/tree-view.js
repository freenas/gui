/**
 * @module ui/tree-view.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class TreeView
 * @extends Component
 */
exports.TreeView = Component.specialize({
    _parentPathHistory: {
        value: null
    },

    _parent: {
        value: null
    },

    _getAbsolutePath: {
        value: function (parent) {
            return (this._parent.path + '/' + parent.name).replace('//', '/');
        }
    },

    parent: {
        get: function() {
            return this._parent;
        },
        set: function(parent) {
            if (this._parent != parent) {
                if (this._parent && parent && !parent.path) {
                    if (this.parentPath) {
                        this._parentPathHistory.push(this.parentPath);
                    }
                    this.parentPath = this._getAbsolutePath(parent);

                    this._startTransition();
                }
                if (!this._parent && parent) {
                    var parentDirectory = this._filesystemService.dirname(parent.path);
                    while (parentDirectory.length > 0 && parentDirectory.length >= this._root.length) {
                        this._parentPathHistory.unshift(parentDirectory);
                        parentDirectory = this._filesystemService.dirname(parentDirectory);
                    }
                }
                this._parent = parent;
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
            if (this._root != root) {
                this._root = root;
                if (!this._parentPathHistory) {
                    this._parentPathHistory = [];
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._filesystemService = this.application.filesystemService;
            }
            if (this._parent && (!this._parentPathHistory || this._parentPathHistory.length == 0)) {
                var parentDirectory = this._filesystemService.dirname(this._parent.path);
                while (parentDirectory.length > 0 && parentDirectory.length >= this._root.length) {
                    this._parentPathHistory.unshift(parentDirectory);
                    parentDirectory = this._filesystemService.dirname(parentDirectory);
                }
            }

        }
    },

    exitDocument: {
        value: function() {
            this._parentPathHistory = [];
            this._parent = null;
            this.close = true;
        }
    },

    handleBackButtonAction: {
        value: function () {
            if (this._parentPathHistory.length > 0) {
                this.parentPath = this._parentPathHistory.pop();
            }
        }
    },

    handleCancelAction: {
        value: function () {
            this.parentPath = this.originalValue;
            this.close = true;
        }
    },

    handleSelectAction: {
        value: function () {
            this.close = true;
        }
    },

    _startTransition: {
        value: function() {
            var self = this;
            return new Promise(function(resolve) {
                self.currentNode.classList.add('isTransitioning');
                self.nextNode.classList.add('isTransitioning');
                self.currentNode.classList.add('isBefore');
                self.nextNode.classList.remove('isAfter');
                self.nextNode._element.addEventListener('transitionend', resolve, false);
            }).then(function() {
                self.currentNode.classList.remove('isTransitioning');
                self.nextNode.classList.remove('isTransitioning');
                self.currentNode.classList.remove('isBefore');
                self.nextNode.classList.add('isAfter');
            });
        }
    }
});
