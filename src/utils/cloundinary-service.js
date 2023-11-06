const cloudinary = require("../configs/cloudinary");

exports.upload = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path);
    return result.secure_url;
  } catch (error) {
    console.log(error);
  }
};
