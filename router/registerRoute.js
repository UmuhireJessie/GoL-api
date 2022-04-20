import express from "express";

import { createTree, findAllTrees, findOneTree, deleteTree, uploadImageTree2 } from "../controller/registerContoller.js";

import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image File!", false);
  }
};
const upload = multer({ storage, fileFilter });

// Tree routes

router.post("/register", upload.single("treeImage"), createTree);

router.get("/register", findAllTrees);

router.get("/register/:id", findOneTree);

router.delete("/register/:id", deleteTree);

router.patch("/registerImage", upload.single("treeImage"), uploadImageTree2);

export default router;
