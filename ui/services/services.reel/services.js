var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Services
 * @extends Component
 */
exports.Services = Component.specialize({
    services: {
        value: null
    },

    categories: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                var self = this;
                self._listServices().then(function (services) {
                    return Promise.all([
                        self._getServicesCategory('Sharing', services, ['smb', 'nfs', 'afp']),
                        self._getServicesCategory('Management', services, ['sshd', 'smartd'])
                    ]);
                }).then(function(categories) {
                    self.categories = categories;
                });
            }
        }
    },

    _listServices: {
        value: function() {
            return this.application.dataService.fetchData(Model.Service);
        }
    },

    _getServicesCategory: {
        value: function(name, services, typesInCategory) {
            return this.application.dataService.getNewInstanceForType(Model.ServicesCategory).then(function(category) {
                category.name = name;
                category.services = services;
                category.types = typesInCategory.map(function(x) { return 'service-' + x; });
                return category;
            });
        }
    }
});
