import React from "react";
import {GeminiResponse} from "../lib/auth"

interface Props {
  data: GeminiResponse;
}

const CareerPathsDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data?.career_paths?.map((path, idx) => (
        <div key={idx} className="p-4 border rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-2">{path.title}</h2>
          
          <div className="mb-2">
            <strong>Suggested Job Titles:</strong> {path.suggested_job_titles.join(", ")}
          </div>
          
          <div className="mb-2">
            <strong>Required Skills:</strong>
            <ul className="list-disc list-inside">
              <li>
                <strong>Existing:</strong> {path.required_skills.existing.join(", ")}
              </li>
              <li>
                <strong>To Develop:</strong> {path.required_skills.to_develop.join(", ")}
              </li>
            </ul>
          </div>

          <div className="mb-2">
            <strong>Next Steps:</strong>
            <ol className="list-decimal list-inside">
              {path.next_steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <strong>Industries:</strong> {path.industries.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerPathsDisplay;
