"use strict";
var system_repository_1 = require("../repository/system-repository");
var model_event_name_1 = require("../model-event-name");
var model_descriptor_service_1 = require("../service/model-descriptor-service");
var event_dispatcher_service_1 = require("../service/event-dispatcher-service");
var crypto_certificate_type_1 = require("core/model/enumerations/crypto-certificate-type");
var _ = require("lodash");
var Promise = require("bluebird");
var crypto_certificate_repository_1 = require("../repository/crypto-certificate-repository");
var alert_filter_repository_1 = require("core/repository/alert-filter-repository");
var mail_repository_1 = require("../repository/mail-repository");
var tunable_repository_1 = require("../repository/tunable-repository");
var ntp_server_repository_1 = require("../repository/ntp-server-repository");
var SystemRoute = (function () {
    function SystemRoute(modelDescriptorService, eventDispatcherService, systemRepository, cryptoCertificateRepository, alertFilterRepository, mailRepository, tunableRepository, ntpServerRepository) {
        this.modelDescriptorService = modelDescriptorService;
        this.eventDispatcherService = eventDispatcherService;
        this.systemRepository = systemRepository;
        this.cryptoCertificateRepository = cryptoCertificateRepository;
        this.alertFilterRepository = alertFilterRepository;
        this.mailRepository = mailRepository;
        this.tunableRepository = tunableRepository;
        this.ntpServerRepository = ntpServerRepository;
        this.objectType = 'SystemSection';
    }
    SystemRoute.getInstance = function () {
        if (!SystemRoute.instance) {
            SystemRoute.instance = new SystemRoute(model_descriptor_service_1.ModelDescriptorService.getInstance(), event_dispatcher_service_1.EventDispatcherService.getInstance(), system_repository_1.SystemRepository.getInstance(), crypto_certificate_repository_1.CryptoCertificateRepository.getInstance(), alert_filter_repository_1.AlertFilterRepository.instance, mail_repository_1.MailRepository.getInstance(), tunable_repository_1.TunableRepository.getInstance(), ntp_server_repository_1.NtpServerRepository.getInstance());
        }
        return SystemRoute.instance;
    };
    SystemRoute.prototype.get = function (systemSectionId, stack) {
        var self = this, columnIndex = 1, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: this.objectType,
            parentContext: parentContext,
            path: parentContext.path + '/system-section/_/' + systemSectionId
        };
        return Promise.all([
            this.systemRepository.listSystemSections(),
            this.modelDescriptorService.getUiDescriptorForType(this.objectType)
        ]).spread(function (systemSections, uiDescriptor) {
            context.object = _.find(systemSections, { id: systemSectionId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_1 = stack.pop();
                if (context_1 && context_1.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_1.objectType].listChange, context_1.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.getCertificate = function (certificateId, stack) {
        var self = this, objectType = 'CryptoCertificate', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/crypto-certificate/_/' + certificateId
        };
        return Promise.all([
            this.cryptoCertificateRepository.listCryptoCertificates(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (certificates, uiDescriptor) {
            context.object = _.find(certificates, { id: certificateId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_2 = stack.pop();
                if (context_2 && context_2.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_2.objectType].listChange, context_2.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.selectNewCertificateType = function (stack) {
        var _this = this;
        var self = this, objectType = 'CryptoCertificate', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            Promise.all(_.map(_.keys(crypto_certificate_type_1.CryptoCertificateType), function (type) { return _this.cryptoCertificateRepository.getNewCryptoCertificate(type); })),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (cryptoCertificates, uiDescriptor) {
            cryptoCertificates._objectType = objectType;
            context.object = _.compact(cryptoCertificates);
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_3 = stack.pop();
                if (context_3 && context_3.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_3.objectType].listChange, context_3.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.createCertificate = function (certificateType, stack) {
        var self = this, objectType = 'CryptoCertificate', columnIndex = 3, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/' + certificateType
        };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (uiDescriptor) {
            var share = _.find(parentContext.object, { _tmpId: certificateType });
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;
            while (stack.length > columnIndex - 1) {
                var context_4 = stack.pop();
                if (context_4 && context_4.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_4.objectType].listChange, context_4.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.getAlertFilter = function (filterId, stack) {
        var self = this, objectType = 'AlertFilter', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/alert-filter/_/' + filterId
        };
        return Promise.all([
            this.alertFilterRepository.listAlertFilters(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (alterFilters, uiDescriptor) {
            context.object = _.find(alterFilters, { id: filterId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_5 = stack.pop();
                if (context_5 && context_5.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_5.objectType].listChange, context_5.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.createAlertFilter = function (stack) {
        var self = this, objectType = 'AlertFilter', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.alertFilterRepository.getNewAlertFilter(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (alterFilter, uiDescriptor) {
            context.object = alterFilter;
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_6 = stack.pop();
                if (context_6 && context_6.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_6.objectType].listChange, context_6.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.getAlertSettings = function (stack) {
        var self = this, objectType = 'Mail', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/settings'
        };
        return Promise.all([
            this.mailRepository.getConfig(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (mailConfig, uiDescriptor) {
            context.object = mailConfig;
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_7 = stack.pop();
                if (context_7 && context_7.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_7.objectType].listChange, context_7.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.createTunable = function (stack) {
        var self = this, objectType = 'Tunable', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.tunableRepository.getNewTunable(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (tunable, uiDescriptor) {
            context.object = tunable;
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_8 = stack.pop();
                if (context_8 && context_8.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_8.objectType].listChange, context_8.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.getTunable = function (tunableId, stack) {
        var self = this, objectType = 'Tunable', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/tunable/_/' + tunableId
        };
        return Promise.all([
            this.tunableRepository.listTunables(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (tunables, uiDescriptor) {
            context.object = _.find(tunables, { id: tunableId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_9 = stack.pop();
                if (context_9 && context_9.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_9.objectType].listChange, context_9.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.createNtpServer = function (stack) {
        var self = this, objectType = 'NtpServer', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/create'
        };
        return Promise.all([
            this.ntpServerRepository.getNewNtpServer(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (ntpServer, uiDescriptor) {
            context.object = ntpServer;
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_10 = stack.pop();
                if (context_10 && context_10.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_10.objectType].listChange, context_10.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    SystemRoute.prototype.getNtpServer = function (ntpServerId, stack) {
        var self = this, objectType = 'NtpServer', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/ntp-server/_/' + ntpServerId
        };
        return Promise.all([
            this.ntpServerRepository.listNtpServers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (ntpServers, uiDescriptor) {
            context.object = _.find(ntpServers, { id: ntpServerId });
            context.userInterfaceDescriptor = uiDescriptor;
            while (stack.length > columnIndex) {
                var context_11 = stack.pop();
                if (context_11 && context_11.changeListener) {
                    self.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName[context_11.objectType].listChange, context_11.changeListener);
                }
            }
            stack.push(context);
            return stack;
        });
    };
    return SystemRoute;
}());
exports.SystemRoute = SystemRoute;
