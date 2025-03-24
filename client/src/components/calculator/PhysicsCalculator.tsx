
import { useState } from "react";
import { motion } from "framer-motion";

interface FormulaType {
  name: string;
  formula: string;
  variables: { [key: string]: string };
  calculate: (inputs: { [key: string]: number }) => number;
}

const physicsFormulas: FormulaType[] = [
  // Mechanics
  {
    name: "Velocity",
    formula: "v = d/t",
    variables: { d: "distance (m)", t: "time (s)" },
    calculate: (inputs) => inputs.d / inputs.t
  },
  {
    name: "Acceleration",
    formula: "a = (v-u)/t",
    variables: { v: "final velocity (m/s)", u: "initial velocity (m/s)", t: "time (s)" },
    calculate: (inputs) => (inputs.v - inputs.u) / inputs.t
  },
  {
    name: "Force",
    formula: "F = ma",
    variables: { m: "mass (kg)", a: "acceleration (m/s²)" },
    calculate: (inputs) => inputs.m * inputs.a
  },
  {
    name: "Work",
    formula: "W = Fd",
    variables: { F: "force (N)", d: "distance (m)" },
    calculate: (inputs) => inputs.F * inputs.d
  },
  {
    name: "Kinetic Energy",
    formula: "KE = ½mv²",
    variables: { m: "mass (kg)", v: "velocity (m/s)" },
    calculate: (inputs) => 0.5 * inputs.m * Math.pow(inputs.v, 2)
  },
  {
    name: "Potential Energy",
    formula: "PE = mgh",
    variables: { m: "mass (kg)", g: "gravity (9.81)", h: "height (m)" },
    calculate: (inputs) => inputs.m * 9.81 * inputs.h
  },
  {
    name: "Power",
    formula: "P = W/t",
    variables: { W: "work (J)", t: "time (s)" },
    calculate: (inputs) => inputs.W / inputs.t
  },
  // Thermodynamics
  {
    name: "Heat Energy",
    formula: "Q = mcΔT",
    variables: { m: "mass (kg)", c: "specific heat (J/kg·K)", T: "temperature change (K)" },
    calculate: (inputs) => inputs.m * inputs.c * inputs.T
  },
  // Waves
  {
    name: "Wave Speed",
    formula: "v = fλ",
    variables: { f: "frequency (Hz)", λ: "wavelength (m)" },
    calculate: (inputs) => inputs.f * inputs.λ
  },
  // Electricity
  {
    name: "Ohm's Law",
    formula: "V = IR",
    variables: { I: "current (A)", R: "resistance (Ω)" },
    calculate: (inputs) => inputs.I * inputs.R
  },
  {
    name: "Electrical Power",
    formula: "P = VI",
    variables: { V: "voltage (V)", I: "current (A)" },
    calculate: (inputs) => inputs.V * inputs.I
  },
  // Circular Motion
  {
    name: "Centripetal Force",
    formula: "F = mv²/r",
    variables: { m: "mass (kg)", v: "velocity (m/s)", r: "radius (m)" },
    calculate: (inputs) => inputs.m * Math.pow(inputs.v, 2) / inputs.r
  },
  // Pressure
  {
    name: "Pressure",
    formula: "P = F/A",
    variables: { F: "force (N)", A: "area (m²)" },
    calculate: (inputs) => inputs.F / inputs.A
  },
  // Momentum
  {
    name: "Momentum",
    formula: "p = mv",
    variables: { m: "mass (kg)", v: "velocity (m/s)" },
    calculate: (inputs) => inputs.m * inputs.v
  },
  // Springs
  {
    name: "Spring Force",
    formula: "F = kx",
    variables: { k: "spring constant (N/m)", x: "displacement (m)" },
    calculate: (inputs) => inputs.k * inputs.x
  },
  // Fluid Mechanics
  {
    name: "Density",
    formula: "ρ = m/V",
    variables: { m: "mass (kg)", V: "volume (m³)" },
    calculate: (inputs) => inputs.m / inputs.V
  },
  // Optics
  {
    name: "Lens Power",
    formula: "P = 1/f",
    variables: { f: "focal length (m)" },
    calculate: (inputs) => 1 / inputs.f
  },
  // Nuclear Physics
  {
    name: "Mass-Energy",
    formula: "E = mc²",
    variables: { m: "mass (kg)" },
    calculate: (inputs) => inputs.m * Math.pow(299792458, 2)
  },
  // Gravitational Force
  {
    name: "Gravity Force",
    formula: "F = GM₁M₂/r²",
    variables: { M1: "mass 1 (kg)", M2: "mass 2 (kg)", r: "distance (m)" },
    calculate: (inputs) => (6.67430e-11 * inputs.M1 * inputs.M2) / Math.pow(inputs.r, 2)
  },
  // Sound
  {
    name: "Sound Intensity",
    formula: "I = P/A",
    variables: { P: "power (W)", A: "area (m²)" },
    calculate: (inputs) => inputs.P / inputs.A
  }
];

const PhysicsCalculator = () => {
  const [selectedFormula, setSelectedFormula] = useState<FormulaType | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<number | null>(null);

  const handleInputChange = (variable: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [variable]: parseFloat(value) || 0
    }));
  };

  const calculateResult = () => {
    if (!selectedFormula) return;
    const result = selectedFormula.calculate(inputs);
    setResult(result);
  };

  return (
    <div className="bg-navy-light p-6 rounded-lg shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {physicsFormulas.map((formula) => (
          <button
            key={formula.name}
            onClick={() => {
              setSelectedFormula(formula);
              setInputs({});
              setResult(null);
            }}
            className={`p-3 rounded-md text-sm font-semibold transition-all ${
              selectedFormula?.name === formula.name
                ? 'bg-gold text-navy'
                : 'bg-navy-light text-gold hover:bg-gold/20'
            }`}
          >
            {formula.name}
          </button>
        ))}
      </div>

      {selectedFormula && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy-lighter p-4 rounded-lg"
        >
          <h3 className="text-gold text-lg font-semibold mb-2">{selectedFormula.formula}</h3>
          <div className="grid gap-4 mb-4">
            {Object.entries(selectedFormula.variables).map(([key, label]) => (
              <div key={key}>
                <label className="text-gray-300 text-sm mb-1 block">{label}</label>
                <input
                  type="number"
                  value={inputs[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full bg-navy p-2 rounded border border-gray-700 text-white"
                  placeholder="Enter value"
                />
              </div>
            ))}
          </div>
          <button
            onClick={calculateResult}
            className="w-full bg-gold text-navy py-2 rounded-md font-semibold hover:bg-gold/90 transition"
          >
            Calculate
          </button>
          {result !== null && (
            <div className="mt-4 text-center">
              <span className="text-gold font-semibold">Result: </span>
              <span className="text-white">{result.toFixed(2)}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PhysicsCalculator;
