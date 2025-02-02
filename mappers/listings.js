const config = require("config");

const mapper = listing => {
  const baseUrl = config.get("assetsBaseUrl");
  const mapImage = image => {

    return { url: `${baseUrl}${image}_full.jpg`,
      thumbnailUrl: `${baseUrl}${image}_thumb.jpg`
  } };

  return {
    ...listing,
    images: listing.images.map(mapImage)
  };
};

module.exports = mapper;
