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
    
    unique_filename: true,
    overwrite: true,
    asset_folder: 'items',
    use_asset_folder_as_public_id_prefix: true
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result.public_id);
    console.log(result);
    console.log('result');
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const getPath = (file) => {
  const outputFolder = "public/assets";
  const fullImage = path.resolve(outputFolder, file.filename +  "_full.webp")
  const thumbImage = path.resolve(outputFolder, file.filename + "_thumb.webp")
  return { fullImage, thumbImage }
}


module.exports = async (req, res, next) => {
  
  const images = [];
  
  const resizePromises = req.files.map(async (file) => {
    const getFile = () => {
      return getPath(file)
    }
    await sharp(file.path)
      .resize(800)
      .webp({ quality: 30 })
      .toFile(getFile().fullImage);

    await sharp(file.path)
      .resize(70)
      .webp({ quality: 12 })
      .toFile(getFile().thumbImage)
      ;
      
  const url = await uploadImage(getFile().fullImage)
  //await uploadImage(getFile().thumbImage)
     console.log(url.public_id)
     console.log('dirname')

    fs.unlinkSync(file.path);
    fs.unlinkSync(getFile().fullImage);
    fs.unlinkSync(getFile().thumbImage);
    
    images.push(url);
    console.log(__dirname)
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
