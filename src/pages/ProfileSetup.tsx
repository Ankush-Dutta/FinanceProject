import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../utils/api';
import { User, DollarSign, Calendar, MapPin } from 'lucide-react';

const ProfileSetup: React.FC = () => {
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
  const [isUpdate, setIsUpdate] = useState(false);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user?.id) return;
      
      console.log('Fetching profile for user ID:', user.id);
      
      try {
        const response = await profileApi.getProfile(user.id);
        if (response) {
          console.log('Profile found:', response);
          // Profile exists, populate form
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
          setIsUpdate(true);
        }
      } catch (error) {
        // Profile doesn't exist, that's fine for new users
        console.log('No existing profile found', error);
        // Check if it's a 404 (profile not found) or other error
        if (error instanceof Error && error.message.includes('404')) {
          console.log('Profile not found - this is expected for new users');
        } else {
          console.error('Unexpected error fetching profile:', error);
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchExistingProfile();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    console.log('Submitting profile for user ID:', user.id);
    console.log('Is update:', isUpdate);
    console.log('Form data:', formData);
    
    setLoading(true);
    try {
      const profileData = {
        uid: user.id,
        dateOfBirth: formData.dateOfBirth,
        occupation: formData.occupation,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        maritalStatus: formData.maritalStatus,
        numberOfDependents: parseInt(formData.dependents),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      console.log('Profile data to send:', profileData);

      if (isUpdate) {
        // Update existing profile (dateOfBirth cannot be updated according to API)
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
        console.log('Sending update data:', updateData);
        await profileApi.updateProfile(user.id, updateData);
      } else {
        // Create new profile
        console.log('Creating new profile');
        await profileApi.createProfile(profileData);
      }

      // Update local auth context
      updateProfile(formData);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Profile setup failed:', error);
      let errorMessage = 'Failed to save profile. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Profile service is not available. Please contact support.';
        } else if (error.message.includes('409')) {
          errorMessage = 'Profile already exists. Please try updating instead.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid profile data. Please check your inputs.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isUpdate ? 'Update Your Profile' : 'Complete Your Profile'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isUpdate ? 'Keep your financial information up to date' : 'Help us personalize your finance tracking experience'}
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
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
                  required={!isUpdate}
                  disabled={isUpdate}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
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
            <div>
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving profile...' : isUpdate ? 'Update Profile' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;