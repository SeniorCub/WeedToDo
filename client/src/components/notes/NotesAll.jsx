import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { logout } from '../../hooks/logout';
import NoteEach from './NoteEach';

const API_URL = import.meta.env.VITE_API_URL;

const NotesAll = () => {
     const [allNotes, setAllNotes] = useState([]);
     const [filteredNotes, setFilteredNotes] = useState([]);
     const [loading, setLoading] = useState(true);
     const [activeFilter, setActiveFilter] = useState('all');

     const id = localStorage.getItem('id');
     const token = localStorage.getItem('token');

     const url = `${API_URL}/note/allnotes/${id}`;

     useEffect(() => {
          const fetchNotes = async () => {
               try {
                    const response = await axios.get(url, {
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                         },
                    });

                    if (response.status === 200) {
                         setLoading(false);
                         const fetchedNotes = response.data.data;
                         setAllNotes(fetchedNotes);
                         setFilteredNotes(fetchedNotes);
                    } else {
                         setLoading(false);
                         toast.error(response.data.message);
                         logout();
                    }
               } catch (error) {
                    setLoading(false);
                    toast.error(error.message);
                    logout();
               }
          };

          fetchNotes();
     }, [token, url, id]);

     const handleFilter = (category) => {
          setActiveFilter(category);
          if (category === 'all') {
               setFilteredNotes(allNotes);
          } else {
               const filtered = allNotes.filter(note => note.category === category);
               setFilteredNotes(filtered);
          }
     };

     const handleUpdateNotes = (deletedNoteId) => {
          const updatedNotes = allNotes.filter(note => note.id !== deletedNoteId);
          setAllNotes(updatedNotes);
          setFilteredNotes(updatedNotes);
     };

     return (
          <>
               <div className="flex justify-center space-x-2 mb-4 p-2 bg-gray-100">
                    {['all', 'general', 'personal', 'work', 'ideas'].map(category => (
                         <button
                              key={category}
                              onClick={() => handleFilter(category)}
                              className={`px-4 py-2 rounded-full text-sm ${activeFilter === category
                                   ? 'bg-color1 text-white'
                                   : 'bg-gray-200 text-gray-700'
                                   }`}
                         >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                         </button>
                    ))}
               </div>

               {loading ? (
                    <div className="text-center text-gray-500 mt-10">
                         Loading notes...
                    </div>
               ) : (
                    <NoteEach
                         notes={filteredNotes}
                         onUpdateNotes={handleUpdateNotes}
                    />
               )}
          </>
     );
};

export default NotesAll;