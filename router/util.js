const {User} = require('../models/user');
const {Timer} = require('../models/timer');
const {Book} = require('../models/book');
const {Note} = require('../models/note');

// Used so that I could always have isAuthenticated and user handy when rendering
function populateVariables(req, others) {
    return Object.assign({
        isAuthenticated: req.isAuthenticated(),
        user: req.user || false,
    }, others);
}

const userLibraryLoader = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findById(req.user.id).populate('library')
            .then(user => { 
                req.user = user;
                next();
            });
    } else {
        next();
    }
};


// Middleware for getting the note object

function noteLoader(req, res, next) {
    if (!req.params.noteId) {
        res.status(400).send("Please send valid note ID");
    }
    else {
        // Load book first
        Note.findById(req.params.noteId)
        .then(function(note) {
            // How it becomes available to user, like how passport works to make user available
            req.note = note;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

// Middleware for getting the book object
function bookLoader(req, res, next) {
    if (!req.params.bookId) {
        res.status(400).send("Please send valid book ID");
    }
    else {
        // Load book first
        Book.findById(req.params.bookId)
        .then(function(book) {
            req.book = book;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

function timerLoader(req, res, next) {
    if (!req.params.timerId) {
        res.status(400).send("Please send valid timer ID");
    }
    else {
        // Load book first
        Timer.findById(req.params.timerId)
        .then(function(timer) {
            req.timer = timer;
            next();
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
    }
}

module.exports = {populateVariables, userLibraryLoader, noteLoader, bookLoader, timerLoader};