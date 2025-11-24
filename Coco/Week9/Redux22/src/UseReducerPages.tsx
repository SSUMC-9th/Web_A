import { useState } from "react";

export function UseReducerPages() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>Use Reducer Page</h1>
            <p>Count: {count}</p>
            <button onClick={handleIncrement}>Increment</button>
        </div>
    );
}