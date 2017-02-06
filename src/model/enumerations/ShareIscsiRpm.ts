const ShareIscsiRpm = {
    UNKNOWN: 'UNKNOWN' as 'UNKNOWN',
    SSD: 'SSD' as 'SSD',
    5400: '5400' as '5400',
    7200: '7200' as '7200',
    10000: '10000' as '10000',
    15000: '15000' as '15000'
};
type ShareIscsiRpm = (typeof ShareIscsiRpm)[keyof typeof ShareIscsiRpm];
export {ShareIscsiRpm};
