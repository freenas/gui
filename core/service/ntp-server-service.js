var Montage = require("montage").Montage,
    NtpServerRepository = require("core/repository/ntp-server-repository").NtpServerRepository;

var NtpServerService = exports.NtpServerService = Montage.specialize({

    ntpSyncNow: {
        value: function(address) {
            return this._ntpServerRepository.syncNow(address)
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new NtpServerService();
                this._instance._ntpServerRepository = NtpServerRepository.getInstance();
            }
            return this._instance;
        }
    }
});
