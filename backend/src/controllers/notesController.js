import Note from '../models/Note.js'

export const getAllNotes =  async(req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({createdAt:-1}); // gets all notes  - newest first
        res.status(200).json(notes);
    } catch (error) {
        console.log("Error in getAllNotes controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getNoteById(req,res){
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
        if(!note)   return res.status(404).json({message: "Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.log("Error in getNoteById controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function createNote(req, res){
    try {
        const {title,content} = req.body;
        // can't directly print title and content
        // first put: app.use(express.json()) in server.js
        const note = new Note({title, content, userId: req.user._id});

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.log("Error in createNote controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateNote = async(req, res) => {
    try {
        const {title,content} = req.body;
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user._id },{ title,content },{new: true});  // if it was /:hello , it would be .hello instead of .id
        if(!updatedNote)    return res.status(404).json({message:"Note not found"});
        res.status(200).json(updatedNote);
    } catch (error) {
        console.log("Error in updateNote controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if(!deletedNote)    return res.status(404).json({message: "Note not found"});
        res.status(200).json({message: "Note deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNote controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}