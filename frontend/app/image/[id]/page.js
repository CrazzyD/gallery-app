'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import authStore from '../../store/authStore';
import Navbar from '@/app/components/Navbar';

export default function ImageDetail() {
  const params = useParams();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const { user } = authStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/images/${params.id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        setImage(response.data);
        setLiked(response.data.liked || false);
        setLikesCount(response.data.likes_count || 0);
      } catch (error) {
        console.error('Failed to fetch image:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchImage();
  }, [params.id, API_URL, token]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like images');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/likes/${params.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLiked((prev) => !prev);

      setLikesCount((prev) =>
        liked ? prev - 1 : prev + 1
      );
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!image)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Image not found
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          <img
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api','')}${image.image_url}`}
            alt={image.title}
            className="w-full max-h-96 object-contain"
          />

          <div className="p-8">

            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {image.title}
                </h1>

                <Link
                  href={`/profile/${image.user_id}`}
                  className="text-purple-600 hover:underline"
                >
                  By {image.username}
                </Link>
              </div>

              <button
                onClick={handleLike}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  liked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                ❤️ {likesCount}
              </button>
            </div>

            {image.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {image.description}
              </p>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Published on{' '}
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>

          </div>
        </div>

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