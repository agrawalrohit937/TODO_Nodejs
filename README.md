🚀 ZenTodo – Full Stack Todo App
A modern, full-stack Todo application with authentication, built using Node.js, Express, MongoDB, and a beautiful interactive frontend.

✨ Features

🔐 User Authentication (JWT आधारित)
📝 Create, Edit, Delete Todos
✅ Mark Todos as Completed
🔍 Search & Filter (All / Completed / Pending)
📊 Task Statistics (Total & Completed)
💾 Persistent Login using LocalStorage
🎨 Modern Glassmorphism UI
⚡ Smooth & Interactive User Experience


🛠️ Tech Stack
🔹 Backend

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication

🔹 Frontend

HTML, CSS, JavaScript
Glassmorphism UI Design
Fetch API


📁 Project Structure
TODO_NODE/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── public/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── app.js
│   └── .env
│
├── .gitignore
└── README.md


⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/backend


2️⃣ Install dependencies
npm install


3️⃣ Create .env file
MONGO_URI=mongodb://localhost:27017/todoDB
JWT_SECRET=your_secret_key


4️⃣ Run the server
npx nodemon app.js


5️⃣ Open in browser
http://localhost:5000


🔐 API Endpoints
Auth

POST /api/auth/register
POST /api/auth/login

Todos (Protected)

GET /api/todos
POST /api/todos
PUT /api/todos/:id
DELETE /api/todos/:id


📸 Screenshots

Add your project screenshots here (Login Page, Dashboard, etc.)


🚀 Future Improvements

🌐 Deployment (Render / Vercel)
📱 Mobile Responsive UI
🔔 Notifications
📊 Advanced Analytics


👨‍💻 Author
Rohit Agrawal

⭐ Show Your Support
If you like this project, give it a ⭐ on GitHub!
