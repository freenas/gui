/**
 * @module ui/wizard.reel
 */
var Component = require("montage/ui/component").Component,
    WizardSectionService = require("core/service/section/wizard-section-service").WizardSectionService;

/**
 * @class Wizard
 * @extends Component
 */
exports.Wizard = Component.specialize(/** @lends Wizard# */ {

    //TODO: remove when account will have been migrated to the new architecture.
    _sectionService: {
        get: function () {
            return WizardSectionService.instance;
        }
    },

    _currentIndex: {
        value: -1
    },

    _currentObject: {
        value: null
    },

    _steps: {
        value: null
    },

    steps: {
        set: function (steps) {
            this._steps = steps;
        },
        get: function () {
            if (!this._steps) {
                this._steps = [];
            }

            return this._steps;
        }
    },

    _isLoading: {
        value: true
    },

    _context: {
        value: {}
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.application.selectionService.saveSelection(this.application.section, [{}]);
                this.addEventListener("action", this);
            }

            this._isLoading = true;
            var self = this;

            Promise.all([
                this._populateServices(),
                this._populateSteps()
            ]).then(function () {
                self.handleNextAction();
                self._isLoading = false;
            });
        }
    },

    exitDocument: {
        value: function () {
            this._resetData();
        }
    },

    handleNextAction: {
        value: function () {
            if (this._currentIndex > -1 && this._currentIndex + 1 < this.steps.length) {
                this._currentObject = this.steps[++this._currentIndex];
            } else if (this._currentIndex === -1) {
                this._currentObject = this.steps[(this._currentIndex = 0)];
            }

            this._context.sectionService = this._services[this._currentIndex];
        }
    },

    handlePreviousAction: {
        value: function () {
            if (this._currentIndex - 1 > -1) {
                this._currentObject = this.steps[--this._currentIndex];
            }
        }
    },

    handleSubmitAction: {
        value: function () {
            this._sectionService.saveWizard(this.steps);
        }
    },

    reset: {
        value: function () {
            this._resetData();
            this.handleNextAction();
        }
    },

    _populateSteps: {
        value: function () {
            var self = this;
            return this._sectionService.getWizardSteps().then(function (steps) {
                self.steps = steps;
            });
        }
    },

    _populateServices: {
        value: function () {
            var self = this;

            return this._sectionService.getWizardChildServices().then(function (services) {
                self._services = services;
            });
        }
    },

    _resetData: {
        value: function () {
            this._currentObject = null;
            this._currentIndex = -1;
        }
    }
});
