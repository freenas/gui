var Path = require('path');

exports.MontageDataConfig = {
    ModelDirectoryAbsolutePath: Path.join(__dirname, "../../core/model"),
    EnumerationsDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/enumerations"),
    DescriptorsDirectoryPath: "core/model/descriptors",
    DescriptorsDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/descriptors"),
    ServicesDirectoryAbsolutePath: Path.join(__dirname, "../../core/model"),
    CustomDescriptorsAbsolutePath: Path.join(__dirname, "../../core/model/custom-descriptors")
};
