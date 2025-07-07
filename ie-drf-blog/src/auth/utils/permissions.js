

export const canEditDelete = (user, item) => {
    return !!user?.id && (user.id === item.author_id || user.is_admin);
};

export const canAddArticles = (user) => {
    return !!user?.id && (user.is_mod) || user.is_admin;
}