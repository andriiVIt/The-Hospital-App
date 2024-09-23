import React, { useEffect, useState } from 'react';
import { apiClient } from '../apiClient';
import { Patients } from '../Api';
import { Link } from "react-router-dom";

const PatientsList = () => {
    const [patients, setPatients] = useState<Patients[]>([]);

    useEffect(() => {
        apiClient.patients.patientsList()
            .then(response => setPatients(response.data))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6 text-center">Patients List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {patients.map(patient => (
                    <div key={patient.id} className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-bold mb-2">{patient.name}</h2>
                        <p className="text-gray-600">ID: {patient.id}</p>
                        <Link to={`/patients/${patient.id}`} className="text-blue-500 mt-4 inline-block">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientsList;
