var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    NtpServerRepository = require("core/repository/ntp-server-repository").NtpServerRepository;

exports.SystemSectionService = AbstractSectionService.specialize({

    init: {
        value: function(systemRepository, ntpServerRepository) {
            this._systemRepository = systemRepository || SystemRepository.instance;
            this._ntpServerRepository = ntpServerRepository || NtpServerRepository.getInstance();
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
    }
});
