const post = require("../models/post");

const ownershipMiddleware = (req, res, next) => {
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

        const existingPost = results[0];

        if (existingPost.userId !== req.user.id) {
            return res.status(403).json({
                message: "You can only modify your own posts"
            });
        }

        req.post = existingPost;
        next();
    });
};

module.exports = ownershipMiddleware;
