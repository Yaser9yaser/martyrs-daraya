'use client';
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    martyrdomDay: '',
    martyrdomMonth: '',
    martyrdomYear: '',
    cemetery: 'northern',
    graveNumber: '',
    section: '',
    keywords: '',
    imageUrl: '', 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow text-right">
          <h2 className="text-xl font-bold mb-4">دخول المشرف</h2>
          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-3 rounded-lg w-full mb-4"
          />
          <button
            onClick={() => {
              if (password === 'yaser abo ammar86') setAuthenticated(true);
              else alert('كلمة السر غلط');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full font-bold"
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.fullName) {
      alert('الرجاء كتابة الاسم الكامل');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'martyrs'), {
        fullName: form.fullName,
        martyrdomDay: Number(form.martyrdomDay),
        martyrdomMonth: Number(form.martyrdomMonth),
        martyrdomYear: Number(form.martyrdomYear),
        cemetery: form.cemetery,
        graveNumber: form.graveNumber,
        section: form.section,
        keywords: form.keywords.split(',').map(k => k.trim()),
        imageUrl: form.imageUrl, 
        visitCount: 0,
        salamCount: 0,
        status: 'approved',
      });
      
      setSuccess(true);
      setForm({ 
        fullName: '', 
        martyrdomDay: '', 
        martyrdomMonth: '', 
        martyrdomYear: '', 
        cemetery: 'northern', 
        graveNumber: '', 
        section: '', 
        keywords: '', 
        imageUrl: '' 
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('حدث خطأ أثناء الحفظ');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 text-right">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">إضافة شهيد جديد</h1>
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">✅ تمت الإضافة بنجاح</p>}
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">الاسم الكامل:</label>
        <input className="w-full border p-3 rounded-lg mb-3" placeholder="الاسم الثلاثي الكامل"
          value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">تاريخ الاستشهاد (يوم/شهر/سنة):</label>
        <div className="flex gap-2 mb-3">
          <input className="w-1/3 border p-3 rounded-lg" placeholder="اليوم"
            value={form.martyrdomDay} onChange={e => setForm({...form, martyrdomDay: e.target.value})} />
          <input className="w-1/3 border p-3 rounded-lg" placeholder="الشهر"
            value={form.martyrdomMonth} onChange={e => setForm({...form, martyrdomMonth: e.target.value})} />
          <input className="w-1/3 border p-3 rounded-lg" placeholder="السنة"
            value={form.martyrdomYear} onChange={e => setForm({...form, martyrdomYear: e.target.value})} />
        </div>
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">المقبرة:</label>
        <select className="w-full border p-3 rounded-lg mb-3"
          value={form.cemetery} onChange={e => setForm({...form, cemetery: e.target.value})}>
          <option value="northern">المقبرة الشمالية</option>
          <option value="southern">المقبرة الجنوبية</option>
        </select>
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">رقم القبر:</label>
        <input className="w-full border p-3 rounded-lg mb-3" placeholder="رقم القبر"
          value={form.graveNumber} onChange={e => setForm({...form, graveNumber: e.target.value})} />
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">القطاع:</label>
        <input className="w-full border p-3 rounded-lg mb-3" placeholder="القطاع (أ، ب، ج)"
          value={form.section} onChange={e => setForm({...form, section: e.target.value})} />
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">الكلمات المفتاحية والكنية:</label>
        <input className="w-full border p-3 rounded-lg mb-4" placeholder="كنية أو لقب (افصل بفاصلة)"
          value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})} />
        
        <label className="block text-gray-700 font-bold mb-1 text-sm">صورة الشهيد:</label>
        <div className="mb-6">
          <CldUploadWidget 
            uploadPreset="xnpiggw4" 
            onSuccess={(result: any) => {
              if (result?.info?.secure_url) {
                setForm({ ...form, imageUrl: result.info.secure_url });
                alert('تم رفع الصورة بنجاح وتجهيز الرابط!');
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full border-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 p-4 rounded-lg font-bold hover:bg-blue-100 transition text-center"
              >
                {form.imageUrl ? '✅ تم رفع الصورة (اضغط لتغييرها)' : '📸 اضغط هنا لرفع صورة الشهيد'}
              </button>
            )}
          </CldUploadWidget>
          
          {form.imageUrl && (
            <p className="text-xs text-gray-500 mt-2 text-left truncate" dir="ltr">
              {form.imageUrl}
            </p>
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-green-700 text-white p-3 rounded-lg font-bold hover:bg-green-800 transition">
          {loading ? 'جاري الحفظ...' : 'إضافة الشهيد'}
        </button>
      </div>
    </div>
  );
}