import { useState, useMemo } from "react";
import ListsAll from "./ListsAll"
import toast from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import api from "../../api/axios";

const AllTasks = () => {
     const [activeFilter, setActiveFilter] = useState('all');
     const id = localStorage.getItem('id');

     const { data: allTasks = [], isLoading, isError, error } = useQuery({
          queryKey: ['tasks', id],
          queryFn: async () => {
               const response = await api.get(`/task/alltasks/${id}`);
               return response.data.data;
          },
          enabled: !!id,
     });

     if (isError) {
          toast.error(error.response?.data?.message || error.message);
     }

     const filteredTasks = useMemo(() => {
          if (activeFilter === 'all') return allTasks;
          if (activeFilter === 'Active') {
               return allTasks.filter(task => task.isComplete === 0 && task.isPending === 0);
          }
          if (activeFilter === 'Pending') {
               return allTasks.filter(task => task.isPending === 1);
          }
          if (activeFilter === 'Completed') {
               return allTasks.filter(task => task.isComplete === 1);
          }
          return allTasks;
     }, [allTasks, activeFilter]);

     return (
          <>
               <div className="flex justify-center space-x-2 mb-4 p-2 bg-gray-50">
                    {['all', 'Active', 'Pending', 'Completed'].map(category => (
                         <button
                              key={category}
                              onClick={() => setActiveFilter(category)}
                              className={`px-4 py-2 rounded-full border-none text-xs ${activeFilter === category
                                   ? 'bg-color1 text-white'
                                   : 'bg-gray-200 text-gray-800'
                                   }`}
                         >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                         </button>
                    ))}
               </div>
               {isLoading ? (
                    <div className="w-full h-full px-5">
                         <div className="grid md:grid-cols-2 gap-4 lg:container">
                              {[1, 2, 3, 4].map(n => (
                                   <div key={n} className="bg-white shadow-md rounded-lg p-4 mb-4 animate-pulse">
                                        <div className="flex justify-between items-center mb-2">
                                             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                             <div className="flex space-x-2">
                                                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                                             </div>
                                        </div>
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                   </div>
                              ))}
                         </div>
                    </div>
               ) : (
                    <ListsAll tasks={filteredTasks} />
               )}
          </>
     );
};

export default AllTasks;