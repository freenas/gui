var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    NtpServerRepository = require("core/repository/ntp-server-repository").NtpServerRepository,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository;

exports.SystemSectionService = AbstractSectionService.specialize({

    init: {
        value: function() {
            this._systemRepository = SystemRepository.getInstance();
            this._ntpServerRepository = NtpServerRepository.getInstance();
            this._vmRepository = VmRepository.instance;
            this._containerRepository = ContainerRepository.instance;
            this._networkRepository = NetworkRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._systemRepository.listSystemSections();
        }
    },

    loadSettings: {
        value: function() {
        }
    },

    getTimezoneOptions: {
        value: function() {
            return this._systemRepository.getTimezones();
        }
    },

    getKeymapOptions: {
        value: function() {
            return this._systemRepository.getKeymaps();
        }
    },

    getSystemGeneral: {
        value: function() {
            return this._systemRepository.getGeneral();
        }
    },

    listNtpServers: {
        value: function() {
            return this._ntpServerRepository.listNtpServers();
        }
    },

    saveNtpServer: {
        value: function(ntpServer) {
            return this._ntpServerRepository.saveNtpServer(ntpServer);
        }
    },

    listVms: {
        value: function() {
            return this._vmRepository.listVms();
        }
    },

    listContainers: {
        value: function() {
            return this._containerRepository.listDockerContainers();
        }
    },

    listNetworkInterfaces: {
        value: function() {
            return this._networkRepository.listNetworkInterfaces();
        }
    }
});
