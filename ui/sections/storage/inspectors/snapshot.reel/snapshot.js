var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

exports.Snapshot = AbstractInspector.specialize(/** @lends Snapshot# */ {

    pathDisplayMode: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    if (object.id == void 0) {
                        this._object.replicable = true;
                        this.pathDisplayMode = "select";
                    } else {
                        this.pathDisplayMode = "display";
                    }
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
            }

            if (this.object._volume) {
                this.object.volume = this.object._volume.id;
            }
            if (this.object._dataset) {
                this.object.dataset = this.object._dataset.id;
            }
            if (!this.object._isNew) {
                this.object._creationDate = new Date(this.object.properties.creation.rawvalue * 1000);
            }
            this._loadExpirationDate();
            this._resetRepetition();
        }
    },

    revert: {
        value: function() {
            var self = this;
            this.inspector.revert().then(function() {
                self._loadExpirationDate();
            });
        }
    },

    save: {
        value: function() {
            var created = this.object.properties ? (+this.object.properties.creation.rawvalue * 1000) : Date.now(),
                expires = this._expirationType === 'on' ? this._expirationDate.getTime() :
                    this._expirationType === 'after' ? (Date.now() + this._lifetime * 1000) : 0;

            this.object.lifetime = expires ? Math.round((expires - created) / 1000) : null;

            return Promise.all([
                this.object._isNew ? this.inspector.save(this.object._recursive) : this.inspector.save(),
                this._repetition ? this._calendarService.createNewRepeatedTask(
                    'volume.snapshot_dataset',
                    this.object.name,
                    [
                        this.object.dataset,
                        this.object._recursive,
                        this.object.lifetime,
                        this.object.name + '-auto',
                        this.object.replicable
                    ],
                    this._repetition
                ) : Promise.resolve()
            ]);
        }
    },

    delete: {
        value: function() {
            var self = this;

            return this.inspector.delete(this.extraDeleteFlags[0].checked);
        }
    },

    _loadVolume: {
        value: function() {
            if (this._object && this._volume) {
                this._object.volume = this._volume.id;
            }
        }
    },

    _loadExpirationDate: {
        value: function() {
            var now = new Date(),
                defaultExpirationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
                expirationDate = null;

            if (!this.object._isNew) {
                if (this._object.lifetime && this._object.properties) {
                    expirationDate = new Date((+this.object.properties.creation.rawvalue + this.object.lifetime) * 1000);
                }
            } else {
                expirationDate = defaultExpirationDate;
            }

            this._expirationType = expirationDate ? 'after' : 'never';
            this._expirationDate = expirationDate || defaultExpirationDate;
            this._lifetime = Math.ceil((this._expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) * (60 * 60 * 24);
        }
    },

    _resetRepetition: {
        value: function() {
            this._repetition = null;
        }
    }

}, {
    EXPIRATION_TYPES: {
        value: [
            {
                value: 'never',
                label: 'Never'
            },
            {
                value: 'on',
                label: 'On'
            },
            {
                value: 'after',
                label: 'After'
            }
        ]
    }
});
