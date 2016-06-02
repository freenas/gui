var Slot = require("montage/ui/slot.reel").Slot;


/**
 * @class Placeholder
 * @extends Slot
 */
exports.Placeholder = Slot.specialize({


    constructor: {
        value: function () {
            this._componentsMap = new Map();
        }
    },


    hasTemplate: {
        value: true
    },


    _moduleId: {
        value: null
    },


    moduleId: {
        get: function () {
            return this._moduleId;
        },
        set: function (value) {
            if (typeof value === "string" && value.length && this._moduleId !== value) {
                this._moduleId = value;
                this._needsLoadComponent = true;
                this.needsDraw = true;
            }
        }
    },


    _object: {
        value: null
    },


    object: {
        get: function () {
            return this._object;
        },
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this.needsDraw = true;
            }
        }
    },


    _context: {
        value: null
    },


    context: {
        get: function () {
            return this._context;
        },
        set: function (context) {
            if (this._context !== context) {
                this._context = context;
                this.needsDraw = true;
            }
        }
    },


    component: {
        value: null
    },


    size: {
        value: null
    },


    _needsLoadComponent: {
        value: false
    },


    enterDocument: {
        value: function () {
            if (!this._isLoadingComponent && !this._needsLoadComponent) {
                this._dispatchPlaceholderContentLoaded();
            }
        }
    },


    exitDocument: {
        value: function () {
            //Fixme: montage issue, not able to remove a class from the element when leaving the dom
            if (this.element.classList.contains("selected")) {
                this.element.classList.remove("selected");
            }
        }
    },


    _dispatchPlaceholderContentLoaded: {
        value: function () {
            this.dispatchEventNamed("placeholderContentLoaded", true, true, this);
        }
    },


    _loadComponentIfNeeded: {
        value: function () {
            if (this._needsLoadComponent) {
                var self = this,
                    moduleId = this._moduleId,
                    promise;

                this._isLoadingComponent = true;
                this._needsLoadComponent = false;

                if (this._componentsMap.has(moduleId)) {
                    promise = Promise.resolve(this._componentsMap.get(moduleId));
                } else {
                    promise = require.async(moduleId).then(function (exports) {
                        var component = new exports[Object.keys(exports)[0]]();
                        self._componentsMap.set(moduleId, component);

                        return component;
                    });
                }

                promise.then(function (component) {
                    self.component = component;
                    self._populateComponentContextIfNeeded();
                    self.content = component;

                    var oldEnterDocument = self.component.enterDocument;

                    self.component.enterDocument = function (isFirstTime) {
                        if (self._isLoadingComponent) {
                            self._dispatchPlaceholderContentLoaded();
                            self._isLoadingComponent = false;
                        }

                        if (this.enterDocument = oldEnterDocument) {
                            this.enterDocument(isFirstTime);
                        }
                    }
                });
            }

            return promise;
        }
    },


    _populateComponentContextIfNeeded: {
        value: function () {
            if (this.component && !this._needsLoadComponent) {
                this.component.object = this.object;
                this.component.context = this.context;
            }
        }
    },


    draw: {
        value: function () {
            this._loadComponentIfNeeded();
            this._populateComponentContextIfNeeded();
        }
    }


});
