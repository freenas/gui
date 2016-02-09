var ModelDescriptor = require("../../core/model/model-descriptor").ModelDescriptor,
    Serializer = require("montage/core/serialization/serializer/montage-serializer").MontageSerializer,
    FS = require('fs'),
    Path = require('path'),
    mr = require("mr/require").makeRequire();


exports.createModelDescriptorWithSchema = function  (name, schema) {
    var modelDescriptor;

    if (schema.type === "object") {
        modelDescriptor = new ModelDescriptor().initWithName(name);

        //FIXME: hacky
        modelDescriptor._montage_metadata = {
            require: mr,
            moduleId: "core/model/model-descriptor",
            objectName: "ModelDescriptor",
            isInstance: true
        };

        var properties = schema.properties;

        if (properties) {
            var propertyKeys = Object.keys(properties),
                propertyDescriptor,
                property,
                propertyKey;

            for (var i = 0, length = propertyKeys.length; i < length; i++) {
                propertyKey = propertyKeys[i];
                property = properties[propertyKey];
                propertyDescriptor = modelDescriptor.newPropertyBlueprint(propertyKey, 1);

                propertyDescriptor._montage_metadata = {
                    require: mr,
                    moduleId: "montage/core/meta/property-blueprint",
                    objectName: "PropertyBlueprint",
                    isInstance: true
                };

                var type = property.type;

                if (typeof type === "string") {
                    setTypeOnPropertyDescriptor(type, propertyDescriptor);

                } else if (Array.isArray(type)) {
                    setTypeOnPropertyDescriptor(property.type[0], propertyDescriptor);

                } else if (propertyDescriptor["$ref"]) {
                    setTypeOnPropertyDescriptor("object", propertyDescriptor);
                }

                if (property.readOnly) {
                    propertyDescriptor.readOnly = property.readOnly;
                }

                if (property.enum) {
                    propertyDescriptor.enumValues = property.enum;
                }

                modelDescriptor.addPropertyBlueprint(propertyDescriptor);
            }
        }
    }

    return modelDescriptor;
};


function setTypeOnPropertyDescriptor(type, propertyDescriptor) {
    if (type === "string") {
        type = "String"; //???

    } else if (type === "integer") {
        type = "number";
    }

    propertyDescriptor.valueType = type;
}


var saveModelDescriptorWithPathAndFileName = exports.saveModelDescriptorWithPathAndFileName = function (modelDescriptor, path) {
    return new Promise(function (resolve, reject) {
        var serializer = new Serializer().initWithRequire(mr);

        path = Path.join(path, modelDescriptor.name + ".mjson");

        if (global.verbose) {
            console.log("wrinting " + path);
        }

        FS.writeFile(path, serializer.serializeObject(modelDescriptor), function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(path)
            }
        });
    });
};


exports.saveModelDescriptorsAtPath = function (modelDescriptors, path) {
    var files = [];

    for (var i = 0, length = modelDescriptors.length; i < length; i++) {
        files.push(saveModelDescriptorWithPathAndFileName(modelDescriptors[i], path));
    }

    return Promise.all(files);
};
