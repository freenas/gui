var Montage = require("montage").Montage,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService;

var ValidationService = exports.ValidationService = Montage.specialize({
    constructor: {
        value: function() {
            this._mandatoryPropertiesPerType = new Map();
            this._modelDescriptorService = ModelDescriptorService.getInstance();
        }
    },

    isPropertyMandatory: {
        value: function(type, propertyName, action) {
            if (!this._mandatoryPropertiesPerType.has(type)) {
                this._loadTypeMandatoryProperties(type);
            }
            return this._mandatoryPropertiesPerType.get(type).then(function(mandatoryPropertiesPerAction) {
                return mandatoryPropertiesPerAction.get(action).has(propertyName);
            });
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
            return this._mandatoryPropertiesPerType.set(type,
                Promise.all([
                    this._getTypeMandatoryPropertiesForAction(type, ValidationService.ACTIONS.CREATE),
                    this._getTypeMandatoryPropertiesForAction(type, ValidationService.ACTIONS.UPDATE)
                ]).spread(function(createMandatory, updateMandatory) {
                    return new Map()
                        .set(ValidationService.ACTIONS.CREATE, createMandatory)
                        .set(ValidationService.ACTIONS.UPDATE, updateMandatory);
                })
            );
        }
    },

    _getTypeMandatoryPropertiesForAction: {
        value: function(type, action) {
            var self = this;
            return this._modelDescriptorService.getDaoForType(type).then(function(dao) {
                return self._modelDescriptorService.getTaskDescriptor(action === ValidationService.ACTIONS.CREATE ?
                    dao.createMethod : dao.updateMethod);
            }).then(function(taskDescriptor) {
                return taskDescriptor ? taskDescriptor.get('mandatory') : [];
            });
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
    },

    ACTIONS: {
        value: {
            CREATE: 'create',
            UPDATE: 'update'
        }
    }
});

