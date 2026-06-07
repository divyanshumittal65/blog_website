const db = require("../config/db");

const createPost = (title, content, userId, callback) => {
    const query = "INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)";
    db.query(query, [title, content, userId], callback);
};

const getAllPosts = (callback) => {
    const query = `
        SELECT posts.*, users.email
        FROM posts
        LEFT JOIN users ON posts.userId = users.id
    `;
    db.query(query, callback);
};

const getPostById = (id, callback) => {
    const query = `
        SELECT posts.*, users.email
        FROM posts
        LEFT JOIN users ON posts.userId = users.id
        WHERE posts.id = ?
    `;
    db.query(query, [id], callback);
};

const updatePost = (id, title, content, callback) => {
    const query = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
    db.query(query, [title, content, id], callback);
};

const deletePost = (id, callback) => {
    const query = "DELETE FROM posts WHERE id = ?";
    db.query(query, [id], callback);
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
