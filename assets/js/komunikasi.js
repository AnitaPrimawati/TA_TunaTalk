// Ambil riwayat chat dari localStorage
let chatHistory = JSON.parse(localStorage.getItem("chatSIBI") || "[]");

// Render chat ke chat-box
function renderChat() {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;
  chatBox.innerHTML = "";
  chatHistory.forEach(item => {
    // Pesan pengguna
    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble user";
    userMsg.textContent = item.pesan;
    chatBox.appendChild(userMsg);

    // Balasan sistem (jika ada)
    if (item.balasan) {
      const sysMsg = document.createElement("div");
      sysMsg.className = "chat-bubble system";
      sysMsg.textContent = item.balasan;
      chatBox.appendChild(sysMsg);
    }

    // Tampilkan waktu (opsional)
    if (item.waktu) {
      const waktuDiv = document.createElement("div");
      waktuDiv.style.fontSize = "12px";
      waktuDiv.style.color = "#888";
      waktuDiv.style.margin = "2px 0 8px 0";
      waktuDiv.textContent = item.waktu;
      chatBox.appendChild(waktuDiv);
    }
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Kirim pesan baru
function kirimPesan() {
  const input = document.getElementById("chatInput");
  if (!input) return;
  const pesan = input.value.trim();
  if (!pesan) return;
  // Simulasi balasan otomatis
  const balasan = "Balasan: " + pesan;
  const now = new Date();
  const waktu = now.toISOString().slice(0, 10); // YYYY-MM-DD
  chatHistory.push({ pesan, balasan, waktu });
  localStorage.setItem("chatSIBI", JSON.stringify(chatHistory));
  input.value = "";
  renderChat();
}

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", renderChat);