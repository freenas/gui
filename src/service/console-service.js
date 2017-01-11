var Montage = require("montage").Montage,
    ShellRepository = require("core/repository/shell-repository").ShellRepository;

var ConsoleService = exports.ConsoleService = Montage.specialize({
    getCliToken: {
        value: function(columns) {
            return this._shellRepository.spawn(columns);
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ConsoleService();
                this._instance._shellRepository = ShellRepository.getInstance();
            }
            return this._instance;
        }
    }
});

