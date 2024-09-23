import React, { useState } from 'react';
import { apiClient } from '../apiClient';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPatient = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        apiClient.patients.patientsCreate({
            name: name.trim()
        })
            .then(() => {
                toast.success('Patient added successfully!');
                setTimeout(() => {
                    navigate('/patients');
                }, 3000); // Затримка перед перенаправленням на 3 секунди
            })
            .catch(error => {
                toast.error('Failed to add patient!');
                console.error('Error creating patient:', error);
            });
    };

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={1000} />
            <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Patient
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddPatient;
