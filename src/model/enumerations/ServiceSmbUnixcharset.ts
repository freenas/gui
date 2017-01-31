const ServiceSmbUnixcharset = {
    UTF-8: 'UTF-8' as 'UTF-8',
    iso-8859-1: 'iso-8859-1' as 'iso-8859-1',
    iso-8859-15: 'iso-8859-15' as 'iso-8859-15',
    gb2312: 'gb2312' as 'gb2312',
    EUC-JP: 'EUC-JP' as 'EUC-JP',
    ASCII: 'ASCII' as 'ASCII'
};
type ServiceSmbUnixcharset = (typeof ServiceSmbUnixcharset)[keyof typeof ServiceSmbUnixcharset];
export {ServiceSmbUnixcharset};
