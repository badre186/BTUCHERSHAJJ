export interface Candidate {
  id: string;
  order: number;
  name: string;
  birthDate: string;
  birthCountry: string;
  birthPlace: string;
  address: string;
  passportProfession: string;
  projectProfession: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  idNumber: string;
  isReserve: string;
  agent: string;
  representative: string;
  notes: string;
  phoneNumber: string;
  firstPayment: number;
  secondPayment: number;
  thirdPayment: number;
  totalPayments: number;
}