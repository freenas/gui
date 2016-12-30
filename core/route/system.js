"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var system_repository_1 = require("../repository/system-repository");
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
var abstract_route_1 = require("./abstract-route");
var SystemRoute = (function (_super) {
    __extends(SystemRoute, _super);
    function SystemRoute(modelDescriptorService, eventDispatcherService, systemRepository, cryptoCertificateRepository, alertFilterRepository, mailRepository, tunableRepository, ntpServerRepository) {
        _super.call(this, eventDispatcherService);
        this.modelDescriptorService = modelDescriptorService;
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
            return self.updateStackWithContext(stack, context);
        });
    };
    SystemRoute.prototype.getCertificate = function (certificateId, stack) {
        var self = this, objectType = 'CryptoCertificate', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/crypto-certificate/_/' + encodeURIComponent(certificateId)
        };
        return Promise.all([
            this.cryptoCertificateRepository.listCryptoCertificates(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (certificates, uiDescriptor) {
            context.object = _.find(certificates, { id: certificateId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
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
            return self.updateStackWithContext(stack, context);
        });
    };
    SystemRoute.prototype.createCertificate = function (certificateType, stack) {
        var self = this, objectType = 'CryptoCertificate', columnIndex = 2, parentContext = stack[columnIndex], context = {
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
            return self.updateStackWithContext(stack, context);
        });
    };
    SystemRoute.prototype.getAlertFilter = function (filterId, stack) {
        var self = this, objectType = 'AlertFilter', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/alert-filter/_/' + encodeURIComponent(filterId)
        };
        return Promise.all([
            this.alertFilterRepository.listAlertFilters(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (alterFilters, uiDescriptor) {
            context.object = _.find(alterFilters, { id: filterId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
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
            return self.updateStackWithContext(stack, context);
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
            return self.updateStackWithContext(stack, context);
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
            return self.updateStackWithContext(stack, context);
        });
    };
    SystemRoute.prototype.getTunable = function (tunableId, stack) {
        var self = this, objectType = 'Tunable', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/tunable/_/' + encodeURIComponent(tunableId)
        };
        return Promise.all([
            this.tunableRepository.listTunables(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (tunables, uiDescriptor) {
            context.object = _.find(tunables, { id: tunableId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
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
            return self.updateStackWithContext(stack, context);
        });
    };
    SystemRoute.prototype.getNtpServer = function (ntpServerId, stack) {
        var self = this, objectType = 'NtpServer', columnIndex = 2, parentContext = stack[columnIndex - 1], context = {
            columnIndex: columnIndex,
            objectType: objectType,
            parentContext: parentContext,
            path: parentContext.path + '/ntp-server/_/' + encodeURIComponent(ntpServerId)
        };
        return Promise.all([
            this.ntpServerRepository.listNtpServers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function (ntpServers, uiDescriptor) {
            context.object = _.find(ntpServers, { id: ntpServerId });
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    };
    return SystemRoute;
}(abstract_route_1.AbstractRoute));
exports.SystemRoute = SystemRoute;
