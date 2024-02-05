const multer  = require('multer')

// Storage file on disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueFileName = `${new Date().getTime()}_${file.originalname}`;
      cb(null, uniqueFileName)
    }
  })
  
const upload = multer({ storage: storage })

module.exports = upload