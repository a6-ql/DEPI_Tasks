// General Listeners
const clsBtn = document.querySelector('.popup-close-btn');
const opnBtn = document.querySelector('.popup-open-btn');
const pp = document.querySelector('.popup');
const ol = document.querySelector('.overlay');
const fm = document.querySelector('.form');
const sbmBtn = document.querySelector('.submit-btn');

clsBtn.addEventListener('click', () => {
  pp.classList.remove('show');
  ol.classList.remove('show');
  fm.reset();
  sbmBtn.textContent = 'Add Employee';
});

opnBtn.addEventListener('click', () => {
  pp.classList.add('show');
  ol.classList.add('show');
  sbmBtn.textContent = 'Add Employee';
});

// API Actions
const API = 'http://localhost:3000/api/employees';

// Get Employees Function
async function getEmployees(url) {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data || [];
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// Get an Employee Function
async function getEmployee(url, id) {
  try {
    const resp = await fetch(`${url}/${id}`);
    const employee = await resp.json();
    return employee;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Add an Employee Function
async function addEmployee(url, employee) {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Update an Employee Function
async function updateEmployee(url, id, employee) {
  try {
    const resp = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Delete an Employee Function
async function deleteEmployee(url, id) {
  try {
    const resp = await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });
    const employee = await resp.json();
    return employee;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Create employee cards
async function createCards() {
  try {
    const employees = await getEmployees(API);
    const row = document.querySelector('.cards-container');
    
    row.innerHTML = '';

    if (!employees || employees.length === 0) {
      const h2 = document.createElement('h2');
      h2.className = 'text-center fs-1 text-secondary';
      h2.textContent = 'Add your first employee';
      const icn = document.createElement('div');
      icn.className = 'text-center fs-1 text-secondary mb-3';
      icn.textContent = '👥';
      row.appendChild(icn);
      row.appendChild(h2);
      return;
    }

    employees.forEach((employee) => {
      const cc = document.createElement('div');
      cc.className = 'col-12 col-md-6 col-lg-4 mb-4';

      const cd = document.createElement('div');
      cd.setAttribute('data-employee-id', employee._id);
      cd.className = 'card h-100 border-0 shadow rounded-4 overflow-hidden';
      
      cd.innerHTML = `
        <div class="card-body px-3 pb-4 d-flex flex-column">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="card-title mb-0 text-primary fw-bold">${employee.name}</h5>
            <span class="badge bg-light text-dark">${employee.employeeId}</span>
          </div>
          <div class="mb-2">
            <small class="text-muted">Address:</small>
            <p class="mb-0">${employee.address}</p>
          </div>
          <div class="mb-2">
            <small class="text-muted">Salary:</small>
            <p class="mb-0">$${employee.salary}</p>
          </div>
          <div class="mb-3">
            <small class="text-muted">Gender:</small>
            <p class="mb-0">${employee.gender}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <button class="btn btn-outline-primary rounded-pill px-3" onclick="openEdit('${employee._id}')">Edit</button>
            <button class="btn btn-outline-danger rounded-pill px-3" onclick="delEmployee('${employee._id}')">Delete</button>
          </div>
        </div>
      `;

      cc.appendChild(cd);
      row.appendChild(cc);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

// Delete Employee Function (UI handler)
async function delEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    await deleteEmployee(API, id);
    createCards();
  }
}

// Open Update Form
async function openEdit(id) {
  const employee = await getEmployee(API, id);
  if (!employee) return;
  
  document.querySelector('#employeeId').value = employee.employeeId || '';
  document.querySelector('#name').value = employee.name || '';
  document.querySelector('#address').value = employee.address || '';
  document.querySelector('#salary').value = employee.salary || '';
  document.querySelector('#gender').value = employee.gender || '';

  fm.dataset.employeeId = id;

  pp.classList.add('show');
  ol.classList.add('show');

  sbmBtn.textContent = 'Update Employee';
}

// Submit Form
fm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const employeeId = document.querySelector('#employeeId').value;
  const name = document.querySelector('#name').value;
  const address = document.querySelector('#address').value;
  const salary = document.querySelector('#salary').value;
  const gender = document.querySelector('#gender').value;

  const employee = {
    employeeId,
    name,
    address,
    salary,
    gender
  }; 
  
  if (!employeeId || !name || !address || !salary || !gender) {
    alert('Please fill all fields');
    return;
  }

  const id = fm.dataset.employeeId;

  if (sbmBtn.textContent === 'Update Employee') {
    await updateEmployee(API, id, employee);
    createCards();
  } else {
    await addEmployee(API, employee);
    createCards();
  }
  
  fm.reset();
  fm.removeAttribute('data-employee-id');
  sbmBtn.textContent = 'Add Employee';

  pp.classList.remove('show');
  ol.classList.remove('show');
});

// Load Employees When DOM content is loaded
document.addEventListener('DOMContentLoaded', () => createCards());
