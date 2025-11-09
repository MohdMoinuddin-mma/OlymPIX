import React, { useState } from 'react';
import { AuthLayout, GlassInput, PrimaryButton } from './AuthComponents';

interface UserDetailsPageProps {
  onFinish: (name: string) => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ onFinish }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    height: '',
    weight: ''
  });
  
  const [units, setUnits] = useState({
    height: 'cm',
    weight: 'kg'
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnits({
        ...units,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation
    for (const key in formData) {
      if (formData[key as keyof typeof formData].trim() === '') {
        setError('Please fill in all fields.');
        return;
      }
    }
    console.log('User details:', { ...formData, units });
    onFinish(formData.name);
  };

  return (
    <AuthLayout title="Complete Your Profile">
      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2.5 mb-6">
        <div className="bg-[#C8F560] h-2.5 rounded-full" style={{ width: '100%' }}></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div className="flex gap-4">
            <GlassInput
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-1/2"
                required
            />
            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-1/2 bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E0FF] focus:bg-white/10 px-4 py-3">
                <option value="" disabled>Gender...</option>
                <option value="male" className="text-black">Male</option>
                <option value="female" className="text-black">Female</option>
                <option value="other" className="text-black">Other</option>
            </select>
        </div>

        <div className="flex gap-4 items-center">
            <GlassInput
                type="number"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
                required
            />
            <select name="height" value={units.height} onChange={handleUnitChange} className="bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E0FF] focus:bg-white/10 px-2 py-3">
                <option value="cm" className="text-black">cm</option>
                <option value="ft" className="text-black">ft</option>
            </select>
        </div>

        <div className="flex gap-4 items-center">
            <GlassInput
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                required
            />
             <select name="weight" value={units.weight} onChange={handleUnitChange} className="bg-white/5 border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E0FF] focus:bg-white/10 px-2 py-3">
                <option value="kg" className="text-black">kg</option>
                <option value="lbs" className="text-black">lbs</option>
            </select>
        </div>
       
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <div className="pt-4">
          <PrimaryButton type="submit">
            Get Started
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserDetailsPage;