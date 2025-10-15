import React from 'react';
import './StatusPipeline.css';

const StatusPipeline = ({ currentStatus, onStatusChange }) => {
  const stages = [
    { id: 'submitted', label: 'Submitted', icon: '📝' },
    { id: 'screening', label: 'Screening', icon: '🔍' },
    { id: 'interview_scheduled', label: 'Interview', icon: '📅' },
    { id: 'interviewed', label: 'Interviewed', icon: '✅' },
    { id: 'technical_test', label: 'Tech Test', icon: '💻' },
    { id: 'reference_check', label: 'References', icon: '📞' },
    { id: 'offer_made', label: 'Offer', icon: '💼' },
    { id: 'hired', label: 'Hired', icon: '🎉' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === currentStatus);
  };

  const currentIndex = getCurrentStageIndex();

  const handleStageClick = (stageId, index) => {
    if (onStatusChange && index <= currentIndex + 1) {
      onStatusChange(stageId);
    }
  };

  return (
    <div className="status-pipeline">
      <div className="pipeline-track">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = index <= currentIndex + 1;

          return (
            <div
              key={stage.id}
              className={`pipeline-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => handleStageClick(stage.id, index)}
            >
              <div className="stage-icon">
                {isCompleted ? '✓' : stage.icon}
              </div>
              <div className="stage-label">{stage.label}</div>
              {index < stages.length - 1 && (
                <div className={`stage-connector ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional status options */}
      <div className="additional-statuses">
        <button
          className="status-btn rejected"
          onClick={() => onStatusChange && onStatusChange('rejected')}
        >
          ❌ Reject
        </button>
        <button
          className="status-btn withdrawn"
          onClick={() => onStatusChange && onStatusChange('withdrawn')}
        >
          ⏸️ Withdrawn
        </button>
      </div>
    </div>
  );
};

export default StatusPipeline;

