"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var system_repository_1 = require("../../repository/system-repository");
var ntp_server_repository_1 = require("../../repository/ntp-server-repository");
var vm_repository_1 = require("core/repository/vm-repository");
var container_repository_1 = require("core/repository/container-repository");
var network_repository_1 = require("core/repository/network-repository");
var SystemSectionService = (function (_super) {
    __extends(SystemSectionService, _super);
    function SystemSectionService() {
        return _super.apply(this, arguments) || this;
    }
    SystemSectionService.prototype.init = function () {
        this.systemRepository = system_repository_1.SystemRepository.getInstance();
        this.ntpServerRepository = ntp_server_repository_1.NtpServerRepository.getInstance();
        this.vmRepository = vm_repository_1.VmRepository.instance;
        this.containerRepository = container_repository_1.ContainerRepository.instance;
        this.networkRepository = network_repository_1.NetworkRepository.instance;
    };
    SystemSectionService.prototype.loadEntries = function () {
        return this.systemRepository.listSystemSections();
    };
    SystemSectionService.prototype.getTimezoneOptions = function () {
        return this.systemRepository.getTimezones();
    };
    SystemSectionService.prototype.getKeymapOptions = function () {
        return this.systemRepository.getKeymaps();
    };
    SystemSectionService.prototype.getSystemGeneral = function () {
        return this.systemRepository.getGeneral();
    };
    SystemSectionService.prototype.listNtpServers = function () {
        return this.ntpServerRepository.listNtpServers();
    };
    SystemSectionService.prototype.saveNtpServer = function (ntpServer) {
        return this.ntpServerRepository.saveNtpServer(ntpServer);
    };
    SystemSectionService.prototype.listVms = function () {
        return this.vmRepository.listVms();
    };
    SystemSectionService.prototype.listContainers = function () {
        return this.containerRepository.listDockerContainers();
    };
    SystemSectionService.prototype.listNetworkInterfaces = function () {
        return this.networkRepository.listNetworkInterfaces();
    };
    SystemSectionService.prototype.loadExtraEntries = function () {
    };
    SystemSectionService.prototype.loadSettings = function () {
    };
    SystemSectionService.prototype.loadOverview = function () {
    };
    return SystemSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.SystemSectionService = SystemSectionService;
