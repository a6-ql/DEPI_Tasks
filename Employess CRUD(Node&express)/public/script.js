document.addEventListener('DOMContentLoaded', () => {
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const formContainer = document.getElementById('formContainer');
    const employeeForm = document.getElementById('employeeForm');
    const submitBtn = document.getElementById('submitBtn');

    // Toggle form visibility
    addEmployeeBtn.addEventListener('click', () => {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        employeeForm.reset();
        submitBtn.textContent = 'Add Employee';
        employeeForm.dataset.employeeId = '';
    });

    // Handle form submission
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            employeeId: document.getElementById('employeeId').value,
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            salary: parseFloat(document.getElementById('salary').value),
            gender: document.getElementById('gender').value
        };

        try {
            const employeeId = employeeForm.dataset.employeeId;
            let response;

            if (employeeId) {
                // Update existing employee
                response = await fetch(`/api/employees/${employeeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new employee
                response = await fetch('/api/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save employee');
            }

            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving employee. Please try again.');
        }
    });
});

// Function to edit employee
async function editEmployee(id) {
    try {
        const response = await fetch(`/api/employees/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee');
        }

        const employee = await response.json();
        
        // Fill the form with employee data
        document.getElementById('employeeId').value = employee.employeeId;
        document.getElementById('name').value = employee.name;
        document.getElementById('address').value = employee.address;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('gender').value = employee.gender;

        // Update form state
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('submitBtn').textContent = 'Update Employee';
        document.getElementById('employeeForm').dataset.employeeId = id;
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching employee data. Please try again.');
    }
}

// Function to delete employee
async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting employee. Please try again.');
        }
    }
} 