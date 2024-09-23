import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DevTools } from "jotai-devtools";
import { useAtom } from "jotai";
import { ThemeAtom } from "../atoms/ThemeAtom";
import Navigation from "./Navigation";
import Home from "./Home";
import PatientsList from "./PatientsList";
import PatientDetails from "./PatientDetails";
import AddPatient from "./AddPatient";

const App = () => {

    const [theme, setTheme] = useAtom(ThemeAtom);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <>
            <header className="text-center my-4">
                <h1 className="text-5xl font-bold">The Hospital App</h1>
            </header>
            <Navigation />
            <Toaster />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/patients" element={<PatientsList />} />
                    <Route path="/patients/:id" element={<PatientDetails />} />
                    <Route path="/add-patient" element={<AddPatient />} />
                </Routes>
            </div>
            <DevTools />
        </>
    );
}

export default App;
