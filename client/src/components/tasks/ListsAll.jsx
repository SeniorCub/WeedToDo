/* eslint-disable react/prop-types */
import { ListEach } from './ListEach';

const ListsAll = ({ tasks }) => {
     return (
          <div className="w-full h-full px-5">
               {tasks.length === 0 ? (
                    <p className="text-center text-gray-500">No tasks available.</p>
               ) : (
                    <div className="grid md:grid-cols-2 gap-4 lg:container">
                         {
                              tasks.map((task) => (
                                   <ListEach task={task} key={task.id} />
                              ))
                         }
                    </div>
               )}
          </div>
     );
};

export default ListsAll;
