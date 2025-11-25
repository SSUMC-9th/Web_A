import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Leading Edge Throttling
    const throttle = (delay : number) => {
        if (timerRef.current) {
            // timerRef.current가 있으면 바로 함수 종료
            return;
        }

        console.log(`API 요청 실행! ${delay}ms 동안 추가 요청 안 받음`);
        timerRef.current = setTimeout(() => {
            console.log(`${delay}ms 지남 > 추가 요청 받음!`);
            alert("Home/throttling 쪽 API 호출!")
            timerRef.current = null;
        }, delay);
    };

    // Trailling Edge Debouncing
    const debounce = (delay : number) => {
        if (timerRef.current) {
            // 할당되어 있는 timerRef에 해당하는 타이머 제거
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            // timerRef에 새로운 타이머 할당
            console.log(`마지막 요청으로부터 ${delay}ms 지났으므로 API 요청 실행!`);
            timerRef.current = null;
        }, delay);
    };

    useEffect(() => {
        return () => {
            // 페이지 이동 시 실행
            if (timerRef.current) {
                // 메모리 누수 방지
                clearTimeout(timerRef.current);
            }
        }
    }, []);

    return (
        <div className="flex flex-col p-6 items-center justify-center cursor-pointer">
            <h1 className="text-3xl font-extrabold">Button 이벤트 예제</h1>
            <button
                onClick={() => throttle(2000)}
                className="mt-5 h-8 w-30 rounded bg-pink-200 active:bg-pink-500"
            >Throttling 버튼</button>
            <button
                className="mt-2 h-8 w-30 rounded bg-yellow-200 active:bg-yellow-500"
                onClick={() => debounce(2000)}
            >Debounce 버튼</button>
            <div>
                <button
                    onClick={() => navigate('/company')}
                    className="mt-8 rounded underline text-gray-700"
                >페이지 이동</button>
            </div>
        </div>
    );
}