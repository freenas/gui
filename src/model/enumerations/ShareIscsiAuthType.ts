const ShareIscsiAuthType = {
    NONE: 'NONE' as 'NONE',
    DENY: 'DENY' as 'DENY',
    CHAP: 'CHAP' as 'CHAP',
    CHAP_MUTUAL: 'CHAP_MUTUAL' as 'CHAP_MUTUAL'
};
type ShareIscsiAuthType = (typeof ShareIscsiAuthType)[keyof typeof ShareIscsiAuthType];
export {ShareIscsiAuthType};
