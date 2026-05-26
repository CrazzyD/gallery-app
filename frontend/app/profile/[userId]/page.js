'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import authStore from '@/app/store/authStore';
import Navbar from '@/app/components/Navbar';

export default function UserProfile() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = authStore();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${params.userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) fetchProfile();
  }, [params.userId, API_URL, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">
            {profile.user.avatar && (
              <img
                src={profile.user.avatar}
                alt={profile.user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.user.username}
              </h1>
              <p className="text-gray-600">
                {profile.user.images_count} images
              </p>
              <p className="text-sm text-gray-500">
                Joined {new Date(profile.user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
        
        {profile.images.length === 0 ? (
          <p className="text-gray-600">No images yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
            {profile.images.map((image) => (
              <Link
                key={image.id}
                href={`/image/${image.id}`}
                className="group relative overflow-hidden rounded-lg bg-gray-200 hover:shadow-lg transition"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-opacity-0 group-hover:text-opacity-100 transition">
                    {image.title}
                  </h3>
                  <p className="text-sm text-gray-200 text-opacity-0 group-hover:text-opacity-100 transition">
                    ❤️ {image.likes_count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/gallery"
          className="inline-block mt-8 px-6 py-2 text-purple-600 hover:underline font-semibold"
        >
          ← Back to Gallery
        </Link>
      </div>
    </>
  );
}
