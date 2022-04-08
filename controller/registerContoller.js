import registerSchema from "../model/registerModel.js";
import { fileUpload } from "../middleware/multer.js";
import dotenv from "dotenv";
import * as async from "async";
import * as fs from "fs";
import util from "util";
import * as ComputerVision from "@azure/cognitiveservices-computervision";
import * as apikey from "@azure/ms-rest-js";

dotenv.config();

("use strict");

const createReadStream = fs.createReadStream;
const sleep = util.promisify(setTimeout);
const ComputerVisionClient = ComputerVision.ComputerVisionClient;
const ApiKeyCredentials = apikey.ApiKeyCredentials;

const key = process.env.COMPUTER_VISION_KEY;
const endpoint = process.env.COMPUTER_VISION_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

async function computerVision2(tagsURL) {
  let isTree = false;

  console.log("-------------------------------------------------");
  console.log("DETECT TAGS");
  console.log();

  try {
    /// Analyze URL image
    console.log("Analyzing tags in image...", tagsURL.split("/").pop());
    const tags = (
      await computerVisionClient.analyzeImage(tagsURL, {
        visualFeatures: ["Tags"],
      })
    ).tags;

    for (const tag of tags) {
      console.log(tag.name);
      if (tag.name === "tree") {
        isTree = true;
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("INSIDE" + isTree);
  return isTree;
}

const createTree = async (req, res) => {
  // validate a request
  if (!req.body) {
    res.status(400).json({ message: "Content can not be empty!" });
    return;
  }

  // new Tree
  try {
    const { name, address, phoneNumber, treeImage } = req.body;

    req.body.treeImage = await fileUpload(req);
    var func = await computerVision2(req.body.treeImage)

    if (func) {
      console.log("ttttttttrrrrreesss"); //checking

      const trees = await registerSchema.create({
        name: name,
        address: address,
        treeImage: req.body.treeImage,
        phoneNumber: phoneNumber,
      });

      res.status(201).json({
        message: "A tree has been saved successfully",
        data: trees,
      });
    }
    res.status(403).json({ message: "Please check the image uploaded" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// find and retrieve all trees
const findAllTrees = async (req, res) => {
  const tree = await registerSchema
    .find({})
    .then((tree) => {
      res.json({ alltrees: tree, count: tree.length });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error occurred while retrieving tree information",
        error: err,
      });
    });
};

// find and retrieve one tree
const findOneTree = async (req, res) => {
  try {
    const treeId = req.params.id;
    const tree = await registerSchema.findById(treeId);

    if (!tree)
      return res
        .status(404)
        .json({ error: `tree with ${treeId} does not exists` });
    res.status(200).json({ tree });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Delete a tree
const deleteTree = async (req, res) => {
  try {
    const tree = await treeSchema.findById(req.params.id);
    if (tree) {
      const deletetree = await registerSchema.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "The tree has been deleted" });
    }
    res.status(404).json({ Error: "Invalid tree id" });
  } catch (error) {
    res.status(500).json({ message: `Error has occurred: ${error}` });
  }
};

export { createTree, findAllTrees, findOneTree, deleteTree };
