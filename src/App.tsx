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
      id: `${Date.now()}-${index}`,  // Générez un identifiant unique pour chaque candidat
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

const handleUpdateCandidate = (updatedCandidate: Partial<Candidate>) => {
  const totalPayments = Number(updatedCandidate.firstPayment || 0) + 
                       Number(updatedCandidate.secondPayment || 0) + 
                       Number(updatedCandidate.thirdPayment || 0);
  
  setCandidates(prev => {
    const updated = prev.map(c => 
      c.id === editingCandidate?.id  // Utilisez l'ID pour identifier le candidat à modifier
        ? { ...c, ...updatedCandidate, totalPayments } 
        : c
    );
    return updated.sort((a, b) => (b.totalPayments || 0) - (a.totalPayments || 0))
                 .map((c, index) => ({ ...c, order: index + 1 }));
  });
  setShowForm(false);
  setEditingCandidate(null);
};
