
export default function handler(request, response) {
 
  if (request.method !== 'POST') {
    return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

 
  const { username, password } = request.body;


  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

 
  if (username === adminUsername && password === adminPassword) {
    
    response.status(200).json({ status: 'success' });
  } else {
    
    response.status(401).json({ status: 'error', message: 'Username atau password salah!' });
  }
}
