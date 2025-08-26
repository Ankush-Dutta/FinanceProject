import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CreditCard, Plus, Trash2, Building, Car, GraduationCap, Home } from 'lucide-react';

const LoanManagement: React.FC = () => {
  const { loans, addLoan, removeLoan } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'personal',
    bank: 'SBI',
    amount: '',
    interestRate: '',
    tenure: '',
  });

  const loanTypes = {
    personal: { name: 'Personal Loan', icon: CreditCard, color: 'bg-blue-500' },
    home: { name: 'Home Loan', icon: Home, color: 'bg-green-500' },
    car: { name: 'Car Loan', icon: Car, color: 'bg-red-500' },
    education: { name: 'Education Loan', icon: GraduationCap, color: 'bg-purple-500' },
  };

  const banks = [
    { name: 'SBI', rates: { personal: 11.5, home: 8.5, car: 9.5, education: 8.0 } },
    { name: 'HDFC', rates: { personal: 11.0, home: 8.75, car: 9.25, education: 8.5 } },
    { name: 'ICICI', rates: { personal: 10.75, home: 8.65, car: 9.15, education: 8.25 } },
    { name: 'Axis Bank', rates: { personal: 11.25, home: 8.8, car: 9.4, education: 8.75 } },
    { name: 'PNB', rates: { personal: 11.75, home: 8.9, car: 9.6, education: 8.1 } },
    { name: 'Kotak', rates: { personal: 10.99, home: 8.7, car: 9.3, education: 8.6 } },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-update interest rate based on bank and loan type
      if (name === 'bank' || name === 'type') {
        const bank = banks.find(b => b.name === (name === 'bank' ? value : newData.bank));
        if (bank) {
          newData.interestRate = bank.rates[newData.type as keyof typeof bank.rates].toString();
        }
      }
      
      return newData;
    });
  };

  const calculateEMI = (amount: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const rate = parseFloat(formData.interestRate);
    const tenure = parseInt(formData.tenure);
    
    const emi = calculateEMI(amount, rate, tenure);
    
    addLoan({
      type: formData.type,
      bank: formData.bank,
      amount,
      interestRate: rate,
      tenure,
      emi,
    });

    setFormData({ type: 'personal', bank: 'SBI', amount: '', interestRate: '', tenure: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Loan
        </button>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
              </p>
            </div>
            <Building className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{loans.reduce((sum, loan) => sum + loan.emi, 0).toLocaleString()}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Add Loan Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Loan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(loanTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank
                </label>
                <select
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {banks.map(bank => (
                    <option key={bank.name} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenure (months)
                </label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="60"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map((loan) => {
          const loanType = loanTypes[loan.type as keyof typeof loanTypes];
          const Icon = loanType.icon;
          
          return (
            <div key={loan.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${loanType.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{loanType.name}</h3>
                    <p className="text-sm text-gray-600">{loan.bank}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeLoan(loan.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold">₹{loan.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-semibold">{loan.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-semibold">{loan.tenure} months</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Monthly EMI</span>
                  <span className="font-bold text-blue-600">₹{loan.emi.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Loans Added</h3>
          <p className="text-gray-600 mb-4">Add your first loan to start tracking your EMIs</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;