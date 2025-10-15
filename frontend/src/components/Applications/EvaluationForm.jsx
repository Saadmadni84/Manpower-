import React, { useState } from 'react';

const EvaluationForm = ({ application, onSubmit, onClose }) => {
  const [evaluation, setEvaluation] = useState({
    overallRating: 3,
    technicalRating: 3,
    communicationRating: 3,
    cultureFitRating: 3,
    notes: '',
    strengths: [],
    weaknesses: [],
    recommendation: 'maybe'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(evaluation);
  };

  return (
    <div className="evaluation-form">
      <h3>Evaluate Candidate</h3>
      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <label>Overall Rating: {evaluation.overallRating}/5</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.overallRating}
            onChange={(e) => setEvaluation({ ...evaluation, overallRating: parseInt(e.target.value) })}
          />
        </div>

        <div className="rating-section">
          <label>Technical Skills: {evaluation.technicalRating}/5</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.technicalRating}
            onChange={(e) => setEvaluation({ ...evaluation, technicalRating: parseInt(e.target.value) })}
          />
        </div>

        <div className="rating-section">
          <label>Communication: {evaluation.communicationRating}/5</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.communicationRating}
            onChange={(e) => setEvaluation({ ...evaluation, communicationRating: parseInt(e.target.value) })}
          />
        </div>

        <div className="rating-section">
          <label>Culture Fit: {evaluation.cultureFitRating}/5</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.cultureFitRating}
            onChange={(e) => setEvaluation({ ...evaluation, cultureFitRating: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Recommendation</label>
          <select
            value={evaluation.recommendation}
            onChange={(e) => setEvaluation({ ...evaluation, recommendation: e.target.value })}
          >
            <option value="strongly_recommend">Strongly Recommend</option>
            <option value="recommend">Recommend</option>
            <option value="maybe">Maybe</option>
            <option value="not_recommend">Not Recommend</option>
            <option value="reject">Reject</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="4"
            value={evaluation.notes}
            onChange={(e) => setEvaluation({ ...evaluation, notes: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Submit Evaluation</button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;

