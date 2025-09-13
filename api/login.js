// api/login.js
export default function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  // Ambil username dan password dari body permintaan
  const { username, password } = request.body;

  // Dapatkan kredensial admin dari Vercel Environment Variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Validasi kredensial
  if (username === adminUsername && password === adminPassword) {
    // Jika kredensial cocok, kirim respons sukses
    response.status(200).json({ status: 'success' });
  } else {
    // Jika tidak cocok, kirim respons gagal
    response.status(401).json({ status: 'error', message: 'Username atau password salah!' });
  }
}
