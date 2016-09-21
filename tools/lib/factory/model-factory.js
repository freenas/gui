require('../../../core/extras/string');
require('montage/core/extras/string');
JSON.sortify = require('json.sortify');

var FS = require('../fs-promise');
var Path = require('path');
var beautify = require('js-beautify').js_beautify;

var MODULE_FILE_TEMPLATE = "<REQUIRES>\n\nexports.<EXPORT_NAME> = Montage.specialize(<PROTOTYPE_DESCRIPTOR>);";
var MODULE_FILE_CONSTRUCTOR_TEMPLATE = "<REQUIRES>\n\nexports.<EXPORT_NAME> = Montage.specialize(<PROTOTYPE_DESCRIPTOR>, <CONSTRUCTOR_DESCRIPTOR>);";
var MODULE_FILE_ONLY_CONSTRUCTOR_TEMPLATE = "<REQUIRES>\n\nexports.<EXPORT_NAME> = Montage.specialize(null, <CONSTRUCTOR_DESCRIPTOR>);";
var CONSTRUCTOR_PROPERTY_BLUEPRINTS_TEMPLATE = "propertyBlueprints: { value: <PROPERTY_BLUEPRINTS> }";
var CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_TEMPLATE = "userInterfaceDescriptor: { value: { <USER_INTERFACE_DESCRIPTOR> } } ";
var CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_MODULE_ID_TEMPLATE = "<USER_INTERFACE_DESCRIPTOR_MODULE_NAME>: { id: '<USER_INTERFACE_DESCRIPTOR_MODULE_ID>' }";
var CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_PROPERTY_STRING_TEMPLATE = "<USER_INTERFACE_DESCRIPTOR_PROPERTY_NAME>: \"<USER_INTERFACE_DESCRIPTOR_PROPERTY_STRING>\"";
var CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_PROPERTY_OBJECT_TEMPLATE = "<USER_INTERFACE_DESCRIPTOR_PROPERTY_NAME>: <USER_INTERFACE_DESCRIPTOR_PROPERTY_OBJECT>";
var REQUIRE_TEMPLATE = 'var <MODULE_NAME> = require("<MODULE_ID>").<MODULE_NAME>;';
var PROPERTY_TEMPLATE = '<PRIVATE_PROPERTY_NAME>:{value:null},<PROPERTY_NAME>:{set: function (value) {if (this<PRIVATE_PROPERTY_NAME_KEY> !== value) {this<PRIVATE_PROPERTY_NAME_KEY> = value;}}, get: function () {return this<PRIVATE_PROPERTY_NAME_KEY>;}}';
var PROPERTY_OBJECT_TEMPLATE = '<PRIVATE_PROPERTY_NAME>:{value:null},<PROPERTY_NAME>:{set: function (value) {if (this<PRIVATE_PROPERTY_NAME_KEY> !== value) {this<PRIVATE_PROPERTY_NAME_KEY> = value;}}, get: function () {return this<PRIVATE_PROPERTY_NAME_KEY> || (this<PRIVATE_PROPERTY_NAME_KEY> = new <MODULE_NAME>());}}';

var ModelObject = function ModelObject (descriptor) {
    this.name = descriptor.root.properties.name;
    this.fileName = _toFileName(descriptor.root.properties.name, "-");
    this.requires = [
        {
            name: "Montage",
            moduleId: "montage"
        }
    ];

    this.requiresMap = new Map ();
    this.requiresMap.set("Montage", true);
    this.properties = [];
};

var createModelWithDescriptor = exports.createModelWithDescriptor = function createModelWithNameAndDescriptor (descriptor) {
    var model = new ModelObject(descriptor),
        propertyBlueprints = descriptor.root.properties.propertyBlueprints,
        property, propertyDescriptor, i , length;

    if (propertyBlueprints) {
        for (i = 0, length = propertyBlueprints.length; i < length; i++) {
            property = descriptor[propertyBlueprints[i]["@"]];

            if (property) {
                propertyDescriptor = {
                    name: property.properties.name,
                    valueType: property.properties.valueType,
                    mandatory: !!property.properties.mandatory
                };

                if (property.properties.valueObjectPrototypeName) {
                    propertyDescriptor.valueObjectPrototypeName = property.properties.valueObjectPrototypeName;

                    if (!model.requiresMap.has(propertyDescriptor.valueObjectPrototypeName)) {
                        model.requiresMap.set(propertyDescriptor.valueObjectPrototypeName, true);

                        model.requires.push({
                            name: propertyDescriptor.valueObjectPrototypeName,
                            moduleId: "core/model/models/" + _toFileName(propertyDescriptor.valueObjectPrototypeName, "-")
                        });
                    }
                }

                if (property.properties.readOnly) {
                    propertyDescriptor.readOnly = true;
                }

                model.properties.push(propertyDescriptor);
            }
        }
    }

    return model;
};


