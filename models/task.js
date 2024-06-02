const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  image: { type: String },
  storyPoint: { type: Number },
  dateStart: { type: Date, default: Date.now },
  dateEnd: { type: Date, default: Date.now },
  status: { type: String },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  assigneeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reporterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  taskStatus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TaskStatus'
  },
});

taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

taskSchema.set('toJSON', {
    virtuals: true
});

exports.Task = mongoose.model('Task', taskSchema);
