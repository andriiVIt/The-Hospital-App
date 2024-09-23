import React, { useState, useEffect } from 'react';
import { apiClient } from '../apiClient';
import { Patients, Diagnoses, Diseases } from '../Api';

const Home = () => {
    const [totalPatients, setTotalPatients] = useState<number>(0);
    const [patientHistory, setPatientHistory] = useState<Patients[]>([]);
    const [recentlyUpdatedPatients, setRecentlyUpdatedPatients] = useState<number>(0);
    const [diagnosesRecorded, setDiagnosesRecorded] = useState<number>(0);
    const [diseases, setDiseases] = useState<Diseases[]>([]);

    useEffect(() => {
        // Запит для отримання списку пацієнтів з діагнозами
        apiClient.patients.patientsList({ order: 'id.desc', select: '*,diagnoses(*)' })
            .then(response => {
                const patients = response.data;
                setTotalPatients(patients.length);
                setPatientHistory(patients);

                // Логіка для визначення кількості пацієнтів, чиї дані були змінені за останній тиждень
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const updatedPatients = patients.filter(patient => {
                    const updatedAtDate = new Date(patient.updated_at);
                    return updatedAtDate > oneWeekAgo;
                });

                setRecentlyUpdatedPatients(updatedPatients.length);
            })
            .catch(error => console.error('Error fetching patients:', error));

        // Запит для отримання кількості діагнозів
        apiClient.diagnoses.diagnosesList()
            .then(response => {
                const diagnoses = response.data;
                setDiagnosesRecorded(diagnoses.length);
            })
            .catch(error => console.error('Error fetching diagnoses:', error));

        // Запит для отримання списку захворювань
        apiClient.diseases.diseasesList()
            .then(response => {
                setDiseases(response.data);
            })
            .catch(error => console.error('Error fetching diseases:', error));
    }, []);

    const getDiagnosisName = (diagnosis: Diagnoses) => {
        const disease = diseases.find(d => d.id === diagnosis.disease_id);
        return disease ? disease.name : 'Unknown Disease';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6 text-center">Welcome to The Hospital App</h1>
            <p className="text-lg mb-4 text-center">
                This application allows you to manage patient records, diagnoses, and more efficiently.
                Use the navigation above to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-500 text-black p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold">Total Patients</h2>
                    <p className="text-3xl font-semibold mt-4">{totalPatients}</p>
                </div>
                <div className="bg-green-500 text-black p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold">Recently Updated Patients</h2>
                    <p className="text-3xl font-semibold mt-4">{recentlyUpdatedPatients}</p>
                </div>
                <div className="bg-green-500 text-black p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold">Diagnoses Recorded</h2>
                    <p className="text-3xl font-semibold mt-4">{diagnosesRecorded}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Recent Patient Additions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patientHistory.length > 0 ? (
                    patientHistory.map(patient => (
                        <div key={patient.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold">{patient.name}</h3>
                            <p className="text-gray-600">
                                Diagnosis: {patient.diagnoses && patient.diagnoses.length > 0 ? getDiagnosisName(patient.diagnoses[0]) : 'No Diagnosis'}
                            </p>
                            <p className="text-gray-600">ID: {patient.id}</p>
                        </div>
                    ))
                ) : (
                    <p>No recent patient additions available.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
