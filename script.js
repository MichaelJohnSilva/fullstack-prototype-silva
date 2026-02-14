// Use localStorage key
var STORAGE_KEY = "ipt_demo_v1";
var db = { accounts: [] };

// Load accounts from localStorage
function loadFromStorage() {
  var data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    db = JSON.parse(data);
  } else {
    db = { accounts: [] };
    saveToStorage();
  }
}

// Save accounts to localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

loadFromStorage();

// ✅ Ensure default admin account exists
var adminExists = db.accounts.find(acc => acc.email === "admin@gmail.com");
if (!adminExists) {
  db.accounts.push({
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "Admin",
    verified: true
  });
  saveToStorage();
}

// ---------------- REGISTER ----------------
var registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Check if email exists
    var exists = db.accounts.find(function(acc) {
      return acc.email === email;
    });
    if (exists) {
      alert("Email already registered!");
      return;
    }

    // Add new account
    db.accounts.push({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: "User",
      verified: false
    });
    saveToStorage();

    // Save email for verification
    localStorage.setItem("unverified_email", email);

    // Go to verify page
    window.location.href = "verify.html";
  });
}

// ---------------- VERIFY ----------------
var verifyBtn = document.getElementById("simulateVerifyBtn");
if (verifyBtn) {
  verifyBtn.addEventListener("click", function() {
    var email = localStorage.getItem("unverified_email");
    var account = db.accounts.find(function(acc) {
      return acc.email === email;
    });
    if (account) {
      account.verified = true;
      saveToStorage();

      // ✅ Save flag so login page knows to show success message
      localStorage.setItem("show_verify_success", "true");

      window.location.href = "login.html";
    }
  });
}

// ---------------- LOGIN ----------------
var loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value.trim();

    loadFromStorage();

    // ✅ Special case: Admin account
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("logged_in_user", email);
      window.location.href = "admin.html";
      return;
    }

    // Normal user lookup
    var account = db.accounts.find(function(acc) {
      return acc.email === email && acc.password === password;
    });

    if (!account) {
      alert("Invalid email or password!");
      return;
    }

    if (!account.verified) {
      alert("Please verify your email before logging in.");
      return;
    }

    // Save logged in user
    localStorage.setItem("logged_in_user", email);

    // Redirect to profile page
    window.location.href = "profile.html";
  });
}

// ---------------- PROFILE ----------------
var profileInfo = document.getElementById("profileInfo");
if (profileInfo) {
  var email = localStorage.getItem("logged_in_user");
  var data = localStorage.getItem(STORAGE_KEY);
  var db = data ? JSON.parse(data) : { accounts: [] };

  var account = db.accounts.find(function(acc) {
    return acc.email === email;
  });

  if (account) {
    profileInfo.innerHTML =
      "<h4>" + account.firstName + " " + account.lastName + "</h4>" +
      "<p><strong>Email:</strong> " + account.email + "</p>" +
      "<p><strong>Role:</strong> " + account.role + "</p>" +
      '<button class="btn btn-primary btn-sm d-inline-flex align-items-center edit-btn">' +
      '<i class="bi bi-pencil-square me-1"></i>Edit Profile</button>';

    var userRoleSpan = document.getElementById("userRole");
    if (userRoleSpan) {
      userRoleSpan.textContent = account.role;
    }
  } else {
    profileInfo.innerHTML = "<p>No user logged in.</p>";
  }
}

// ---------------- EMPLOYEES ----------------
var employeeForm = document.getElementById("employeeForm");
var employeeTableBody = document.getElementById("employeeTableBody");

if (employeeForm && employeeTableBody) {
  employeeForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var empId = document.getElementById("empId").value.trim();
    var empEmail = document.getElementById("empEmail").value.trim();
    var empPosition = document.getElementById("empPosition").value.trim();
    var empDept = document.getElementById("empDept").value.trim();
    var empHireDate = document.getElementById("empHireDate").value;

    // Save employee to localStorage
    var employees = JSON.parse(localStorage.getItem("employees") || "[]");
    employees.push({
      id: empId,
      email: empEmail,
      position: empPosition,
      dept: empDept,
      hireDate: empHireDate
    });
    localStorage.setItem("employees", JSON.stringify(employees));

    renderEmployees();
    employeeForm.reset();
  });

  function renderEmployees() {
    var employees = JSON.parse(localStorage.getItem("employees") || "[]");
    if (employees.length === 0) {
      employeeTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No employees</td></tr>';
      return;
    }
    employeeTableBody.innerHTML = employees.map(emp => `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.email}</td>
        <td>${emp.position}</td>
        <td>${emp.dept}</td>
        <td>
          <button class="btn btn-sm btn-warning">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  renderEmployees();
}

// ---------------- DEPARTMENTS ----------------
var deptForm = document.getElementById("deptForm");
var deptTableBody = document.getElementById("deptTableBody");

if (deptForm && deptTableBody) {
  deptForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var deptName = document.getElementById("deptName").value;
    var deptDesc = document.getElementById("deptDesc").value;

    var departments = JSON.parse(localStorage.getItem("departments") || "[]");
    departments.push({ name: deptName, description: deptDesc });
    localStorage.setItem("departments", JSON.stringify(departments));

    renderDepartments();
    deptForm.reset();
  });

  function renderDepartments() {
    var departments = JSON.parse(localStorage.getItem("departments") || "[]");
    if (departments.length === 0) {
      deptTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No departments</td></tr>';
      return;
    }
    deptTableBody.innerHTML = "";
    departments.forEach(function(dept, index) {
      var row = "<tr>" +
        "<td>" + dept.name + "</td>" +
        "<td>" + dept.description + "</td>" +
        "<td>" +
          "<div class='d-flex gap-2'>" +
            "<button class='btn btn-sm btn-primary' onclick='editDepartment(" + index + ")'>Edit</button>" +
            "<button class='btn btn-sm btn-danger' onclick='deleteDepartment(" + index + ")'>Delete</button>" +
          "</div>" +
        "</td>" +
      "</tr>";
      deptTableBody.innerHTML += row;
    });
  }

  window.editDepartment = function(index) {
    var departments = JSON.parse(localStorage.getItem("departments") || "[]");
    var dept = departments[index];
    document.getElementById("deptName").value = dept.name;
    document.getElementById("deptDesc").value = dept.description;
    // Remove old entry so Save overwrites
    departments.splice(index, 1);
    localStorage.setItem("departments", JSON.stringify(departments));
    renderDepartments();
  };

  window.deleteDepartment = function(index) {
    var departments = JSON.parse(localStorage.getItem("departments") || "[]");
    departments.splice(index, 1);
    localStorage.setItem("departments", JSON.stringify(departments));
    renderDepartments();
  };

  renderDepartments();
}


// ---------------- LOGOUT ----------------
var logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    // Clear logged-in user
    localStorage.removeItem("logged_in_user");
    // Redirect to dashboard (index.html) with no account logged in
    window.location.href = "index.html";
  });
}
