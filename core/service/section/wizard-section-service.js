var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageSectionService = require("core/service/section/storage-section-service").StorageSectionService,
    Application = require("montage/core/application").Application,
    WizardRepository = require("core/repository/wizard-repository").WizardRepository;

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function (wizardRepository) {
            this._wizardRepository = wizardRepository || WizardRepository.instance;
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

    getWizardSteps: {
        value: function () {
            var self = this;

            return this.getWizardChildServices().then(function () {
                return Promise.all([
                    self.getNewSystemGeneral(),
                    self.getNewVolume(),
                    self.getNewDirectoryServices(),
                    self.getNewShare(),
                    self.getMailData()
                ]);
            });
        }
    },

    getWizardChildServices: {
        value: function () {
            var self = this;

            return Promise.all([
                Promise.resolve(),
                StorageSectionService.instance,
                Promise.resolve(),
                Promise.resolve(),
                Promise.resolve()
            ]).then(function (data) {
                return (self._services = data);
            });
        }
    },

    handleTaskDone: {
        value: function (event) {
            var notification = event.detail;
            console.log(notification);

            if (notification.state === "FINISHED" && this._wizardsMap.has(notification.jobId)) {
                var steps = this._wizardsMap.get(notification.jobId),
                    shares = steps[3].$shares,
                    promises = [];

                shares.forEach(function (share) {
                    if (share.name) {
                        promises.push(dataService.saveDataObject(share));
                    }
                });

                this._wizardsMap.delete(jobId);
                Promise.all(promises);
            }
        }
    },

    _wizardsMap: {
        value: new Map()
    },

    saveWizard: {
        value: function (steps) {
            var storageSectionService = this._services[1],
                directoryServices = steps[2].$directoryServices,
                wizardRepository = this._wizardRepository,
                promises = [
                    wizardRepository.saveSystemGeneral(steps[0]),
                    storageSectionService.createVolume(steps[1]),
                    wizardRepository.saveMailData(steps[4])
                ];

            directoryServices.forEach(function (directoryService) {
                if (directoryService.name) {
                    promises.push(wizardRepository.saveNewDirectoryService(directoryService));
                }
            });

            return Promise.all(promises).then(function (jobIds) {
                var volumeJobId = jobIds[1],
                    notification = self.noticationCenter.findTaskWithJobId(volumeJobId);

                if (notification) {
                    this._wizardsMap.set(volumeJobId, steps);
                }
            });
        }
    }

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
