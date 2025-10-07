const cloudinary = require('cloudinary').v2;

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No files were uploaded.' });
    }

    const file = req.files.image;

    cloudinary.uploader.upload(file.tempFilePath, { folder: 'recipe_app' }, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Image upload failed' });
      }
      res.json({ url: result.secure_url });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
