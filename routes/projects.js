const { Project } = require('../models/project');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    try {
        const projectList = await Project.find();
        if (!projectList || projectList.length === 0) {
            return res.status(404).json({ success: false, message: 'No projects found' });
        }
        res.status(200).send(projectList);
    } catch {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving projects' });
    }
});

router.get('/:projectId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
        return res.status(400).json({ success: false, message: 'Invalid Project ID' });
    }
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'The project with the given ID was not found.' });
        }
        res.status(200).send(project);
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the project' });
    }
});

router.get('/userProjectsByUserId/:userId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    try {
        const user = await User.findById(req.params.userId).select('projects');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const userProjectsIds = user.projects;
        const projects = await Project.find({ _id: { $in: userProjectsIds } });

        if (!projects.length) {
            return res.status(404).json({ message: 'The user with the given ID doesn\'t have active projects.' });
        }
        res.status(200).send(projects);
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving projects.' });
    }
});

router.post('/userProjectsByIds', async (req, res) => {
    const ids = req.body;
    if (!Array.isArray(ids) || !ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: 'Invalid IDs' });
    }
    try {
        const objects = await Project.find({ _id: { $in: ids } });
        if (!objects || objects.length === 0) {
            return res.status(404).json({ message: 'The projects with the given IDs were not found.' });
        }
        res.status(200).send(objects);
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving projects.' });
    }
});

router.post('/', async (req, res) => {
    try {
        let project = new Project({
            name: req.body.title,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            team: req.body.team,
            tasks: req.body.tasks
        });
        project = await project.save();
        if (!project) {
            return res.status(400).send('The project cannot be created!');
        }
        res.send(project);
    } catch {
        res.status(500).json({ message: 'An error occurred while creating the project.' });
    }
});

router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid Project ID' });
    }
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.title,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                team: req.body.team,
                tasks: req.body.tasks
            },
            { new: true }
        );
        if (!project) {
            return res.status(400).send('The project cannot be updated!');
        }
        res.send(project);
    } catch {
        res.status(500).json({ message: 'An error occurred while updating the project.' });
    }
});

router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid Project ID' });
    }
    try {
        const project = await Project.findByIdAndRemove(req.params.id);
        if (project) {
            return res.status(200).json({ success: true, message: 'The project is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Project not found!' });
        }
    } catch {
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the project.' });
    }
});

module.exports = router;
