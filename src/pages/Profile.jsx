import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business ID</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.businessId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;