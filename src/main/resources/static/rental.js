const API_URL = "http://localhost:8081";

////////////////////// Rental
// คำนวณราคาจากจำนวนวัน
function calculateRentalPrice(days) {
  const ratePerDay = 10;
  return days * ratePerDay;
}

// สร้างข้อมูลการเช่า
function buildRentalData(gameName, tenantName, rentalPeriod) {
  const numberOfDays = parseInt(rentalPeriod) || 0;
  if (numberOfDays <= 0) {
    throw new Error("Invalid rental period. Must be greater than 0.");
  }

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + numberOfDays);

  return {
    gameName,
    tenantName,
    rentalPeriod: `${numberOfDays} days`,
    rentalDate: today.toISOString().split("T")[0],
    returnDueDate: dueDate.toISOString().split("T")[0],
    rentalPrice: calculateRentalPrice(numberOfDays),
  };
}

// แสดงข้อมูลการชำระเงิน
function showPaymentConfirmation(data) {
  const paymentDetails = `
    <p><strong>Game Name:</strong> ${data.gameName}</p>
    <p><strong>Tenant Name:</strong> ${data.tenantName}</p>
    <p><strong>Rental Period:</strong> ${data.rentalPeriod}</p>
    <p><strong>Return Due Date:</strong> ${data.returnDueDate}</p>
    <p><strong>Rental Price:</strong> $${data.rentalPrice}</p>
  `;
  document.getElementById("paymentDetails").innerHTML = paymentDetails;
  document.getElementById("paymentConfirmation").style.display = "flex";
}

// ส่งข้อมูลเช่าไปยัง backend
async function submitRental(rentalData) {
  try {
    // สร้างการเช่า
    const res = await fetch(`${API_URL}/rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rentalData),
    });

    if (!res.ok) throw new Error("Failed to create rental.");

    // ลดสต็อกเกม
    const stockRes = await fetch(
      `${API_URL}/games/reduce-stock/${encodeURIComponent(rentalData.gameName)}`,
      { method: "PATCH" }
    );

    if (!stockRes.ok) throw new Error("Failed to reduce stock.");

    alert("✅ Payment confirmed and rental created!");

    // อัปเดตรายละเอียดการเช่า
    document.getElementById("detailGameName").innerText = rentalData.gameName;
    document.getElementById("detailTenantName").innerText = rentalData.tenantName;
    document.getElementById("detailRentalPeriod").innerText = rentalData.rentalPeriod;
    document.getElementById("detailReturnDueDate").innerText = rentalData.returnDueDate;
    document.getElementById("detailRentalPrice").innerText = `$${rentalData.rentalPrice}`;

    document.getElementById("paymentConfirmation").style.display = "none";
  } catch (error) {
    console.error("❌ Error:", error);
    alert("❌ Something went wrong: " + error.message);
  }
}

// ฟังก์ชันตั้ง event listener ให้กับฟอร์ม
// function setupRentalForm() {
//   const form = document.getElementById("rentalForm");
//   if (!form) {
//     console.error("Form with id 'rentalForm' not found!");
//     return;
//   }

//   form.addEventListener("submit", function (e) {
//     e.preventDefault();  // ป้องกันรีเฟรชหน้า
//     console.log("Form submitted.");

//     // อ่านค่าจาก input fields
//     const gameName = document.getElementById("gameName").value;
//     const tenantName = document.getElementById("tenantName").value;
//     const rentalPeriod = document.getElementById("rentalPeriod").value;

//     console.log("Game Name:", gameName);
//     console.log("Tenant Name:", tenantName);
//     console.log("Rental Period:", rentalPeriod);

//     // เพิ่มการส่งข้อมูลหรือประมวลผลต่อได้ที่นี่
//   });
// }

// // เรียกฟังก์ชันนี้หลังโหลด DOM เสร็จ
// document.addEventListener("DOMContentLoaded", setupRentalForm);



document.getElementById("rentalForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submitted.");

  const gameName = document.getElementById("gameName").value.trim();
  const tenantName = document.getElementById("tenantName").value.trim();
  const rentalPeriod = document.getElementById("rentalPeriod").value.trim();

  if (!gameName || !tenantName || !rentalPeriod) {
    alert("❌ Please fill in all fields!");
    return;
  }

//   const params = new URLSearchParams(window.location.search);
//     const gameId = params.get("gameId");
//     const gameName = params.get("gameName");

//     document.getElementById("gameName").innerText = gameName;
//     document.getElementById("gameId").value = gameId;

  try {
    const rentalData = buildRentalData(gameName, tenantName, rentalPeriod);
    showPaymentConfirmation(rentalData);

    document.getElementById("confirmPayment").onclick = function () {
      submitRental(rentalData);
    };
  } catch (error) {
    alert(error.message);
  }
});