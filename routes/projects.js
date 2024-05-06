const { Project } = require('../models/project');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const projectList = await Project.find();

    if(!projectList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(projectList);
})

router.get('/:id', async(req,res)=>{
    const project = await Project.findById(req.params.id);

    if(!project) {
        res.status(500).json({message: 'The project with the given ID was not found.'})
    } 
    res.status(200).send(project);
})



router.post('/', async (req,res)=>{
    let project = new Project({
        name: req.body.title,
        dateStart: req.body.content,
        dateEnd: req.body.image,
        team: req.body.tags,
        tasks: req.body.category
    })
    console.log(project);//////////////////////////////////////////////////////////
    project = await project.save();

    if(!project)
    return res.status(400).send('the project cannot be created!')

    res.send(project);
})


router.put('/:id',async (req, res)=> {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.title,
            dateStart: req.body.content,
            dateEnd: req.body.image,
            team: req.body.tags,
            tasks: req.body.category
        },
        { new: true }
    )

    if(!project)
    return res.status(400).send('the project cannot be created!')

    res.send(project);
})

router.delete('/:id', (req, res)=>{
    Project.findByIdAndRemove(req.params.id).then(project =>{
        if(project) {
            return res.status(200).json({success: true, message: 'the project is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "project not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;