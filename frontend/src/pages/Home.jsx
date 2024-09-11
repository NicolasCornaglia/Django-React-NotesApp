import { useState, useEffect } from "react"
import api from "../api";
import Note from "../components/Note";
import '../styles/Note.css'
import LoadingIndicator from "../components/LoadingIndicator";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNotes();
    }, [])

    const getNotes = () => {
        setLoading(true);
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
                setLoading(false);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        setLoading(true);
        api.delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    console.log("Note was deleted.")
                } else {
                    alert("Failed to delete note.")
                }
                getNotes();
                setLoading(false);
            }).catch ((error) => {
                alert(error);
            })
            
    }

    const createNote = (e) => {
        setLoading(true);
        e.preventDefault()
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) {
                    console.log("Note created!")
                } else {
                    alert("Failed to create the Note.")
                }
                getNotes();
            }).catch((err) => {
                alert(err);
            })
    }

    return (
        <div>
            <div>
                <h2>Notes</h2>
                <div className="notes-wrapper">
                {notes.map((note) => (
                    <div className="">
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                    </div>
                ))}
                {loading && <LoadingIndicator />}
                </div>
            </div>
            <h2 className="center-title">Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default Home;