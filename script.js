// Key for localStorage
let STORAGE_KEY = "ipt_demo_v1";
let db = { accounts: [] };

// Load existing accounts from localStorage
function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    db = JSON.parse(data);
  } else {
    db = { accounts: [] };
    saveToStorage();
  }
}

// Save accounts back to localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

loadFromStorage();

// Handle Register form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get values from inputs
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if email already exists
    if (db.accounts.find(acc => acc.email === email)) {
      alert("Email already registered!");
      return;
    }

    // Add new account (unverified by default)
    db.accounts.push({
      firstName,
      lastName,
      email,
      password,
      role: "User",
      verified: false
    });
    saveToStorage();

    // Store email temporarily for verification
    localStorage.setItem("unverified_email", email);

    // Redirect to verify page
    window.location.href = "verify.html";
  });
}

// Handle Verify page
const verifyBtn = document.getElementById("simulateVerifyBtn");
if (verifyBtn) {
  verifyBtn.addEventListener("click", function() {
    const email = localStorage.getItem("unverified_email");
    const account = db.accounts.find(acc => acc.email === email);
    if (account) {
      account.verified = true;
      saveToStorage();
      alert("Email verified! You may now log in.");
      window.location.href = "login.html";
    }
  });
}

// Handle profile page
const profileInfo = document.getElementById("profileInfo");
if (profileInfo) {
  const email = localStorage.getItem("logged_in_user");
  const data = localStorage.getItem("ipt_demo_v1");
  let db = data ? JSON.parse(data) : { accounts: [] };

  const account = db.accounts.find(acc => acc.email === email);
  if (account) {
    // Show profile info
    profileInfo.innerHTML = `
      <p><strong>Name:</strong> ${account.firstName} ${account.lastName}</p>
      <p><strong>Email:</strong> ${account.email}</p>
      <p><strong>Role:</strong> ${account.role}</p>
    `;

    // Update dropdown role
    const userRoleSpan = document.getElementById("userRole");
    if (userRoleSpan) {
      userRoleSpan.textContent = account.role;
    }
  } else {
    profileInfo.innerHTML = `<p>No user logged in.</p>`;
  }
}

// Handle logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("logged_in_user");
    window.location.href = "login.html";
  });
}

