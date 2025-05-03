const jsvr = require('json-server');
const srv = jsvr.create();
const rtr = jsvr.router('books.json');
const mdwr = jsvr.defaults();
const cors = require('cors');

// Enable CORS for all routes
srv.use(cors());

// Set default middlewares (logger, static, cors)
srv.use(mdwr);

// Custom routes
srv.use((req, res, next) => {
  // Modify the response for GET /books to handle our books.json structure
  if (req.method === 'GET' && req.path === '/books') {
    rtr.db.setState(rtr.db.getState());
  }
  next();
});

srv.use(rtr);

const PORT = 3000;
srv.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/books`);
}); 