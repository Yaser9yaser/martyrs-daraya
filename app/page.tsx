'use client';
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Martyr {
  id: string;
  fullName: string;
  cemetery: string;
  graveNumber: string;
  martyrdomDay: number;
  martyrdomMonth: number;
  keywords: string[];
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Martyr[]>([]);
  const [martyrs, setMartyrs] = useState<Martyr[]>([]);
  const [today, setToday] = useState<Martyr[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'martyrs'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Martyr[];
      setMartyrs(data);
      const now = new Date();
      const todayMartyrs = data.filter(
        m => m.martyrdomDay === now.getDate() && m.martyrdomMonth === now.getMonth() + 1
      );
      setToday(todayMartyrs);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const fuse = new Fuse(martyrs, { keys: ['fullName', 'keywords'], threshold: 0.4 });
    setResults(fuse.search(query).map(r => r.item));
  }, [query, martyrs]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          منصة توثيق شهداء داريا
        </h1>
        <p className="text-center text-gray-500 mb-8">ابحث عن اسم الشهيد لمعرفة موقع قبره</p>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث باسم الشهيد..."
          className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 mb-6"
        />

        {today.length > 0 && !query && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold mb-2">🌿 اليوم في الذاكرة</p>
            {today.map(m => (
              <p key={m.id} className="text-green-700">{m.fullName}</p>
            ))}
          </div>
        )}

        {results.map(m => (
          <a href={`/martyr/${m.id}`} key={m.id}
            className="block bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:shadow-md transition">
            <p className="font-bold text-gray-800">{m.fullName}</p>
            <p className="text-gray-500 text-sm">{m.cemetery === 'northern' ? 'المقبرة الشمالية' : 'المقبرة الجنوبية'} - {m.graveNumber}</p>
          </a>
        ))}
      </div>
    </div>
  );
}