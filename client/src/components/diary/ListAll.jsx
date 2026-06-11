import DiaryEntry from '../../components/diary/DiaryEntry';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const ListAll = () => {
     const id = localStorage.getItem('id');

     const { data: diaries = [], isLoading, isError, error } = useQuery({
          queryKey: ['diaries', id],
          queryFn: async () => {
               const response = await api.get(`/diary/all/${id}`);
               return response.data.data;
          },
          enabled: !!id,
     });

     if (isError) {
          toast.error(error.response?.data?.message || error.message);
     }

     return (
          isLoading ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 container pb-28 mt-4">
                    {[1, 2, 3].map(n => (
                         <div key={n} className="bg-white shadow-md rounded-lg p-4 mb-4 relative animate-pulse w-full">
                              <div className="flex justify-between items-center mb-2">
                                   <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                   </div>
                                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                              </div>
                              <div className="space-y-2 mt-4">
                                   <div className="h-3 bg-gray-200 rounded w-full"></div>
                                   <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                   <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                              </div>
                         </div>
                    ))}
               </div>
          ) : (
               diaries.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">No content available.</p>
               ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 container pb-28 mt-4">
                         {
                              diaries.map((diary) => (
                                   <DiaryEntry entry={diary.type} key={diary.id} data={diary} />
                              ))
                         }
                    </div>
               )
          )
     )
}

export default ListAll;
