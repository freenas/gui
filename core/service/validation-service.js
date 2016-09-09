var Montage = require("montage").Montage,
    Services = require("core/model/services").Services,
    FastMap = require("collections/fast-map"),
    FastSet = require("collections/fast-set");

exports.ValidationService = Montage.specialize({
    ACTIONS: {
        value: {
            CREATE: 'create',
            UPDATE: 'update'
        }
    },

    constructor: {
        value: function() {
            this._mandatoryPropertiesPerType = new FastMap();
        }
    },

    isPropertyMandatory: {
        value: function(type, propertyName, action) {
            if (!this._mandatoryPropertiesPerType.has(type)) {
                this._loadTypeMandatoryProperties(type);
            }
            return this._mandatoryPropertiesPerType.get(type).get(action).has(propertyName);
        }
    },

    isValid: {
        value: function(type, propertyName, action, value) {
            return !this.isPropertyMandatory(type, propertyName, action) ||
                !this._isEmpty(value);
        }
    },

    _isEmpty: {
        value: function(value) {
            return typeof value === "undefined" || 
                    (typeof value === "object" && !value) || 
                    (typeof value === "string" && value.length == 0);
        }
    },

    _loadTypeMandatoryProperties: {
        value: function(type) {
            var typeMandatoryPropertiesPerAction = new FastMap();
            typeMandatoryPropertiesPerAction.set(this.ACTIONS.CREATE, this._getTypeMandatoryPropertiesForAction(type, this.ACTIONS.CREATE));
            typeMandatoryPropertiesPerAction.set(this.ACTIONS.UPDATE, this._getTypeMandatoryPropertiesForAction(type, this.ACTIONS.UPDATE));
            this._mandatoryPropertiesPerType.set(type, typeMandatoryPropertiesPerAction);
        }
    },

    _getTypeMandatoryPropertiesForAction: {
        value: function(type, action) {
            var serviceDescriptors = Services.findServicesForType(type),
                mandatoryProperties = new FastSet();
            if (serviceDescriptors) {
                var serviceDescriptor = serviceDescriptors[action];
                if (serviceDescriptor) {
                    if (serviceDescriptor.restrictions) {
                        mandatoryProperties.addEach(serviceDescriptor.restrictions.requiredFields);
                    }
                }
            }
            return mandatoryProperties;
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
            }
            return this._instance;
        }
    }

});

