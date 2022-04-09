import mongoose from "mongoose";

// Creating a schema of the database that will be used
var registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  treeImage: [{
    type: String,
    required: true,
  }],
  userName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// Export as defaul, the schema will have name task on mongodb
export default new mongoose.model("Tree", registerSchema);
