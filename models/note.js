const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    category: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Category' 
	},
    project: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Project' 
	},
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
    authorId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
});

noteSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

noteSchema.set('toJSON', {
    virtuals: true
});

exports.Note = mongoose.model('Note', noteSchema);
