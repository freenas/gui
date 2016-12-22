var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    systemSections = require("core/data/system-sections.json");

exports.SystemSectionDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.SystemSection;
        }
    },

    list: {
        value: function() {
            var self = this;
            return Promise.all(
                systemSections.map(function(definition, index) {
                    return self.getNewInstance().then(function(systemSection) {
                        systemSection._isNew = false;
                        systemSection.identifier = definition.id;
                        systemSection.label = definition.label;
                        systemSection.icon = definition.icon;
                        systemSection.order = index;
                        return systemSection;
                    });
                })
            );
        }
    }
});
