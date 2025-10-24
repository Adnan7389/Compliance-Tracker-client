import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">My Profile</h2>
            <div className="space-y-3">
                <div>
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Role</p>
                    <p className="text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Business Name</p>
                    <p className="text-gray-900">{user?.businessName}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;