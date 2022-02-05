const router = require("express").Router();
const Post = require("../models/Post");
const verify = require("../middleware/verify");
const { auth, moveFile } = require("../middleware/drive");

// CREATE POST
router.post("/", verify, async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});


// UPDATE POST
router.put("/:id", verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (req.body.photo) {
            const picId = post.photo;
            await moveFile(picId, auth);
        }

        if(post.username === req.body.username) {
            try {
                const updatedpost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                }, {new: true})

                res.status(200).json(updatedpost);

            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can update only your post!");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});


// DELETE POST
router.delete("/:id", verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const picId = post.photo;
        await moveFile(picId, auth);

        if(post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json("Post has been deleted successfully!");

            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your post!");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});



// GET POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

// GET ALL POSTS
router.get("/", async (req, res) => {
    const userName = req.query.user;
    const catName = req.query.cat;

    try {
        let posts;
        if(userName) {
            posts = await Post.find({username: userName});
        } else if(catName) {
            posts = await Post.find({categories: {
                $in: [catName],
            }});
        } else {
            posts = await Post.find();
        }

        res.status(200).json(posts);

    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;