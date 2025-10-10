import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <NavBar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default HomeLayout;