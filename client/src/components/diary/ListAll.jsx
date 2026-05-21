import { useEffect, useState } from 'react';
import DiaryEntry from '../../components/diary/DiaryEntry';
import toast from 'react-hot-toast';
import { logout } from '../../hooks/logout';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ListAll = () => {
     const [diaries, setDiaries] = useState([]);
     const [loading, setLoading] = useState(true);

     const id = localStorage.getItem('id');
     const token = localStorage.getItem('token');

     const url = `${API_URL}/diary/all/${id}`;

     useEffect(() => {
          const fetchall = async () => {
               try {
                    const response = await axios.get(url, {
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                         },
                    });

                    if (response.status === 200) {
                         setLoading(false);
                         const diary = response.data.data;
                         setDiaries(diary);
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
          }
          fetchall()
     }, [token, url, id]);

     return (
          loading ? (
               <div className="text-center text-gray-500 mt-10" >
                    Loading Diary...
               </div >
          ) : (
               diaries.length === 0 ? (
                    <p className="text-center text-gray-500">No content available.</p>
               ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 container pb-28">
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

export default ListAll
