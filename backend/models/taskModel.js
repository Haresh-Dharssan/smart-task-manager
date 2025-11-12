import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !v || v >= new Date();
        },
        message: "Due date cannot be in the past",
      },
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
