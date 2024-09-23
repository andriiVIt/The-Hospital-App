import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

export default function Navigation() {
    return (
        <div className="navbar bg-base-100 h-16 min-h-[4rem]">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case text-xl">Home</Link>
                <Link to="/patients" className="btn btn-ghost normal-case text-xl">Patients</Link>
                <Link to="/add-patient" className="btn btn-ghost normal-case text-xl">Add Patient</Link>
            </div>
            <div className="flex-none">
                <ThemeSwitcher />
            </div>
        </div>
    );
}
