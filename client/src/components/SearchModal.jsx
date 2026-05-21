// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
const SearchModal = ({ allTasks}) => {
    // State to toggle form visibility
    const [isOpen, setIsOpened] = useState(false);
    const [searchItem, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]); // Properly initialize state for filtered items

    // Function to filter tasks based on the search query
    function filterItems(query) {
        // eslint-disable-next-line react/prop-types
        return allTasks.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.date.toLowerCase().includes(query) ||
            item.time.toString().includes(query)
        );
    }

    // Function to handle search input and toggle form visibility
    function getSearch() {
        setIsOpened(!isOpen);
        const searchTerm = searchItem.toLowerCase();
        const filtered = filterItems(searchTerm);
        setFilteredItems(filtered); // Update state with filtered items
    }

    return (
        <>
               {/* Search Bar */}
               <div className="bg-color3 w-[30vh] h-[5vh] flex flex-col justify-center items-center -translate-y-5 fixed right-1/2 md:w-[50vw] top-[5vh] transform translate-x-1/2">
                    <label className="input input-bordered flex items-center gap-2 bg-color1 text-white w-full h-full rounded-none">
                         <span className="sr-only">Search tasks</span>
                         <input type="text" className="grow placeholder:text-gray-300" placeholder="Search" onChange={(e) => setSearch(e.target.value)}value={searchItem} name="search" />
                         <button type="button" onClick={() => getSearch()} className="focus:outline-none">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                         </button>
                    </label>
               </div>

            {/* Search Results Modal */}
            {isOpen && (
                <div className="fixed top-[10vh] mt-2 p-2 bg-color3 shadow-md w-96 transform translate-x-1/2 right-1/2 md:w-[50vw] w-[30vw]">
                    <div>
                        {/* Check if filteredItems has any results */}
                        {filteredItems.length > 0 ? (
                            filteredItems.map(({ id, date, description, title, time }) => (
                                   <div key={id} className={`flex w-full p-2 mb-2 max-h-28 border-b`} >
                                        {/* Task Details */}
                                        <div className="basis-4/6">
                                             <h2 className="font-extrabold text-base">{title}</h2>
                                             <p className="font-light text-sm">{description}</p>
                                        </div>
                                        {/* Time and Date */}
                                        <div className="basis-2/6 text-sm text-right">
                                             <p className="font-bold max-h-10 overflow-y-hidden">{time}</p>
                                             <p className="font-extralight text-xs max-h-16 overflow-y-hidden">{date}</p>
                                        </div>
                                   </div>
                            ))
                        ) : (
                            <p>No tasks found.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchModal;