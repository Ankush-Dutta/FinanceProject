import React, { useMemo, useState } from "react";
import { Calculator, FileText, TrendingUp, Info } from "lucide-react";

/**
 * Indian Income Tax Calculator (FY 2024-25 / AY 2025-26 style)
 * - New Regime (default): slabs 0–3L:0%, 3–6L:5%, 6–9L:10%, 9–12L:15%, 12–15L:20%, >15L:30%
 *   • Standard deduction ₹50,000 (salaried)
 *   • §87A rebate: taxable income ≤ ₹7,00,000 → tax = 0 (simple rule)
 *   • Most exemptions/deductions (HRA, LTA, 80C, etc.) NOT allowed → we disable them in UI
 *   • Surcharge cap 25% (instead of 37%)
 *
 * - Old Regime:
 *   • Common slabs: 0–2.5L:0%, 2.5–5L:5%, 5–10L:20%, >10L:30%
 *   • Deductions/exemptions allowed (HRA, LTA, 80C, 80E, home loan interest up to ₹2L, etc.)
 *   • §87A rebate: taxable income ≤ ₹5,00,000 → tax = 0
 *   • Surcharge up to 37% based on thresholds
 */

type Regime = "new" | "old";

type Form = {
  annualIncome: string;           // Gross salary income
  isSalaried: boolean;            // to enable standard deduction
  // Deductions/Exemptions inputs (apply only in old regime)
  investments80C: string;         // 80C (PF/ELSS/LIC etc.) cap 1.5L; LIC also falls here
  hra: string;                    // HRA exemption (from employer calc) – user-entered
  lta: string;                    // LTA exemption – user-entered
  medicalReimbursement: string;   // typically part of CTC; old regime only
  educationLoan80E: string;       // 80E – interest (no cap, but time-limited; we take entered value)
  homeLoanInt24B: string;         // Section 24(b) self-occupied cap 2L
  lifeInsurance: string;          // often under 80C; we’ll merge into 80C cap
};

type Result = {
  regime: Regime;
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  monthlyTax: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
};

const INR = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

const parseN = (s: string) => (isNaN(parseFloat(s)) ? 0 : Math.max(0, parseFloat(s)));

const STANDARD_DEDUCTION = 50_000;  // salaried
const OLD_80C_CAP = 150_000;        // includes LIC etc.
const OLD_HOME_INT_CAP = 200_000;   // Section 24(b) cap for self-occupied

const calcNewRegimeTax = (taxable: number) => {
  // slabs: 0–3L:0, 3–6L:5%, 6–9L:10%, 9–12L:15%, 12–15L:20%, >15L:30%
  let tax = 0;
  const slabs = [
    { upTo: 300_000, rate: 0 },
    { upTo: 600_000, rate: 0.05 },
    { upTo: 900_000, rate: 0.10 },
    { upTo: 1_200_000, rate: 0.15 },
    { upTo: 1_500_000, rate: 0.20 },
    { upTo: Infinity, rate: 0.30 },
  ];
  let last = 0;
  for (const s of slabs) {
    const span = Math.max(0, Math.min(taxable, s.upTo) - last);
    tax += span * s.rate;
    if (taxable <= s.upTo) break;
    last = s.upTo;
  }
  // §87A rebate (simple): taxable ≤ 7L → tax = 0 (before surcharge/cess)
  if (taxable <= 700_000) tax = 0;
  return tax;
};

const calcOldRegimeTax = (taxable: number) => {
  // slabs: 0–2.5L:0, 2.5–5L:5%, 5–10L:20%, >10L:30%
  let tax = 0;
  const slabs = [
    { upTo: 250_000, rate: 0 },
    { upTo: 500_000, rate: 0.05 },
    { upTo: 1_000_000, rate: 0.20 },
    { upTo: Infinity, rate: 0.30 },
  ];
  let last = 0;
  for (const s of slabs) {
    const span = Math.max(0, Math.min(taxable, s.upTo) - last);
    tax += span * s.rate;
    if (taxable <= s.upTo) break;
    last = s.upTo;
  }
  // §87A rebate (old): taxable ≤ 5L → tax = 0
  if (taxable <= 500_000) tax = 0;
  return tax;
};

const calcSurcharge = (regime: Regime, income: number, baseTax: number) => {
  // Thresholds by total income
  // > 50L: 10%, > 1Cr: 15%, > 2Cr: 25%, > 5Cr: 37% (old) or 25% (new regime cap)
  let rate = 0;
  if (income > 50_00_000 && income <= 1_00_00_000) rate = 0.10;
  else if (income > 1_00_00_000 && income <= 2_00_00_000) rate = 0.15;
  else if (income > 2_00_00_000 && income <= 5_00_00_000) rate = 0.25;
  else if (income > 5_00_00_000) rate = regime === "new" ? 0.25 : 0.37;

  return baseTax * rate;
};

