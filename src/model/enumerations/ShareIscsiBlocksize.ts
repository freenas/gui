const ShareIscsiBlocksize = {
    512: '512' as '512',
    1024: '1024' as '1024',
    2048: '2048' as '2048',
    4096: '4096' as '4096'
};
type ShareIscsiBlocksize = (typeof ShareIscsiBlocksize)[keyof typeof ShareIscsiBlocksize];
export {ShareIscsiBlocksize};
