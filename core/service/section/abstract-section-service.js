var Montage = require("montage/core/core").Montage,
    SectionRepository = require("core/repository/section-repository").SectionRepository;

exports.AbstractSectionService = Montage.specialize({
    _instance: {
        value: null
    },

    init: {
        value: function() {
        }
    },

    _load: {
        value: function() {
            var self = this;
            return Promise.all([
                self.constructor._sectionRepository.getNewSection(),
                self.constructor._sectionRepository.getNewSectionSettings(),
                self.loadEntries(),
                self.loadSettings(),
                self.loadOverview()
            ]).then(function(data) {
                self.section = data[0];
                self.section.settings = data[1];
                self.section.entries = data[2];
                self.section.overview = data[4];
                self.section.settings.section = self.section;
                self.section.settings.settings = data[3];
                return self;
            });
        }
    },
    
    loadEntries: {
        value: function() {
        }
    },
    
    loadSettings: {
        value: function() {
        }
    },
    
    loadOverview: {
        value: function() {
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.init();
                this._sectionRepository = this._sectionRepository || SectionRepository.instance;
                return this._instance._load();
            } else {
                return Promise.resolve(this._instance);
             }
         }
    }
});
