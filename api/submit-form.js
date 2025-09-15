// File: /api/submit-form.js

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  // Ambil URL rahasia dari environment variable
  const SCRIPT_URL = process.env.GAS_WEB_APP_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ status: 'error', message: 'Server configuration error.' });
  }

  try {
    // Teruskan (forward) request body dari frontend ke Google Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: req.body, // req.body sudah dalam bentuk string JSON dari frontend
    });

    if (!response.ok) {
      throw new Error(`Google Script request failed with status ${response.status}`);
    }

    // Ambil hasil dari Google Apps Script
    const result = await response.json();

    // Kirim kembali hasilnya ke frontend
    res.status(200).json(result);

  } catch (error) {
    console.error('Error forwarding request to Google Apps Script:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit form.' });
  }
}
