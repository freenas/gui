const ServiceSmbDoscharset = {
    CP437: 'CP437' as 'CP437',
    CP850: 'CP850' as 'CP850',
    CP852: 'CP852' as 'CP852',
    CP866: 'CP866' as 'CP866',
    CP932: 'CP932' as 'CP932',
    CP949: 'CP949' as 'CP949',
    CP950: 'CP950' as 'CP950',
    CP1029: 'CP1029' as 'CP1029',
    CP1251: 'CP1251' as 'CP1251',
    ASCII: 'ASCII' as 'ASCII'
};
type ServiceSmbDoscharset = (typeof ServiceSmbDoscharset)[keyof typeof ServiceSmbDoscharset];
export {ServiceSmbDoscharset};
