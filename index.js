const express = require('express');
const port = 8001;
const app = express();
const fs = require('fs');
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://anurag253118:anur4506KG9@cluster0.oxanhaw.mongodb.net/student',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('db connect'))
    .catch((err) => console.log(err))

// const db = require('./config/mongoose');
const path = require('path');
const student = require('./models/student');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded());

app.get('/', function (req, res) {
    return res.render('add_details');
});

app.post('/addStudentDetails', student.uploadImg, async function (req, res) {
    // console.log(req.body);
    // console.log(req.file);
    var ImagePath = '';
    if (req.file) {
        ImagePath = student.adminModulePath + "/" + req.file.filename;
    }
    req.body.adminImg = ImagePath;
    let data = await student.create(req.body);
    return res.redirect('/');
});

app.get('/view_details', async function (req, res) {
    let data = await student.find({});
    return res.render('view_details', {
        stData: data
    });
});

app.get('/deleteRecord/:id', async function (req, res) {
    let oldImg = await student.findById(req.params.id);
    if (oldImg.adminImg) {
        let fullPath = path.join(__dirname, oldImg.adminImg);
        await fs.unlinkSync(fullPath);
    }
    await student.findByIdAndDelete(req.params.id);
    return res.redirect('/view_details');
});

app.get('/updateRecord/:id', async function (req, res) {
    let record = await student.findById(req.params.id);
    return res.render('update_details', {
        stRecord: record,
    });
});

app.post('/editStudentDetails', student.uploadImg, async function (req, res) {
    let oldData = await student.findById(req.body.editData);
    if (req.file) {
        if (oldData.adminImg) {
            let fullPath = path.join(__dirname, oldData.adminImg);
            await fs.unlinkSync(fullPath);
        }
        var ImagePath = '';
        ImagePath = student.adminModulePath + "/" + req.file.filename;
        req.body.adminImg = ImagePath;
    }
    else {
        req.body.ImagePath = oldData.ImagePath;
    }
    await student.findByIdAndUpdate(req.body.editData, req.body);
    return res.redirect('/view_details');
});

app.listen(port, function (err) {
    if (err) {
        console.log("something wrong");
        return false;
    }
    console.log("server is ready on", port);
});