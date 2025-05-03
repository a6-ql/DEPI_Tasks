const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('Connected to MongoDB');
    console.log('Using MongoDB URI:', MONGODB_URI);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB URI:', MONGODB_URI);
    process.exit(1);
});

// Routes
// Render the main page
app.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.render('index', { employees });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).render('error', { error: 'Error fetching employees from database' });
    }
});

// API Routes
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ message: 'Error deleting employee' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 