const express = require("express");
const postController = require("../controllers/post.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  paginationMiddleware,
} = require("../middlewares/pagination.middleware");
const {
  validatePostCreation,
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticateToken);

router.get("/", paginationMiddleware, postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post(
  "/",
  validatePostCreation,
  handleValidationErrors,
  postController.createPost,
);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
