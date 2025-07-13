require('dotenv').config(); // Add at the top

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require('./modules/blog');
const userRouter = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentications');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.json());
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
