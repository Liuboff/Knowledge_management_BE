const { Note } = require('../models/note');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const noteList = await Note.find();

    if(!noteList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(noteList);
})

router.get('/:id', async(req,res)=>{
    const note = await Note.findById(req.params.id);

    if(!note) {
        res.status(500).json({message: 'The note with the given ID was not found.'})
    } 
    res.status(200).send(note);
})



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
    console.log(note);//////////////////////////////////////////////////////////
    note = await note.save();

    if(!note)
    return res.status(400).send('the note cannot be created!')

    res.send(note);
})


router.put('/:id',async (req, res)=> {
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
    return res.status(400).send('the note cannot be created!')

    res.send(note);
})

router.delete('/:id', (req, res)=>{
    Note.findByIdAndRemove(req.params.id).then(note =>{
        if(note) {
            return res.status(200).json({success: true, message: 'the note is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "note not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;