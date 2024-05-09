const express = require('express');
const router = express.Router();
const { Note } = require('../models/note');
const { Comment } = require('../models/comment');

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

router.post('/', async (req,res)=>{
    let note = new Note({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
        category: req.body.category,
        author: req.body.author,
        projects: req.body.projects
    })
    note = await note.save();

    if(!note)
    return res.status(400).send('the note cannot be created!')

    res.send(note);
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
            author: req.body.author
        },
        { new: true }
    )

    if(!note)
    return res.status(400).send('The note cannot be created!')

    res.send(note);
});

router.delete('/:noteId', async (req, res)=>{
    try {
        console.log(req.params.notetId);
        const note = await Note.findByIdAndDelete(req.params.noteId);
        console.log(note);
        if (note) {
            await Comment.deleteMany({ noteId: req.params.noteId });
            console.log('after comments del');
            return res.status(200).json({ success: true, message: 'The note and its comments are deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Note not found!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err });
    }
});

router.get('/notesByUser/:userId', async(req,res)=>{
    const notes = await Note.find({ author: req.params.userId });
    if(!notes) {
        res.status(500).json({message: 'The notes in user with the given ID were not found.'})
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
    return res.status(400).send('the comment cannot be created!')

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