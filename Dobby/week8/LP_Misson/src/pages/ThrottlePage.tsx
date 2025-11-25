import { useEffect, useState } from 'react'
import useThrottle from '../hooks/useThrottle';

const ThrottlePage = () => {
    const [scrollY, setScrollY] = useState<number>(0);
    const handleScroll = useThrottle(() => {
        setScrollY(window.scrollY);
    }, 1000);
    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    console.log("스크롤됨");
   return (
       <div className="flex flex-col items-center justify-center h-screen">
           <h1>ThrottlePage</h1>
           <p>scrollY: {scrollY}</p>
       </div>
    )
}

export default ThrottlePage