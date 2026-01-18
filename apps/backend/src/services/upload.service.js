import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';

        if (file.fieldname === 'avatar') {
            uploadPath = path.join(__dirname, '../../uploads/avatars');
        } else if (file.fieldname === 'banner') {
            uploadPath = path.join(__dirname, '../../uploads/banners');
        } else {
            return cb(new Error('Type de fichier non supporté'), null);
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);

        const shortBasename = basename.substring(0, 50);
        cb(null, `${shortBasename}-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé. Utilisez uniquement JPG, PNG ou WebP.'), false);
    }
};

const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
}).single('avatar');

const uploadBanner = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
}).single('banner');

const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath) {
            resolve();
            return;
        }

        let fullPath;
        if (path.isAbsolute(filePath)) {
            fullPath = filePath;
        } else {
            if (filePath.startsWith('/uploads/')) {
                fullPath = path.join(__dirname, '../../', filePath);
            } else {
                fullPath = path.join(__dirname, '../../uploads/', filePath);
            }
        }

        fs.unlink(fullPath, (err) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const getFileUrl = (filename, type) => {
    if (!filename) return null;
    return `/uploads/${type}s/${filename}`;
};

export {
    uploadAvatar,
    uploadBanner,
    deleteFile,
    getFileUrl
};