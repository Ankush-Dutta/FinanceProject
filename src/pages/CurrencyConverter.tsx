import React, { useState, useEffect } from 'react';
import { ArrowUpDown, DollarSign, RefreshCw } from 'lucide-react';

const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  ];

  // Mock exchange rates - In a real app, this would fetch from a live API
  const mockRates: { [key: string]: { [key: string]: number } } = {
    USD: { INR: 83.12, EUR: 0.85, GBP: 0.73, JPY: 110.25, CAD: 1.25, AUD: 1.35, CNY: 6.45, SGD: 1.35, CHF: 0.88 },
    EUR: { USD: 1.18, INR: 97.89, GBP: 0.86, JPY: 130.15, CAD: 1.47, AUD: 1.59, CNY: 7.61, SGD: 1.59, CHF: 1.04 },
    GBP: { USD: 1.37, INR: 113.89, EUR: 1.16, JPY: 151.24, CAD: 1.71, AUD: 1.85, CNY: 8.84, SGD: 1.85, CHF: 1.21 },
    INR: { USD: 0.012, EUR: 0.010, GBP: 0.009, JPY: 1.33, CAD: 0.015, AUD: 0.016, CNY: 0.078, SGD: 0.016, CHF: 0.011 },
    JPY: { USD: 0.009, EUR: 0.008, GBP: 0.007, INR: 0.75, CAD: 0.011, AUD: 0.012, CNY: 0.058, SGD: 0.012, CHF: 0.008 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, INR: 66.50, JPY: 88.20, AUD: 1.08, CNY: 5.16, SGD: 1.08, CHF: 0.70 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, INR: 61.57, JPY: 81.67, CAD: 0.93, CNY: 4.78, SGD: 1.00, CHF: 0.65 },
    CNY: { USD: 0.155, EUR: 0.131, GBP: 0.113, INR: 12.89, JPY: 17.09, CAD: 0.194, AUD: 0.209, SGD: 0.209, CHF: 0.136 },
    SGD: { USD: 0.74, EUR: 0.63, GBP: 0.54, INR: 61.57, JPY: 81.67, CAD: 0.93, AUD: 1.00, CNY: 4.78, CHF: 0.65 },
    CHF: { USD: 1.14, EUR: 0.96, GBP: 0.83, INR: 94.65, JPY: 125.28, CAD: 1.43, AUD: 1.54, CNY: 7.35, SGD: 1.54 },
  };

  const convertCurrency = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
    } else {
      const rate = mockRates[fromCurrency]?.[toCurrency] || 1;
      const converted = (parseFloat(amount || '0') * rate).toFixed(2);
      setConvertedAmount(converted);
      setExchangeRate(rate);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const popularPairs = [
    { from: 'USD', to: 'INR', rate: '83.12' },
    { from: 'EUR', to: 'USD', rate: '1.18' },
    { from: 'GBP', to: 'INR', rate: '113.89' },
    { from: 'USD', to: 'JPY', rate: '110.25' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Currency Converter</h1>
        <DollarSign className="h-8 w-8 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Convert Currency</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg"
                placeholder="Enter amount"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  onClick={swapCurrencies}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  title="Swap currencies"
                >
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={convertCurrency}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>

          {convertedAmount && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">
                  {currencies.find(c => c.code === fromCurrency)?.flag} {amount} {fromCurrency} =
                </p>
                <p className="text-3xl font-bold text-green-800 mt-2">
                  {currencies.find(c => c.code === toCurrency)?.flag} {convertedAmount} {toCurrency}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Popular Pairs & Market Info */}
        <div className="space-y-6">
          {/* Popular Currency Pairs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Currency Pairs</h3>
            <div className="space-y-3">
              {popularPairs.map((pair, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pair.from}/{pair.to}</span>
                  </div>
                  <span className="font-semibold text-green-600">{pair.rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exchange Rate Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">USD Strength Index</p>
                  <p className="text-sm text-gray-600">vs Major Currencies</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+0.45%</p>
                  <p className="text-sm text-gray-500">102.45</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">EUR/USD</p>
                  <p className="text-sm text-gray-600">European Session</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-0.23%</p>
                  <p className="text-sm text-gray-500">1.1785</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">GBP/USD</p>
                  <p className="text-sm text-gray-600">London Session</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+0.12%</p>
                  <p className="text-sm text-gray-500">1.3695</p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Market Status:</strong> <span className="text-green-600">Open</span></p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Data Source:</strong> Mock Exchange Rates</p>
              <p className="text-xs text-gray-500 mt-4">
                Note: This converter uses mock data for demonstration purposes. 
                For real trading, please use official financial data sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;