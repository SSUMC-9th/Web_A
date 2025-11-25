import { useReducer, useState } from "react";

interface IState {
    count: number;
    error: string | null;
    
}

interface IAction {
    type: 'increment' | 'decrement'|'reset';
}

function reducer(state: IState, action: IAction): IState {
    switch (action.type) {
        case 'increment':
            return {
                ...state,
    count: state.count + 1,
    error: null
};
        case 'decrement':
            return { ...state,  count: state.count - 1, error: null };
        case 'reset':
            return { ...state, count: 0, error: null };
        default:
            throw new Error();
    }
}

export function UseReducerPages() {
    
    const [count, setCount] = useState(0);//useState
    const [state, dispatch] = useReducer(reducer, {
        count: 0,
        error: null
    } );//useReducer

    const handleIncrement = () => {
        setCount(count + 1);
    }

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1>UseState</h1>
                <p>useState count: {count}</p>
                <button onClick={handleIncrement}>Increment useState</button>
            </div>
            <div>
                <h1>UseReducer</h1>
                <p>useReducer count: {state.count}</p>
                <button onClick={() => dispatch({ type: 'increment' })}>Increment useReducer</button>
                <button onClick={() => dispatch({ type: 'decrement' })}>Decrement useReducer</button>
                <button onClick={() => dispatch({ type: 'reset' })}>Reset useReducer</button>
            </div>
        </div>
    );
}