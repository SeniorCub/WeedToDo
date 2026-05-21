import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { BiMicrophone, BiMicrophoneOff, BiSave } from 'react-icons/bi';
import { BsFileText } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CreateDiary = () => {
     const [isOpen, setIsOpen] = useState(false);
     const [noteType, setNoteType] = useState('text'); // 'text' or 'audio'
     const [textNote, setTextNote] = useState('');
     const [audioRecording, setAudioRecording] = useState(null);
     const [isRecording, setIsRecording] = useState(false);
     const [selectedDateTime, setSelectedDateTime] = useState({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].slice(0, 5)
     });
     const mediaRecorderRef = useRef(null);
     const audioChunksRef = useRef([]);
     const navigate = useNavigate();

     const startAudioRecording = async () => {
          try {
               const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
               mediaRecorderRef.current = new MediaRecorder(stream);

               mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
               };

               mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setAudioRecording(URL.createObjectURL(audioBlob));
                    audioChunksRef.current = [];
               };

               mediaRecorderRef.current.start();
               setIsRecording(true);
          } catch (err) {
               console.error('Error accessing microphone', err);
               toast.error('Could not access microphone. Please check permissions.');
          }
     };

     const stopAudioRecording = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
               mediaRecorderRef.current.stop();
               setIsRecording(false);
          }
     };

     const handleSaveNote = async () => {
          try {
               // Get the current user ID from your auth system
               const id = localStorage.getItem('id')

               let response;

               if (noteType === 'text') {
                    response = await fetch(`${API_URL}/diary/create`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token auth
                         },
                         body: JSON.stringify({
                              user_id: id,
                              type: noteType,
                              content: textNote,
                              created_at: new Date(`${selectedDateTime.date}T${selectedDateTime.time}`).toISOString()
                         })
                    });
               } else {
                    // For audio, we need to use FormData to handle the file
                    const formData = new FormData();

                    // Convert the audio blob URL back to a file
                    try {
                         const audioBlob = await fetch(audioRecording).then(r => r.blob());

                         // Create a File object with a proper type
                         const audioFile = new File(
                              [audioBlob],
                              'recording.webm',
                              { type: audioBlob.type || 'audio/webm' }
                         );
                         formData.append('audioFile', audioFile);

                         formData.append('user_id', id);
                         formData.append('type', noteType);
                         formData.append('created_at', new Date(`${selectedDateTime.date}T${selectedDateTime.time}`).toISOString());

                         response = await fetch(`${API_URL}/diary/create`, {
                              method: 'POST',
                              headers: {
                                   'Authorization': `Bearer ${localStorage.getItem('token')}`
                              },
                              body: formData
                         });
                    } catch (error) {
                         console.error("Error processing audio:", error);
                         toast.error('Error processing audio recording. Please try again.');
                    }
               }

               const data = await response.json();

               if (response.ok) {
                    // Show success message
                    toast.success('Diary entry saved successfully!');

                    // Reset form and close
                    setTimeout(() => {
                         setTextNote('');
                         setAudioRecording(null);
                         setIsOpen(false);
                         navigate('/diary')
                    }, 3000);
               } else {
                    // Show error message
                    toast.error(`Error: ${data.message}`);
               }
          } catch (error) {
               console.error('Error saving diary entry:', error);
               toast.error('Failed to save diary entry. Please try again.');
          }
     };

     const clearAudioRecording = () => {
          setAudioRecording(null);
     };

     return (
          <>
               <button
                    className="bg-color1 w-16 h-16 flex flex-col justify-center items-center rounded-full text-white fixed right-4 bottom-4 shadow-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
               >
                    <BsFileText className="w-8 h-8" />
               </button>

               {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                         <div className="bg-white rounded-lg w-11/12 max-w-md p-6 max-h-[90vh] overflow-y-auto">
                              <div className="flex justify-between items-center mb-4">
                                   <h2 className="text-2xl font-bold text-color1">Create Diary Note</h2>
                                   <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-red-500 hover:bg-red-100 rounded-full p-1"
                                   >
                                        <CgClose />
                                   </button>
                              </div>

                              {/* Note Type Toggle */}
                              <div className="flex justify-center mb-4">
                                   <div className="flex bg-gray-100 rounded-full p-1">
                                        <button
                                             className={`px-4 py-2 rounded-full transition-colors ${noteType === 'text' ? 'bg-color1 text-white' : 'text-gray-600'
                                                  }`}
                                             onClick={() => setNoteType('text')}
                                        >
                                             Text Note
                                        </button>
                                        <button
                                             className={`px-4 py-2 rounded-full transition-colors ${noteType === 'audio' ? 'bg-color1 text-white' : 'text-gray-600'
                                                  }`}
                                             onClick={() => setNoteType('audio')}
                                        >
                                             Audio Note
                                        </button>
                                   </div>
                              </div>

                              {/* Content Area */}
                              {noteType === 'text' ? (
                                   <textarea
                                        value={textNote}
                                        onChange={(e) => setTextNote(e.target.value)}
                                        placeholder="Write your diary note here..."
                                        className="w-full h-40 p-3 border rounded-lg mb-4 resize-none"
                                   />
                              ) : (
                                   <div className="flex flex-col items-center">
                                        {!audioRecording ? (
                                             <button
                                                  onClick={isRecording ? () => stopAudioRecording() : () => startAudioRecording()}
                                                  className={`w-20 h-20 rounded-full ${isRecording
                                                       ? 'bg-red-500 text-white'
                                                       : 'bg-color1 text-white'
                                                       } flex items-center justify-center`}
                                             >
                                                  {isRecording ? <BiMicrophoneOff /> : <BiMicrophone />}
                                             </button>
                                        ) : (
                                             <div className="flex flex-col items-center">
                                                  <audio src={audioRecording} controls className="mb-4">
                                                       <track kind="captions" />
                                                  </audio>
                                                  <div className="flex space-x-4">
                                                       <button
                                                            onClick={() => clearAudioRecording()}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                                       >
                                                            Clear
                                                       </button>
                                                  </div>
                                             </div>
                                        )}
                                        {isRecording && (
                                             <p className="text-red-500 mt-2">Recording...</p>
                                        )}
                                   </div>
                              )}

                              {/* Date and Time Selection */}
                              <div className="flex space-x-4 mb-4">
                                   <div className="flex-1">
                                        <label htmlFor="diary-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                             id="diary-date"
                                             type="date"
                                             value={selectedDateTime.date}
                                             onChange={(e) => setSelectedDateTime(prev => ({ ...prev, date: e.target.value }))}
                                             className="w-full p-2 border rounded-lg"
                                        />
                                   </div>
                                   <div className="flex-1">
                                        <label htmlFor="diary-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input
                                             id="diary-time"
                                             type="time"
                                             value={selectedDateTime.time}
                                             onChange={(e) => setSelectedDateTime(prev => ({ ...prev, time: e.target.value }))}
                                             className="w-full p-2 border rounded-lg"
                                        />
                                   </div>
                              </div>

                              {/* Save Button */}
                              <button
                                   onClick={() => handleSaveNote()}
                                   disabled={noteType === 'text' ? !textNote : !audioRecording}
                                   className="w-full py-3 bg-color1 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                              >
                                   <BiSave className="mr-2" /> Save Diary Note
                              </button>
                         </div>
                    </div>
               )}
          </>
     );
};

export default CreateDiary;