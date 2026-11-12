import { useEffect, useState } from "react";

function useDebounce(searchTerm,delay=500){
    const [debounceSearch,setDebounceSearch]=useState(searchTerm);

    useEffect(()=>{
        const handler=setTimeout(()=>{
            setDebounceSearch(searchTerm)
        },delay)

         return () => {
      clearTimeout(handler);
    };
    },[searchTerm,delay])

    return debounceSearch
}

export default useDebounce