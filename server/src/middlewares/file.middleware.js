import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const FolderUpload = async (req, res, next) => {
  const paths = req; 
  console.log(paths)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
      const folderPath = path.join("./public", path.dirname(file.originalname));
      // console.log(folderPath)
      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, path.basename(file.originalname));
    },
  });

  const upload = multer({ storage });

  upload.array("files")(req, res, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "File upload failed", details: err.message });
    }
    next();
  });

};
