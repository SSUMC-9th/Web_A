interface Props {
    onRetry?: () => void;
}

const ErrorView = ({ onRetry }: Props) => (
    <div className="w-full flex flex-col items-center justify-center py-16 gap-3 text-zinc-300">
        <div>문제가 발생했습니다.</div>
        {onRetry && (
            <button onClick={onRetry} className="px-3 h-9 rounded bg-zinc-800 hover:bg-zinc-700">
                다시 시도
            </button>
        )}
    </div>
);

export default ErrorView;


