/* eslint-disable react/prop-types */
import { toast } from 'react-hot-toast';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { useState } from 'react';
import CreateTask from './CreateTask';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const ShowTask = ({ tasks, isOpen, set }) => {
     const [isEditing, setIsEditing] = useState(false);
     const [selectedTask, setSelectedTask] = useState(null);
     const queryClient = useQueryClient();
     const userId = localStorage.getItem('id');


     const deleteMutation = useMutation({
          mutationFn: (taskId) => api.delete(`/task/delete/${taskId}`),
          onSuccess: () => {
               toast.success("Task deleted successfully.");
               queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
               set(false);
          },
          onError: () => {
               toast.error("Failed to delete task.");
          }
     });

     const completeMutation = useMutation({
          mutationFn: (taskId) => api.put(`/task/complete/${taskId}`),
          onSuccess: () => {
               toast.success("Task completed successfully.");
               queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
          },
          onError: () => {
               toast.error("Failed to complete task.");
          }
     });


     const handleEditClick = () => {
          setSelectedTask(tasks); // Set the current note for editing
          setIsEditing(true); // Open CreateNote modal
     };

     return (
          <>
               {isOpen && tasks && (
                    <div className='fixed top-0 left-1/2 transform -translate-x-1/2 w-full bg-black/50 h-full z-30 flex items-center justify-center'>
                         <div className="p-4 bg-white shadow-md rounded-lg w-5/6 border border-color1 max-h-[80vh] overflow-y-auto">
                              <div className='flex justify-between items-center mb-4'>
                                   <button 
                                        type="button"
                                        onClick={() => completeMutation.mutate(tasks.id)}
                                        className="focus:outline-none"
                                        aria-label={tasks.isComplete === 1 ? "Mark task as incomplete" : "Mark task as complete"}
                                        disabled={completeMutation.isPending}
                                   >
                                        {tasks.isComplete === 1 ? (
                                             <BsCheckCircle
                                                  className={`mr-2 cursor-pointer ${tasks.isComplete === 1
                                                       ? 'text-green-500'
                                                       : 'text-gray-300'
                                                       }`}
                                             />) : (
                                             <BsCircle
                                                  className={`mr-2 cursor-pointer ${tasks.isComplete === 1
                                                       ? 'text-green-500'
                                                       : 'text-gray-300'
                                                       }`}
                                             />
                                        )}
                                   </button>
                                   <h2 className="font-bold text-xl mb-2">{tasks.title || 'Untitled Note'}</h2>
                                   <button type="button" className='cursor-pointer text-red-500 hover:bg-red-50 rounded-full focus:outline-none' onClick={() => set(false)}>
                                        <CgClose size={24} />
                                   </button>
                              </div>
                              <div className="flex justify-between items-start mb-2">
                                   <div className="text-xs text-gray-400 mt-2">
                                        {tasks.time.split(":")[0] + ":" + tasks.time.split(":")[1]}
                                        {", " + tasks.date.split("T")[0]}
                                   </div>
                                   <div className="flex space-x-2">
                                        <button className="text-color1 p-1 rounded-full cursor-pointer" onClick={() => handleEditClick()}>
                                             <BiEdit size={20} />
                                        </button>
                                        <button 
                                             className="text-red-500 hover:bg-red-100 p-1 rounded-full disabled:opacity-50" 
                                             onClick={() => deleteMutation.mutate(tasks.id)}
                                             disabled={deleteMutation.isPending}
                                        >
                                             <BiTrash size={20} />
                                        </button>
                                   </div>
                              </div>
                              <p className="text-sm text-gray-600 max-h-96 overflow-y-auto w-full break-words">
                                   {tasks.description || "No content available."}
                              </p>
                         </div>
                    </div>
               )}

               {
                    isEditing && (
                         <CreateTask
                              isOpen={isEditing}
                              setIsOpen={setIsEditing}
                              tasks={selectedTask} // Pass the selected note for editing
                         />
                    )
               }
          </>
     );
};

export default ShowTask;
