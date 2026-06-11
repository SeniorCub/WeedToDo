/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const validationSchema = Yup.object().shape({
     title: Yup.string().required('Title is required'),
     contet: Yup.string().required('Note content is required'),
     category: Yup.string().optional(),
});

const CreateNote = ({ notes, isOpen, setIsOpen }) => {
     const [isOpened, setIsOpened] = useState(isOpen);
     const queryClient = useQueryClient();
     const userId = localStorage.getItem('id');

     useEffect(() => {
          setIsOpened(isOpen);
     }, [isOpen]);

     const mutation = useMutation({
          mutationFn: (data) => {
               const url = `/note/${notes?.id ? `edit/${notes.id}` : 'create'}`;
               return api.post(url, data);
          },
          onSuccess: (response) => {
               toast.success(response.data.message);
               queryClient.invalidateQueries({ queryKey: ['notes', userId] });
               formik.resetForm();
               setIsOpened(false);
               if (setIsOpen) setIsOpen(false);
          },
          onError: (error) => {
               console.error('Error creating/updating note:', error);
               toast.error(error.response?.data?.message || 'Failed to save note');
          }
     });

     const formik = useFormik({
          initialValues: {
               title: notes?.title || '',
               contet: notes?.contet || '',
               category: notes?.category || 'general',
          },
          enableReinitialize: true,
          validationSchema,
          onSubmit: (values) => {
               mutation.mutate(values);
          }
     });

     return (
          <>
               <button
                    className="bg-color1 w-16 h-16 flex flex-col justify-center items-center rounded-full text-white fixed right-4 bottom-4 border-none"
                    onClick={() => setIsOpened(!isOpen)}
               >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" strokeWidth={3} stroke="#fff" className="w-8 h-8">
                         <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
               </button>

               {isOpened && (
                    <div className="fixed top-28 p-4 bg-white shadow-md rounded-lg w-5/6 left-1/2 transform -translate-x-1/2 border border-color1 z-50">
                         <div className='flex justify-between items-center mb-4'>
                              <span></span>
                              <h1 className="text-center text-2xl text-color1 font-bold">Create Note</h1>
                              <button
                                   type="button"
                                   className='cursor-pointer text-red-500 hover:bg-red-50 rounded-full focus:outline-none'
                                   onClick={() => setIsOpened(false)}
                              >
                                   <CgClose size={24} />
                              </button>
                         </div>

                         <form onSubmit={formik.handleSubmit}>
                              <div className="flex flex-col space-y-4">
                                   {formik.touched.title && formik.errors.title ? (
                                        <p className="text-red-500 text-xs">{formik.errors.title}</p>
                                   ) : null}
                                   <input
                                        type="text"
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        placeholder="Note title"
                                        className="w-full p-2 border bg-white/10 text-black placeholder:text-black rounded-lg"
                                   />

                                   {formik.touched.contet && formik.errors.contet ? (
                                        <p className="text-red-500 text-xs">{formik.errors.contet}</p>
                                   ) : null}
                                   <textarea
                                        type="text"
                                        name="contet"
                                        value={formik.values.contet}
                                        onChange={formik.handleChange}
                                        placeholder="Note content"
                                        className="w-full p-2 border bg-white/10 text-black placeholder:text-black rounded-lg max-h-72"
                                   />

                                   <select
                                        name="category"
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                        className="w-full p-2 border bg-white/10 text-black placeholder:text-black rounded-lg"
                                   >
                                        <option value="general">General</option>
                                        <option value="personal">Personal</option>
                                        <option value="work">Work</option>
                                        <option value="ideas">Ideas</option>
                                   </select>

                                   <button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="w-full py-2 px-4 bg-color1 text-white font-bold rounded-lg disabled:opacity-50"
                                   >
                                        {mutation.isPending ? "Saving..." : (notes ? "Update Note" : "Create Note")}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}
          </>
     );
};

export default CreateNote;