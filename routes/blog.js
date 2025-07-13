const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Comment = require("../modules/comments");
const User = require("../modules/user"); // adjust the path if needed

const Blog = require("../modules/blog");
 // Assuming you have a Blog model defined in models/Blog.js


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`)); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");


  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Check if the logged-in user is the creator
    if (!blog || blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized or blog not found.");
    }

    await Blog.deleteOne({ _id: req.params.id });
    await Comment.deleteMany({ blogId: req.params.id }); // delete related comments too

    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/comment/delete/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ success: false });
  }
});



router.post("/", upload.single('coverImage'), async(req,res) => {
   const { title, body } = req.body;

   const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
    });

    // console.log(req.body);
    // console.log(req.file);
    return res.redirect("/");
})

module.exports = router;
