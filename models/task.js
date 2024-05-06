const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    dateCreated: { type: Date, default: Date.now },
    dateEnd: { type: Date, default: Date.now },
    assainee: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
    reporter: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
    status: { 
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

exports.Note = mongoose.model('Task', taskSchema);
