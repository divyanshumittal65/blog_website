const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const ownershipMiddleware = require("../middleware/ownershipmiddleware");
const {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
} = require("../controllers/post");

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.patch("/:id", authMiddleware, ownershipMiddleware, updatePost);
router.delete("/:id", authMiddleware, ownershipMiddleware, deletePost);

module.exports = router;
