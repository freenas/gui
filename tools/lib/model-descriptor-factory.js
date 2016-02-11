var ModelDescriptor = require("../../core/model/model-descriptor").ModelDescriptor,
    Serializer = require("montage/core/serialization/serializer/montage-serializer").MontageSerializer,
    FS = require('fs'),
    Path = require('path'),
    mr = require("mr/require").makeRequire();


var createModelDescriptorWithNameAndSchema = exports.createModelDescriptorWithNameAndSchema = function (name, schema) {
    var descriptor;

    if (schema.type === "object") {
        descriptor = getModelDescriptorWithNameAndSchema(name, schema);
    } else if (schema.type === "string") {
        if (schema.enum) {
            descriptor = getModelDescriptorWithNameAndEnum(name, schema.enum);
        } else {
            if (global.warning || global.verbose) {
                console.log("does not support schema '" + name + "' with the content '" + JSON.stringify(schema) + "'");
            }
        }

    } else {
        if (global.warning || global.verbose) {
            console.log("does not support schema '" + name + "' for the type '" + schema.type + "'");
        }
    }

    return descriptor;
};


exports.createModelDescriptorsWithNameAndSchema = function (name, schema) {
    var descriptors = [];

    schema._schema_name = name;

    var schemas = findSchemasInSchema(schema),
        _schema;

    for (var i = 0, length = schemas.length; i< length; i++) {
        _schema = schemas[i];
        descriptors.push(createModelDescriptorWithNameAndSchema(_schema._schema_name, _schema));
    }

    return descriptors;
};


var findSchemasInSchema = exports.findSchemasInSchema = function findSchemasInSchema (schema, _schemas) {
    if (!_schemas) {
        _schemas = [];
    }

    var properties = schema.properties;

    if (properties) {
        _schemas.push(schema);

        var propertyKeys = Object.keys(properties),
            property,
            propertyKey;

        for (var i = 0, length = propertyKeys.length; i < length; i++) {
            propertyKey = propertyKeys[i];
            property = properties[propertyKey];

            var type = property.type;

            if (property.enum) {
                if (global.warning || global.verbose) {
                    console.log("schema '" + schema._schema_name +
                        "' should have a reference to an enumeration for the property '" + propertyKey + "'");
                }
            } else if (typeof type === "string") {
                if (type === "object") {
                    if (global.warning || global.verbose) {
                        console.log("schema '" + schema._schema_name +
                            "' should have a reference to an object for the property '" + propertyKey + "'");
                    }

                    property._schema_name = schema._schema_name + "-" + propertyKey;

                    findSchemasInSchema(property, _schemas);
                }
            }
        }
    } else {
        if (global.warning || global.verbose) {
            console.log("Missing schema for '" + schema._schema_name + "'");
        }
    }

    return _schemas;
};


var saveModelDescriptorWithPathAndFileName = exports.saveModelDescriptorWithPathAndFileName = function (modelDescriptor, path) {
    return new Promise(function (resolve, reject) {
        var serializer = new Serializer().initWithRequire(mr);

        path = Path.join(path, modelDescriptor.name + ".mjson");

        if (global.verbose) {
            console.log("writing " + path);
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


//FIXME: hacky
function createModelDescriptorWithName(name) {
    var modelDescriptor = new ModelDescriptor().initWithName(name);

    modelDescriptor._montage_metadata = {
        require: mr,
        moduleId: "core/model/model-descriptor",
        objectName: "ModelDescriptor",
        isInstance: true
    };

    return modelDescriptor;
}

//FIXME: hacky
function createPropertyDescriptorWithModelAndName(modelDescriptor, name) {
    var propertyDescriptor = modelDescriptor.newPropertyBlueprint(name, 1);

    propertyDescriptor._montage_metadata = {
        require: mr,
        moduleId: "montage/core/meta/property-blueprint",
        objectName: "PropertyBlueprint",
        isInstance: true
    };

    return propertyDescriptor;
}


function getModelDescriptorWithNameAndSchema(name, schema) {
    var modelDescriptor = createModelDescriptorWithName(name),
        properties = schema.properties;

    if (properties) {
        var propertyKeys = Object.keys(properties),
            propertyDescriptor,
            property,
            propertyKey;

        for (var i = 0, length = propertyKeys.length; i < length; i++) {
            propertyKey = propertyKeys[i];
            property = properties[propertyKey];
            propertyDescriptor = createPropertyDescriptorWithModelAndName(modelDescriptor, propertyKey);

            var type = property.type;

            if (typeof type === "string") {
                if (type === "object" && (global.warning || global.verbose)) {
                    console.log("schema '" + name + "' should have a reference to an object for the property '" + propertyKey + "'");
                }

                setTypeOnPropertyDescriptor(type, propertyDescriptor);

            } else if (Array.isArray(type)) {
                //todo check if [0] !== null
                setTypeOnPropertyDescriptor(property.type[0], propertyDescriptor);

            } else if (propertyDescriptor["$ref"]) {
                //todo: implement $ref
                setTypeOnPropertyDescriptor("object", propertyDescriptor);
            }

            if (property.readOnly) {
                propertyDescriptor.readOnly = property.readOnly;
            }

            if (property.enum) {
                if (global.warning || global.verbose) {
                    console.log("schema '" + name + "' should have a reference to an enumeration for the property '" + propertyKey + "'");
                }

                propertyDescriptor.enumValues = property.enum;
            }

            modelDescriptor.addPropertyBlueprint(propertyDescriptor);
        }
    }

    return modelDescriptor;
}


function getModelDescriptorWithNameAndEnum(name, enumeration) {
    var modelDescriptor = createModelDescriptorWithName(name),
        propertyDescriptor,
        enumValue;

    for (var i = 0, length = enumeration.length; i < length; i++) {
        enumValue = enumeration[i];
        propertyDescriptor = createPropertyDescriptorWithModelAndName(modelDescriptor, enumValue);

        propertyDescriptor.defaultValue = enumValue;
        setTypeOnPropertyDescriptor(typeof enumValue, propertyDescriptor);

        modelDescriptor.addPropertyBlueprint(propertyDescriptor);
    }

    return modelDescriptor;
}


function setTypeOnPropertyDescriptor(type, propertyDescriptor) {
    if (type === "string") {
        type = "String"; //???

    } else if (type === "integer") {
        type = "number";
    }

    propertyDescriptor.valueType = type;
}
