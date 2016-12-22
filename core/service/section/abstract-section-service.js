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
                self.loadEntries ? self.loadEntries() : function() {},
                self.loadExtraEntries ? self.loadExtraEntries() : function() {},
                self.loadSettings ? self.loadSettings() : function() {},
                self.loadOverview ? self.loadOverview() : function() {}
            ]).then(function(data) {
                self.section = data[0];
                self.section.settings = data[1];
                self.entries = self.section.entries = data[2];
                self.extraEntries = self.section.extraEntries = data[3]
                self.section.settings.section = self.section;
                self.section.settings.settings = data[4];
                self.section.overview = data[5];
                return self;
            });
        }
    },

    loadEntries: {
        value: function() {
        }
    },

    loadExtraEntries: {
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
                var self = this;
                this._instance = new this();
                this._sectionRepository = this._sectionRepository || SectionRepository.instance;
                var initReturn = this._instance.init();
                if (!Promise.is(initReturn)) {
                    initReturn = Promise.resolve();
                }
                this._instance.instanciationPromise = initReturn.then(function() {
                    return self._instance._load()
                });
            }
            return this._instance;
         }
    }
});
