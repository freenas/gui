const ShareIscsiBlocksize = {
    512: '512' as '512',
    4096: '4096' as '4096'
};
type ShareIscsiBlocksize = (typeof ShareIscsiBlocksize)[keyof typeof ShareIscsiBlocksize];
export {ShareIscsiBlocksize};
