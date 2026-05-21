/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import { BsFileText } from 'react-icons/bs';
import { BiMicrophone, BiTrash, BiPlay, BiPause } from 'react-icons/bi';


const API_URL = import.meta.env.VITE_API_URL;

const formatTime = (seconds) => {
     if (isNaN(seconds)) return '0:00';
     const mins = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ShowDiary = ({ diary, isOpen, set }) => {
     const [isPlaying, setIsPlaying] = useState(false);
     const [progress, setProgress] = useState(0);
     const [currentTime, setCurrentTime] = useState(0);
     const [duration, setDuration] = useState(0);
     const audioRef = useRef(null);

     const getAudioSrc = () => {
          const baseUrl = API_URL.split('api')[0];
          let audioSrc;

          // Check if data.content already has 'uploads/' prefix
          if (diary.content.startsWith('uploads/')) {
               audioSrc = `${baseUrl}${diary.content}`;
          } else {
               audioSrc = `${baseUrl}uploads/${diary.content}`;
          }
          return audioSrc;
     };

     const togglePlayPause = () => {
          if (audioRef.current) {
               if (isPlaying) {
                    audioRef.current.pause();
               } else {
                    audioRef.current.play();
               }
               setIsPlaying(!isPlaying);
          }
     };

     const handleProgressChange = (e) => {
          const manualChange = Number(e.target.value);
          if (audioRef.current) {
               audioRef.current.currentTime = (manualChange / 100) * duration;
          }
          setProgress(manualChange);
     };

     useEffect(() => {
          if (!audioRef.current) return;

          const audioElement = audioRef.current;

          const updateProgress = () => {
               if (audioElement) {
                    const progressPercent = audioElement.duration > 0
                         ? (audioElement.currentTime / audioElement.duration) * 100
                         : 0;
                    setProgress(progressPercent);
                    setCurrentTime(audioElement.currentTime);
               }
          };

          const handleLoadedMetadata = () => {
               setDuration(audioElement.duration || 0);
          };

          // Force reload the audio to ensure it loads properly
          audioElement.load();

          audioElement.addEventListener('timeupdate', updateProgress);
          audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
          audioElement.addEventListener('durationchange', () => {
               setDuration(audioElement.duration || 0);
          });

          return () => {
               if (audioElement) {
                    audioElement.removeEventListener('timeupdate', updateProgress);
                    audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    audioElement.removeEventListener('durationchange', () => { });
               }
          };
     }, []);
     const handleDelete = async (taskId) => {
          try {
               const token = localStorage.getItem('token');

               const requestOptions = {
                    method: "DELETE",
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${token}`,
                    },
               };
               let response = await fetch(`${API_URL}/diary/delete/${taskId}`, requestOptions);
               if (response.status === 200) {
                    toast.success("Task deleted successfully.");
                    window.location.reload();
               } else {
                    toast.error("Failed to delete diary entry.");
               }
          } catch (error) {
               console.error("Error deleting diary entry:", error);
               toast.error("Failed to delete diary entry.");
          }
     };


     return (
          isOpen && diary && (
               <div className='fixed top-0 left-1/2 transform -translate-x-1/2 w-full bg-black/50 h-full z-50 flex items-center justify-center'>
                    <div className="p-4 bg-white shadow-md rounded-lg w-5/6 border border-color1 max-h-[80vh] overflow-y-auto">

                         <div className='flex justify-between items-center mb-4'>
                              <div className="text-xs text-gray-400 mt-2 flex items-center">
                                   {diary.type === 'text' ? (
                                        <BsFileText className="mr-2 text-color1" />
                                   ) : (
                                        <BiMicrophone className="mr-2 text-color1" />
                                   )} {diary.created_at.split("T")[1].split(":")[0] + ":" + diary.created_at.split("T")[1].split(":")[1]}
                                   {", " + diary.created_at.split("T")[0]}
                              </div>
                              <h2></h2>
                              <div className="flex space-x-10">
                                   <button type="button" className='cursor-pointer text-red-500 hover:bg-red-50 rounded-full focus:outline-none' onClick={() => set(false)}>
                                        <CgClose size={24} />
                                   </button>
                              </div>
                         </div>
                         {diary.type === 'text' ? (
                              <p className="text-gray-600 line-clamp-3 w-full break-words break-all">
                                   {diary.content
                                        ? (diary.content.length > 500
                                             ? diary.content.substring(0, 500) + '...'
                                             : diary.content)
                                        : ''}
                              </p>
                         ) : (
                              <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
                                   <button
                                        onClick={() => togglePlayPause()}
                                        className="bg-color1 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                                   >
                                        {isPlaying ? <BiPause size={20} /> : <BiPlay size={20} />}
                                   </button>
                                   <div className="flex-1 relative">
                                        <input
                                             type="range"
                                             min="0"
                                             max="100"
                                             value={progress}
                                             onChange={handleProgressChange}
                                             className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer 
                                                       [&::-webkit-slider-thumb]:appearance-none 
                                                       [&::-webkit-slider-thumb]:w-3 
                                                       [&::-webkit-slider-thumb]:h-3 
                                                       [&::-webkit-slider-thumb]:bg-color1 
                                                       [&::-webkit-slider-thumb]:rounded-full"
                                        />
                                   </div>
                                   <span className="text-sm text-gray-600">
                                        {formatTime(currentTime)} / {duration && isFinite(duration) ? formatTime(duration) : '0:00'}
                                   </span>
                                   <audio
                                        ref={audioRef}
                                        src={getAudioSrc()}
                                        preload="metadata"
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onEnded={() => {
                                             setIsPlaying(false);
                                             setProgress(0);
                                             if (audioRef.current) {
                                                  audioRef.current.currentTime = 0;
                                             }
                                        }}
                                        onError={(e) => {
                                             console.error("Audio error:", e);
                                             console.error("Audio error code:", e.target.error?.code);
                                             console.error("Audio error message:", e.target.error?.message);
                                             setDuration(0);
                                             setCurrentTime(0);
                                        }}
                                   >
                                        <track kind="captions" />
                                   </audio>
                              </div>
                         )}
                         <button className="float-end flex items-center border border-red-300 text-red-300 hover:bg-red-100 p-1 rounded-full hover:text-red-500 hover:border-red-500" onClick={() => handleDelete(diary.id)}>
                              <BiTrash size={20} /> Delete
                         </button>
                    </div>
               </div>
          )
     );
};


export default ShowDiary
