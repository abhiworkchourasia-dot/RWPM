import React, { useState } from 'react';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2ProgressDetail from './steps/Step2ProgressDetail';
import Step3MaterialDetail from './steps/Step3MaterialDetail';
import Step4Manpower from './steps/Step4Manpower';
import Step5Machinery from './steps/Step5Machinery';
import Step6Inspection from './steps/Step6Inspection';
import Step7Review from './steps/Step7Review';
import FormProgressBar from './components/FormProgressBar';
import './CreateReport.css';

const STEPS = [
    'Basic Info',
    'Progress Detail',
    'Material Detail',
    'Manpower',
    'Machinery',
    'Inspection',
    'Review'
];

const CreateReport = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        progressItems: [{ id: Date.now(), workDescription: '', doneTillToday: '' }],
        materialDetails: [{ id: Date.now(), name: '', quantity: '' }],
        manpowerItems: [
            { id: '1', category: 'Skilled Labor', count: '' },
            { id: '2', category: 'Unskilled Labor', count: '' },
            { id: '3', category: 'Supervisors', count: '' }
        ],
        machineryItems: [
            { id: '1', machineryName: 'Crane', count: '' },
            { id: '2', machineryName: 'Tower Wagon', count: '' }
        ],
        instructions: '',
        safetyDeclared: false
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        const props = { next: nextStep, prev: prevStep, formData, setFormData };
        switch (currentStep) {
            case 1: return <Step1BasicInfo {...props} />;
            case 2: return <Step2ProgressDetail {...props} />;
            case 3: return <Step3MaterialDetail {...props} />;
            case 4: return <Step4Manpower {...props} />;
            case 5: return <Step5Machinery {...props} />;
            case 6: return <Step6Inspection {...props} />;
            case 7: return <Step7Review {...props} />;
            default: return null;
        }
    };

    return (
        <div className="create-report-container animate-fade-in">
            <div className="form-header">
                <h1 className="page-title">Daily Progress Report</h1>
                <p className="subtitle">Step-wise digital workflow for site engineering logs.</p>
            </div>

            <FormProgressBar steps={STEPS} currentStep={currentStep} />

            <div className="step-content-wrapper glass-panel">
                {renderStep()}
            </div>
        </div>
    );
};

export default CreateReport;
