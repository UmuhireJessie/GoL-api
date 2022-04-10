import registerSchema from "../model/registerModel.js";
import { fileUpload } from "../middleware/multer.js";
import dotenv from "dotenv";
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

  try {
    const tags = (
      await computerVisionClient.analyzeImage(tagsURL, {
        visualFeatures: ["Tags"],
      })
    ).tags;

    for (const tag of tags) {
      if (tag.name === "tree") {
        isTree = true;
        break;
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
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
    const { name, address, phoneNumber, userName } = req.body;

    req.body.treeImage = await fileUpload(req);
    var func = await computerVision2(req.body.treeImage);

    if (func) {
      const trees = await registerSchema.create({
        name: name,
        address: address,
        treeImage: req.body.treeImage,
        phoneNumber: phoneNumber,
        userName: userName,
      });

      res.status(201).json({
        message: "A tree has been saved successfully",
        data: trees,
      });
    }
    res.status(403).json({ message: "Please check the image uploaded" });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}; 

const uploadImageTree = async (req, res) => {
  // validate a request
  // try {
    const { userName } = req.body;

    const userNameFound = await registerSchema.findOne( userName );

    // var userUploadTree = userNameFound.userName;
    console.log(req.body.userName);    // body is empty and this is undefined
    if (userNameFound) {
      console.log(req.body);     // body is empty too
      console.log( userNameFound )   // this being retrieved
      req.body.treeImage = await fileUpload(req);

      const trees = await registerSchema.findOneAndUpdate(
        {
          userName: userNameFound,
        },
        {
          $push: {
            treeImage: req.body.treeImage,
          },
        }
      );
      res.status(201).json({ message: "A tree has been added successful" });
    }
    res
      .status(403)
      .json({
        message: "Please check the image uploaded",
        image: req.body.treeImage,
      });
  // } catch (err) {
  //   res.status(500).json({
  //     message: "Internal Server Error",
  //     error: err,
  //   });
  // }
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
