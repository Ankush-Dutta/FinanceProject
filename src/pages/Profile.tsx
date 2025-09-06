import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../utils/api';
import { User, DollarSign, Calendar, MapPin, Save, Loader } from 'lucide-react';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    maritalStatus: 'single',
    dependents: '0'
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await profileApi.getProfile(user.id);
        if (response) {
          setFormData({
            dateOfBirth: response.dateOfBirth || '',
            occupation: response.occupation || '',
            monthlyIncome: response.monthlyIncome?.toString() || '',
            address: response.address || '',
            city: response.city || '',
            state: response.state || '',
            zipCode: response.zipCode || '',
            maritalStatus: response.maritalStatus || 'single',
            dependents: response.numberOfDependents?.toString() || '0'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const updateData = {
        occupation: formData.occupation,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        maritalStatus: formData.maritalStatus,
        numberOfDependents: parseInt(formData.dependents),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      await profileApi.updateProfile(user.id, updateData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  disabled
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg bg-gray-100 cursor-not-allowed"
                  value={formData.dateOfBirth}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Date of birth cannot be changed</p>
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Software Engineer, Doctor, etc."
                value={formData.occupation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                Monthly Income
              </label>
              <div className="mt-1 relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="50000"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.maritalStatus}
                onChange={handleInputChange}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label htmlFor="dependents" className="block text-sm font-medium text-gray-700">
                Number of Dependents
              </label>
              <input
                type="number"
                id="dependents"
                name="dependents"
                min="0"
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.dependents}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className=" -ml-1 mr-3 h-5 w-5" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
