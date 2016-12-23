var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService,
    TopologyService = require("core/service/topology-service").TopologyService,
    DiskRepository = require("core/repository/disk-repository").DiskRepository,
    VolumeRepository = require("core/repository/volume-repository").VolumeRepository,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    AccountRepository = require("core/repository/account-repository").AccountRepository,
    MailRepository = require("core/repository/mail-repository").MailRepository,
    WizardRepository = require("core/repository/wizard-repository").WizardRepository;

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function () {
            this._wizardRepository = WizardRepository.instance;
            this._systemRepository = SystemRepository.getInstance();
            this._accountRepository = AccountRepository.getInstance();
            this._diskRepository = DiskRepository.getInstance();
            this._volumeRepository = VolumeRepository.getInstance();
            this._mailRepository = MailRepository.getInstance();
            this._topologyService = TopologyService.instance;
            this._modelDescriptorService = ModelDescriptorService.getInstance();

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

    listUsers: {
        value: function() {
            return this._accountRepository.listUsers();
        }
    },

    getMailConfig: {
        value: function() {
            return this._mailRepository.getConfig();
        }
    },

    saveMailConfig: {
        value: function(mailConfig) {
            return this._mailRepository.saveConfig(mailConfig);
        }
    },

    buildStepsWizardWithDescriptor: {
        value: function (wizardDescriptor) {
            var self = this,
                stepsDescriptor = wizardDescriptor.steps,
                promises = [],
                wizardSteps = [];

            stepsDescriptor.forEach(function (stepDescriptor) {
                var wizardStep = new WizardStep(stepDescriptor.id);
                wizardStep.objectType = stepDescriptor.objectType;
                wizardStep.parent = stepDescriptor.parent || null;

                promises.push(Promise.all([
                    self._modelDescriptorService.getDaoForType(stepDescriptor.objectType).then(function(dao) {
                        wizardStep.dao = dao;
                        return dao.getNewInstance();
                    }),
                    self._modelDescriptorService.getUiDescriptorForType(stepDescriptor.objectType)
                ]).spread(function (instance, uiDescriptor) {
                    wizardStep.object = instance;
                    wizardStep.uiDescriptor = uiDescriptor;
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

    _wizardsMap: {
        value: new Map()
    },

    saveWizard: {
        value: function (steps) {
            var self = this,
                indexVolume = -1,
                promises = [];

            steps.forEach(function (step) {
                var stepId = step.id,
                    stepObject = step.object;

                if (!step.isSkipped) {
                    if (stepId === "volume") {
                        stepObject.topology = {
                            data: stepObject.topology.data,
                            cache: stepObject.topology.cache,
                            log: stepObject.topology.log,
                            spare: stepObject.topology.spare
                        };
                        indexVolume = promises.push(self._volumeRepository.createVolume(stepObject)) - 1;
                    } else if (stepId === "directoryServices") {
                        var directoryServices = stepObject.__directoryServices;

                        directoryServices.forEach(function (directoryService) {
                            if (directoryService.name) {
                                promises.push(step.dao.save(directoryService));
                            }
                        });
                    } else if (stepId !== "share" && stepId !== "user") {
                        promises.push(step.dao.save(stepObject));
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
