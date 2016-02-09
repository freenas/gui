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

    _needsUpdateComponent: {
        value: false
    },

    _needsLoadComponent: {
        value: false
    },

    component: {
        value: null
    },

    _previousComponent: {
        value: null
    },

    _loadComponent: {
        value: function (moduleId) {
            var element = document.createElement("div"),
                self = this;

            this._element.innerHTML = "";
            this._element.appendChild(element);
            require.async(moduleId).then(function (exports) {
                if (element.parentNode) {
                    // TODO: This is an ugly hack, fix
                    self.component = new exports[Object.keys(exports)[0]]();
                    self.component.element = element;
                    self.component.needsDraw = true;
                    self.component.attachToParentComponent();
                    self.component._oldEnterDocument = self.component.enterDocument;
                    self.component.enterDocument = function (isFirstTime) {
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
            var element,
                self;

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
    }

});
