var Montage = require("montage").Montage;

exports.DockerCollection = Montage.specialize({
    _collection: {
        value: null
    },
    collection: {
        set: function (value) {
            if (this._collection !== value) {
                this._collection = value;
            }
        },
        get: function () {
            return this._collection;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _match_expr: {
        value: null
    },
    match_expr: {
        set: function (value) {
            if (this._match_expr !== value) {
                this._match_expr = value;
            }
        },
        get: function () {
            return this._match_expr;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "collection",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "match_expr",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            nameExpression: "id.defined() ? name : 'Create a collection'",
            collectionNameExpression: "'Collections'",
            daoModuleId: "core/dao/docker-collection-dao",
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-collection.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-collection.reel'
            }
        }
    }
});
