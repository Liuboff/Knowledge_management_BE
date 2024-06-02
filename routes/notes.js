const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Note } = require('../models/note');
const { Comment } = require('../models/comment');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    const noteList = await Note.find();

    if(!noteList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(noteList);
});

router.get('/:id', async(req,res)=>{
    const note = await Note.findById(req.params.id);

    if(!note) {
        res.status(500).json({message: 'The note with the given ID was not found.'})
    } 
    res.status(200).send(note);
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {
      let note = new Note({
        title: req.body.title,
        content: req.body.content,
        image: `${basePath}${fileName}`,
        category: req.body.category,
        authorId: req.body.authorId,
        project: req.body.project
      });
      note = await note.save();
      if (!note) {
        return res.status(400).send('The note cannot be created!');
      }
      res.status(201).send(note);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the note.', error: error.message });
    }
});


router.put('/:id', async (req, res)=> {
    const note = await Note.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            content: req.body.content,
            image: req.body.image || note.image,
            tags: req.body.tags,
            category: req.body.category,
            authorId: req.body.authorId
        },
        { new: true }
    )

    if(!note)
    return res.status(400).send('The note can not be created!')

    res.send(note);
});

router.delete('/:noteId', async (req, res)=>{
    try {
        const note = await Note.findByIdAndDelete(req.params.noteId);
        if (note) {
            await Comment.deleteMany({ noteId: req.params.noteId });
            return res.status(200).json({ success: true, message: 'The note and its comments are deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Note not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.get('/notesByUser/:userId', async(req,res)=>{
    const notes = await Note.find({ authorId: req.params.userId });
    if(!notes) {
        res.status(500).json({message: 'The notes in user with the given ID were not found.'})
    }
    res.status(200).send(notes);
});

router.get('/notesByProject/:projectId', async(req,res)=>{
    const notes = await Note.find({ project: req.params.projectId });
    if(!notes) {
        res.status(500).json({message: 'The notes in project with the given ID were not found.'})
    }
    res.status(200).send(notes);
});

router.get('/comments/:noteId', async(req,res)=>{
    const comments = await Comment.find({ noteId: req.params.noteId });
    if(!comments) {
        res.status(500).json({message: 'The comments in note with the given ID were not found.'})
    }
    res.status(200).send(comments);
});

router.post('/commentCreate', async (req,res)=>{
    let comment = new Comment({
        content: req.body.content,
        image: req.body.image,
        noteId: req.body.noteId,
        authorId: req.body.authorId
    })
    comment = await comment.save();

    if(!comment)
    return res.status(400).send('the comment can not be created!')

    res.send(comment);
});

router.delete('/comments/:commentId', (req, res)=>{
    Comment.findByIdAndDelete(req.params.commentId).then(comment =>{
        if(comment) {
            return res.status(200).json({success: true, message: 'the comment is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "comment not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});

module.exports = router;