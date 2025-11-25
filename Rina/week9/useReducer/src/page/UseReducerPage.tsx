import { useReducer, useState } from "react";

// 1. state에 대한 interface
interface IState {
    counter: number;
}

// 2. reducer에 대한 interface
interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
    payload?: number;
}

function reducer(state: IState, action: IAction) {
    const {type} = action;

    switch(type) {
        case 'INCREASE':{
            return {
                ...state,   // 원본 값을 항상 유지시켜줘야 함, 이게 귀찮으면 immer라는 라이브러리 쓰기
                counter: state.counter + 1,
            }
        }
        case 'DECREASE': {
            return {
                ...state,
                counter: state.counter - 1,
            }
        }
        case 'RESET_TO_ZERO': {
            return {
                ...state,
                counter: 0,
            }
        }
        default:
            return state;
    }
}

export default function UseReducerPage() {
    // 1. useState
    const [count, setCount] = useState(0);

    const handleIncrease = () => {
        setCount(count + 1);
    };

    // 2. useReducer
    const [state, dispatch] = useReducer(reducer, {
        counter: 0, 
    })

    return (
        <div className="flex flex-col gap-10">
            <div className="bg-gray-800 text-gray-200 p-4">
                <h1 className="font-bold text-3xl">useState 훅 사용: {count}</h1>
                <button
                    onClick={handleIncrease}
                    className="border border-gray-300 rounded p-2 mt-3 bg-gray-500 active:bg-gray-600 cursor-pointer"
                >+1</button>
            </div>
            <div className="bg-blue-900 text-blue-200 p-4">
                <h1 className="font-bold text-3xl">useReducer 훅 사용: {state.counter}</h1>
                <button
                    onClick={() =>
                        dispatch({
                            type: 'INCREASE',
                            payload: 3,
                        })
                    }
                    className="border border-gray-300 rounded p-2 mt-3 bg-blue-400 active:bg-gray-600 cursor-pointer"
                >INCREASE</button>

                <button
                    onClick={() =>
                        dispatch({
                            type: 'DECREASE',
                        })
                    }
                    className="border border-gray-300 rounded p-2 mt-3 bg-blue-500 active:bg-gray-600 cursor-pointer"
                >DECREASE</button>

                <button
                    onClick={() =>
                        dispatch({
                            type: 'RESET_TO_ZERO',
                        })
                    }
                    className="border border-gray-300 rounded p-2 mt-3 bg-blue-600 active:bg-gray-600 cursor-pointer"
                >RESET</button>
            </div>
                
            
        </div>
        
    )
}