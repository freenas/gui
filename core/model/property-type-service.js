var Model = require('./model').Model;

var PropertyTypeService = function() {
    this._mappings = {
        Share: {
            properties: {
                discriminator: 'type',
                mapping: {
                    smb: Model.ShareSmb,
                    afp: Model.ShareAfp,
                    nfs: Model.ShareNfs
                }
            }
        },
        Service: {
            config: {
                discriminator: 'name',
                mapping: {
                    smb:    Model.ServiceSmb,
                    sshd:   Model.ServiceSshd,
                    nfs:    Model.ServiceNfs,
                    afp:    Model.ServiceAfp,
                    smartd: Model.ServiceSmartd
                }
            }
        },
        NetworkInterface: {
            vlan: {
                discriminator: 'type',
                mapping: {
                    VLAN:    Model.NetworkInterfaceVlan
                }
            },
            lagg: {
                discriminator: 'type',
                mapping: {
                    LAGG:    Model.NetworkInterfaceLagg
                }
            },
            bridge: {
                discriminator: 'type',
                mapping: {
                    BRIDGE:    Model.NetworkInterfaceBridge
                }
            }
        }
    };

    this.getTypeForObjectProperty = function(object, data, propertyKey) {
        var objectTypeName = Object.getPrototypeOf(object).Type.typeName,
            objectMappings = this._mappings[objectTypeName];
        if (objectMappings) {
            var propertyMapping = objectMappings[propertyKey];
            if (propertyMapping) {
                return propertyMapping.mapping[data[propertyMapping.discriminator]];
            }
        }
        return null;
    };
};

exports.propertyTypeService = new PropertyTypeService();
