'use client';
import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { use } from 'react';
import { CldImage } from 'next-cloudinary';

interface Martyr {
  id: string;
  fullName: string;
  cemetery: string;
  graveNumber: string;
  section: string;
  martyrdomDay: number;
  martyrdomMonth: number;
  martyrdomYear: number;
  visitCount: number;
  salamCount: number;
  imageUrl?: string; // إضافة حقل الصورة هنا
}

export default function MartyrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [martyr, setMartyr] = useState<Martyr | null>(null);
  const [salamDone, setSalamDone] = useState(false);

  useEffect(() => {
    const fetchMartyr = async () => {
      const docRef = doc(db, 'martyrs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMartyr({ id: docSnap.id, ...docSnap.data() } as Martyr);
        await updateDoc(docRef, { visitCount: increment(1) });
      }
    };
    fetchMartyr();
  }, [id]);

  const handleSalam = async () => {
    if (!martyr || salamDone) return;
    await updateDoc(doc(db, 'martyrs', martyr.id), { salamCount: increment(1) });
    setSalamDone(true);
  };

  if (!martyr) return <div className="text-center p-8">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12 text-right">
        <a href="/" className="text-green-700 mb-6 block font-medium hover:underline">← العودة للبحث</a>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-8">
          
          {/* عرض الصورة الكاملة للشهيد في حال توفرها */}
          {martyr.imageUrl && (
            <div className="w-full h-64 md:h-80 relative rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-100 flex items-center justify-center">
              <CldImage
                src={martyr.imageUrl}
                alt={martyr.fullName}
                width="600"
                height="400"
                crop="fill"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{martyr.fullName}</h1>
          <p className="text-gray-500 mb-6 font-medium">تاريخ الاستشهاد: {martyr.martyrdomDay}/{martyr.martyrdomMonth}/{martyr.martyrdomYear}</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 mb-2">🕌 <strong className="text-gray-900">المقبرة:</strong> {martyr.cemetery === 'northern' ? 'الشمالية' : 'الجنوبية'}</p>
            <p className="text-gray-700 mb-2">📍 <strong className="text-gray-900">رقم القبر:</strong> {martyr.graveNumber}</p>
            <p className="text-gray-700">🗺️ <strong className="text-gray-900">القطاع:</strong> {martyr.section}</p>
          </div>
          
          <div className="flex gap-6 mb-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
            <span className="flex items-center gap-1">👁️ زار صفحته {martyr.visitCount} شخص</span>
            <span className="flex items-center gap-1">🕊️ أهدى له السلام {martyr.salamCount} شخص</span>
          </div>
          
          <button onClick={handleSalam} disabled={salamDone}
            className={`w-full p-4 rounded-xl font-bold text-lg transition ${salamDone ? 'bg-green-100 text-green-700' : 'bg-green-700 text-white hover:bg-green-800 shadow-sm'}`}>
            {salamDone ? '✅ تم إهداء السلام' : '🕊️ سلامٌ عليك'}
          </button>
        </div>
      </div>
    </div>
  );
}