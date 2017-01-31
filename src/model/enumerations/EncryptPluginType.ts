const EncryptPluginType = {
    AES128: 'AES128' as 'AES128',
    AES192: 'AES192' as 'AES192',
    AES256: 'AES256' as 'AES256'
};
type EncryptPluginType = (typeof EncryptPluginType)[keyof typeof EncryptPluginType];
export {EncryptPluginType};
