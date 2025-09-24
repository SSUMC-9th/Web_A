import React from "react";
import { useTodos } from "../context/useTodos";

export default function TodoInput() {
  const { addTodo } = useTodos();
  const [text, setText] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(text);
    setText("");
  };

  return (
    <form className="todo-container__form" onSubmit={onSubmit}>
      <input
        className="todo-container__input"
        type="text"
        placeholder="할 일을 입력해주세요."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button className="todo-container__button" type="submit">
        할일 추가
      </button>
    </form>
  );
}
