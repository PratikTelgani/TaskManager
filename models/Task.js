const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    task: String,
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Tasks', TaskSchema);