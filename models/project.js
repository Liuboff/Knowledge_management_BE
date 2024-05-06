const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    team: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    tasks: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    ],
});

projectSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

projectSchema.set('toJSON', {
    virtuals: true
});

exports.Category = mongoose.model('Project', projectSchema);
