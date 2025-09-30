import "./Editor.css";
import { useState } from "react";

const Editor = ({ onCreate }: { onCreate: (content: string) => void }) => {
  const [content, setContent] = useState("");

  // 버튼 클릭시 호출되는 함수
  const onSubmit = () => {
    if (content === "") {
      alert("내용을 입력해주세요!");
      return;
    }

    onCreate(content); // App.tsx.onCreate 함수 호출
    setContent(""); // 입력창 초기화
  };

  return (
    <div className="Editor">
      <input
        value={content}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        onChange={(e) => setContent(e.target.value)}
        placeholder="새로운 할 일"
      />
      <button onClick={onSubmit}>추가</button>
    </div>
  );
};

export default Editor;
