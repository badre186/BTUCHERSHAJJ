import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';
import { Edit, Trash2, Download, Upload, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void; // Ajout de la méthode onDeleteAll dans les props
  onImport: (candidates: Candidate[]) => void;
  filter: string;
}

export default function CandidateList({ candidates, onEdit, onDelete, onDeleteAll, onImport, filter }: Props) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const sorted = [...candidates].sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0));
    const updatedCandidates = sorted.map((candidate, index) => ({
      ...candidate,
      order: index + 1
    }));
    setSortedCandidates(updatedCandidates);
  }, [candidates]);

  const filteredCandidates = sortedCandidates.filter(candidate =>
    Object.values(candidate).some(value =>
      value?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCandidates);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidates");
    XLSX.writeFile(wb, "candidates.xlsx");
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const importedCandidates = jsonData.map((row: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...row,
          firstPayment: Number(row.firstPayment || 0),
          secondPayment: Number(row.secondPayment || 0),
          thirdPayment: Number(row.thirdPayment || 0),
          totalPayments: Number(row.firstPayment || 0) + Number(row.secondPayment || 0) + Number(row.thirdPayment || 0)
        }));
        
        onImport(importedCandidates as Candidate[]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDeleteAll = () => {
    onDeleteAll();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-blue-800">قائمة المرشحين</h2>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload size={20} />
              استيراد من Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importFromExcel}
                className="hidden"
              />
            </label>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <Download size={20} />
              تصدير إلى Excel
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} />
              حذف الجميع
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">الترتيب</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">المهنة المعتمدة للعمل</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">احتياطي؟</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">المندوب</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">رقم الجوال</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">الدفعة الأولى</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">الدفعة الثانية</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">الدفعة الثالثة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-blue-800">مجموع الدفعات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{candidate.order}</td>
                  <td className="px-4 py-3 text-sm">{candidate.name}</td>
                  <td className="px-4 py-3 text-sm">{candidate.projectProfession}</td>
                  <td className="px-4 py-3 text-sm">{candidate.isReserve}</td>
                  <td className="px-4 py-3 text-sm">{candidate.representative}</td>
                  <td className="px-4 py-3 text-sm">{candidate.phoneNumber}</td>
                  <td className="px-4 py-3 text-sm">{candidate.firstPayment}</td>
                  <td className="px-4 py-3 text-sm">{candidate.secondPayment}</td>
                  <td className="px-4 py-3 text-sm">{candidate.thirdPayment}</td>
                  <td className="px-4 py-3 text-sm font-bold">{candidate.totalPayments}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => onEdit(candidate)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(candidate.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-right text-blue-800">
              تفاصيل المرشح: {selectedCandidate.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">المعلومات الشخصية</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">الترتيب</dt>
                    <dd className="text-gray-900">{selectedCandidate.order}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">الاسم</dt>
                    <dd className="text-gray-900">{selectedCandidate.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">تاريخ الميلاد</dt>
                    <dd className="text-gray-900">{selectedCandidate.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">بلد الميلاد</dt>
                    <dd className="text-gray-900">{selectedCandidate.birthCountry}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">محل الميلاد</dt>
                    <dd className="text-gray-900">{selectedCandidate.birthPlace}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">العنوان</dt>
                    <dd className="text-gray-900">{selectedCandidate.address}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">معلومات جواز السفر</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">رقم الجواز</dt>
                    <dd className="text-gray-900">{selectedCandidate.passportNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">تاريخ الإصدار</dt>
                    <dd className="text-gray-900">{selectedCandidate.issueDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">تاريخ الانتهاء</dt>
                    <dd className="text-gray-900">{selectedCandidate.expiryDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">جهة الإصدار</dt>
                    <dd className="text-gray-900">{selectedCandidate.issuingAuthority}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">المعلومات المهنية</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">المهنة في جواز السفر</dt>
                    <dd className="text-gray-900">{selectedCandidate.passportProfession}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">المهنة المعتمدة للعمل</dt>
                    <dd className="text-gray-900">{selectedCandidate.projectProfession}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">احتياطي</dt>
                    <dd className="text-gray-900">{selectedCandidate.isReserve}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">المعلومات المالية</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">الدفعة الأولى</dt>
                    <dd className="text-gray-900">{selectedCandidate.firstPayment}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">الدفعة الثانية</dt>
                    <dd className="text-gray-900">{selectedCandidate.secondPayment}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">الدفعة الثالثة</dt>
                    <dd className="text-gray-900">{selectedCandidate.thirdPayment}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">مجموع الدفعات</dt>
                    <dd className="text-gray-900 font-bold">{selectedCandidate.totalPayments}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">معلومات إضافية</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">رقم الهوية</dt>
                    <dd className="text-gray-900">{selectedCandidate.idNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">الوكيل</dt>
                    <dd className="text-gray-900">{selectedCandidate.agent}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">المندوب</dt>
                    <dd className="text-gray-900">{selectedCandidate.representative}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">رقم الجوال</dt>
                    <dd className="text-gray-900">{selectedCandidate.phoneNumber}</dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-2">ملاحظات</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedCandidate.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}