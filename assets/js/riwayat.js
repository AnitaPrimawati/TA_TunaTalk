document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("chat-history");
  const history = JSON.parse(localStorage.getItem("chat_history")) || [];

  history.forEach(item => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat-entry");
    chatDiv.innerHTML = `
      <p><strong>Gesture:</strong> ${item.kalimat}</p>
      <p><strong>Balasan:</strong> ${item.balasan}</p>
      <hr>
    `;
    historyContainer.appendChild(chatDiv);
  });
});
