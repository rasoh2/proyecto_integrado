const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (_req, file, cb) => {
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Tipo de archivo no permitido. Usa JPG, PNG o WEBP"));
  }

  return cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const handleUploadError = (error, _req, res, next) => {
  if (!error) {
    return next();
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: "error",
      message: "El archivo supera el tamano maximo permitido de 2MB",
      data: null,
    });
  }

  return res.status(400).json({
    status: "error",
    message: error.message,
    data: null,
  });
};

module.exports = {
  uploadAvatar,
  handleUploadError,
};
