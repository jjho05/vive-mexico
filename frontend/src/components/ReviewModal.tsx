'use client';

import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { getSession } from '@/lib/auth';

interface ReviewModalProps {
  businessId: number;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ businessId, businessName, isOpen, onClose }: ReviewModalProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/businesses/${businessId}/reviews`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [isOpen, businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación de estrellas.');
      return;
    }
    
    setSubmitting(true);
    try {
      const session = getSession();
      const touristId = session?.tourist_id || localStorage.getItem('vive-mexico-tourist-id') || 'anonymous';
      
      const payload = {
        business_id: businessId,
        tourist_id: touristId,
        rating,
        comment,
      };

      const res = await fetch(`/api/businesses/${businessId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error saving review');
      
      toast.success('¡Gracias por tu reseña!');
      setReviews([...reviews, { ...payload, created_at: new Date().toISOString() }]);
      setRating(0);
      setComment('');
    } catch (e) {
      console.error(e);
      toast.error('Ocurrió un error al enviar tu reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-bold text-lg pr-4 line-clamp-1">{businessName}</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="font-bold mb-4">Reseñas de la comunidad</h3>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2].map(i => (
                <div key={i} className="bg-gray-100 h-16 rounded-xl"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Aún no hay reseñas. ¡Sé el primero en opinar!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex gap-1 mb-2 text-[var(--primary)]">
                    {Array.from({length: 5}).map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < rev.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  {rev.comment && <p className="text-sm text-gray-700">{rev.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Deja tu reseña</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 transition-transform hover:scale-110 ${rating >= star ? 'text-[var(--primary)]' : 'text-gray-300'}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="¿Qué te pareció este lugar? (Opcional)"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none text-sm resize-none"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Publicar Reseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
