var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    NotificationCenterModule = require("core/backend/notification-center"),
    Application = require("montage/core/application").application,
    Model = require("core/model/model").Model,
    TopologyService = require("core/service/topology-service").TopologyService,
    DiskRepository = require("core/repository/disk-repository").DiskRepository,
    VolumeRepository = require("core/repository/volume-repository").VolumeRepository,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    WizardRepository = require("core/repository/wizard-repository").WizardRepository;

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function (wizardRepository, systemRepository, diskRepository, volumeRepository, topologyService) {
            this._wizardRepository = wizardRepository || WizardRepository.instance;
            this._systemRepository = systemRepository || SystemRepository.getInstance();
            this._diskRepository = diskRepository || DiskRepository.getInstance();
            this._volumeRepository = volumeRepository || VolumeRepository.getInstance();
            this._topologyService = topologyService || TopologyService.instance;
            Application.addEventListener("taskDone", this);

            var self = this,
                availablePaths;
            return this._volumeRepository.listVolumes().then(function() {
                return self._volumeRepository.getAvailableDisks();
            }).then(function(paths) {
                availablePaths = paths;
                return self._diskRepository.listDisks();
            }).then(function(disks) {
                return self._volumeRepository.getDisksAllocations(disks.map(function(x) { return x.id; }));
            }).then(function(disksAllocations) {
                return self._diskRepository.updateDiskUsage(availablePaths, disksAllocations);
            });
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

    getTimezoneOptions: {
        value: function() {
            return this._systemRepository.listTimezones();
        }
    },

    getKeymapOptions: {
        value: function() {
            return this._systemRepository.listKeymaps();
        }
    },

    getSystemGeneral: {
        value: function() {
            return this._systemRepository.getGeneral();
        }
    },

    clearReservedDisks: {
        value: function() {
            return this._diskRepository.clearReservedDisks();
        }
    },

    listAvailableDisks: {
        value: function() {
            return this._diskRepository.listAvailableDisks();
        }
    },

    generateTopology: {
        value: function(topology, disks, redundancy, speed, storage) {
            var self = this;
            this.clearReservedDisks();
            var vdev, j, disksLength,
                priorities = this._topologyService.generateTopology(topology, this._diskRepository.listAvailableDisks(), redundancy, speed, storage);
            for (var i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
                vdev = topology.data[i];
                if (Array.isArray(vdev.children)) {
                    for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                        self._diskRepository.markDiskAsReserved(vdev.children[j]);
                    }
                } else {
                    self._diskRepository.markDiskAsReserved(vdev);
                }
            }
            return priorities;
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
                        var shares = shareStep.object.__shares;

                        shares.forEach(function (share) {
                            if (share.name) {
                                share.target_path = volume.id;
                                promises.push(dataService.saveDataObject(share));
                            }
                        });
                    }

                    if (!userStep.isSkipped) {
                        var users = userStep.object.__users;

                        users.forEach(function (user) {
                            if (user.username) {
                                user.home = '/mnt/' + volume.id + '/' + user.username;
                                promises.push(dataService.saveDataObject(user));
                            }
                        });
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


var WizardStep = function WizardStep (id) {
    this.id = id;
};


WizardStep.prototype.parent = null;

WizardStep.prototype.service = null;

WizardStep.prototype.object = null;

WizardStep.prototype.isSkipped = false;
