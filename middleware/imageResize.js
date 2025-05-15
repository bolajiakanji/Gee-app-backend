const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const getOrderedFilesArray = require("../utilities/orderedFileArray");

const cloudinary = require('cloudinary').v2;
const uploadImage = async (imagePath) => {
  const options = {
    unique_filename: true,
    overwrite: true,
    asset_folder: 'items',
    use_asset_folder_as_public_id_prefix: true
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log('result');
    console.log('resu');
    console.log(result.public_id);
    console.log(result);

    return {id: result.public_id, filename: result.original_filename };
  } catch (error) {
    console.error(error);
  }
};

const getPath = (file) => {
  console.log(file.filename)
  console.log('file.filename')
  const outputFolder = "public/assets";
  const fullImage = path.resolve(outputFolder, file.filename + file.originalname + "_full.webp")
  const thumbImage = path.resolve(outputFolder, file.filename + file.originalname + "_thumb.webp")
  return { fullImage, thumbImage }
}


module.exports = async (req, res, next) => {
  console.log('hereyou')
  console.log(req.files)
  console.log('hereyou2')
  const images = [];
  
  
  console.log('hereme')
  const resizePromises = req.files.map(async (file) => {
    console.log(file)
    console.log('file')
    console.log('fie')
    const getFile = () => {
      return getPath(file)
    }
   await sharp(file.path)
      .resize(800)
      .webp({ quality: 30 })
      .toFile(getFile().fullImage)
     
    
    
    await sharp(file.path)
    .resize(70)
    .webp({ quality: 12 })
    .toFile(getFile().thumbImage)
    
    
      
      
  const url = await uploadImage(getFile().fullImage)
  //await uploadImage(getFile().thumbImage)
     console.log(url.public_id)
     
     fs.unlinkSync(file.path);
     fs.unlinkSync(getFile().fullImage);
     fs.unlinkSync(getFile().thumbImage);
     
     images.push(url);
     console.log(__dirname)
     console.log('__dirname')
     console.log(url)
    });
    
    await Promise.all([...resizePromises]);
    
    req.images = getOrderedFilesArray(images);
    console.log('dirname')
    console.log('dirne')

  next();
};
