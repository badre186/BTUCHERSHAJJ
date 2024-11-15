import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Candidate } from './types';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';
import LandingPage from './components/LandingPage';

const SHEET_ID = '1o4y35LSGIi9XolbIbkw_PXfxPRHOlzzdApOY0I12FDw';
const API_KEY = 'AIzaSyB2Wo_yI5Ckd2WtfWiugrIKj6tb6RrCZ-s';
const SHEET_NAME = 'Candidates';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);

  // Charger les candidats depuis Google Sheets
  const fetchCandidatesFromSheet = async () => {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
      );

      if (!response.ok) {
        console.error(`Erreur HTTP : ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Données reçues depuis Google Sheets :", data);

      if (!data.values) {
        console.error("Aucune donnée trouvée dans l'onglet 'Candidates' du Google Sheets.");
        return;
      }

      const loadedCandidates = data.values.slice(1).map((row: string[], index) => ({
        id: `${Date.now()}-${index}`, // Créer un identifiant unique pour chaque candidat
        order: row[0],
        name: row[1],
        birthDate: row[2],
        birthCountry: row[3],
        birthPlace: row[4],
        address: row[5],
        passportProfession: row[6],
        projectProfession: row[7],
        passportNumber: row[8],
        issueDate: row[9],
        expiryDate: row[10],
        issuingAuthority: row[11],
        idNumber: row[12],
        isReserve: row[13] === 'TRUE',
        agent: row[14],
        representative: row[15],
        phoneNumber: row[16],
        firstPayment: Number(row[17]) || 0,
        secondPayment: Number(row[18]) || 0,
        thirdPayment: Number(row[19]) || 0,
        totalPayments: (Number(row[17]) || 0) + (Number(row[18]) || 0) + (Number(row[19]) || 0),
      })) as Candidate[];

      setCandidates(
        loadedCandidates.sort((a, b) => b.totalPayments - a.totalPayments).map((c, index) => ({
          ...c,
          order: index + 1,
        }))
      );

    } catch (error) {
      console.error("Erreur lors du chargement des données de Google Sheets :", error);
    }
  };

  useEffect(() => {
    fetchCandidatesFromSheet();
  }, []);

  const handleAddCandidate = (candidate: Partial<Candidate>) => {
    const newCandidate = {
      ...candidate,
      id: Date.now().toString(),
      totalPayments: Number(candidate.firstPayment || 0) + 
                    Number(candidate.secondPayment || 0) + 
                    Number(candidate.thirdPayment || 0)
    } as Candidate;
    
    setCandidates(prev => {
      const updated = [...prev, newCandidate];
      return updated.sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
                   .map((c, index) => ({ ...c, order: index + 1 }));
    });
    setShowForm(false);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleUpdateCandidate = (updatedCandidate: Partial<Candidate>) => {
    const totalPayments = Number(updatedCandidate.firstPayment || 0) + 
                         Number(updatedCandidate.secondPayment || 0) + 
                         Number(updatedCandidate.thirdPayment || 0);
    
    setCandidates(prev => {
      const updated = prev.map(c => 
        c.id === editingCandidate?.id 
          ? { ...c, ...updatedCandidate, totalPayments } 
          : c
      );
      return updated.sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
                   .map((c, index) => ({ ...c, order: index + 1 }));
    });
    setShowForm(false);
    setEditingCandidate(null);
  };

  const handleDeleteCandidate = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المرشح؟')) {
      setCandidates(prev => {
        const updated = prev.filter(c => c.id !== id);
        return updated.sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
                     .map((c, index) => ({ ...c, order: index + 1 }));
      });
    }
  };

  const handleDeleteAll = () => {
    setCandidates([]);
  };

  const handleImportCandidates = (importedCandidates: Candidate[]) => {
    setCandidates(prev => {
      const updated = [...prev, ...importedCandidates];
      return updated.sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
                   .map((c, index) => ({ ...c, order: index + 1 }));
    });
  };

  if (!showCandidates) {
    return <LandingPage onEnter={() => setShowCandidates(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">نظام إدارة المرشحين</h1>
            <button
              onClick={() => setShowCandidates(false)}
              className="text-white hover:text-yellow-500 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث عن مرشح..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
          >
            <UserPlus size={20} />
            إضافة مرشح جديد
          </button>
        </div>

        <CandidateList
          candidates={candidates}
          onEdit={handleEditCandidate}
          onDelete={handleDeleteCandidate}
          onDeleteAll={handleDeleteAll} 
          onImport={handleImportCandidates}
          filter={filter}
        />

        {showForm && (
          <CandidateForm
            candidate={editingCandidate || {}}
            onSubmit={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
            onClose={() => {
              setShowForm(false);
              setEditingCandidate(null);
            }}
            isEdit={!!editingCandidate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
