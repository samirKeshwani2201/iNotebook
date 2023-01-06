// import NoteCotext from './noteContext'
// // import { useState } from 'react'

// const NoteStates = (props) => {
//     // const s1 = {
//     //     "name": "Samir ",
//     //     "class": "5b "
//     // }

//     // const [state, setState] = useState(s1)
//     // const update = () => {
//     //     setTimeout(() => {
//     //         setState({
//     //             "name": "Sam ",
//     //             "class": "15b "
//     //         })
//     //     }, 1000);
//     // }

//     // Jo bhi chej hum provide karna chate hai usee value= mee daal do
//     // return (
//     //     <NoteCotext.Provider value={{ state, update }}>
//     //         {props.children}
//     //     </NoteCotext.Provider>
//     // )
// }

// export default NoteStates;




import NoteCotext from './noteContext'
import { useState } from 'react'

const NoteStates = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    // Get all  note :
    const getNotes = async () => {
        // API call 
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':  localStorage.getItem('token')
            }
        });

        const json = await response.json()
        setNotes(json)
    }

    // Add a note :
    const addNote = async (title, description, tag) => {


        // API call 
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':  localStorage.getItem('token')
            },
            // title, description, tag this we passed in the body in order to save it in the database 
            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        // Concat returns an array whereas push updates an array 
        setNotes(notes.concat(note))


    }





    // Delete a note :
    const deleteNote = async (id) => {

        // API call 
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':  localStorage.getItem('token')
            }

        });

        // Filter me true return karne vale values rahe ge aur false vali nahi rahe ge
        const newNotes = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNotes);
    }

    // Edit a note:
    const editNote = async (id, title, description, tag) => {
        // API call 
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':  localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });


        //  const json = response.json();

        let newNotes = JSON.parse(JSON.stringify(notes))
        // logic to edit note in client
        for (let index = 0; index < notes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                // direct note[index] kar ke hum update nahi kar sakte hai kyu ke stae hai isliye 
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);


    }


    return (
        <NoteCotext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteCotext.Provider>
    )
}

export default NoteStates;

