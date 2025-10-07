import { getMyInfo } from "../apis/auth";
import { useEffect } from "react";

const MyPage = () => {
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
        };
        getData();
    }, []);
  return <div>MyPage</div>;
};

export default MyPage;