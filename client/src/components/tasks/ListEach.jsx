/* eslint-disable react/prop-types */
import { toast } from 'react-hot-toast';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import ShowTask from './ShowTask';
import CreateTask from './CreateTask';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const ListEach = ({ task }) => {

     const [selectedTask, setSelectedTask] = useState(null);
     const [isOpen, setisopen] = useState(false);
     const [isEditing, setIsEditing] = useState(false);

     const handleEditClick = (task) => {
          setSelectedTask(task); // Set the current note for editing
          setIsEditing(true); // Open CreateNote modal
     };

     const handleClick = (task) => {
          setSelectedTask(task);
          setisopen(true);
     }

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

     return (
          <>
               <div className="mt-2">
                    <div
                         key={task.id}
                         className="bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out"
                    >
                         <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                   <button 
                                        type="button"
                                        onClick={() => completeTask(task.id)}
                                        className="focus:outline-none mr-2"
                                        aria-label={task.isComplete === 1 ? "Mark task as incomplete" : "Mark task as complete"}
                                   >
                                        {task.isComplete === 1 ? (
                                             <BsCheckCircle
                                                  className={`${task.isComplete === 1
                                                       ? 'text-green-500'
                                                       : 'text-gray-300'
                                                       }`}
                                             />) : (
                                             <BsCircle
                                                  className={`${task.isComplete === 1
                                                       ? 'text-green-500'
                                                       : 'text-gray-300'
                                                       }`}
                                             />
                                        )}
                                   </button>
                                   <span className="text-sm text-gray-500">
                                        {task.time.split(":")[0] + ":" + task.time.split(":")[1]}
                                        {", " + task.date.split("T")[0]}
                                   </span>
                              </div>
                              <div className="flex space-x-2">
                                   <button
                                        className="text-color1 p-1 rounded-full"
                                        onClick={() => handleEditClick(task)}
                                   >
                                        <BiEdit size={20} />
                                   </button>
                                   <button
                                        className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                                        onClick={() => deleteTask(task.id)}
                                   >
                                        <BiTrash size={20} />
                                   </button>
                              </div>
                         </div>

                         <button
                              type="button"
                              className={`w-full text-left focus:outline-none cursor-pointer
                                        ${task.isComplete === 1
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-800'
                                   }`
                              }
                              onClick={() => handleClick(task)}
                         >
                              <h2 className="font-bold text-base mb-1">{task.title}</h2>
                              <p className="text-xs">
                                   {task.description.substring(0, 200)}
                                   {task.description.length > 300 ? '...' : ''}
                              </p>
                         </button>
                    </div>

               </div>

               <ShowTask tasks={selectedTask} isOpen={isOpen} set={setisopen} />

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

export default ListEach;