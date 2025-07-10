const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Title of the Task"],
      minlength: 3,
    },
    description: {
      type: String,
      required: false,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Task", taskSchema);
