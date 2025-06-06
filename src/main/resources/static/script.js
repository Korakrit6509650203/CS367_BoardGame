const API_URL = "http://localhost:9090/games"; // ปรับตาม backend จริง

async function loadGames() {
  try {
    const res = await fetch(API_URL);
    const games = await res.json();
    // console.log("Game object:", games); // ตรวจว่ามีค่าไหม
    // console.log("Game ID:", games.id);

    const container = document.getElementById("game-list");

    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="images/${game.picture}" alt="${game.gameName}" />
        <div class="card-body">
          <h3>${game.gameName}</h3>
          <p>Type: ${game.types}</p>
          <p>Players: ${game.numberOfPlayers}</p>
          <p>Age: ${game.ageOfPlayers}</p>
          <p>Difficulty: ${game.difficultyLevel}</p>
          <p>Playtime: ${game.playingTime}</p>
          <p class="stock">Stock: ${game.stock}</p>
          <button onclick="window.location.href = 'http://localhost:8080/rent.html'">📦 Rental</button>
          <button class="delete-btn" onclick="deleteGame(${game.gameName})">🗑️ Delete</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load games.", error);
  }
}

loadGames();

// async function deleteGame() {
//   const res = await fetch(API_URL);
//   const games = await res.json();
//   const confirmed = confirm("Are you sure you want to delete this game?");
//   if (!confirmed) return;

//   try {
//     fetch(`http://localhost:9090/games/${game.gameName}`, {
//       method: "DELETE",
//     });
    
//     if (res.ok) {
//       alert("Game deleted successfully.");
//       document.getElementById("game-list").innerHTML = ""; // clear ก่อนโหลดใหม่
//       loadGames(); // โหลดเกมใหม่
//     } else {
//       alert("Failed to delete game.");
//     }
//   } catch (error) {
//     console.error("Error deleting game:", error);
//     alert("An error occurred.");
  // }
// }
