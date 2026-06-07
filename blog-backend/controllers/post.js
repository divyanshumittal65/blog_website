const post = require("../models/post");

const createPost = (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    post.createPost(title, content, userId, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Post created successfully",
            postId: result.insertId
        });
    });
};

const getAllPosts = (req, res) => {
    post.getAllPosts((err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
};

const getSinglePost = (req, res) => {
    const { id } = req.params;

    post.getPostById(id, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json(results[0]);
    });
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    post.updatePost(id, title, content, (err) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Post updated successfully"
        });
    });
};

const deletePost = (req, res) => {
    const { id } = req.params;

    post.deletePost(id, (err) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Post deleted successfully"
        });
    });
};

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};
