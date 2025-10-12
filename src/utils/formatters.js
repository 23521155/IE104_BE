import { pick } from 'lodash';

export const slugify = (val) => {
    if (!val) return '';
    return String(val)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
};
export const normalizeName = (str) => {
    return str
        .normalize('NFD') // tách dấu ra khỏi ký tự
        .replace(/[\u0300-\u036f]/g, '') // xoá dấu (accents)
        .replace(/['.\s]/g, ''); // xoá dấu nháy đơn, dấu chấm, khoảng trắng
    // về chữ thường (tuỳ chọn)
};
export const pickUser = (user) => {
    if (!user) return {};
    return pick(user, [
        '_id',
        'email',
        'username',
        'displayName',
        'avatar',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
    ]);
};
