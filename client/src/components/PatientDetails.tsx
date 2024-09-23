import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../apiClient';
import { Patients, Diagnoses, Diseases } from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
interface PatientDetailsType extends Patients {
    diagnoses?: (Diagnoses & { disease_name?: string })[];
}
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const PatientDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<PatientDetailsType | null>(null);
    const [newName, setNewName] = useState('');
    const [diseases, setDiseases] = useState<Diseases[]>([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [currentDisease, setCurrentDisease] = useState<string | null>(null);
    const [newDiseaseName, setNewDiseaseName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                if (id) {
                    const response = await apiClient.patients.patientsList({ id: `eq.${id}`, select: '*,diagnoses(*)' });
                    const patientData = response.data[0];

                    const diseasesResponse = await apiClient.diseases.diseasesList();
                    const diseaseList = diseasesResponse.data;
                    setDiseases(diseaseList);

                    const diagnosesWithNames = patientData.diagnoses?.map(diagnosis => {
                        const diseaseName = diseaseList.find(disease => disease.id === diagnosis.disease_id)?.name || 'Unknown Disease';
                        return { ...diagnosis, disease_name: diseaseName };
                    });

                    setPatient({ ...patientData, diagnoses: diagnosesWithNames });

                    if (diagnosesWithNames && diagnosesWithNames.length > 0) {
                        setCurrentDisease(diagnosesWithNames[diagnosesWithNames.length - 1].disease_name || null);
                    }

                    setNewName(patientData?.name || '');
                }
            } catch (error) {
                console.error('Error fetching patient or diseases data:', error);
            }
        };

        fetchPatientData();
    }, [id]);

    const handleUpdate = async () => {
        try {
            if (patient && patient.id) {
                await apiClient.patients.patientsPartialUpdate({ name: newName }, { id: `eq.${patient.id}` });
                setPatient({ ...patient, name: newName });
                toast.success('Name updated successfully!');
            }
        } catch (error) {
            toast.error('Failed to update name!');
            console.error('Error updating patient:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (patient && patient.id) {
                await apiClient.patients.patientsDelete({ id: `eq.${patient.id}` });
                toast.success('Patient deleted successfully!');
                setTimeout(() => {
                    navigate('/patients');
                }, 1000);
            }
        } catch (error) {
            toast.error('Failed to delete patient!');
            console.error('Error deleting patient:', error);
        }
    };

    const handleAddDiagnosis = async () => {
        try {
            if (patient && patient.id && selectedDisease) {
                await apiClient.diagnoses.diagnosesCreate({
                    patient_id: patient.id,
                    disease_id: parseInt(selectedDisease, 10),
                    diagnosis_date: new Date().toISOString(),
                });

                const response = await apiClient.patients.patientsList({ id: `eq.${id}`, select: '*,diagnoses(*)' });
                const updatedPatient = response.data[0];
                const diagnosesWithNames = updatedPatient.diagnoses?.map(diagnosis => {
                    const diseaseName = diseases.find(disease => disease.id === diagnosis.disease_id)?.name || 'Unknown Disease';
                    return { ...diagnosis, disease_name: diseaseName };
                });

                setPatient({ ...updatedPatient, diagnoses: diagnosesWithNames });

                if (diagnosesWithNames && diagnosesWithNames.length > 0) {
                    setCurrentDisease(diagnosesWithNames[diagnosesWithNames.length - 1].disease_name || null);
                }

                toast.success('Diagnosis added successfully!');
            }
        } catch (error) {
            toast.error('Failed to add diagnosis!');
            console.error('Error adding diagnosis:', error);
        }
    };

    const handleAddDisease = async () => {
        try {
            if (newDiseaseName.trim()) {
                await apiClient.diseases.diseasesCreate({ name: newDiseaseName.trim() });

                const response = await apiClient.diseases.diseasesList();
                setDiseases(response.data);
                setNewDiseaseName('');

                toast.success('New disease added successfully!');
            }
        } catch (error) {
            toast.error('Failed to add disease!');
            console.error('Error adding disease:', error);
        }
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="max-w-lg p-8 rounded-lg shadow-lg bg-[#f9f9e9]">
            <h1 className="text-4xl font-bold mb-4">{patient.name}</h1>
            <p className="text-lg mb-2"><strong>ID:</strong> {patient.id}</p>

            <p className="text-lg mb-4">
                <strong>Current Disease:</strong> {currentDisease || 'No diagnoses available'}
            </p>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-1">New Name:</label>
                <div className="flex">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="input input-bordered w-full max-w-xs mr-2"
                    />
                    <button
                        onClick={handleUpdate}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                    >
                        Update Name
                    </button>
                </div>
            </div>

            <button
                onClick={handleDelete}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mb-4"
            >
                Delete Patient
            </button>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-1">Add New Diagnosis:</label>
                <div className="flex">
                    <select
                        value={selectedDisease}
                        onChange={(e) => setSelectedDisease(e.target.value)}
                        className="input input-bordered w-full max-w-xs mr-2"
                    >
                        <option value="">Select Disease</option>
                        {diseases.map(disease => (
                            <option key={disease.id} value={disease.id}>{disease.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddDiagnosis}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                    >
                        Add Diagnosis
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-1">Add New Disease:</label>
                <div className="flex">
                    <input
                        type="text"
                        value={newDiseaseName}
                        onChange={(e) => setNewDiseaseName(e.target.value)}
                        className="input input-bordered w-full max-w-xs mr-2"
                    />
                    <button
                        onClick={handleAddDisease}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Add Disease
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mt-8">Diagnoses</h2>
                <ul className="list-disc list-inside mt-2">
                    {patient.diagnoses?.map(diagnosis => (
                        <li key={diagnosis.id}>
                            {diagnosis.disease_name} - Date: {diagnosis.diagnosis_date}
                        </li>
                    )) || <p>No diagnoses available.</p>}
                </ul>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default PatientDetails;
