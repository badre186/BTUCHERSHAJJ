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
        
        onImport(importedCandidates as Candidate[]);  // Appel de la méthode onImport
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDeleteAll = () => {
    onDeleteAll();  // Appel de la méthode onDeleteAll
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
                onChange={importFromExcel}  // Appel de la fonction d'importation
                className="hidden"
              />
            </label>
            <button
              onClick={exportToExcel}  // Appel de la fonction d'exportation
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <Download size={20} />
              تصدير إلى Excel
            </button>
            <button
              onClick={handleDeleteAll}  // Appel de la fonction de suppression de tous les candidats
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
                <tr key={candidate.id} className="hover:bg-
