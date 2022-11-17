const cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: 'dklgcgqqk', 
  api_key: '974144698677466', 
  api_secret: '6waFLH3umnK7LsoNjNJj-SJEZpU' 
});

module.exports = {cloudinary}