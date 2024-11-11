import React from 'react';
import { Candidate } from '../types';
import { X } from 'lucide-react';

interface Props {
  candidate: Partial<Candidate>;
  onSubmit: (candidate: Partial<Candidate>) => void;
  onClose: () => void;
  isEdit?: boolean;
}

export default function CandidateForm({ candidate, onSubmit, onClose, isEdit }: Props) {
  const [formData, setFormData] = React.useState({
    ...candidate,
    firstPayment: candidate.firstPayment || 0,
    secondPayment: candidate.secondPayment || 0,
    thirdPayment: candidate.thirdPayment || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPayments = Number(formData.firstPayment || 0) + 
                         Number(formData.secondPayment || 0) + 
                         Number(formData.thirdPayment || 0);
    onSubmit({
      ...formData,
      totalPayments,
      firstPayment: Number(formData.firstPayment),
      secondPayment: Number(formData.secondPayment),
      thirdPayment: Number(formData.thirdPayment),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-right text-blue-800">
          {isEdit ? 'تعديل بيانات المرشح' : 'إضافة مرشح جديد'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Champs pour toutes les informations */}
            <div>
              <label className="block text-sm font-medium text-gray-700">الترتيب</label>
              <input
                type="number"
                name="order"
                value={formData.order || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الاسم</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الميلاد</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">بلد الميلاد</label>
              <input
                type="text"
                name="birthCountry"
                value={formData.birthCountry || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">مكان الميلاد</label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">العنوان</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">المهنة في جواز السفر</label>
              <input
                type="text"
                name="passportProfession"
                value={formData.passportProfession || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">المهنة في المشروع</label>
              <input
                type="text"
                name="projectProfession"
                value={formData.projectProfession || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">رقم جواز السفر</label>
              <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الإصدار</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الجهة المصدرة</label>
              <input
                type="text"
                name="issuingAuthority"
                value={formData.issuingAuthority || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">رقم الهوية</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">هل هو احتياطي؟</label>
              <input
                type="checkbox"
                name="isReserve"
                checked={formData.isReserve || false}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  isReserve: e.target.checked
                }))}
                className="mt-1 block"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الوكيل</label>
              <input
                type="text"
                name="agent"
                value={formData.agent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الممثل</label>
              <input
                type="text"
                name="representative"
                value={formData.representative || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الدفع الأول</label>
              <input
                type="number"
                name="firstPayment"
                value={formData.firstPayment || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الدفع الثاني</label>
              <input
                type="number"
                name="secondPayment"
                value={formData.secondPayment || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الدفع الثالث</label>
              <input
                type="number"
                name="thirdPayment"
                value={formData.thirdPayment || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              {isEdit ? 'تحديث' : 'إضافة'}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
