import React from 'react';
import './FormProgressBar.css';
import { Check } from 'lucide-react';

const FormProgressBar = ({ steps, currentStep }) => {
    return (
        <div className="progress-bar-container">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={index} className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                        <div className="step-marker">
                            {isCompleted ? <Check size={16} /> : stepNumber}
                        </div>
                        <span className="step-label">{step}</span>
                        {index !== steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                );
            })}
        </div>
    );
};

export default FormProgressBar;
