const API_URL = "http://localhost:8081";

//////////////////// Utility Functions ////////////////////
const fetchAPI = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json ? res.json() : res;
};

const showPopupAddgame = () => {
  const popup = document.getElementById("add-game-popup");
  if (popup) {
    popup.classList.add("active");
    console.log("Popup is now visible.");
  } else {
    console.error("Popup element not found!");
  }
}

const hidePopupAddgame = () => {
  const popup = document.getElementById("add-game-popup");
  if (popup) {
    popup.classList.remove("active");
  } else {
    console.error("Popup element not found!");
  }
}

//////////////////// Load Games ////////////////////
const loadGames = async () => {
  hidePopupAddgame();
  try {
    const games = await fetchAPI(`${API_URL}/games`);
    console.log("Games data:", games);

    const container = document.getElementById("game-list");
    container.innerHTML = "";

    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${game.picture}" alt="${game.gameName}"/>
        <div class="card-body">
          <h3>${game.gameName}</h3>
          <p>Type: ${game.types}</p>
          <p>Players: ${game.numberOfPlayers}</p>
          <p>Age: ${game.ageOfPlayers}</p>
          <p>Difficulty: ${game.difficultyLevel}</p>
          <p>Playtime: ${game.playingTime}</p>
          <p class="stock">Stock: ${game.stock}</p>
          <button id="rentGameButton" onclick="window.location.href = '${API_URL}/rent.html?gameId=${game.gameId}'";>📦 Rental</button>
          <button class="edit-btn" onclick="editGame(${game.gameId})">✏️ Edit</button>
          <button class="delete-btn" onclick="deleteGame(${game.gameId})">🗑️ Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load games.", error);
  }
};

//////////////////// Edit Game ////////////////////
async function editGame(gameId) {
  try {
    // ดึงข้อมูลเกมที่ต้องการแก้ไขจาก API
    const res = await fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch game details: ${res.status}`);
    }

    const game = await res.json();

    // แสดงข้อมูลเกมใน popup ฟอร์ม
    showPopupEditgame(game);

  } catch (error) {
    console.error("Failed to load game details for editing.", error);
    alert("Failed to load game details.");
  }
}

// ฟังก์ชันสำหรับเปิด popup พร้อมข้อมูลที่ต้องแก้ไข
function showPopupEditgame(game) {
  const popup = document.getElementById("add-game-popup");
  popup.classList.add("active");

  // เติมข้อมูลในฟอร์ม
  document.getElementById("gameName").value = game.gameName;
  document.getElementById("types").value = game.types;
  document.getElementById("numberOfPlayers").value = game.numberOfPlayers;
  document.getElementById("ageOfPlayers").value = game.ageOfPlayers;
  document.getElementById("difficultyLevel").value = game.difficultyLevel;
  document.getElementById("playingTime").value = game.playingTime;
  document.getElementById("stock").value = game.stock;

  // เพิ่ม event listener สำหรับการ submit เพื่อแก้ไขเกม
  const form = document.getElementById("gameForm");
  form.onsubmit = (e) => submitEditGame(e, game.gameId);
}

// ฟังก์ชันสำหรับ submit ข้อมูลที่แก้ไข
async function submitEditGame(e, gameId) {
  e.preventDefault();

  const updatedGame = {
    gameName: document.getElementById("gameName").value,
    types: document.getElementById("types").value,
    numberOfPlayers: parseInt(document.getElementById("numberOfPlayers").value),
    ageOfPlayers: document.getElementById("ageOfPlayers").value,
    difficultyLevel: document.getElementById("difficultyLevel").value,
    playingTime: document.getElementById("playingTime").value,
    stock: parseInt(document.getElementById("stock").value),
  };

  try {
    const res = await fetch(`${API_URL}/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedGame),
    });

    if (!res.ok) {
      throw new Error(`Failed to update game: ${res.status}`);
    }

    alert("Game updated successfully!");
    hidePopupAddgame();
    // deleteGame(gameId);
    loadGames();

  } catch (error) {
    console.error("Failed to update game.", error);
    alert("Error updating game.");
  }
}

