import { useState } from "react";
import "./StepSlider.css";

export default function StepSlider({
  name,
  steps,
  min,
  max,
  unit,
  value,
  handleUpdate,
}: {
  name: string;
  steps: number[];
  min: number;
  max: number;
  unit: string;
  value: number;
  handleUpdate: (value: number) => void;
}) {
  const [stepPosition, setStepPosition] = useState(
    steps.find((step) => step === value) || 0
  );

  function handlePositionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setStepPosition(value);
    handleUpdate(steps[value]);
  }

  return (
    <div className="slider-container">
      <p>
        {min}
        {unit}
      </p>
      <div className="slider">
        <input
          name={name}
          id={name}
          className="step-range"
          type="range"
          min={0}
          max={steps.length - 1}
          value={stepPosition}
          onChange={handlePositionChange}
        />
        {/* notches */}
        <div className="notches-container">
          {steps.map((value) => (
            <div className="notch" key={value}></div>
          ))}
        </div>
      </div>
      <p>
        {max}
        {unit}
      </p>
    </div>
  );
}
