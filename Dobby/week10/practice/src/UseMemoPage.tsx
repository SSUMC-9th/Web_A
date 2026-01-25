import { useMemo, useState } from "react";
import TextInput from "./components/TextInput";
import { findPrimeNumbers } from "./utils/math";

export default function UseMemoPage() {
  console.log("rendered");

  const [limit, setLimit] = useState<number>(10000);
  const [text, setText] = useState("");

  const handleChangeText = (text: string) => {
    setText(text);
  };

  const primes = useMemo((): number[] | undefined => findPrimeNumbers(limit), [limit]);

  return (
    <div className="flex flex-col gap-4">
      <h1>같이 배우는 리액트 useMemo편</h1>
      <label>
        숫자 입력 (소수 찾기) :
        <input
          type="number"
          placeholder="Enter limit"
          value={limit}
          className="border border-neutral-300 rounded-md p-2"
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>

      <h2>소수 리스트 : </h2>
      <div className="flex flex-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {primes?.map((prime: number) => (
          <span
            key={prime}
            className="mr-2 mb-2 px-2 py-1 rounded bg-neutral-800 text-neutral-100"
            style={{ display: "inline-block" }}
          >
            {prime}
          </span>
        ))}
      </div>

      <label>
        {text}
        다른 입력 테스트 : <TextInput onChange={handleChangeText} />
      </label>
    </div>
  );
}
