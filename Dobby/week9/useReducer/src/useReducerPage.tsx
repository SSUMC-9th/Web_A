import { useReducer, useState } from 'react'

// 1. state에 대한 interface 정의
interface IState {
    counter : number;
}

// 2. reducer에 대한 interface 정의
interface IAction {
    type: 'INCREMENT' | 'DECREMENT' | 'RESET_TO_ZERO'
    payload?: number;
}

function reducer(state: IState, action: IAction): IState {
    const { type } = action;
    switch (type) {
        case 'INCREMENT':
            return {
                ...state,
                counter: state.counter + 1,
            };
        case 'DECREMENT':
            return {
                ...state,
                counter: state.counter - 1,
            };
        case 'RESET_TO_ZERO':
            return {
                ...state,
                counter: 0,
            };
        default:
            return state;
    }
}

export default function UseReducerPage() {
    // 1. useState 사용
    const [count, setCount] = useState(0);

    // 2. useReducer 사용
    const [state, dispatch] = useReducer(reducer, {
        counter : 0,
    });

    const handleIncrement = () => {
        setCount(count + 1);
    };
    return (
        <div className = 'flex flex-col items-center justify-center'>
            <div>
                <h2 className = 'text-2xl font-bold'>useState훅 사용 : {count}</h2>
                <button onClick={handleIncrement}>Increment</button>
            </div>
            <div>
                <h2 className = 'text-2xl font-bold'>useReducer훅 사용 : {state.counter}</h2>
                <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
                <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
                <button onClick={() => dispatch({ type: 'RESET_TO_ZERO' })}>Reset to Zero</button>
            </div>
        </div>
    );
}