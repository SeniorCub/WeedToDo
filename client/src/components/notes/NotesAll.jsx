import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import NoteEach from './NoteEach';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const NotesAll = () => {
     const [activeFilter, setActiveFilter] = useState('all');
     const id = localStorage.getItem('id');

     const { data: allNotes = [], isLoading, isError, error } = useQuery({
          queryKey: ['notes', id],
          queryFn: async () => {
               const response = await api.get(`/note/allnotes/${id}`);
               return response.data.data;
          },
          enabled: !!id,
     });

     if (isError) {
          toast.error(error.response?.data?.message || error.message);
     }

     const filteredNotes = useMemo(() => {
          if (activeFilter === 'all') return allNotes;
          return allNotes.filter(note => note.category === activeFilter);
     }, [allNotes, activeFilter]);

     return (
          <>
               <div className="flex justify-center space-x-2 mb-4 p-2 bg-gray-100">
                    {['all', 'general', 'personal', 'work', 'ideas'].map(category => (
                         <button
                              key={category}
                              onClick={() => setActiveFilter(category)}
                              className={`px-4 py-2 rounded-full text-sm ${activeFilter === category
                                   ? 'bg-color1 text-white'
                                   : 'bg-gray-200 text-gray-700'
                                   }`}
                         >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                         </button>
                    ))}
               </div>

               {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-24">
                         {[1, 2, 3].map(n => (
                              <div key={n} className="bg-white shadow-md rounded-lg p-4 relative border w-full animate-pulse">
                                   <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                        <div className="flex space-x-2">
                                             <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                             <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                        </div>
                                   </div>
                                   <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                   <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                   <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                   <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              </div>
                         ))}
                    </div>
               ) : (
                    <NoteEach notes={filteredNotes} />
               )}
          </>
     );
};

export default NotesAll;