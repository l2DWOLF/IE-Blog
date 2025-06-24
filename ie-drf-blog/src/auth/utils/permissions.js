

export const canEditDelete = (user, item) => {
    return !!user?.id && (user.id === item.author_id || user.is_admin);
};

export const canLikeDislike = (user) => {
    return !!user?.id
};