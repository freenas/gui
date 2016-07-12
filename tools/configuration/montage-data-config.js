var Path = require('path');

exports.MontageDataConfig = {
    ModelDirectoryAbsolutePath: Path.join(__dirname, "../../core/model"),
    ModelsDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/models"),
    ModelsDirectoryPath: "core/model/models",
    EnumerationsDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/enumerations"),
    DescriptorsDirectoryPath: "core/model/descriptors",
    DescriptorsDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/descriptors"),
    ServicesDirectoryAbsolutePath: Path.join(__dirname, "../../core/model"),
    UserInterfaceDescriptorDirectoryAbsolutePath: Path.join(__dirname, "../../core/model/user-interface-descriptors"),
    CustomDescriptorsAbsolutePath: Path.join(__dirname, "../../core/model/custom-descriptors"),
    CacheDirectoryAbsolutePath: Path.join(__dirname, "../../core/cache")
};
