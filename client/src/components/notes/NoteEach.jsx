/* eslint-disable react/prop-types */
import { toast } from 'react-hot-toast';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { AiFillTag } from 'react-icons/ai';
import ShowNote from './ShowNote';
import { useState } from 'react';
import CreateNote from './CreateNote';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import ReactMarkdown from 'react-markdown';

const NoteEach = ({ notes = [] }) => {
     const [selectedNote, setSelectedNote] = useState(null);
     const [isOpen, setisopen] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const queryClient = useQueryClient();
     const userId = localStorage.getItem('id');

     const deleteMutation = useMutation({
          mutationFn: (noteId) => api.delete(`/note/delete/${noteId}`),
          onSuccess: () => {
               toast.success("Note deleted successfully.");
               queryClient.invalidateQueries({ queryKey: ['notes', userId] });
          },
          onError: (error) => {
               console.error("Error deleting note:", error);
               toast.error("Failed to delete note.");
          }
     });

     const handleEditClick = (note) => {
          setSelectedNote(note); // Set the current note for editing
          setIsEditing(true); // Open CreateNote modal
     };


     const getCategoryColor = (category) => {
          switch (category) {
               case 'personal': return 'bg-color2/20 text-color2';
               case 'work': return 'bg-color1 text-white';
               case 'ideas': return 'bg-color1/20 text-color1';
               default: return 'bg-gray-200 text-color1';
          }
     };

     // Added null checks and default empty array
     if (!notes || !Array.isArray(notes)) {
          return (
               <div className="text-center text-gray-500 p-4">
                    No notes available or invalid data.
               </div>
          );
     }

     const handleNoteClick = (note) => {
          setSelectedNote(note);
          setisopen(true);
     }

     return (
          <>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-24">
                    {notes.length === 0 ? (
                         <p className="text-center text-gray-500 col-span-full">No notes available.</p>
                    ) : (
                         notes.map((note) => (
                              <div
                                   key={note.id}
                                   className="bg-white shadow-md rounded-lg p-4 relative border w-full flex flex-col"
                              >
                                   <div className="flex justify-between items-start mb-2">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getCategoryColor(note.category)}`}>
                                             <AiFillTag className="mr-1" />
                                             {note.category || 'Uncategorized'}
                                        </div>
                                        <div className="flex space-x-2">
                                             <button className="text-color1 p-1 rounded-full cursor-pointer" onClick={() => handleEditClick(note)}>
                                                  <BiEdit size={20} />
                                             </button>
                                             <button
                                                  className="text-red-500 hover:bg-red-100 p-1 rounded-full disabled:opacity-50"
                                                  onClick={() => deleteMutation.mutate(note.id)}
                                                  disabled={deleteMutation.isPending}
                                             >
                                                  <BiTrash size={20} />
                                             </button>
                                        </div>
                                   </div>

                                   <button
                                        type="button"
                                        className='w-full text-left cursor-pointer focus:outline-none flex-1 flex flex-col'
                                        onClick={() => handleNoteClick(note)}
                                   >
                                        <h2 className="font-bold text-lg mb-2">{note.title || ''}</h2>
                                        <div className="text-sm text-gray-600 line-clamp-3 w-full break-words break-all prose prose-sm overflow-hidden">
                                             <ReactMarkdown>
                                                  {note.contet
                                                       ? (note.contet.length > 500
                                                            ? note.contet.substring(0, 500) + '...'
                                                            : note.contet)
                                                       : ''}
                                             </ReactMarkdown>
                                        </div>
                                   </button>

                                   <div className="text-xs text-gray-400 mt-4">
                                        Created: {note.created_at
                                             ? new Date(note.created_at).toLocaleDateString()
                                             : 'Unknown date'}
                                   </div>
                              </div>
                         ))
                    )}
               </div>

               <ShowNote notes={selectedNote} isOpen={isOpen} set={setisopen} />

               {isEditing && (
                    <CreateNote
                         isOpen={isEditing}
                         setIsOpen={setIsEditing}
                         notes={selectedNote} // Pass the selected note for editing
                    />
               )}
          </>
     );
};


export default NoteEach;