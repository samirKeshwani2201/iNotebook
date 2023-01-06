import React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import AddNote from "./AddNote"
import { useNavigate } from 'react-router-dom'
import NoteItem from "./NoteItem"

const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();

    const { notes, getNotes, editNote } = context;

    useEffect(() => {
        if (localStorage.getItem('token')) {
            // login hoga toh hi hum usko access de ge notes ka 
            getNotes();
        }
        else {
            navigate("/login");
        }
    }, [])
    // This ref is uesd for opening the modal  
    const ref = useRef(null)

    // this ref is used for closing the modal when we click on the update button 
    const refClose = useRef(null)


    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: " " })
    const updateNote = (currentNote) => {
        // ref.current ka matlab hai ki kaha par reference hai voh point kar raha hai 
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })

    }


    const handleClick = (e) => {


        editNote(note.id, note.etitle, note.edescription, note.etag);

        refClose.current.click();
        props.showAlert("Updated successfully ", "success")

    }
    const onChange = (e) => {
        // Spread operator ,jo bhi value note ke andar hai voh to rahe he lekinjo properties aage likhi ja rahi hai inko add ya overwrite kardo
        setNote({ ...note, [e.target.name]: e.target.value })
    }



    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            {/* jo addNote me form tha vahi copy kiya hai  */}
                            <form className='my-3  '>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    {/* value={note.etitle}  this we wrote because when we open than old should be already written  */}
                                    <input type="text" className="form-control" name='etitle' minLength={5} required id="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription " minLength={5} required name='edescription' value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' minLength={5} required value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>



            <div className=" row my-3">
                <h2>Your notes </h2>
                <div className="container mx-2">
                    {
                        notes.length === 0 && 'No notes to display '
                    }
                </div>
                {

                    notes.map((note) => {
                        // map laga ke hum ek ek note pass kar rahe hai noteitem me naki puri array pass kar rahe hai so noteitem me hum delete karte samay ek ek id check kar paiyege and so required ko hum delete kar saktehai 
                        return <NoteItem showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />;

                    })
                }
            </div>
        </>
    )
}

export default Notes











