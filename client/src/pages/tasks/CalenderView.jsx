import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { logout } from '../../hooks/logout';
import toast from 'react-hot-toast';
import axios from 'axios';
import ListEach from '../../components/tasks/ListEach';
import DiaryEntry from '../../components/diary/DiaryEntry';

const API_URL = import.meta.env.VITE_API_URL;

// Localizer for calendar
const localizer = momentLocalizer(moment);

const CalendarView = () => {
     const [tasks, setTasks] = useState([]);
     const [diaries, setDiaries] = useState([]);
     const [selectedEvent, setSelectedEvent] = useState(null);
     const [showModal, setShowModal] = useState(false);

     const id = localStorage.getItem('id');
     const token = localStorage.getItem('token');

     useEffect(() => {
          const url = `${API_URL}/task/alltasks/${id}`;
          const fetchTasks = async () => {
               try {
                    const response = await axios.get(url, {
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                         },
                    });

                    if (response.status === 200) {
                         // Add task-specific properties for styling
                         const formattedTasks = response.data.data.map(task => {
                              // Ensure date is a proper Date object
                              const taskDate = new Date(task.date);

                              return {
                                   ...task,
                                   title: task.title || task.taskName || "Task",
                                   isTask: true, // Flag to identify as task
                                   start: taskDate,
                                   end: taskDate,
                              };
                         });
                         setTasks(formattedTasks);
                    } else {
                         toast.error(response.data.message);
                         logout();
                    }
               } catch (error) {
                    toast.error(error.message);
                    logout();
               }
          };

          fetchTasks();
     }, [token, id]);

     useEffect(() => {
          const url = `${API_URL}/diary/all/${id}`;
          const fetchall = async () => {
               try {
                    const response = await axios.get(url, {
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                         },
                    });

                    if (response.status === 200) {
                         // Add diary-specific properties for styling
                         const formattedDiaries = response.data.data.map(diary => {
                              // Ensure date is a proper Date object
                              const diaryDate = new Date(diary.created_at);

                              return {
                                   ...diary,
                                   title: diary.title || (diary.content ? diary.content.substring(0, 30) : "Diary Entry"),
                                   isDiary: true, // Flag to identify as diary
                                   start: diaryDate,
                                   end: diaryDate,
                              };
                         });
                         setDiaries(formattedDiaries);
                    } else {
                         toast.error(response.data.message);
                         logout();
                    }
               } catch (error) {
                    toast.error(error.message);
                    logout();
               }
          };
          fetchall();
     }, [token, id]);

     // Custom event styling based on type (task or diary)
     const eventStyleGetter = (event) => {
          if (event.isTask) {
               return {
                    style: {
                         backgroundColor: '#3182CE', // Blue for tasks
                         color: 'white',
                         borderRadius: '4px',
                         border: 'none',
                         display: 'block',
                         cursor: 'pointer'
                    }
               };
          } else if (event.isDiary) {
               return {
                    style: {
                         backgroundColor: '#38A169', // Green for diaries
                         color: 'white',
                         borderRadius: '4px',
                         border: 'none',
                         display: 'block',
                         cursor: 'pointer'
                    }
               };
          }
          return {};
     };

     // Handle event click
     const handleEventClick = (event) => {
          setSelectedEvent(event);
          setShowModal(true);
     };

     // Close modal
     const closeModal = () => {
          setShowModal(false);
          setSelectedEvent(null);
     };

     return (
          <div className="p-4 bg-white rounded-lg shadow">
               <Calendar
                    localizer={localizer}
                    events={[...tasks, ...diaries]}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    className='h-[80vh] md:w-9/12 mx-auto'
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleEventClick}
               />

               {/* Modal for displaying selected event */}
               {showModal && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                         <div className="p-6 max-w-lg w-full relative">
                              <button
                                   onClick={() => closeModal()}
                                   className="text-red-700 absolute -top-40 -right-40"
                              >
                                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                              </button>
                              {selectedEvent.isTask && (
                                   <ListEach task={selectedEvent} />
                              )}

                              {selectedEvent.isDiary && (
                                   <DiaryEntry entry={selectedEvent.type} data={selectedEvent} />
                              )}
                         </div>
                    </div>
               )}
          </div>
     );
};

export default CalendarView;