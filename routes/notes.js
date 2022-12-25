const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");

// ROUTE 1: Get all the notes using : GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add notes using : POST "/api/notes/addnote". Login required
router.post(
    "/addnote",
    fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be at least 8 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //If there are validation errors, then return the errors with bad request to the user
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        date:Date.now(),
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
  );


  // ROUTE 3: Update an existing note using : POST "/api/notes/updatenote". Login required
  router.put(
      "/updatenote/:id",
    fetchuser,
    async (req,res)=>{
        try {
            const {title,description,tag} = req.body
            //Creating a new note object
            const newNote= {}
            if(title){newNote.title=title}
            if(description){newNote.description=description}
            if(tag){newNote.tag=tag}

            //Finding the note to be updated and update it
            // const note = Notes.findByIdAndUpdate()
            let note =await Notes.findById(req.params.id)
            if(!note){return res.status(404).send("Not Found")}
            if(note.user.toString()!=req.user.id){
                return res.status(401).send(`Not allowed`)
            }
            note = await Notes.findByIdAndUpdate(req.params.id,newNote,{new:true})
            res.json({note})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
          }
    }
    )

    // ROUTE 4: Delete an existing note using : POST "/api/notes/deletenote". Login required
    router.delete("/deletenote/:id",fetchuser,async (req,res)=>{
        try {
            //find the note to be deleted and delete it
            let note =await Notes.findById(req.params.id)
            //if no notes are found, them return 404 not found
            if(!note){return res.status(404).send("Not Found")}

            //checking if the user is the owner of note
            if(note.user.toString()!=req.user.id){
                return res.status(401).send(`Not allowed`)
            }
            // note= await Notes.deleteOne({_id:req.params.id})  // This also works and I figured it out myself
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({"success":"Note has been deleted",Note:note})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
          }
    })

module.exports = router;
