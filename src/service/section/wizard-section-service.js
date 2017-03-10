var AbstractSectionService = require('core/service/section/abstract-section-service').AbstractSectionService,
    NotificationCenterModule = require('core/backend/notification-center'),
    Application = require('montage/core/application').application,
    ModelDescriptorService = require('core/service/model-descriptor-service').ModelDescriptorService,
    TopologyService = require('core/service/topology-service').TopologyService,
    DiskRepository = require('core/repository/disk-repository').DiskRepository,
    VolumeRepository = require('core/repository/volume-repository').VolumeRepository,
    SystemRepository = require('core/repository/system-repository').SystemRepository,
    AccountRepository = require('core/repository/account-repository').AccountRepository,
    AlertEmitterRepository = require('core/repository/alert-emitter-repository').AlertEmitterRepository,
    ShareRepository = require("core/repository/share-repository").ShareRepository,
    ServiceRepository = require("core/repository/service-repository").ServiceRepository,
    ShareService = require('core/service/share-service').ShareService,
    _ = require("lodash");

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function () {
            this._systemRepository = SystemRepository.getInstance();
            this._accountRepository = AccountRepository.getInstance();
            this._diskRepository = DiskRepository.getInstance();
            this._volumeRepository = VolumeRepository.getInstance();
            this._alertEmitterRepository = AlertEmitterRepository.getInstance();
            this._shareRepository = ShareRepository.getInstance();
            this._serviceRepository = ServiceRepository.getInstance();
            this._topologyService = TopologyService.getInstance();
            this._modelDescriptorService = ModelDescriptorService.getInstance();
            this._shareService = ShareService.instance;
            Application.addEventListener('taskDone', this);

            return Promise.all([
                this._volumeRepository.listVolumes(),
                this._topologyService.init()
            ]);
        }
    },

    getVdevRecommendation: {
        value: function (redundancy, speed, storage)  {
            return this._topologyService.getVdevRecommendation(redundancy, speed, storage);
        }
    },

    getNewSystemGeneral: {
        value: function () {
            return this._systemRepository.getGeneral();
        }
    },

    getNewVolume: {
        value: function () {
            return this._volumeRepository.getNewVolume();
        }
    },

    getNewUser: {
        value: function() {
            return this._accountRepository.getNewUser().then(function(user) {
                user.password = {
                    $password: null
                };
                return user;
            });
        }
    },

    getNewDirectoryServices: {
        value: function () {
            return this._accountRepository.getNewDirectoryServices();
        }
    },

    getNewDirectoryForType: {
        value: function(type) {
            return this._accountRepository.getNewDirectoryForType(type);
        }
    },

    getMailData: {
        value: function () {
            return this._alertEmitterRepository.list().then(function(alerEmitters) {
                return _.find(alerEmitters, {config: {'%type': 'AlertEmitterEmail'}});
            });
        }
    },

    getNewShare: {
        value: function () {
            return this._shareRepository.getNewShare();
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

    listUsers: {
        value: function() {
            return this._accountRepository.listUsers();
        }
    },

    getMailConfig: {
        value: function() {
            return this._alertEmitterRepository.list().then(function(alerEmitters) {
                return _.find(alerEmitters, {config: {'%type': 'AlertEmitterEmail'}});
            });
        }
    },

    saveMailConfig: {
        value: function(mailConfig) {
            return this._alertEmitterRepository.save(mailConfig);
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
                wizardStep.service = self;

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
                if (notification.state === 'FINISHED') {
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
            var self = this,
                indexVolume = -1,
                promises = [this._serviceRepository.listServices()];

            steps.forEach(function (step) {
                var stepId = step.id,
                    stepObject = step.object;

                if (!step.isSkipped) {
                    if (stepId === 'volume') {
                        stepObject.topology = {
                            data: stepObject.topology.data,
                            cache: stepObject.topology.cache,
                            log: stepObject.topology.log,
                            spare: stepObject.topology.spare
                        };
                        indexVolume = promises.push(self._volumeRepository.createVolume(stepObject)) - 1;
                    } else if (stepId === 'directoryServices') {
                        var directoryServices = stepObject.__directoryServices;

                        directoryServices.forEach(function (directoryService) {
                            if (directoryService.name) {
                                promises.push(step.dao.save(directoryService));
                            }
                        });
                    } else if (stepId !== 'share' && stepId !== 'user') {
                        promises.push(step.dao.save(stepObject));
                    }
                }
            });

            Promise.all(promises).then(function(submittedTasks) {
                return (indexVolume > -1 ? submittedTasks[indexVolume].taskPromise : Promise.resolve()).then(function() {
                    return submittedTasks[0];
                });
            }).then(function(services) {
                var shareStep = self._findWizardStepWithStepsAndId(steps, 'share'),
                    volumeStep = self._findWizardStepWithStepsAndId(steps, 'volume'),
                    userStep = self._findWizardStepWithStepsAndId(steps, 'user'),
                    volume = volumeStep.object,
                    userPromises = [];

                if (!userStep.isSkipped) {
                    var users = userStep.object.__users;

                    users.forEach(function (user) {
                        if (user.username) {
                            user.home = '/mnt/' + volume.id + '/' + user.username;
                            userPromises.push(self._accountRepository.saveUser(user));
                        }
                    });
                } else {
                    userPromises.push(Promise.resolve());
                }

                return Promise.all(userPromises).then(function() {
                    var sharePromises = [];
                    if (!shareStep.isSkipped) {
                        var shares = shareStep.object.__shares;

                        shares.forEach(function (share) {
                            if (share.name) {
                                share.target_path = volume.id + '/' + share.name;
                                if (share.type === 'iscsi') {
                                    share.target_type = 'ZVOL';
                                    share.__extent = {
                                        id: 'iqn.2005-10.org.freenas.ctl.' + share.name,
                                        lun: 0
                                    }
                                } else {
                                    share.target_type = 'DATASET';
                                }
                                var service = _.find(services, {config: {type: 'service-' + share.type}});
                                if (!service.config.enable) {
                                    service.config.enable = true;
                                    sharePromises.push(self._serviceRepository.saveService(service));
                                }
                                sharePromises.push(self._shareService.save(share));
                            }
                        });
                    }

                    return Promise.all(sharePromises);
                });

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

    getProfiles: {
        value: function () {
            return this._topologyService.getProfiles();
        }
    },

    generateTopology: {
        value: function (disks, topologyProfile) {
            if (!disks) {
                var self = this;

                return this.listAvailableDisks().then(function (disks) {
                    return self._topologyService.generateTopology(disks, topologyProfile);
                });
            }

            return this._topologyService.generateTopology(disks, topologyProfile);
        }
    },

    // FIXME: duplicated code between different section-service.
    listDisks: {
        value: function () {
            if (!this.initialDiskAllocationPromise || this.initialDiskAllocationPromise.isRejected()) {
                var self = this;

                this.initialDiskAllocationPromise = this._diskRepository.listDisks().then(function (disks) {
                    self._volumeRepository.initializeDisksAllocations((_.map(disks, 'path')));
                    return disks;
                });
            }
            return this.initialDiskAllocationPromise;
        }
    },

    // FIXME: duplicated code between different section-service.
    listAvailableDisks: {
        value: function () {
            var self = this;
            return this.listDisks().then(function () {
                return self._diskRepository.listAvailableDisks()
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


var WizardStep = function WizardStep (id) {
    this.id = id;
};


WizardStep.prototype.parent = null;

WizardStep.prototype.service = null;

WizardStep.prototype.object = null;

WizardStep.prototype.isSkipped = false;
