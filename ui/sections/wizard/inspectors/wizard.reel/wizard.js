/**
 * @module ui/wizard.reel
 */
var Component = require("montage/ui/component").Component,
    WizardSectionService = require("core/service/section/wizard-section-service").WizardSectionService,
    wizardDescriptor = require("./wizard.mjson");

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
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.application.selectionService.saveSelection(this.application.section, [{}]);
                this.addEventListener("action", this);
            }

            this._resetData();
            this._isLoading = true;
            var self = this;

            this._sectionService.buildStepsWizardWithDescriptor(wizardDescriptor).then(function (steps) {
                self.steps = steps;
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
            this._next();
        }
    },

    handleSkipAction: {
        value: function () {
            if (this._canSkip) {
                this.steps[this._currentIndex].isSkipped = true;

                if (this._currentIndex + 1 < this.steps.length) {
                    this._next();
                } else {
                    this._canSkip = false;
                }
            }
        }
    },

    handlePreviousAction: {
        value: function () {
            this._previous();
            this._canSkip = true;
        }
    },

    handleSubmitAction: {
        value: function () {
            this.application.section = this.application.sectionsDescriptors.dashboard;
            this._sectionService.saveWizard(this.steps);
        }
    },

    _previous: {
        value: function () {
            if (this._currentIndex - 1 > -1) {
                var candidateStep;

                while ((candidateStep = this.steps[--this._currentIndex])) {
                    if (candidateStep.parent) {
                        if (!this._isStepSkipped(candidateStep.parent)) {
                            this._selectStep(candidateStep);
                        }
                    } else {
                        this._selectStep(candidateStep);
                        break;
                    }
                }
            }
        }
    },

    _next: {
        value: function () {
            if (this._currentIndex > -1) {
                var candidateStep;

                while (this._currentIndex + 1 < this.steps.length && (candidateStep = this.steps[++this._currentIndex])) {
                    if (candidateStep.parent) {
                        if (!this._isStepSkipped(candidateStep.parent)) {
                            this._selectStep(candidateStep);
                            candidateStep.isSkipped = false;
                            break;
                        } else {
                            candidateStep.isSkipped = true;
                        }
                    } else {
                        this._selectStep(candidateStep);
                        candidateStep.isSkipped = false;
                        break;
                    }
                }
            } else if (this._currentIndex === -1) {
                this._currentObject = this.steps[(this._currentIndex = 0)].object;
            }
        }
    },

    _selectStep: {
        value: function (step) {
            this._context.isNextStepDisabled = false;
            this._currentObject = step.object;
            this._context.sectionService = step.service;
        }
    },

    _isStepSkipped: {
        value: function (id) {
            var steps = this.steps,
                response = false,
                step;

            for (var i = 0, length = steps.length; i < length && response === false; i++) {
                step = steps[i];

                if (step.id === id) {
                    return step.isSkipped;
                }
            }

            return response;
        }
    },

    _resetData: {
        value: function () {
            this._currentObject = null;
            this._currentIndex = -1;
            this._context = {};
            this._canSkip = true;
        }
    }
});
