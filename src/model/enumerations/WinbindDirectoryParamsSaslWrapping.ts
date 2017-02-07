const WinbindDirectoryParamsSaslWrapping = {
    PLAIN: 'PLAIN' as 'PLAIN',
    SIGN: 'SIGN' as 'SIGN',
    SEAL: 'SEAL' as 'SEAL'
};
type WinbindDirectoryParamsSaslWrapping = (typeof WinbindDirectoryParamsSaslWrapping)[keyof typeof WinbindDirectoryParamsSaslWrapping];
export {WinbindDirectoryParamsSaslWrapping};
