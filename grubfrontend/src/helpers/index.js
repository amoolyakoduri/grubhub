import ls from 'local-storage';

export const isLoggedIn = () => {
    return ls.get('isLoggedIn') === true;
}

export const isBuyer = () => {
    return ls.get('userType') === "buyer";
}

export const isOwner = () => {
    return ls.get('userType') === "owner";
}