/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    Evaluate = require("frb/evaluate");

/**
 * @class Notification
 * @extends Component
 */
exports.Notification = Component.specialize(/** @lends Notification# */ {

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    var data = object.data;

                    if (data && data.length) {
                        var self = this,
                            entity = data[0];

                        this.application.delegate.getUserInterfaceDescriptorForType(object.modelType).then(function (UIDescriptor) {
                            var nameExpression = UIDescriptor.nameExpression,
                                typeOfEntity = typeof entity,
                                summary;

                            if (nameExpression && entity && typeOfEntity === "object") {
                                var expressionValue = Evaluate(nameExpression, entity);

                                if ((expressionValue === void 0 || expressionValue === null)) {
                                    if (entity.id !== void 0 && entity.id !== null) {
                                        summary = entity.id;
                                    }
                                } else {
                                    summary = expressionValue;
                                }
                            } else if (typeOfEntity === "string") {
                                summary =  entity;
                            }

                            self.summary = summary;

                        }).catch(function (error) {
                            console.warn(error);
                        });
                    } else {
                        this.summary = this.object.modelType;
                    }
                }
            }
        },
        get: function () {
            return this._object;
        }
    },

    UIDescriptor: {
        value: null
    },

    summary: {
        value: null
    },

    infoExpanded: {
        value: false
    },

    handleInfoToggleAction: {
        value: function () {
            this.infoExpanded = !this.infoExpanded;
        }
    }
});
