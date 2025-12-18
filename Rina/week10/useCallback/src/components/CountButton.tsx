import { memo } from "react";

interface ICountButton {
    onClick: (count: number) => void;
}

const CountButton = ({onClick}: ICountButton) => {
    console.log('CountButton rendered');
    
    return (
        <button className="border p-2 rounded-lg cursor-pointer hover:bg-blue-100 active:bg-blue-200"
            onClick={() => onClick(10)}>
            카운트 증가
        </button>
    )
};

export default memo(CountButton);