const TaxCalculation: React.FC = () => {
  const [regime, setRegime] = useState<Regime>("new");
  const [form, setForm] = useState<Form>({
    annualIncome: "",
    isSalaried: true,
    investments80C: "",
    hra: "",
    lta: "",
    medicalReimbursement: "",
    educationLoan80E: "",
    homeLoanInt24B: "",
    lifeInsurance: "",
  });

  const [result, setResult] = useState<Result | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const disabledInNew = regime === "new";

  const doCalculate = () => {
    const income = parseN(form.annualIncome);
    const salariedStd = form.isSalaried ? STANDARD_DEDUCTION : 0;

    // --- DEDUCTIONS ---
    let totalDeductions = 0;

    if (regime === "old") {
      // Merge LIC into 80C and cap to ₹1.5L
      const in80cRaw = parseN(form.investments80C) + parseN(form.lifeInsurance);
      const in80c = Math.min(in80cRaw, OLD_80C_CAP);

      // Home loan interest cap for self-occupied
      const homeInt = Math.min(parseN(form.homeLoanInt24B), OLD_HOME_INT_CAP);

      // Other exemptions/deductions as entered by user
      const hra = parseN(form.hra);
      const lta = parseN(form.lta);
      const med = parseN(form.medicalReimbursement);
      const eduLoan = parseN(form.educationLoan80E);

      totalDeductions =
        in80c + homeInt + hra + lta + med + eduLoan + salariedStd;
    } else {
      // NEW REGIME: only standard deduction (for salaried) is considered here.
      totalDeductions = salariedStd;
    }

    const taxableIncome = Math.max(0, income - totalDeductions);

    // --- TAX ---
    const baseTax =
      regime === "new"
        ? calcNewRegimeTax(taxableIncome)
        : calcOldRegimeTax(taxableIncome);

    const surcharge = calcSurcharge(regime, income, baseTax);
    const taxPlusSurcharge = baseTax + surcharge;
    const cess = taxPlusSurcharge * 0.04; // Health & Education Cess
    const totalTax = taxPlusSurcharge + cess;

    const res: Result = {
      regime,
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      baseTax,
      surcharge,
      cess,
      totalTax,
      monthlyTax: totalTax / 12,
      takeHomeAnnual: income - totalTax,
      takeHomeMonthly: (income - totalTax) / 12,
    };
    setResult(res);
  };

  const helpNote = useMemo(() => {
    return regime === "new"
      ? "New regime (default): Only the standard deduction (₹50,000 for salaried) is generally allowed. HRA, LTA, 80C, etc. are not allowed."
      : "Old regime: Most deductions/exemptions (80C, HRA, LTA, 80E, home loan interest up to ₹2L, etc.) are allowed. §87A rebate up to ₹5L.";
  }, [regime]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Income Tax Calculator (India)</h1>
        <Calculator className="h-8 w-8 text-blue-600" />
      </div>

      {/* Regime Switch */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Tax Regime</label>
          <select
            name="regime"
            value={regime}
            onChange={(e) => setRegime(e.target.value as Regime)}
            className="border rounded-md px-3 py-2"
          >
            <option value="new">New Regime (default)</option>
            <option value="old">Old Regime</option>
          </select>
          <label className="flex items-center gap-2 text-sm ml-2">
            <input
              type="checkbox"
              name="isSalaried"
              checked={form.isSalaried}
              onChange={handleChange}
            />
            Salaried (apply ₹50,000 standard deduction)
          </label>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-700">
          <Info className="h-4 w-4 mt-0.5" />
          <span>{helpNote}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Income & Deductions
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Gross Income (₹)
              </label>
              <input
                type="number"
                name="annualIncome"
                value={form.annualIncome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="1200000"
              />
            </div>

            {/* Section: Deductions allowed only under old regime */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${disabledInNew ? "opacity-60" : ""}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  80C Investments (₹) (PF/ELSS/PPF/LIC) — cap 1.5L
                </label>
                <input
                  type="number"
                  name="investments80C"
                  value={form.investments80C}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="150000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Life Insurance Premium (₹) — counts under 80C cap
                </label>
                <input
                  type="number"
                  name="lifeInsurance"
                  value={form.lifeInsurance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HRA Exemption (₹)
                </label>
                <input
                  type="number"
                  name="hra"
                  value={form.hra}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LTA Exemption (₹)
                </label>
                <input
                  type="number"
                  name="lta"
                  value={form.lta}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Loan Interest (₹) — 80E
                </label>
                <input
                  type="number"
                  name="educationLoan80E"
                  value={form.educationLoan80E}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Loan Interest (₹) — Sec 24(b) cap 2L
                </label>
                <input
                  type="number"
                  name="homeLoanInt24B"
                  value={form.homeLoanInt24B}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Reimbursement (₹)
                </label>
                <input
                  type="number"
                  name="medicalReimbursement"
                  value={form.medicalReimbursement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={disabledInNew}
                  placeholder="15000"
                />
              </div>
            </div>

            <button
              onClick={doCalculate}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Calculate Tax
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tax Calculation Results
          </h2>

          {result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Regime</div>
                  <div className="text-xl font-bold text-blue-700 uppercase">{result.regime}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Gross Annual Income</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {INR(result.grossIncome)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Deductions</div>
                  <div className="text-2xl font-bold text-green-700">
                    {INR(result.totalDeductions)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Taxable Income</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {INR(result.taxableIncome)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Income Tax (before surcharge & cess)</span>
                  <span className="font-semibold">{INR(result.baseTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Surcharge</span>
                  <span className="font-semibold">{INR(result.surcharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health & Education Cess (4%)</span>
                  <span className="font-semibold">{INR(result.cess)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Tax Payable</span>
                  <span className="font-bold text-red-600">{INR(result.totalTax)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-lg font-semibold text-gray-900 mb-4">Take Home (Post-Tax)</div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Take Home</span>
                    <span className="font-bold text-green-700 text-lg">{INR(result.takeHomeAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Take Home</span>
                    <span className="font-bold text-green-700 text-lg">{INR(result.takeHomeMonthly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Tax</span>
                    <span className="font-semibold text-red-600">{INR(result.monthlyTax)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-900">
                <strong>Note:</strong> This is a simplified calculator for salary income. Actual tax may vary based on latest Finance Act rules, exemptions, special income (capital gains/lottery), and employer payroll treatment.
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Enter details and click "Calculate Tax" to see your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculation;
