// Menggunakan path relatif, bukan alamat lengkap
const API_URL = "/api";

const sidebar = document.getElementById("sidebar");
const hamburgerButton = document.getElementById("hamburger-button");
const closeSidebarButton = document.getElementById("close-sidebar-button");
const historyListContainer = document.getElementById("history-list-container");

const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const newChatButton = document.getElementById("new-chat-button");
const headerActions = document.getElementById("header-actions");

let currentConversationId = localStorage.getItem("conversationId");
let guestConversationHistory = [];

function getRelativeDateGroup(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const checkDate = new Date(date);
  if (checkDate >= today) return "Hari Ini";
  if (checkDate >= yesterday) return "Kemarin";
  if (checkDate >= sevenDaysAgo) return "7 Hari Terakhir";
  return "Lebih Lama";
}

async function loadHistoryList() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch(`${API_URL}/chats`, {
      headers: { "x-auth-token": token },
    });
    if (!res.ok) throw new Error("Gagal memuat riwayat");
    const histories = await res.json();
    historyListContainer.innerHTML = "";
    let lastHeader = null;
    histories.forEach((history) => {
      const groupTitle = getRelativeDateGroup(history.createdAt);
      if (groupTitle !== lastHeader) {
        const titleElement = document.createElement("h4");
        titleElement.className = "history-group-title";
        titleElement.textContent = groupTitle;
        historyListContainer.appendChild(titleElement);
        lastHeader = groupTitle;
      }
      const li = document.createElement("div");
      li.className = "history-item";
      li.dataset.id = history._id;
      const titleSpan = document.createElement("span");
      titleSpan.className = "history-title";
      titleSpan.textContent = history.title || "Percakapan Lama";
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-history-btn";
      deleteBtn.title = "Hapus Percakapan";
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
      deleteBtn.onclick = async (e) => {
        e.stopPropagation();
        if (
          confirm(
            `Anda yakin ingin menghapus percakapan "${titleSpan.textContent}"?`
          )
        ) {
          await deleteConversation(history._id, li);
        }
      };
      li.appendChild(titleSpan);
      li.appendChild(deleteBtn);
      if (history._id === currentConversationId) {
        li.classList.add("active");
      }
      li.onclick = () => {
        if (currentConversationId !== history._id) {
          currentConversationId = history._id;
          localStorage.setItem("conversationId", currentConversationId);
          loadChatHistory(currentConversationId);
          updateHistoryListActiveState();
        }
        toggleSidebar();
      };
      historyListContainer.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

async function deleteConversation(id, elementToRemove) {
  const token = localStorage.getItem("token");
  try {
    const deleteRes = await fetch(`${API_URL}/chats/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });
    if (!deleteRes.ok) throw new Error("Gagal menghapus");
    if (currentConversationId === id) {
      localStorage.removeItem("conversationId");
      currentConversationId = null;
      chatWindow.innerHTML = "";
      displayMessage("bot", "Yah chat kita udah dihapus, ayo chat lagi!😃");
    }
    elementToRemove.remove();
    cleanupEmptyHeaders();
  } catch (err) {
    alert("Gagal menghapus percakapan.");
  }
}

function cleanupEmptyHeaders() {
  const allHeaders = historyListContainer.querySelectorAll(
    ".history-group-title"
  );
  allHeaders.forEach((header) => {
    if (
      !header.nextElementSibling ||
      header.nextElementSibling.classList.contains("history-group-title")
    ) {
      header.remove();
    }
  });
}

function updateHistoryListActiveState() {
  const allItems = historyListContainer.querySelectorAll(".history-item");
  allItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.id === currentConversationId);
  });
}

function toggleSidebar() {
  sidebar.classList.toggle("open");
}

function setupHeader() {
  const token = localStorage.getItem("token");
  headerActions.innerHTML = "";
  hamburgerButton.style.display = "none";
  if (token) {
    hamburgerButton.style.display = "block";
    const logoutButton = document.createElement("button");
    logoutButton.id = "logout-button";
    logoutButton.className = "icon-button";
    logoutButton.title = "Logout";
    logoutButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`;
    logoutButton.onclick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("conversationId");
      window.location.reload();
    };
    headerActions.appendChild(logoutButton);
  } else {
    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.className = "header-button";
    loginButton.textContent = "Login";
    loginButton.onclick = () => {
      window.location.href = "/login.html";
    };
    headerActions.appendChild(loginButton);
  }
}

async function loadChatHistory(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    displayMessage(
      "bot",
      "Selamat datang! Aku AEROSKY, Ngobrol ga sih gabut banget nih rasanya😅"
    );
    return;
  }
  if (!id) {
    chatWindow.innerHTML = "";
    displayMessage("bot", "Ngobrol yuk kak gabut nih😃");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/chats/${id}`, {
      headers: { "x-auth-token": token },
    });
    if (!response.ok) {
      localStorage.removeItem("conversationId");
      currentConversationId = null;
      chatWindow.innerHTML = "";
      displayMessage("bot", "Gak ada history chat nih. Ayo ngobrol dulu✌️😉");
      return;
    }
    const conversation = await response.json();
    chatWindow.innerHTML = "";
    conversation.messages.forEach((msg) => {
      const displayRole = msg.role === "model" ? "bot" : "user";
      displayMessage(displayRole, msg.parts[0].text);
    });
    updateHistoryListActiveState();
  } catch (error) {
    displayMessage("error", "Gagal memuat histori chat.");
  }
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  displayMessage("user", message);
  messageInput.value = "";
  const token = localStorage.getItem("token");
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message");
  typingIndicator.innerHTML = `<p><i>Sabar gue lagi ngetik...</i></p>`;
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  try {
    let response;
    if (token) {
      response = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({
          message: message,
          conversationId: currentConversationId,
        }),
      });
    } else {
      guestConversationHistory.push({
        role: "user",
        parts: [{ text: message }],
      });
      response = await fetch(`${API_URL}/chats/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          history: guestConversationHistory,
        }),
      });
    }
    chatWindow.removeChild(typingIndicator);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    displayMessage("bot", data.response);
    if (token) {
      const isNewConversation = !currentConversationId;
      currentConversationId = data.conversationId;
      localStorage.setItem("conversationId", currentConversationId);
      if (isNewConversation) {
        loadHistoryList();
      }
      updateHistoryListActiveState();
    } else {
      guestConversationHistory.push({
        role: "model",
        parts: [{ text: data.response }],
      });
    }
  } catch (error) {
    if (chatWindow.contains(typingIndicator)) {
      chatWindow.removeChild(typingIndicator);
    }
    displayMessage("error", `Error: ${error.message}`);
  }
}

function displayMessage(role, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${role}-message`);
  messageDiv.innerHTML = `<p>${text.replace(/\n/g, "<br>")}</p>`;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
hamburgerButton.addEventListener("click", toggleSidebar);
closeSidebarButton.addEventListener("click", toggleSidebar);
newChatButton.addEventListener("click", () => {
  localStorage.removeItem("conversationId");
  currentConversationId = null;
  guestConversationHistory = [];
  chatWindow.innerHTML = "";
  displayMessage("bot", "Percakapan baru dimulai.");
  updateHistoryListActiveState();
});

window.addEventListener("load", () => {
  setupHeader();
  loadChatHistory(currentConversationId);
  if (localStorage.getItem("token")) {
    loadHistoryList();
  }
});
