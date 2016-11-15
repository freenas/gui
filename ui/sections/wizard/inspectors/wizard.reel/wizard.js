/**
 * @module ui/wizard.reel
 */
var Component = require("montage/ui/component").Component,
    StorageSectionService = require("core/service/section/storage-section-service").StorageSectionService,
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
            //FIXME!
            //this._sectionService.saveWizard(this.steps);
            Promise.all([
                this.application.dataService.saveDataObject(this.steps[0]), //save system general
                this.application.dataService.saveDataObject(this.steps[1]), //save volume
                this.application.dataService.saveDataObject(this.steps[3]), //save mail data
            ]).then(function () {

            });
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
            return Promise.all([
                this._sectionService.getNewSystemGeneral(),
                this._sectionService.getNewVolume(),
                this._sectionService.getNewDirectoryServices(),
                this._sectionService.getNewShare(),
                this._sectionService.getMailData()
            ]).then(function (data) {
                self.steps = data;
            });
        }
    },

    _populateServices: {
        value: function () {
            var self = this;

            Promise.all([
                Promise.resolve(),
                StorageSectionService.instance,
                Promise.resolve(),
                Promise.resolve(),
                Promise.resolve()
            ]).then(function (data) {
                self._services = data;
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
