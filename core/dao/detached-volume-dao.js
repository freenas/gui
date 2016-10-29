var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.DetachedVolumeDao = AbstractDao.specialize({
    __volumeService: {
        value: null
    },

    _volumeService: {
        get: function() {
            var self = this,
                Model = this.constructor.Model,
                promise = this.__volumeService ? 
                    Promise.resolve(this.__volumeService) :
                    Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                        return self.__volumeService = Volume.constructor.services;
                    });
            return promise;
        }
    },

    init: {
        value: function() {
            this._model = this.constructor.Model.DetachedVolume;
        }
    },

    list: {
        value: function() {
            this._checkModelIsInitialized();
            var self = this;
            return this._volumeService.then(function(volumeService) {
                return volumeService.find();
            }).then(function(rawDetachedVolumes) {
                return Promise.all(rawDetachedVolumes.filter(function(x) {
                    return x.status === "ONLINE";
                }).map(function(x) {
                    return self._dataService.mapRawDataToType(x, self._model).then(function(detachedVolume) {
                        detachedVolume.topology._isDetached = true;
                        return detachedVolume;
                    });
                }));
            });
        }
    }
});
