import React from 'react'
import { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const [note, setNote] = useState({ title: "", description: "", tag: " " })
    const { addNote } = context;
    const handleClick = (e) => {
        // so that reloading is not there we use preventDefault()
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        // So that once submitted than the text box should be empty 
        setNote({ title: "", description: "", tag: " " })
        props.showAlert("Added successfully ","success")
    }
    const onChange = (e) => {
        // Spread operator ,jo bhi value note ke andar hai voh to rahe he lekinjo properties aage likhi ja rahi hai inko add ya overwrite kardo
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="container my-3">
            <h2>
                Add a note
            </h2>
            <form className='my-3  '>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" name='title' id="title" aria-describedby="emailHelp" minLength={5} required value={note.title} onChange={onChange} />

                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' minLength={5} required value={note.description} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' minLength={5} required value={note.tag} onChange={onChange} />
                </div>

                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add note</button>
            </form>
        </div>
    )
}

export default AddNote