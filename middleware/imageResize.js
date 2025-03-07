const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2;

// cloudinary.config({ 
//   cloud_name: process.env.CLOUD_NAME, 
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });

// Log the configuration
console.log(cloudinary.config());
const uploadImage = async (imagePath) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};



const outputFolder = "public/assets";

module.exports = async (req, res, next) => {
  const images = [];

  const resizePromises = req.files.map(async (file) => {
    await sharp(file.path)
      .resize(1000)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

    await sharp(file.path)
      .resize(100)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"))
      ;
      
   await uploadImage(path.resolve(outputFolder, file.filename + "_full.jpg"))
    

    fs.unlinkSync(file.path);
    fs.unlinkSync(path.resolve(outputFolder, file.filename + "_full.jpg"));
    
    images.push(file.filename);
    console.log(__dirname)
    console.log('dirname')
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