function _toFileName (name, separator) {
    return name.split(/(?=[A-Z])/).join(separator).toLowerCase();
}


ModelObject.prototype.toJS = function () {
    var PROTOTYPE_DESCRIPTOR = "", REQUIRES = "", CONSTRUCTOR_DESCRIPTOR = "", CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR = "",
        privatePropertyName, constructorProperties = [], i, length, property, _require, propertyName, propertyNameValid,
        // TODO: enable feature later
        // Need to add class method +  prototype method on compiled files.
        // Need to remove all the "manual" initialization of the valueObjectPrototypeName within GUI
        propertyNameKey, enableMultipleRequires = false;

    for (i = 0, length = this.properties.length; i < length; i++) {
        property = this.properties[i];
        propertyNameValid = /^(?:[\$A-Z_a-z0-9])*$/.test(property.name);
        propertyName = propertyNameValid ? property.name : '"' + property.name + '"';
        propertyNameKey = propertyNameValid ? "._" + property.name : '["_' + property.name + '"]';
        privatePropertyName = propertyNameValid ? "_" + property.name : '"_' + property.name + '"';

        if (enableMultipleRequires && property.valueObjectPrototypeName && this.requiresMap.has(property.valueObjectPrototypeName)) {
            PROTOTYPE_DESCRIPTOR += ((PROPERTY_OBJECT_TEMPLATE
                .replace(/<PROPERTY_NAME>/ig, propertyName))
                .replace(/<PRIVATE_PROPERTY_NAME_KEY>/ig, propertyNameKey)
                .replace(/<MODULE_NAME>/ig, property.valueObjectPrototypeName))
                .replace(/<PRIVATE_PROPERTY_NAME>/ig, privatePropertyName);
        } else {
            PROTOTYPE_DESCRIPTOR += (PROPERTY_TEMPLATE.replace(/<PROPERTY_NAME>/ig, propertyName))
                .replace(/<PRIVATE_PROPERTY_NAME_KEY>/ig, propertyNameKey)
                .replace(/<PRIVATE_PROPERTY_NAME>/ig, privatePropertyName);
        }

        if (length - 1 !== i) {
            PROTOTYPE_DESCRIPTOR += ",";
        }
    }

    if (PROTOTYPE_DESCRIPTOR && PROTOTYPE_DESCRIPTOR.length) {
        PROTOTYPE_DESCRIPTOR = "{" + PROTOTYPE_DESCRIPTOR + "}";
    }

    if (enableMultipleRequires) {
        for (i = 0, length = this.requires.length; i < length; i++) {
            _require = this.requires[i];

            REQUIRES += ((REQUIRE_TEMPLATE.replace(/<MODULE_NAME>/ig, _require.name)).replace(/<MODULE_ID>/ig, _require.moduleId));
        }
    } else {
        REQUIRES += ((REQUIRE_TEMPLATE.replace(/<MODULE_NAME>/ig, this.requires[0].name)).replace(/<MODULE_ID>/ig, this.requires[0].moduleId));
    }

    if (this.properties.length) {
        constructorProperties.push((CONSTRUCTOR_PROPERTY_BLUEPRINTS_TEMPLATE
            .replace(/<PROPERTY_BLUEPRINTS>/ig, JSON.sortify(this.properties)).replace(/\"([^(\")"]+)\":/g,"$1:")));
    }

    if (this.userInterfaceDescriptor && this.userInterfaceDescriptor.root) {
        var userInterfaceDescriptorProperties = this.userInterfaceDescriptor.root.properties,
            userInterfaceDescriptorPropertiesKeys = Object.keys(userInterfaceDescriptorProperties);

        for (i = 0, length = userInterfaceDescriptorPropertiesKeys.length; i < length; i++) {
            property = userInterfaceDescriptorProperties[userInterfaceDescriptorPropertiesKeys[i]];

            if (typeof property === "object") {
                if (property["%"]) {
                    CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR += (
                        (CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_MODULE_ID_TEMPLATE
                            .replace(/<USER_INTERFACE_DESCRIPTOR_MODULE_NAME>/ig, userInterfaceDescriptorPropertiesKeys[i]))
                            .replace(/<USER_INTERFACE_DESCRIPTOR_MODULE_ID>/ig, property["%"])
                    );
                } else {
                   CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR += (
                        (CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_PROPERTY_OBJECT_TEMPLATE
                            .replace(/<USER_INTERFACE_DESCRIPTOR_PROPERTY_NAME>/ig, userInterfaceDescriptorPropertiesKeys[i]))
                            .replace(/<USER_INTERFACE_DESCRIPTOR_PROPERTY_OBJECT>/ig, JSON.stringify(property))
                    );
                }    
            } else {
                 CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR += (
                        (CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_PROPERTY_STRING_TEMPLATE
                            .replace(/<USER_INTERFACE_DESCRIPTOR_PROPERTY_NAME>/ig, userInterfaceDescriptorPropertiesKeys[i]))
                            .replace(/<USER_INTERFACE_DESCRIPTOR_PROPERTY_STRING>/ig, property)
                    );
            }

            if (length - 1 !== i) {
                CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR += ",";
            }
        }

        constructorProperties.push(CONSTRUCTOR_PROPERTY_USER_INTERFACE_DESCRIPTOR_TEMPLATE.replace(/<USER_INTERFACE_DESCRIPTOR>/ig, CONSTRUCTOR_USER_INTERFACE_DESCRIPTOR));
    }

    if (constructorProperties.length) {
        for (i = 0, length = constructorProperties.length; i < length; i++) {
            CONSTRUCTOR_DESCRIPTOR += constructorProperties[i];

            if (length - 1 !== i) {
                CONSTRUCTOR_DESCRIPTOR += ",";
            }
        }

        CONSTRUCTOR_DESCRIPTOR = "{" + CONSTRUCTOR_DESCRIPTOR + "}";
    }


    if (CONSTRUCTOR_DESCRIPTOR && PROTOTYPE_DESCRIPTOR) {
        return ((MODULE_FILE_CONSTRUCTOR_TEMPLATE.replace(/<EXPORT_NAME>/ig, this.name))
            .replace(/<PROTOTYPE_DESCRIPTOR>/ig, PROTOTYPE_DESCRIPTOR)
            .replace(/<REQUIRES>/ig, REQUIRES)
            .replace(/<CONSTRUCTOR_DESCRIPTOR>/ig, CONSTRUCTOR_DESCRIPTOR));
    } else if (CONSTRUCTOR_DESCRIPTOR) {
        return ((MODULE_FILE_ONLY_CONSTRUCTOR_TEMPLATE.replace(/<EXPORT_NAME>/ig, this.name))
            .replace(/<CONSTRUCTOR_DESCRIPTOR>/ig, CONSTRUCTOR_DESCRIPTOR)
            .replace(/<REQUIRES>/ig, REQUIRES));
    }

    return ((MODULE_FILE_TEMPLATE.replace(/<EXPORT_NAME>/ig, this.name))
        .replace(/<PROTOTYPE_DESCRIPTOR>/ig, PROTOTYPE_DESCRIPTOR)
        .replace(/<REQUIRES>/ig, REQUIRES));
};

exports.saveModelsAtPath = function saveModelsAtPath (models, path) {
    var files = [];

    for (var i = 0, length = models.length; i < length; i++) {
        files.push(saveModelWithPathAndFileName(models[i], path));
    }

    return Promise.all(files);
};

var saveModelWithPathAndFileName = exports.saveModelWithPathAndFileName = function (model, path) {
    path = Path.join(path, model.fileName + ".js");

    if (global.verbose) {
        console.log("writing " + path);
    }

    return FS.writeFileAtPathWithData(path, beautify(model.toJS(), {
        space_after_anon_function: true,
        end_with_newline: true
    }));
};
