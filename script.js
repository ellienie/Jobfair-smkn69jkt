  const formContainer = document.getElementById('form-container');
  const adminContainer = document.getElementById('admin-container');
  const statusMessage = document.getElementById('status-message');
  const form = document.getElementById('registration-form');
  const exportCsvButton = document.getElementById('export-csv-button');
  const dataTableBody = document.getElementById('data-table-body');
  const refreshButton = document.getElementById('refresh-data');
  const searchInput = document.getElementById('search-input');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const closeAdminModal = document.getElementById('close-admin-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const logoutAdminButton = document.getElementById('logout-admin');
  const lastUpdatedText = document.getElementById('last-updated-text');
  
  const cvInput = document.getElementById('cv');
  const cvUploadArea = document.getElementById('cv-upload-area');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.querySelector('.file-name');
  const removeFileBtn = document.getElementById('remove-file');
  
  let registrationData = [];
  let updateIntervalId = null;
  let selectedFile = null;

  const submitButton = document.getElementById('submit-button');
  const buttonContent = document.getElementById('button-content');
  const loadingSpinner = document.getElementById('loading-spinner');

  const tabForm = document.getElementById('tab-form');
  const tabAdmin = document.getElementById('tab-admin');


  const SCRIPT_URL = '/api/submit-form';


  cvUploadArea.addEventListener('click', () => { cvInput.click(); });
  cvInput.addEventListener('change', (e) => { if (e.target.files.length > 0) { handleFileSelection(e.target.files[0]); } });
  cvUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); cvUploadArea.classList.add('dragover'); });
  cvUploadArea.addEventListener('dragleave', () => { cvUploadArea.classList.remove('dragover'); });
  cvUploadArea.addEventListener('drop', (e) => { e.preventDefault(); cvUploadArea.classList.remove('dragover'); if (e.dataTransfer.files.length > 0) { handleFileSelection(e.dataTransfer.files[0]); } });
  removeFileBtn.addEventListener('click', (e) => { e.stopPropagation(); resetFileInput(); });

  function handleFileSelection(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Format File Tidak Valid', text: 'Hanya file PDF, DOC, DOCX, JPG, atau PNG yang diizinkan.' });
      resetFileInput();
      return;
    }
    if (file.size > maxSize) {
      Swal.fire({ icon: 'error', title: 'File Terlalu Besar', text: 'Ukuran file maksimal adalah 5MB.' });
      resetFileInput();
      return;
    }
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.remove('hidden');
    const fileIcon = fileInfo.querySelector('i');
    if (file.type === 'application/pdf') { fileIcon.className = 'fas fa-file-pdf text-red-500 mr-2'; } 
    else if (file.type.includes('image')) { fileIcon.className = 'fas fa-file-image text-green-500 mr-2'; } 
    else { fileIcon.className = 'fas fa-file-word text-blue-500 mr-2'; }
  }

  function resetFileInput() {
    cvInput.value = '';
    selectedFile = null;
    fileInfo.classList.add('hidden');
  }

 
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedFile) {
      Swal.fire({ icon: 'error', title: 'CV Belum Diupload', text: 'Silakan upload CV Anda sebelum mendaftar.' });
      return;
    }

    submitButton.disabled = true;
    buttonContent.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile); 

    reader.onload = async () => {
      const fileBase64 = reader.result.split('base64,')[1]; 

      
      const formDataObject = {
        fullName: document.getElementById('fullName').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        birthDate: document.getElementById('birthDate').value,
        education: document.getElementById('education').value,
        alumniStatus: document.querySelector('input[name="alumniStatus"]:checked')?.value || '',
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        socialMedia: document.getElementById('socialMedia').value,
        company: document.getElementById('company').value,
      
        cvFile: fileBase64,
        cvFileName: selectedFile.name,
        cvMimeType: selectedFile.type,
      };

      try {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(formDataObject) 
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();

        if (result.status === 'success') {
          Swal.fire({ icon: 'success', title: 'Pendaftaran Berhasil!', text: 'Terima kasih, data dan CV Anda telah kami terima.' });
          form.reset();
          resetFileInput();
        } else {
          throw new Error(result.message || 'Terjadi kesalahan di server.');
        }

      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Pendaftaran Gagal', text: `Terjadi kesalahan: ${err.message}` });
      } finally {
        submitButton.disabled = false;
        buttonContent.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
      }
    };

    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        Swal.fire({ icon: 'error', title: 'Gagal Membaca File', text: 'Tidak dapat memproses file yang Anda pilih.' });
        submitButton.disabled = false;
        buttonContent.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
    };
  });


  function showAdminLoginModal() { adminLoginModal.style.display = 'block'; modalBackdrop.style.display = 'block'; document.body.style.overflow = 'hidden'; }
function hideAdminLoginModal() { adminLoginModal.style.display = 'none'; modalBackdrop.style.display = 'none'; document.body.style.overflow = 'auto'; }
tabForm.addEventListener('click', () => { formContainer.classList.remove('hidden'); adminContainer.classList.add('hidden'); tabForm.classList.add('bg-indigo-600','text-white', 'tab-active'); tabForm.classList.remove('hover:bg-gray-50', 'text-gray-600'); tabAdmin.classList.remove('bg-indigo-600','text-white', 'tab-active'); tabAdmin.classList.add('hover:bg-gray-50', 'text-gray-600'); clearInterval(updateIntervalId); });
tabAdmin.addEventListener('click', () => { showAdminLoginModal(); });
closeAdminModal.addEventListener('click', hideAdminLoginModal);
modalBackdrop.addEventListener('click', hideAdminLoginModal);


adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.status === 'success') {
            hideAdminLoginModal();
            formContainer.classList.add('hidden');
            adminContainer.classList.remove('hidden');
            tabAdmin.classList.add('bg-indigo-600','text-white', 'tab-active');
            tabAdmin.classList.remove('hover:bg-gray-50', 'text-gray-600');
            tabForm.classList.remove('bg-indigo-600','text-white', 'tab-active');
            tabForm.classList.add('hover:bg-gray-50', 'text-gray-600');
            startAdminPanel();
        } else {
            Swal.fire({ icon: 'error', title: 'Login Gagal', text: result.message || 'Username atau password salah!' });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Login Gagal', text: 'Terjadi kesalahan jaringan atau server.' });
    }
});

logoutAdminButton.addEventListener('click', () => { formContainer.classList.remove('hidden'); adminContainer.classList.add('hidden'); tabForm.classList.add('bg-indigo-600','text-white', 'tab-active'); tabForm.classList.remove('hover:bg-gray-50', 'text-gray-600'); tabAdmin.classList.remove('bg-indigo-600','text-white', 'tab-active'); tabAdmin.classList.add('hover:bg-gray-50', 'text-gray-600'); clearInterval(updateIntervalId); });

function startAdminPanel() { fetchAdminData(); updateIntervalId = setInterval(fetchAdminData, 30000); }
async function fetchAdminData() { lastUpdatedText.textContent = 'Memuat data...'; try { const response = await fetch(SCRIPT_URL); if (!response.ok) throw new Error('Gagal jaringan'); const data = await response.json(); registrationData = data; updateStats(data); renderTable(data); lastUpdatedText.textContent = 'Diperbarui: ' + new Date().toLocaleTimeString('id-ID'); } catch (err) { console.error(err); lastUpdatedText.textContent = 'Gagal memuat data.'; } }
function updateStats(data) { const today = new Date().toLocaleDateString('id-ID'); const todayRegs = data.filter(item => new Date(item['Time']).toLocaleDateString('id-ID') === today).length; const maleRegs = data.filter(item => item['Jenis Kelamin'] === 'Laki-laki').length; const femaleRegs = data.filter(item => item['Jenis Kelamin'] === 'Perempuan').length; document.getElementById('total-registrants').textContent = data.length; document.getElementById('today-registrants').textContent = todayRegs; document.getElementById('male-registrants').textContent = maleRegs; document.getElementById('female-registrants').textContent = femaleRegs; document.getElementById('data-count').textContent = data.length; document.getElementById('total-data').textContent = data.length; }
function renderTable(data) { 
    dataTableBody.innerHTML = ''; 
    if (data.length === 0) { 
        dataTableBody.innerHTML = '<tr class="table-row-hover"><td colspan="11" class="px-4 py-6 text-center text-gray-500"><i class="far fa-folder-open mr-2"></i>Belum ada data.</td></tr>'; 
        exportCsvButton.disabled = true; 
    } else { 
        exportCsvButton.disabled = false; 
        data.forEach(item => { 
            const row = document.createElement('tr'); 
            row.classList.add('table-row-hover'); 
            row.innerHTML = `
            <td class="px-4 py-3 border-b"><div class="font-medium">${item['Nama Lengkap'] || '-'}</div></td>
            <td class="px-4 py-3 border-b"><span class="px-2 py-1 rounded-full text-xs ${item['Jenis Kelamin'] === 'Laki-laki' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}">${item['Jenis Kelamin'] || '-'}</span></td>
            <td class="px-4 py-3 border-b">${item['Tanggal Lahir'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Instansi Pendidikan'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Status Alumni'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Alamat'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Nomor Telepon'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Email'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Akun Media Sosial'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Perusahaan'] || '-'}</td>
            <td class="px-4 py-3 border-b">${item['Time'] ? new Date(item['Time']).toLocaleString() : '-'}</td>
            `; 
            dataTableBody.appendChild(row); 
        }); 
    } 
}
exportCsvButton.addEventListener('click', () => { if (registrationData.length === 0) { Swal.fire({ icon: 'warning', title: 'Tidak Ada Data', text: 'Tidak ada data untuk diekspor!' }); return; } const headers = Object.keys(registrationData[0]); let csvContent = headers.join(",") + "\n"; registrationData.forEach(item => { const row = headers.map(h => `"${item[h] || ''}"`).join(","); csvContent += row + "\n"; }); const blob = new Blob([csvContent], { type: "text/csv" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "data_pendaftar_jobfair.csv"; link.click(); });
refreshButton.addEventListener('click', fetchAdminData);
searchInput.addEventListener('input', (e) => { const term = e.target.value.toLowerCase(); if (term) { const filtered = registrationData.filter(item => (item['Nama Lengkap'] && item['Nama Lengkap'].toLowerCase().includes(term)) || (item['Email'] && item['Email'].toLowerCase().includes(term)) || (item['Nomor Telepon'] && item['Nomor Telepon'].includes(term))); renderTable(filtered); document.getElementById('data-count').textContent = filtered.length; } else { renderTable(registrationData); document.getElementById('data-count').textContent = registrationData.length; } });



