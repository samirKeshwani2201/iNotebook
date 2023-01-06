const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
//Middle ware 

// Validator
const { body, validationResult } = require('express-validator');


const Notes = require('../models/Notes');


// ROUTE 1:Get all the notes using :GET(as we have to take token from the header ). "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})



// ROUTE 2(post requset ):Add a new note  using :post. "/api/notes/addnote"
router.post('/addnote', fetchuser, [
    // For validating the inputs 
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be alteast 5 characters ').isLength({ min: 5 })
], async (req, res) => {
    try {
        //Destructuring from the request 
        const { title, description, tag } = req.body;

        // If there are errors than return bad request and the errors .Here we are checking the validity of the req
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If errors isnt empty than go inside if statement 
            return res.status(400).json({ errors: errors.array() });
        }

        // new Note returns a promise .save hai vo promise return karega 
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }

})


// For updation we can use post request but we will use put request 

// ROUTE 3(PUT requset ):Update a note  using :POST . "/api/notes/updatenote/:id"
// We need to pass the id also because the logged in user cant update other users notes 

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        // create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it 

        // The req.params property is an object containing properties mapped to the named route “parameters”.in short link ma je pass kairi hoi te.jo id hum update karna chate hai
        let note = await Notes.findById(req.params.id)
        //Id he wrong hai to error bhej diye 
        if (!note) {
            return res.status(404).send("Not found")
        }

        //Dusre ke update nahi karsak ta hia apna he update kar sakta hai notes 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");

        }

        // new: true it means koi naiya contact ata hai to woh create ho jaiye ga 

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})





// ROUTE 4(DELETE requset ):DELETE a note  using :DELETE . "/api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

     
        let note = await Notes.findById(req.params.id)
        //Id he wrong hai to error bhej diye 
        if (!note) {
            return res.status(404).send("Not found")
        }

        // Allow deletion only if user owns this note 
        //Dusre ke update nahi karsak ta hia apna he update kar sakta hai notes 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // new: true it means koi naiya contact ata hai to woh create ho jaiye ga 

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success " :"Note has been deleted",note:note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

module.exports = router