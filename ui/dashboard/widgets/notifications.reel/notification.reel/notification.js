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
                                summary,
                                expressionValue;

                            // Fixme: Once there are entity names provided
                            // directly by the middleware, use those instead
                            // of the calculated entity names.
                            if (nameExpression && entity && typeOfEntity === "object") {
                                expressionValue = Evaluate(nameExpression, entity);
                            }

                            if (object.taskName) {
                                switch (object.taskName) {
                                    case "share.update":
                                        summary = "Update " + entity.type.toUpperCase() + " Share " + (expressionValue || entity.id);
                                        break;
                                    case "share.create":
                                        summary = "Create " + entity.type.toUpperCase() + " Share " + entity.name;
                                        break;
                                    case "share.delete":
                                        summary = "Delete " + entity.type.toUpperCase() + " Share " + (expressionValue || entity.id);
                                        break;
                                    case "user.update":
                                        summary = "Update User " + (expressionValue || entity.id);
                                        break;
                                    case "user.create":
                                        summary = "Create User " + entity.username;
                                        break;
                                    case "user.delete":
                                        summary = "Delete User " + (expressionValue || entity.id);
                                        break;
                                    case "group.update":
                                        summary = "Update Group " + (expressionValue || entity.id);
                                        break;
                                    case "group.create":
                                        summary = "Create Group " + entity.name;
                                        break;
                                    case "group.delete":
                                        summary = "Delete Group " + (expressionValue || entity.id);
                                        break;
                                    case "volume.update":
                                        summary = "Update Volume " + (expressionValue || entity.id);
                                        break;
                                    case "volume.create":
                                        summary = "Create Volume " + entity.id;
                                        break;
                                    case "volume.delete":
                                        summary = "Delete Volume " + (expressionValue || entity.id);
                                        break;
                                    case "network.interface.update":
                                        summary = "Update " + entity.type + " " + (expressionValue || entity.id);
                                        break;
                                    case "network.interface.create":
                                        summary = "Create new " + entity.type + " " + (entity.name ? entity.name : "");
                                        break;
                                    case "network.interface.delete":
                                        summary = "Delete " + entity.type + " " + (expressionValue || entity.id);
                                        break;
                                    case "service.update":
                                        summary = "Update " + expressionValue + " Settings";
                                        break;
                                    case "network.configuration.update":
                                        summary = "Update " + expressionValue;
                                        break;
                                    case "system.general.update":
                                        summary = "Update System General Settings";
                                        break;
                                    default:
                                        summary = object.taskName + " " + (expressionValue || entity.id);
                                }
                            }

                            self.summary = summary;
                        }).catch(function (error) {
                            var typeOfEntity,
                                summary;
                            // Fixme: This makes me really sad and there needs to be a
                            // better way to handle editing things with no UI descriptor
                            if (object.taskName) {
                                switch (object.taskName) {
                                    case "system.general.update":
                                        summary = "Update System General Settings";
                                        break;
                                    default:
                                        summary = object.taskName;
                                }
                            } else if (typeOfEntity === "string") {
                                summary =  entity;
                            } else {
                                // I'm being explicit with this instead of leaving it undefined.
                                // It will result in no summary displayed at all either way.
                                summary = null;
                            }
                            self.summary = summary;
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
