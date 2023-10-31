const multer = require("multer");

const getDate = new Date().toLocaleString().split(", ");
const date = getDate[0].split("/");

const storeage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public");
  },
  filename: (req, file, callback) => {
    const splitFileName = file.originalname.split(".");
    callback(
      null,
      "" +
        date.join("") +
        "_" +
        Math.round(Math.random() * 100000) +
        "." +
        splitFileName[splitFileName.length - 1]
    );
  },
});

const upload = multer({ storage: storeage });

module.exports = upload;
