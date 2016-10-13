/**
 * @module ui/docker-image-pull.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    ContainerCreator = require("ui/sections/containers/inspectors/container-creator.reel").ContainerCreator;

/**
 * @class DockerImagePull
 * @extends AbstractInspector
 */
exports.DockerImagePull = AbstractInspector.specialize(/** @lends DockerImagePull# */ {
    
    templateDidLoad: {
        value: function () {
            var self = this;

            ContainerCreator.prototype.templateDidLoad.call(this).then(function () {
                return self._sectionService.listDockerImages();
            }).then(function (dockerImages) {
                self._dockerImages = dockerImages;
            });
        }
    }

});
