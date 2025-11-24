import type { CartState } from "../slices/cartSlice";
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import type { RootState } from "../store/store";
import { openModal } from "../slices/modalSlice";
const PriceBox = () => {
  const { total } = useSelector((state: RootState): CartState => state.cart);
  const dispatch = useDispatch();
  const handleClear = () => {
    dispatch(openModal());
  };
  return (
    <div className="flex justify-center items-center">
      <h2 className=" p-4 text-xl font-bold bg-gray-100 rounded-md ">
        총 가격: {total}원
      </h2>
      <button
        onClick={handleClear}
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-300 cursor-pointer h-15 ml-4"
      >
        초기화
      </button>
    </div>
  );
};

export default PriceBox;
