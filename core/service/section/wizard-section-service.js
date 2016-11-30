var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageSectionService = require("core/service/section/storage-section-service").StorageSectionService,
    NotificationCenterModule = require("core/backend/notification-center"),
    Application = require("montage/core/application").application,
    Model = require("core/model/model").Model
    WizardRepository = require("core/repository/wizard-repository").WizardRepository;

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function (wizardRepository) {
            this._wizardRepository = wizardRepository || WizardRepository.instance;
            Application.addEventListener("taskDone", this);
        }
    },

    getNewSystemGeneral: {
        value: function () {
            return this._wizardRepository.getNewSystemGeneral();
        }
    },

    getNewVolume: {
        value: function () {
            return this._wizardRepository.getNewVolume();
        }
    },

    getNewUser: {
        value: function() {
            return this._wizardRepository.getNewUser();
        }
    },

    getNewDirectoryServices: {
        value: function () {
            return this._wizardRepository.getNewDirectoryServices();
        }
    },

    getMailData: {
        value: function () {
            return this._wizardRepository.getMailData();
        }
    },

    getNewShare: {
        value: function () {
            return this._wizardRepository.getNewShare();
        }
    },

    buildStepsWizardWithDescriptor: {
        value: function (wizardDescriptor) {
            var stepsDescriptor = wizardDescriptor.steps,
                dataService = Application.dataService,
                promises = [],
                wizardSteps = [];

            stepsDescriptor.forEach(function (stepDescriptor) {
                var wizardStep = new WizardStep(stepDescriptor.id);
                wizardStep.objectType = stepDescriptor.objectType;
                wizardStep.parent = stepDescriptor.parent || null;

                promises.push(dataService.getNewInstanceForType(Model[stepDescriptor.objectType]).then(function (instance) {
                    wizardStep.object = instance;
                }));

                if (stepDescriptor.service) {
                    promises.push(require.async(stepDescriptor.service).then(function (exports) {
                        var service = exports[Object.keys(exports)[0]].instance;

                        if (Promise.is(service)) {
                            return service;
                        }

                        return service;
                    }).then(function (service) {
                        wizardStep.service = service;
                    }));
                }

                wizardSteps.push(wizardStep);
            });

            return Promise.all(promises).then(function () {
                return wizardSteps;
            });
        }
    },

    notificationCenter: {
        get: function () {
            return NotificationCenterModule.defaultNotificationCenter;
        }
    },

    handleTaskDone: {
        value: function (event) {
            var notification = event.detail;

            if (this._wizardsMap.has(notification.jobId)) {
                if (notification.state === "FINISHED") {
                    var steps = this._wizardsMap.get(notification.jobId),
                        shareStep = this._findWizardStepWithStepsAndId(steps, "share"),
                        volumeStep = this._findWizardStepWithStepsAndId(steps, "volume"),
                        userStep = this._findWizardStepWithStepsAndId(steps, "user"),
                        dataService = Application.dataService,
                        volume = volumeStep.object,
                        promises = [];

                    if (!shareStep.isSkipped) {
                        var shares = shareStep.object.$shares;

                        shares.forEach(function (share) {
                            if (share.name) {
                                share.target_path = volume.id;
                                promises.push(dataService.saveDataObject(share));
                            }
                        });
                    }

                    if (!userStep.isSkipped) {
                        var user = userStep.object;
                        user.home = '/mnt/' + volume.id + '/' + user.username;
                        promises.push(dataService.saveDataObject(user));
                    }

                    Promise.all(promises);
                }

                this._wizardsMap.delete(notification.jobId);
            }
        }
    },

    _wizardsMap: {
        value: new Map()
    },

    saveWizard: {
        value: function (steps) {
            var dataService = Application.dataService,
                self = this,
                indexVolume = -1,
                promises = [];

            steps.forEach(function (step) {
                var stepId = step.id,
                    stepObject = step.object;

                if (!step.isSkipped) {
                    if (stepId === "volume") {
                        indexVolume = promises.push(step.service.createVolume(stepObject)) - 1;
                    } else if (stepId === "directoryServices") {
                        var directoryServices = stepObject.__directoryServices;

                        directoryServices.forEach(function (directoryService) {
                            if (directoryService.name) {
                                promises.push(dataService.saveDataObject(directoryService));
                            }
                        });
                    } else if (stepId !== "share" && stepId !== "user") {
                        promises.push(dataService.saveDataObject(stepObject));
                    }
                }
            });

            return Promise.all(promises).then(function (jobIds) {
                if (indexVolume > -1) {
                    var volumeJobId = jobIds[indexVolume];
                    self._wizardsMap.set(volumeJobId, steps);
                }
            });
        }
    },

    _findWizardStepWithStepsAndId: {
        value: function (steps, id) {
            var response = null,
                step;

            for (var i = 0, length = steps.length; i < length && response === null; i++) {
                step = steps[i];

                if (step.id === id) {
                    response = step;
                }
            }

            return response;
        }
    },

},
//TODO: remove when wizard will have been migrated to the new architecture.
{
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.init();
             }
            return this._instance;
         }
    }

});


var WizardStep = function WizardStep (id) {
    this.id = id;
};


WizardStep.prototype.parent = null;

WizardStep.prototype.service = null;

WizardStep.prototype.object = null;

WizardStep.prototype.isSkipped = false;
