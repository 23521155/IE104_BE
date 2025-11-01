import multer from 'multer';
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const customFileFilter = (req, file, callback) => {
    // Doi voi multer kiem tra kieu file thi mimetype
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
        const errMessage = 'File type is invalid. Only accept jpg, jpeg and png';
        return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null);
    }

    // Neu nhu file hop le
    return callback(null, true);
};

// Khoi tao function upload duoc boi boi thang multer
const upload = multer({
    limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
    fileFilter: customFileFilter,
});

export const multerUploadMiddleware = { upload };
