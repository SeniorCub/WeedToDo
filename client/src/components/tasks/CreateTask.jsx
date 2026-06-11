/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const validationSchema = Yup.object().shape({
     title: Yup.string().required('Title is required'),
     description: Yup.string().required('please enter a Description'),
     date: Yup.date().required('PLease select a due date'),
     time: Yup.string().required('please select a Time'),
     completed: Yup.boolean(),
});

const CreateTask = ({ tasks, isOpen, setIsOpen }) => {
     const [isOpened, setIsOpened] = useState(isOpen);
     const queryClient = useQueryClient();
     const userId = localStorage.getItem('id');

     useEffect(() => {
          setIsOpened(isOpen);
     }, [isOpen]);

     const mutation = useMutation({
          mutationFn: (data) => {
               const url = `/task/${tasks?.id ? `edit/${tasks.id}` : 'create'}`;
               return api.post(url, data);
          },
          onSuccess: (response) => {
               toast.success(response.data.message);
               queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
               formik.resetForm();
               setIsOpened(false);
               if (setIsOpen) setIsOpen(false);
          },
          onError: (error) => {
               console.error('Error creating/updating task:', error);
               toast.error(error.response?.data?.message || 'Failed to save task');
          }
     });

     const formik = useFormik({
          initialValues: {
               title: tasks?.title || '',
               description: tasks?.description || '',
               date: tasks?.date?.split("T")[0] || '',
               time: tasks?.time || '',
               completed: false,
          },
          enableReinitialize: true,
          validationSchema,
          onSubmit: (values) => {
               mutation.mutate(values);
          }
     });

     return (
          <>
               <button className="bg-color1 w-16 h-16 flex flex-col justify-center items-center rounded-full text-white fixed right-4 bottom-4 z-50 border-none" onClick={() => setIsOpened(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" strokeWidth={3} stroke="#fff" className="w-8 h-8">
                         <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
               </button>

               {isOpened && (
                    <div className="fixed top-28 p-4 bg-color1 shadow-md rounded-lg text-white w-5/6 left-1/2 right-3 transform -translate-x-1/2 z-50">
                         <div className='flex justify-between items-center'>
                              <span></span><h1 className="text-center text-2xl font-bold">Create Task</h1> <button type="button" className='border rounded-full text-red-500 border-red-500 hover:bg-red-50 focus:outline-none' onClick={() => setIsOpened(false)}><CgClose /></button>
                         </div>
                         <form onSubmit={formik.handleSubmit}>
                              <div className="flex flex-col space-y-4">
                                   <div className="flex items-center sr-only">
                                        <input type="checkbox" id="completed" name="completed" onChange={formik.handleChange} className="checkbox checkbox-success mr-2" />
                                        <label htmlFor="completed" className="font-semibold">Mark as Completed</label>
                                   </div>
                                   {formik.touched.title && formik.errors.title ? (<p className="text-red-500 text-xs">{formik.errors.title}</p>) : null}
                                   <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} placeholder="Task title" className="w-full p-2 border bg-white/10 text-black placeholder:text-black rounded-lg" />
                                   {formik.touched.description && formik.errors.description ? (<p className="text-red-500 text-xs">{formik.errors.description}</p>) : null}
                                   <textarea name="description" value={formik.values.description} onChange={formik.handleChange} placeholder="Task description" className="w-full p-2 border bg-white/10 text-black placeholder:text-black rounded-lg h-56 resize-none" />

                                   <div className="flex space-x-2">
                                        {formik.touched.time && formik.errors.time ? (<p className="text-red-500 text-xs">{formik.errors.time}</p>) : null}
                                        <input type="time" name="time" value={formik.values.time} onChange={formik.handleChange} className="w-1/2 p-2 border bg-white/10 text-black placeholder:text-black rounded-lg" />
                                        {formik.touched.date && formik.errors.date ? (<p className="text-red-500 text-xs">{formik.errors.date}</p>) : null}
                                        <input type="date" name="date" value={formik.values.date} onChange={formik.handleChange} className="w-1/2 p-2 border bg-white/10 text-black placeholder:text-black rounded-lg" />
                                   </div>

                                   <button type="submit" disabled={mutation.isPending} className="w-full py-2 px-4 bg-white text-color1 font-bold rounded-lg disabled:opacity-50">
                                        {mutation.isPending ? 'Saving...' : (tasks ? 'Update Task' : 'Create Task')}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}
          </>
     );
};

export default CreateTask;