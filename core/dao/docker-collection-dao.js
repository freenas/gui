var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;

exports.DockerCollectionDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.DockerCollection;
        }
    },

    list: {
        value: function () {
            return Promise.all([
                this.getDefaultDockerCollection(),
                this.super()
            ]).then(function (data) {
                var dockerCollections = data[1];

                //add default docker
                if (dockerCollections.indexOf(data[0]) === -1) {
                    dockerCollections.unshift(data[0]);
                }

                return dockerCollections;
            });
        }
    },

    getDefaultDockerCollection: {
        value: function () {
            if (this._defaultDockerCollection) {
                return Promise.resolve(this._defaultDockerCollection);
            }

            var self = this;

            return this.getNewInstance().then(function (dockerCollection) {
                dockerCollection.id = -1;
                dockerCollection._isNew = false;
                dockerCollection.collection = dockerCollection.name = "freenas";
                self._defaultDockerCollection = dockerCollection;
                return dockerCollection;
            });
        }
    },
});
