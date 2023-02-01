const express=require('express');
const multer=require('multer');
const fs=require('fs');

//const ejs=require('ejs');

const path=require('path');

const storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname +'-'+Date.now()+path.extname(file.originalname));  
    }
})

const app=express();  

const upload=multer({
    storage: storage,
    limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('Image');

const Delete=multer({ 
    fileFilter:function(req,file,cb) {
        checkFileType(file,cb);
    }                       
}).single('Image');

function checkFileType(file,cb){
    //Allowed extensions
    const filetypes= /jpeg|jpg|png/;  

    //check the extension

    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());

    //check mimetype
    const mimetype=filetypes.test(file.mimetype);


    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error');
    }
}

//EJS
//app.set('view engine','ejs');

//Public Folder
//app.use(express.static('./public'));

app.get('/',(req,res)=>res.send("Done"));  

app.post('/uploads',(req,res)=>{
    upload(req,res,(err)=>{
         if(err){
            res.send({
                msg:err
            });
        }else{
            if(req.file==undefined){
                res.send({
                    msg:'Error!'
                });
            }
            else{
                res.send({
                    msg:'File uploaded',
                    file:`uploads/${req.file.filename}`
                });
            }
        }
        });
    });

    app.delete('/delete',(req,res)=>{
        const id =req.query.id;
        const path='./public/uploads/'+id;
        console.log(path);
        fs.unlinkSync(path);
        res.status(201).send("File Deleted");
    });
    app.post('/rename', (req, res,next) => {
        try {
            const id = req.query.id;
            const newName = req.query.newName;
            const oldpath = './public/uploads/' + id;
            const newpath = './public/uploads/' + newName;
            fs.renameSync(oldpath, newpath, err => {
                if (err) {
                    console.log(err);
                    res.status(201).send(err)
                }
                res.status(201).send("File Renamed");
            })
        } catch (error) {
            if (error) res.status(201).send(error)
        }
        next();
    })
const port=4000;

app.listen(port,(req,res)=>console.log(`Server has been started ${port}`));