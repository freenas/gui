"use strict";
var section_repository_1 = require("core/repository/section-repository");
var event_dispatcher_service_1 = require("core/service/event-dispatcher-service");
var AbstractSectionService = (function () {
    function AbstractSectionService() {
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
        var self = this, initReturn = this.init();
        if (!Promise.is(initReturn)) {
            initReturn = Promise.resolve();
        }
        this.instanciationPromise = initReturn.then(function () {
            return self.load();
        });
    }
    AbstractSectionService.prototype.findObjectWithId = function (entries, id) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            if (entry.id === id) {
                return entry;
            }
        }
        return null;
    };
    AbstractSectionService.prototype.load = function () {
        var self = this;
        return Promise.all([
            AbstractSectionService.sectionRepository.getNewSection(),
            AbstractSectionService.sectionRepository.getNewSectionSettings(),
            self.loadEntries(),
            self.loadExtraEntries(),
            self.loadSettings(),
            self.loadOverview()
        ]).then(function (data) {
            self.section = data[0];
            self.section.settings = data[1];
            self.entries = self.section.entries = data[2];
            self.extraEntries = self.section.extraEntries = data[3];
            self.section.settings.section = self.section;
            self.section.settings.settings = data[4];
            self.overview = self.section.overview = data[5];
            return self;
        });
    };
    return AbstractSectionService;
}());
AbstractSectionService.sectionRepository = section_repository_1.SectionRepository.instance;
exports.AbstractSectionService = AbstractSectionService;
