import { useEffect, useState } from "react";

// function useDebounce() {}

// export default useDebounce;

// const [search, setSearch] = useState("");

// const debouncedValue: void = useDebounce(search, 500);

// 이런 느낌

function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    //value 또는 delay의 변경을 통해서 실행 되어야 함
    //delay 후, value를 debounceValue로 업데이트.
    const handler = setTimeout(() => setDebounceValue(value), delay);

    //value가 변경되면 이전 타이머 삭제. -> update 취소
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounceValue;
}

export default useDebounce;
