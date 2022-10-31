const postDB = require('../models/postSchema');

module.exports.allPosts = async (req, res, next) => {
    var param = req.query;
    param = Object.values(param)[0]; 
    if(param == null)
    {
        var allData = await postDB.find({})
    }else{
        var allData = await postDB.find({ type: param})
    }
    if(!allData){
        req.flash('danger', 'No Posts Yet');
        res.redirect('/posts');
        return next();
    }else{
        res.render('postCRUD/read', { data: allData, isLoggedIn: req.isAuthenticated() });
    }
}

module.exports.createForm = (req, res) => {
    res.render('postCRUD/create');
}

module.exports.createPost = async(req, res) => {
    const newPost = new postDB(req.body.post);
    newPost.author = req.user._id;
    await newPost.save();
    req.flash('success', 'Successfully Added Post');
    res.redirect(`/posts/${newPost._id}`);

}

module.exports.showPost = async(req, res) => {
    const post = await postDB.findById(req.params.id).populate('offers').populate('author');
    if(req.user){
        var currentUserId = req.user._id;
    }else{
        currentUserId = 0;
    }
    res.render('postCRUD/show', { post: post,  currentUserId, offers: post.offers });
}

module.exports.editPostForm = async(req, res) => {
    const { id } = req.params; 
    const post = await postDB.findById(id);
    if (!post)
    {
        req.flash('error', 'The post does not exist!');
        return res.redirect('/posts');
    }
    if(!post.author.equals(req.user._id)){
        req.flash('error', 'No Permission')
        return res.redirect('/posts');
    }
    res.render('postCRUD/edit', { post })
}

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const post = await postDB.findById(id);
    if (!post)
    {
        req.flash('error', 'The post does not exist!');
        return res.redirect('/posts');
    }
    if(!post.author.equals(req.user._id)){
        req.flash('error', 'No Permission')
        return res.redirect('/posts');
    }else{
        const swim = await postDB.findByIdAndUpdate(id, {...req.body.post});
        req.flash('success', 'Post edited sucessfully')
        res.redirect(`/posts/${id}`);
    }
}

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await postDB.findById(id);
    if (!post)
    {
        req.flash('error', 'The post does not exist!');
        return res.redirect('/posts');
    }
    if (!post.author.equals(req.user._id)){
        req.flash('error', 'No Permission');
        return res.redirect('/posts')
    }else{
        await postDB.findByIdAndDelete(id);
        req.flash('success', 'Post deleted sucessfully')
        res.redirect('/posts');
    }
}