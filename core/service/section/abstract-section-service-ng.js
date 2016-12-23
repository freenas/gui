"use strict";
var section_repository_1 = require('../../repository/section-repository');
var event_dispatcher_service_1 = require('../event-dispatcher-service');
var Promise = require("bluebird");
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
        ]).spread(function (section, sectionSettings, entries, extraEntries, settings, overview) {
            sectionSettings.section = section;
            sectionSettings.settings = settings;
            self.section = section;
            self.section.settings = sectionSettings;
            self.entries = self.section.entries = entries;
            self.extraEntries = self.section.extraEntries = extraEntries;
            self.overview = self.section.overview = overview;
            return self;
        });
    };
    AbstractSectionService.sectionRepository = section_repository_1.SectionRepository.instance;
    return AbstractSectionService;
}());
exports.AbstractSectionService = AbstractSectionService;
