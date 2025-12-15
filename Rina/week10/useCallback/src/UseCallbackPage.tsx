import { useCallback, useState } from "react"
import TextInput from "./components/TextInput";
import CountButton from "./components/CountButton";

export default function UseCallbackPage () {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>('');

    const handleIncreaseCount = useCallback((number: number) => {
        setCount(count + number);
        // 빈 배열을 넘긴다면? '빈 배열은 이 함수가 처음 한번만 만들어져야 한다'의 의미임
        // 함수가 호출되는 순간 모든 값은 동결됨
        // 함수 내부에서 count 값은 0으로 기억하고 있음(useState의 초깃값)
        // 두번째 클릭을 해도, 0 + 10이 되어서 count 값이 변하지 않음
        // 첫번째 클릭도 0 + 10
        // 두번째 클릭도 0 + 10
    }, [count]);

    const handleText = useCallback((text: string) => {
        setText(text);
    }, [text]);

    return (
        <div>
            <h1 className="font-bold text-3xl">같이 배우는 리액트 useCallback편</h1>
            <h2 className="bg-gray-200 mt-6 mb-2 p-2">Count: {count}</h2>
            <CountButton onClick={handleIncreaseCount}/>
            <h2 className="bg-gray-200 mt-4 mb-2 p-2">Text</h2>
            <div className="flex flex-col">
                <span>{text}</span>
                <TextInput onChange={handleText}/>
            </div>
        </div>
    )
}
