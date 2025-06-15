const API_URL = window.location.origin;
console.log("API_URL " + API_URL)

document.addEventListener("DOMContentLoaded", () => {
    loadRentals();
});

// Function to fetch and display rental details
async function loadRentals() {
    try {
        const response = await fetch(`${API_URL}/rentals`);
        if (!response.ok) throw new Error("Failed to fetch rental data.");
        const rentals = await response.json();

        const rentalDetails = document.getElementById("rentalDetails");
        if (!rentalDetails) throw new Error("Rental details container not found.");

        rentalDetails.innerHTML = rentals.map(rental => `
            <div class="card">
                <h3>${rental.gameName}</h3>
                <p>Tenant: ${rental.tenantName}</p>
                <p>Rental Period: ${rental.rentalPeriod}</p>
                <p>Due: ${rental.returnDueDate}</p>
                <p>Price: ${rental.rentalPrice}฿</p>
                <p><button onclick="returnGame(${rental.rentalId}, '${rental.gameName}', '${rental.returnDueDate}')">Return</button></p>
                <p><button onclick="editRental(${rental.rentalId}, prompt('Enter new rental period (days):'))">Edit</button></p>
                <p><button onclick="cancelRental(${rental.rentalId})">Cancel</button></p>
            </div>
        `).join("");

    } catch (error) {
        console.error("❌ Error loading rentals:", error);
        alert("❌ Unable to load rental details.");
    }
}

// Return a rented game
async function returnGame(rentalId, gameName, returnDueDate) {
    const isConfirmed = confirm("Are you sure you want to return this game?");
    if (!isConfirmed) {
        // alert("Return operation aborted.");
        return;
    }

    // console.log("rentalId " + rentalId);
    // console.log("gameName " + gameName);
    // console.log("returnDueDate " + returnDueDate);

    // Get the current date as the return date
    const realReturnDate = new Date();
    // console.log("returnDate " + returnDueDate)

    // Parse due date and calculate late fees
    const lateDays = Math.ceil((realReturnDate - returnDueDate) / (1000 * 60 * 60 * 24)); // Difference in days
    const lateFee = lateDays > 0 ? lateDays * 100 : 0; // 100 per late day


    const feeMessage = lateFee > 0 
        ? `You are ${lateDays} days late. Additional fee: ${lateFee}฿.` 
        : "No additional fee.";

    if (!confirm(`Return Date: ${realReturnDate}\n${feeMessage}\nProceed?`)) {
        // alert("Return operation canceled.");
        return;
    }

    try {
        // Send return details to the server
        const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                realReturnDate,
                lateFee,
            }),
        });

        if (!response.ok) throw new Error("Failed to process game return.");

        // เพิ่มสต็อกเกม
        const stockRes = await fetch(`${API_URL}/games/increase-stock/${gameName}`, {
            method: "PATCH",
        });

        if (!stockRes.ok) throw new Error("❌ Failed to reduce stock.");
        
        try {
            const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to cancel rental.");

            alert(`✅ Game returned successfully!\n${feeMessage}`);
            // Optional: Reload rentals or update UI
            // document.getElementById("rentalDetails");
            loadRentals();
            
        } catch (error) {
            console.error("❌ Error canceling rental:", error);
            alert(`❌ Failed to cancel rental: ${error.message}`);
        }
        // Reload rentals or update UI
        // loadRentals();

    } catch (error) {
        console.error("❌ Error returning game:", error);
        alert(`❌ Failed to return game: ${error.message}`);
    }
}


//////////////////// Rentals List ////////////////////
// Edit a rental
async function editRental(rentalId) {
    try {
        // Fetch current rental data
        const response = await fetch(`${API_URL}/rentals/${rentalId}`);
        if (!response.ok) throw new Error("Failed to fetch rental details.");
        const rentalData = await response.json();

        // Populate the form with current rental data
        document.getElementById("tenantName").value = rentalData.tenantName || "";
        document.getElementById("rentalPeriod").value = rentalData.rentalPeriod || "";

        // Add a listener for form submission
        const form = document.getElementById("rentalForm");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Build new rental data
            const updatedData = {
                tenantName: document.getElementById("tenantName").value.trim(),
                rentalPeriod: document.getElementById("rentalPeriod").value.trim(),
            };

            // Submit updated rental data
            await submitEditRental(rentalId, updatedData);
            loadRentals();

        });
    } catch (error) {
        console.error("❌ Error editing rental:", error);
        alert(`❌ Failed to edit rental: ${error.message}`);
    }
}

// Submit edited rental data
async function submitEditRental(rentalId, rentalData) {
    try {
        const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rentalData),
        });

        if (!response.ok) throw new Error("Failed to update rental.");

        alert("✅ Rental updated successfully!");
        // Optional: Reload rentals or update UI
        loadRentals();

    } catch (error) {
        console.error("❌ Error updating rental:", error);
        alert(`❌ Failed to update rental: ${error.message}`);
    }
}

// Cancel a rental
async function cancelRental(rentalId) {

    const isConfirmed = confirm("Are you sure you want to cancel this rental?");
    if (!isConfirmed) {
        // alert("Cancellation aborted.");
        return; // Exit the function if the user cancels
    }

    try {
        const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to cancel rental.");

        alert("✅ Rental canceled successfully!");
        // Optional: Reload rentals or update UI
        // document.getElementById("rentalDetails");
        loadRentals();
        
    } catch (error) {
        console.error("❌ Error canceling rental:", error);
        alert(`❌ Failed to cancel rental: ${error.message}`);
    }
}