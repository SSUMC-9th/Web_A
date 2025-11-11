type Props = {
  onClick?: () => void;
};

const FAB = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-20 z-30 h-12 w-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-2xl flex items-center justify-center shadow-lg"
      aria-label="LP 추가"
    >
      +
    </button>
  );
};

export default FAB;
