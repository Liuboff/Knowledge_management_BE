const mongoose = require('mongoose');

const taskStatusSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

taskStatusSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

taskStatusSchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('TaskStatus', taskStatusSchema);
