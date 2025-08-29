// src/pages/AssetManagement.tsx
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { TrendingUp, Plus, Trash2, Wallet, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';

const AssetManagement: React.FC = () => {
  const { assets, liabilities, addAsset, addLiability, removeAsset, removeLiability } = useData();
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  
  const [assetForm, setAssetForm] = useState({
    type: 'savings',
    name: '',
    value: '',
    monthlyReturn: '',
  });

  const [liabilityForm, setLiabilityForm] = useState({
    type: 'credit_card',
    name: '',
    amount: '',
    monthlyPayment: '',
  });

  const assetTypes = {
    savings: { name: 'Savings Account', icon: Wallet, color: 'bg-green-500' },
    investment: { name: 'Investment', icon: TrendingUp, color: 'bg-blue-500' },
    fd: { name: 'Fixed Deposit', icon: PiggyBank, color: 'bg-purple-500' },
    stocks: { name: 'Stocks', icon: BarChart3, color: 'bg-red-500' },
    mutual_funds: { name: 'Mutual Funds', icon: TrendingUp, color: 'bg-indigo-500' },
    real_estate: { name: 'Real Estate', icon: Wallet, color: 'bg-yellow-500' },
  };

  const liabilityTypes = {
    credit_card: { name: 'Credit Card Debt', icon: CreditCard, color: 'bg-red-500' },
    personal_loan: { name: 'Personal Loan', icon: Wallet, color: 'bg-orange-500' },
    other: { name: 'Other Liability', icon: TrendingUp, color: 'bg-gray-500' },
  };

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset({
      type: assetForm.type,
      name: assetForm.name,
      value: parseFloat(assetForm.value),
      monthlyReturn: assetForm.monthlyReturn ? parseFloat(assetForm.monthlyReturn) : undefined,
    });
    setAssetForm({ type: 'savings', name: '', value: '', monthlyReturn: '' });
    setShowAssetForm(false);
  };

  const handleLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLiability({
      type: liabilityForm.type,
      name: liabilityForm.name,
      amount: parseFloat(liabilityForm.amount),
      monthlyPayment: liabilityForm.monthlyPayment ? parseFloat(liabilityForm.monthlyPayment) : undefined,
    });
    setLiabilityForm({ type: 'credit_card', name: '', amount: '', monthlyPayment: '' });
    setShowLiabilityForm(false);
  };

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssetValue - totalLiabilityValue;
  const monthlyAssetReturn = assets.reduce((sum, asset) => sum + (asset.monthlyReturn || 0), 0);
  const monthlyLiabilityPayment = liabilities.reduce((sum, liability) => sum + (liability.monthlyPayment || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssetForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
          <button
            onClick={() => setShowLiabilityForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Liability
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-green-600">₹{totalAssetValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600">₹{totalLiabilityValue.toLocaleString()}</p>
            </div>
            <CreditCard className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Worth</p>
              <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{netWorth.toLocaleString()}
              </p>
            </div>
            <Wallet className={`h-8 w-8 ${netWorth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Liquidity Ratio</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalLiabilityValue > 0 ? ((totalAssetValue / totalLiabilityValue) * 100).toFixed(0) : '∞'}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Monthly Cash Flow */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Asset Returns</p>
            <p className="text-xl font-bold text-green-600">+₹{monthlyAssetReturn.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Liability Payments</p>
            <p className="text-xl font-bold text-red-600">-₹{monthlyLiabilityPayment.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Cash Flow</p>
            <p className={`text-xl font-bold ${(monthlyAssetReturn - monthlyLiabilityPayment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(monthlyAssetReturn - monthlyLiabilityPayment) >= 0 ? '+' : ''}₹{(monthlyAssetReturn - monthlyLiabilityPayment).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('assets')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'assets'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assets ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('liabilities')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'liabilities'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Liabilities ({liabilities.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'assets' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => {
                const assetType = assetTypes[asset.type as keyof typeof assetTypes];
                const Icon = assetType.icon;
                
                return (
                  <div key={asset.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${assetType.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                          <p className="text-sm text-gray-600">{assetType.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAsset(asset.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value</span>
                        <span className="font-semibold text-green-600">₹{asset.value.toLocaleString()}</span>
                      </div>
                      {asset.monthlyReturn && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Return</span>
                          <span className="font-semibold text-green-600">₹{asset.monthlyReturn.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liabilities.map((liability) => {
                const liabilityType = liabilityTypes[liability.type as keyof typeof liabilityTypes];
                const Icon = liabilityType.icon;
                
                return (
                  <div key={liability.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${liabilityType.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{liability.name}</h4>
                          <p className="text-sm text-gray-600">{liabilityType.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLiability(liability.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-semibold text-red-600">₹{liability.amount.toLocaleString()}</span>
                      </div>
                      {liability.monthlyPayment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Payment</span>
                          <span className="font-semibold text-red-600">₹{liability.monthlyPayment.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Asset Form Modal */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  {Object.entries(assetTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="SBI Savings Account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Value (₹)</label>
                <input
                  type="number"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, value: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="100000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Return (₹) - Optional</label>
                <input
                  type="number"
                  value={assetForm.monthlyReturn}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, monthlyReturn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="1000"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssetForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liability Form Modal */}
      {showLiabilityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Liability</h3>
            <form onSubmit={handleLiabilitySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Liability Type</label>
                <select
                  value={liabilityForm.type}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  {Object.entries(liabilityTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Liability Name</label>
                <input
                  type="text"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="HDFC Credit Card"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Amount (₹)</label>
                <input
                  type="number"
                  value={liabilityForm.amount}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="50000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment (₹) - Optional</label>
                <input
                  type="number"
                  value={liabilityForm.monthlyPayment}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="5000"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLiabilityForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Liability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;