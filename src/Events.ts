const Events = {
    userLoggedIn: 'userLoggedIn' as 'userLoggedIn',
    sessionOpened: 'sessionOpened' as 'sessionOpened'
};

type Events = (typeof Events)[keyof typeof Events];
export { Events };
