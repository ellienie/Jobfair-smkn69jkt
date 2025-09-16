

export default async function handler(req, res) {

  const SCRIPT_URL = process.env.GAS_WEB_APP_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ status: 'error', message: 'Server configuration error.' });
  }

  try {
    
    if (req.method === 'GET') {
      const response = await fetch(SCRIPT_URL); 
      
      if (!response.ok) {
        throw new Error(`Google Script (GET) request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json(data); 
    }

   
    if (req.method === 'POST') {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: req.body,
      });

      if (!response.ok) {
        throw new Error(`Google Script (POST) request failed with status ${response.status}`);
      }

      const result = await response.json();
      return res.status(200).json(result); 
    }

    
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
  }
}
