var Component = require("montage/ui/component").Component;


/**
 * @class Placeholder
 * @extends Component
 */
exports.Placeholder = Component.specialize({


    _moduleId: {
        value: null
    },


    moduleId: {
        get: function () {
            return this._moduleId;
        },
        set: function (value) {
            if (value && this._moduleId !== value) {
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

                if (this.component && !this._needsLoadComponent && object) {
                    // if the component stay the same we can update directly the context,
                    // otherwise it will be updated once the component would have been loaded.
                    this.component.object = object;
                }
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

                if (this.component && !this._needsLoadComponent && context) {
                    this.component.context = context;
                }
            }
        }
    },

    component: {
        value: null
    },


    size: {
        value: null
    },


    _previousComponent: {
        value: null
    },


    _needsUpdateComponent: {
        value: false
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

    _dispatchPlaceholderContentLoaded: {
        value: function () {
            this.dispatchEventNamed("placeholderContentLoaded", true, true, this);
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


    willDraw: {
        value: function () {
            var width = this._element.clientWidth,
                height = this._element.clientHeight;

            if (!this.size || width !== this.size.width || height !== this.size.height) {
                if (width && height) {
                    this.size = {
                        width: width,
                        height: height
                    };
                }
            }
        }
    },


    draw: {
        value: function () {
            if (this._needsUpdateComponent) {
                if (this._previousComponent) {
                    this._previousComponent.detachFromParentComponent();
                }

                this._previousComponent = this.component;
                this._needsUpdateComponent = false;
            }

            if (this._needsLoadComponent) {
                this._loadComponent(this._moduleId);
                this._needsLoadComponent = false;
            }
        }
    },


    _loadComponent: {
        value: function (moduleId) {
            var element = document.createElement("div"),
                self = this;

            this._isLoadingComponent = true;
            this._element.innerHTML = "";
            this._element.appendChild(element);

            return require.async(moduleId).then(function (exports) {
                if (element.parentNode) {
                    // TODO: This is an ugly hack, fix
                    self.component = new exports[Object.keys(exports)[0]]();
                    self.component.element = element;
                    self.component.object = self.object;
                    self.component.context = self.context;

                    self.component.needsDraw = true;
                    self.component.attachToParentComponent();
                    self.component._oldEnterDocument = self.component.enterDocument;
                    self.component.enterDocument = function (isFirstTime) {
                        if (self._isLoadingComponent) {
                            self._dispatchPlaceholderContentLoaded();
                            self._isLoadingComponent = false;
                        }

                        self._needsUpdateComponent = true;
                        self.needsDraw = true;

                        if (this.enterDocument = this._oldEnterDocument) {
                            delete this._oldEnterDocument;
                            this.enterDocument(isFirstTime);
                        }
                    }
                }
            });
        }
    }

});
