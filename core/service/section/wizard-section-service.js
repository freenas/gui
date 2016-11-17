var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageSectionService = require("core/service/section/storage-section-service").StorageSectionService,
    NotificationCenterModule = require("core/backend/notification-center"),
    Application = require("montage/core/application").application,
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

    getWizardSteps: {
        value: function () {
            var self = this;

            return this.getWizardChildServices().then(function () {
                return Promise.all([
                    self.getNewSystemGeneral(),
                    self.getNewVolume(),
                    self.getNewUser(),
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
                    shares = steps[4].$shares,
                    wizardRepository = this._wizardRepository,
                    promises = [];

                    shares.forEach(function (share) {
                        if (share.name) {
                            share.target_path = steps[1].id;
                            promises.push(wizardRepository.saveShare(share));
                        }
                    });
                    steps[2].home = '/mnt/' + steps[1].id + '/' + steps[2].username;
                    promises.push(wizardRepository.saveUser(steps[2]));

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
            var storageSectionService = this._services[1],
                directoryServices = steps[3].$directoryServices,
                wizardRepository = this._wizardRepository,
                promises = [
                    wizardRepository.saveSystemGeneral(steps[0]),
                    storageSectionService.createVolume(steps[1]),
                    wizardRepository.saveMailData(steps[5])
                ],
                self = this;

            directoryServices.forEach(function (directoryService) {
                if (directoryService.name) {
                    promises.push(wizardRepository.saveDirectory(directoryService));
                }
            });

            return Promise.all(promises).then(function (jobIds) {
                var volumeJobId = jobIds[1];
                self._wizardsMap.set(volumeJobId, steps);
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
