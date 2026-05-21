/* eslint-disable react/prop-types */
import { toast } from 'react-hot-toast';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { useState } from 'react';
import CreateTask from './CreateTask';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';

const API_URL = import.meta.env.VITE_API_URL;

const ShowTask = ({ tasks, isOpen, set }) => {
     const [isEditing, setIsEditing] = useState(false);
     const [selectedTask, setSelectedTask] = useState(null);


     const deleteTask = async (taskId) => {
          try {
               const token = localStorage.getItem('token');

               const requestOptions = {
                    method: "DELETE",
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${token}`,
                    },
               };
               let response = await fetch(`${API_URL}/task/delete/${taskId}`, requestOptions);
               if (response.status === 200) {
                    toast.success("Task deleted successfully.");
                    window.location.reload();
               } else {
                    toast.error("Failed to delete task.");
               }
          } catch (error) {
               console.error("Error deleting task:", error);
               toast.error("Failed to delete task.");
          }
     };

     const completeTask = async (taskId) => {
          try {
               const token = localStorage.getItem('token');

               const requestOptions = {
                    method: "PUT",
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${token}`,
                    },
               };
               let response = await fetch(`${API_URL}/task/complete/${taskId}`, requestOptions);
               if (response.status === 200) {
                    toast.success("Task completed successfully.");
                    window.location.reload();
               } else {
                    toast.error("Failed to complete task.");
               }
          } catch (error) {
               console.error("Error completing task:", error);
               toast.error("Failed to complete task.");
          }
     }


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
                                        onClick={() => completeTask(tasks.id)}
                                        className="focus:outline-none"
                                        aria-label={tasks.isComplete === 1 ? "Mark task as incomplete" : "Mark task as complete"}
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
                                        <button className="text-red-500 hover:bg-red-100 p-1 rounded-full" onClick={() => deleteTask(tasks.id)}>
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
