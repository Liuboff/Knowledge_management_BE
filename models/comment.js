const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true
});

exports.Comment = mongoose.model('Comment', commentSchema);
