const { Project } = require('../models/project');
const { User } = require('../models/user');
const { Task } = require('../models/task');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/:taskId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'The task with the given ID doesn\'t exist.' });
        }
        res.status(200).send(task);
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving task.' });
    }
});

router.post('/', async (req, res) => {
    try {
        let task = new Task({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            storyPoint: req.body.storyPoint,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            status: req.body.status,
            projectId: req.body.projectId,
            assigneeId: req.body.assigneeId,
            reporterId: req.body.reporterId,
            taskStatus: req.body.taskStatus
        });
        console.log(task);

        task = await task.save();
        console.log(task);

        if (!task) {
            return res.status(400).send('The task cannot be created!');
        }
        res.send(task);
    } catch {
        res.status(500).json({ message: 'An error occurred while creating the task.' });
    }
});

router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                image: req.body.image,
                storyPoint: req.body.storyPoint,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                status: req.body.status,
                projectId: req.body.projectId,
                assaineeId: req.body.assaineeId,
                reporterId: req.body.reporterId,
                taskStatus: req.body.taskStatus
            },
            { new: true }
        );
        if (!task) {
            return res.status(400).send('The task cannot be updated!');
        }
        res.send(task);
    } catch {
        res.status(500).json({ message: 'An error occurred while updating the task.' });
    }
});

router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    try {
        const task = await Task.findByIdAndRemove(req.params.id);
        if (task) {
            return res.status(200).json({ success: true, message: 'The task is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Task not found!' });
        }
    } catch {
        return res.status(500).json({ success: false, message: 'An error occurred while deleting the task.' });
    }
});

module.exports = router;
