import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const SHEET_ID = '1o4y35LSGIi9XolbIbkw_PXfxPRHOlzzdApOY0I12FDw';
const SHEET_NAME = 'Candidates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { client_email, private_key } = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT(client_email, undefined, private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  
  const sheets = google.sheets({ version: 'v4', auth });

  const candidateData = req.body;

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            candidateData.order,
            candidateData.name,
            candidateData.birthDate,
            candidateData.birthCountry,
            candidateData.birthPlace,
            candidateData.address,
            candidateData.passportProfession,
            candidateData.projectProfession,
            candidateData.passportNumber,
            candidateData.issueDate,
            candidateData.expiryDate,
            candidateData.issuingAuthority,
            candidateData.idNumber,
            candidateData.isReserve ? 'TRUE' : 'FALSE',
            candidateData.agent,
            candidateData.representative,
            candidateData.phoneNumber,
            candidateData.firstPayment,
            candidateData.secondPayment,
            candidateData.thirdPayment,
            candidateData.totalPayments,
          ],
        ],
      },
    });

    res.status(200).json({ message: 'Candidate added successfully', response });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ message: 'Failed to add candidate', error });
  }
}
