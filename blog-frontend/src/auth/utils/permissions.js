

export const canEditDelete = (user, item) => {
    return !!user?.id && (user.id === item.author_id || user.is_admin);
};

export const modArticlesAccess = (user) => {
    return !!user?.id && (user.is_mod) || user.is_admin;
};

export const isUserAccess = (user) => {
    return !!user?.id;
};