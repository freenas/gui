var FS = require('../fs-promise'),
    Path = require('path');

require('../../../core/extras/string');
require('montage/core/extras/string');

var ENUM_FILE_TEMPLATE = "var Enum = require(\"montage/core/enum\").Enum;\n\nexports.<EXPORT_NAME> = new Enum().initWithMembersAndValues([<MEMBERS>], [<VALUES>]);\n";


exports.createEnumerationWithNameAndValues = function (name, values) {
    values = values.sort().map(function (value) { return "\"" + value + "\""});

    return {
        name: name,
        data: ((ENUM_FILE_TEMPLATE.replace(/<EXPORT_NAME>/, name.toCamelCase()))
            .replace(/<MEMBERS>/, values)).replace(/<VALUES>/, values)
    };
};

var saveEnumerationAtPath = exports.saveEnumerationAtPath = function (enumeration, path) {
    return FS.writeFileAtPathWithData(Path.join(path, _toFileName(enumeration.name, "-") + ".js"), enumeration.data);
};

exports.saveEnumerationsAtPath = function (enumerations, path) {
    var files = [];

    for (var i = 0, length = enumerations.length; i < length; i++) {
        files.push(saveEnumerationAtPath(enumerations[i], path));
    }

    return Promise.all(files);
};


function _toFileName (name, separator) {
    return name.split(/(?=[A-Z])/).join(separator).toLowerCase();
}
