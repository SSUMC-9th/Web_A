import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  //value나 delay가 변경될 때 마다 실행
  useEffect(() => {
    //delay(ms) 후에 실행됩니다.
    //delay 시간 후에 value를 debouncedValue로 업데이트하는 타이머를 시작합니다/
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    //cleanup 함수: value가 변경되면 이전 타이머를 취소하고 새로운 타이머를 시작합니다.
    //값이 변경될 때마다 마지막에 멈춘 값만 업데이트 됩니다.
    return () => clearTimeout(handler);
  }, [value, delay]);

  //최종적으로 반환되는 값은 debouncedValue입니다. "잠시 기다린 값"
  return debouncedValue;
}
export default useDebounce;