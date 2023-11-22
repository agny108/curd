const mongoose = require('mongoose');
const multer = require('multer');
const imgPath = ('/uploads');
const path = require('path');
const studentSheMa = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    hobby: {
        type: Array,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    adminImg: {
        type: String,
        require: true
    }

});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imgPath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
})
studentSheMa.statics.uploadImg = multer({
    storage: storage,
}).single("admin");
studentSheMa.statics.adminModulePath = imgPath;
const student = mongoose.model('student', studentSheMa);
module.exports = student;