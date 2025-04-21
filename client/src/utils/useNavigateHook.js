let navigateFn;

export const setNavigate = (navFn) => {
    navigateFn = navFn;
};

export const navigate = (path) => {
    if (navigateFn) {
        navigateFn(path);
    } else {
        console.warn("Navigate function not initialized");
    }
};