//////////////////// Delete Game ////////////////////
const deleteGame = async (gameId) => {
  if (!confirm("Are you sure you want to delete this game?")) return;
  try {
    await fetchAPI(`${API_URL}/games/${gameId}`, { method: 'DELETE' });
    alert("Game deleted successfully.");
    loadGames();
  } catch (error) {
    console.error("Failed to delete game:", error);
    alert("Error deleting game.");
  }
};

//////////////////// Add Game ////////////////////
const addNewGame = async (e) => {
  e.preventDefault();

  const file = document.getElementById("picture").files[0];
  let pictureUrl = null;

  if (file) {
    try {
      pictureUrl = await uploadToAzureBlob(file);
    } catch (error) {
      console.error("Failed to upload picture:", error);
      alert("Failed to upload picture.");
      return;
    }
  }

  const newGame = {
    gameName: document.getElementById("gameName").value,
    types: document.getElementById("types").value,
    numberOfPlayers: parseInt(document.getElementById("numberOfPlayers").value),
    ageOfPlayers: document.getElementById("ageOfPlayers").value,
    difficultyLevel: document.getElementById("difficultyLevel").value,
    playingTime: document.getElementById("playingTime").value,
    stock: parseInt(document.getElementById("stock").value),
    picture: pictureUrl,
  };

  try {
    await fetchAPI(`${API_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    });

    alert("Game added successfully!");
    hidePopupAddgame();
    e.target.reset();
    loadGames();
  } catch (error) {
    console.error("Failed to add game.", error);
  }
};

//////////////////// Azure Blob Upload ////////////////////
const uploadToAzureBlob = async (file) => {
  const containerName = "imageserver";
  const blobName = `${file.name}-${Date.now()}`;
  const domainBlob = "https://webappstorage555.blob.core.windows.net";
  const sasToken = "sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-17T15:55:24Z&st=2025-06-15T07:55:24Z&spr=https&sig=5Bg1PL7nm3LU%2FFrmEgMOL9b%2B469qCfyuzntNolvuciE%3D";
  const blobUrl = `${domainBlob}/${containerName}/${blobName}?${sasToken}`;

  const res = await fetch(blobUrl, {
    method: "PUT",
    headers: { "x-ms-blob-type": "BlockBlob" },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload file to Azure Blob. Status: ${res.status}`);
  }

  return blobUrl.split("?")[0];
};

//////////////////// Setup Add Game Form ////////////////////
const setupAddGameForm = () => {
  const addBG = document.getElementById("add-game");

  const addGameBtn = document.createElement("button");
  addGameBtn.textContent = "➕ Add Game";
  addGameBtn.id = "add-game-btn";
  addGameBtn.addEventListener("click", showPopupAddgame);
  addBG.appendChild(addGameBtn);

  const popup = document.createElement("div");
  popup.id = "add-game-popup";
  popup.innerHTML = `
    <div id="popup-content">
      <form id="gameForm">
        <h2>Add New Game</h2>
        <label>Game Name: <input type="text" id="gameName" required /></label>
        <label>Type: <input type="text" id="types" required /></label>
        <label>Players: <input type="number" id="numberOfPlayers" required /></label>
        <label>Age: <input type="text" id="ageOfPlayers" required /></label>
        <label>Difficulty: <input type="text" id="difficultyLevel" required /></label>
        <label>Playtime: <input type="text" id="playingTime" required /></label>
        <label>Stock: <input type="number" id="stock" required /></label>
        <label>Upload Image: <input type="file" id="picture" accept="image/*" required /></label>
        <div class="popup-buttons">
          <button type="submit">Submit</button>
          <button type="button" id="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  addBG.appendChild(popup);

  document.getElementById("cancel-btn").addEventListener("click", hidePopupAddgame);
  document.getElementById("gameForm").addEventListener("submit", addNewGame);
};

//////////////////// Initialize ////////////////////
document.addEventListener("DOMContentLoaded", () => {
  setupAddGameForm();
  loadGames();
});
