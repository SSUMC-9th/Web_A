import { useReducer, useState, type ChangeEvent } from "react";

const initialState: IState = {
    department: 'SW Developer',
    error: null,
}

interface IState {
    department: string;
    error: string|null;
}

interface IAction {
    type: 'CHANGE_DEPARTMENT' | 'RESET';
    payload?: string;
}

function reducer(state: IState, action: IAction) {
    const {type, payload} = action;

    switch (type) {
        case "CHANGE_DEPARTMENT": {
            const newDepartment = payload;
            const hasError = newDepartment !== '카드메이커';
            return {
                ...state,
                department: hasError ? state.department : newDepartment,
                error: hasError ? '거부권 행사. 카드메이커만 입력 가능합니다.' : null,
            }
        }
        case "RESET": {
            return initialState
        }
        default:
            return state;
    }
}
export default function UseReducerCompany() {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [department, setDepartment] = useState('');

    const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value)
    }

    return (
        <div className="bg-gray-300 p-4 flex flex-col justify-center items-center mt-30">
            <h1 className="text-3xl text-pink-800 font-extrabold">{state.department}</h1>
            {state.error && <p className="text-red-500 text-2xl">{state.error}</p>}
            <input
                className="w-full mt-3 border rounded p-1 bg-gray-400"
                placeholder="변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
                value={department}
                onChange={handleChangeDepartment}
            />
            <button
                onClick={() =>
                    dispatch({
                        type: 'CHANGE_DEPARTMENT',
                        payload: department
                    })
                }
                className="border rounded mt-2 w-30 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 cursor-pointer"
            >
                직무 변경하기
            </button>
            <button
                onClick={() =>
                    dispatch({ type: 'RESET'})
                }
                className="border rounded mt-2 w-30 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 cursor-pointer"
            >
                RESET
            </button>
        </div>
    )
}