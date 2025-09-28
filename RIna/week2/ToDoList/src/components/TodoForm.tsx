import { useState } from "react";
import { useTodo } from "../TodoContext";

export default function TodoForm() {
    const { addTodo } = useTodo();
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <form className="todo-container__form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="todo-container__input"
                placeholder="할 일을 입력하세요"
                required
            />
            <button type="submit" className="todo-container__button">
                할 일 추가
            </button>
        </form>
    )
}