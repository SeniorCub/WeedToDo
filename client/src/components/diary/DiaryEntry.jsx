/* eslint-disable react/prop-types */
import { BsFileText } from 'react-icons/bs';
import { BiMicrophone, BiTrash, BiPlay, BiPause } from 'react-icons/bi';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ShowDiary from './ShowDiary';

const API_URL = import.meta.env.VITE_API_URL;

const formatTime = (seconds) => {
     if (isNaN(seconds)) return '0:00';
     const mins = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const DiaryEntry = ({ entry, data }) => {
     const [isPlaying, setIsPlaying] = useState(false);
     const [progress, setProgress] = useState(0);
     const [currentTime, setCurrentTime] = useState(0);
     const [duration, setDuration] = useState(0);
     const audioRef = useRef(null);
     const [selectedDiary, setSelectedDiary] = useState(null);
     const [isOpen, setisopen] = useState(false);

     const handleDiaryClick = (data) => {
          setSelectedDiary(data);
          setisopen(true);
     }

     const getAudioSrc = () => {
          const baseUrl = API_URL.split('api')[0];
          let audioSrc;

          // Check if data.content already has 'uploads/' prefix
          if (data.content.startsWith('uploads/')) {
               audioSrc = `${baseUrl}${data.content}`;
          } else {
               audioSrc = `${baseUrl}uploads/${data.content}`;
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
          <>
               <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
                    <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center">
                              {entry === 'text' ? (
                                   <BsFileText className="mr-2 text-color1" />
                              ) : (
                                   <BiMicrophone className="mr-2 text-color1" />
                              )}
                              <span className="text-sm text-gray-500">
                                   {data.created_at.split("T")[1].split(":")[0] + ":" + data.created_at.split("T")[1].split(":")[1]}
                                   {", " + data.created_at.split("T")[0]}
                              </span>
                         </div>
                         <div className="flex space-x-2">
                              <button
                                   className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                                   onClick={() => handleDelete(data.id)}
                              >
                                   <BiTrash size={20} />
                              </button>
                         </div>
                    </div>
                    <div
                         onClick={() => handleDiaryClick(data)}
                         onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                   e.preventDefault();
                                   handleDiaryClick(data);
                              }
                         }}
                         role="button"
                         tabIndex="0"
                         className='cursor-pointer'
                    >
                         {entry === 'text' ? (
                              <p className="text-gray-600 line-clamp-3 w-full break-words break-all">
                                   {data.content
                                        ? (data.content.length > 500
                                             ? data.content.substring(0, 500) + '...'
                                             : data.content)
                                        : ''}
                              </p>
                         ) : (
                              <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
                                   <button
                                        onClick={(e) => {
                                             e.stopPropagation();
                                             togglePlayPause();
                                        }}
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
                    </div>
               </div>

               <ShowDiary diary={selectedDiary} isOpen={isOpen} set={setisopen} />

          </>
     );
}

export default DiaryEntry;
