const { isLoggedIn } = require('../middleware/middleware');
const postDB = require('../models/postSchema');
const { post } = require('../routes/postRoutes');

// View all posts of a single user
module.exports.userPosts = async(req, res) =>{
    const userId = req.user.id;
    const userData = await postDB.find({ author: req.user });
    res.render('postCRUD/read', { data: userData, isLoggedIn: req.isAuthenticated() });
}
/// posts/offer/:id
module.exports.offerForm = async(req, res) => {
    const { id } = req.params;
    const postBeingViewed = await postDB.findById(id).populate('author');
    const userId = req.user.id;
    const userData = await postDB.find({ author: req.user });
    res.render('user/offer', { postBeingViewed, allOfCurrUserPosts: userData });
}

module.exports.offerConfirm = async(req, res) => {
    const { currUserPostId, postBeingViewedId } = req.params;
    const currUserPost = await postDB.findById(currUserPostId);
    const postBeingViewed = await postDB.findById(postBeingViewedId).populate('author');
    res.render('user/confirm', { currUserPost, postBeingViewed });
}

module.exports.offerConfirmPost = async(req, res) => {
    const { currUserPostId, postBeingViewedId } = req.params;
    const currUserPost = await postDB.findById(currUserPostId);
    await postDB.updateOne(
        { _id: postBeingViewedId }, 
        { $push: { offers: currUserPost } }
    );
    req.flash('success', 'Offer made!')
    res.redirect(`/posts/${postBeingViewedId}`);
}

module.exports.acceptOffer = async(req, res) => {
    const { currUserPostId, offerPostId } = req.params;
    const currUserPost = await postDB.findById(currUserPostId);
    const offerPost = await postDB.findById(offerPostId).populate('author');
    req.flash('success', 'Offer Accepted');
    res.render('user/accept', { currUserPost, offerPost });
}

module.exports.exchanged = async (req, res) => {
    const { currUserPostId, offerPostId } = req.params;
    const currUserPost = await postDB.findById(currUserPostId);
    const offerPost = await postDB.findById(offerPostId);

    if (!currUserPost || !offerPost )
    {
        req.flash('error', 'The post does not exist!');
        return res.redirect('/posts');
    }
    if (!currUserPost.author.equals(req.user._id)){
        req.flash('error', 'No Permission');
        return res.redirect('/posts')
    }else{
        await postDB.findByIdAndDelete(currUserPostId);
        req.flash('success', 'Exchange was successful')
        res.redirect('/posts');
    }
}