'use client';
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminPage() {
  const [form, setForm] = useState({
    fullName: '',
    martyrdomDay: '',
    martyrdomMonth: '',
    martyrdomYear: '',
    cemetery: 'northern',
    graveNumber: '',
    section: '',
    keywords: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await addDoc(collection(db, 'martyrs'), {
      fullName: form.fullName,
      martyrdomDay: Number(form.martyrdomDay),
      martyrdomMonth: Number(form.martyrdomMonth),
      martyrdomYear: Number(form.martyrdomYear),
      cemetery: form.cemetery,
      graveNumber: form.graveNumber,
      section: form.section,
      keywords: form.keywords.split(',').map(k => k.trim()),
      visitCount: 0,
      salamCount: 0,
      status: 'approved',
    });
    setLoading(false);
    setSuccess(true);
    setForm({ fullName: '', martyrdomDay: '', martyrdomMonth: '', martyrdomYear: '', cemetery: 'northern', graveNumber: '', section: '', keywords: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">إضافة شهيد جديد</h1>

        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">✅ تمت الإضافة بنجاح</p>}

        <input className="w-full border p-3 rounded-lg mb-3" placeholder="الاسم الثلاثي الكامل"
          value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />

        <div className="flex gap-2 mb-3">
          <input className="w-1/3 border p-3 rounded-lg" placeholder="اليوم"
            value={form.martyrdomDay} onChange={e => setForm({...form, martyrdomDay: e.target.value})} />
          <input className="w-1/3 border p-3 rounded-lg" placeholder="الشهر"
            value={form.martyrdomMonth} onChange={e => setForm({...form, martyrdomMonth: e.target.value})} />
          <input className="w-1/3 border p-3 rounded-lg" placeholder="السنة"
            value={form.martyrdomYear} onChange={e => setForm({...form, martyrdomYear: e.target.value})} />
        </div>

        <select className="w-full border p-3 rounded-lg mb-3"
          value={form.cemetery} onChange={e => setForm({...form, cemetery: e.target.value})}>
          <option value="northern">المقبرة الشمالية</option>
          <option value="southern">المقبرة الجنوبية</option>
        </select>

        <input className="w-full border p-3 rounded-lg mb-3" placeholder="رقم القبر"
          value={form.graveNumber} onChange={e => setForm({...form, graveNumber: e.target.value})} />

        <input className="w-full border p-3 rounded-lg mb-3" placeholder="القطاع (أ، ب، ج)"
          value={form.section} onChange={e => setForm({...form, section: e.target.value})} />

        <input className="w-full border p-3 rounded-lg mb-6" placeholder="كنية أو لقب (افصل بفاصلة)"
          value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})} />

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-green-700 text-white p-3 rounded-lg font-bold hover:bg-green-800 transition">
          {loading ? 'جاري الحفظ...' : 'إضافة الشهيد'}
        </button>
      </div>
    </div>
  );
}