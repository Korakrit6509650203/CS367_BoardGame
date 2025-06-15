const API_URL = window.location.origin;
console.log("API_URL " + API_URL)
// const API_URL = "http://localhost:8081"; // Base API URL

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    const queryParams = new URLSearchParams(window.location.search);
    const gameId = queryParams.get("gameId");

    if (gameId) loadGameDetails(gameId);
    initializePage();
});

// Initialize the combined page
function initializePage() {
    document.body.innerHTML = `
        <div class="container mt-5">
            <div id="gameDetails" class="mb-5"></div> 
            <div id="rentalFormContainer"></div>
            <div id="rentalDetailsContainer" class="mt-5"></div>
            <div id="paymentConfirmation" class="mt-5" style="display: none;">
                <div class="card mt-3">
                    <h3>💳 Payment Confirmation</h3>
                    <p id="paymentDetails"></p>
                    <button id="confirmPayment" class="btn btn-success">Confirm Payment</button>
                </div>
            </div>
            <div class="mt-4">
                <button id="backButton" class="btn btn-secondary"> ⬅ Back to Shop</button>
            </div>
        </div>
    `;

    // Back button functionality
    const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", () => {
        window.location.href = `${API_URL}/`;
    });

    const confirmPaymentButton = document.getElementById("confirmPayment");
    if (confirmPaymentButton) {
        confirmPaymentButton.addEventListener("click", () => {
            alert("Payment confirmed!");
        });
    }
}

// Fetch and display game details
async function loadGameDetails(gameId) {
    try {
        const response = await fetch(`${API_URL}/games/${gameId}`);
        if (!response.ok) throw new Error("Failed to fetch game details.");
        const gameData = await response.json();
        displayGameDetails(gameData);

        // Store gameName in body attribute
        document.body.setAttribute("data-game-name", gameData.gameName);

    } catch (error) {
        console.error("Error loading game details:", error);
        alert("Unable to load game details.");
    }
}

// Display game details in the UI
function displayGameDetails(gameData) {
    const gameDetails = document.getElementById("gameDetails");
    if (!gameDetails || !gameData) return;

    gameDetails.innerHTML = `
        <div class="game-details">
            <img src="${gameData.picture}" alt="${gameData.gameName}" class="img-fluid">
            <h2>${gameData.gameName}</h2>
            <p><strong>Type:</strong> ${gameData.types}</p>
            <p><strong>Players:</strong> ${gameData.numberOfPlayers}</p>
            <p><strong>Difficulty:</strong> ${gameData.difficultyLevel}</p>
            <p><strong>Age:</strong> ${gameData.ageOfPlayers}</p>
            <p><strong>Playtime:</strong> ${gameData.playingTime}</p>
            <p><strong>Stock:</strong> ${gameData.stock}</p>
        </div>
    `;

    createRentalForm(); // Initialize rental form after game details
}

// Create rental form dynamically
function createRentalForm() {
    const rentalFormContainer = document.getElementById("rentalFormContainer");
    if (!rentalFormContainer) return;

    rentalFormContainer.innerHTML = `
        <h3>📝 Rent a Board Game</h3>
        <form id="rentalForm">
            <div class="mb-3">
                <label for="tenantName" class="form-label">Your Name</label>
                <input type="text" id="tenantName" class="form-control" placeholder="Enter Your Name" required>
            </div>
            <div class="mb-3">
                <label for="rentalPeriod" class="form-label">Rental Period (days)</label>
                <input type="number" id="rentalPeriod" class="form-control" placeholder="Enter Rental Period" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit Rental</button>
        </form>
    `;

    const rentalForm = document.getElementById("rentalForm");
    rentalForm.addEventListener("submit", handleRentalSubmission);
}

// Handle rental form submission
async function handleRentalSubmission(event) {
    event.preventDefault();

    const gameName = document.body.getAttribute("data-game-name");
    const tenantName = document.getElementById("tenantName").value.trim();
    const rentalPeriod = parseInt(document.getElementById("rentalPeriod").value.trim(), 10);

    if (!tenantName || isNaN(rentalPeriod) || rentalPeriod <= 0) {
        alert("❌ Please provide valid input!");
        return;
    }

    try {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + rentalPeriod);

        const rentalData = {
            gameName,
            tenantName,
            rentalPeriod: `${rentalPeriod} days`,
            rentalDate: today.toISOString().split("T")[0],
            returnDueDate: dueDate.toISOString().split("T")[0],
            rentalPrice: calculateRentalPrice(rentalPeriod),
        };

        await submitRental(rentalData);
        alert("✅ Rental created successfully!");
        createRentalDetails(rentalData);

    } catch (error) {
        console.error("Error submitting rental:", error);
        alert("❌ Something went wrong: " + error.message);
    }
}

// Submit rental data
async function submitRental(rentalData) {
    try {
        const res = await fetch(`${API_URL}/rentals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rentalData),
        });

        if (!res.ok) throw new Error("Failed to create rental.");

        // Update stock
        await fetch(`${API_URL}/games/reduce-stock/${rentalData.gameName}`, { method: "PATCH" });

    } catch (error) {
        throw error;
    }
}

// Create and display rental details
function createRentalDetails(rentalData) {
    const rentalDetailsContainer = document.getElementById("rentalDetailsContainer");
    if (!rentalDetailsContainer) return;

    rentalDetailsContainer.innerHTML = `
        <div class="card mt-3">
            <h3>📋 Rental Details</h3>
            <p><strong>Game Name:</strong> ${rentalData.gameName}</p>
            <p><strong>Tenant Name:</strong> ${rentalData.tenantName}</p>
            <p><strong>Rental Period:</strong> ${rentalData.rentalPeriod}</p>
            <p><strong>Return Due Date:</strong> ${rentalData.returnDueDate}</p>
            <p><strong>Rental Price:</strong> ${rentalData.rentalPrice}฿</p>
        </div>
    `;
}

// Calculate rental price
function calculateRentalPrice(days) {
    const ratePerDay = 10;
    return days * ratePerDay;
}
