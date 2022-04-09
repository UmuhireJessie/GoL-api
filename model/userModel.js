import mongoose from "mongoose";

var userSchema = new mongoose.Schema ({
    name: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    }],
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    }],
    phoneNumber: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    }],
    userName: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    }],
    date: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    }]
})

export default new mongoose.model("user", userSchema);