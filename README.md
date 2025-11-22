🚀 LNMIIT CSE Department Website

A full-stack, dynamic, CMS-enabled web application for the Computer Science & Engineering Department of LNMIIT Jaipur, built using React + Tailwind, Node.js + Express, and MySQL (Sequelize ORM).
Includes a full Admin Panel for real-time content management.

🎯 Features
🌐 Public Website

Fully responsive homepage with:

Hero slider (dynamic)

News + events section

Achievements showcase

Department information blocks

Faculty directory with:

Filters (designation)

Search functionality

Individual faculty pages

Programs (B.Tech, M.Tech, PhD)

Research areas & facilities

News & updates with individual detail pages

Events (upcoming + past)

Student achievements with images & links

Newsletter PDFs with viewer/download

Department directory (phone/email)

Mega-Menu style navbar inspired by IIT Delhi

Smooth animations using Framer Motion

🔐 Admin Panel

Secure login via JWT Authentication

Fully dynamic CMS:

Sliders (hero images)

Faculty management

Programs

News + detail pages

Events

Achievements

Newsletters (PDF upload)

Directory

Info blocks

File Uploads:

Images (auto-organized folders)

PDFs

Search, Filters, Sorting in tables

Role-ready structure (future-proof)

Built using React + Tailwind

🛠️ Tech Stack
Frontend

React 18 (Vite)

React Router DOM 6

Axios

Tailwind CSS

Framer Motion

Lucide Icons

ESLint + Prettier

Backend

Node.js 20+

Express.js

MySQL 8

Sequelize ORM (ES Modules)

JWT Auth

Multer (file uploads)

Bcrypt.js (password hashing)

CORS + Helmet security headers

📋 Prerequisites

Node.js 20+

MySQL 8+

npm / yarn

🚀 Installation & Setup
1. Clone Repository
git clone <repository-url>
cd CSE-DEPARTMENT

⚙️ 2. Backend Setup
cd backend
npm install

Create .env file

⚠️ Never commit .env.
You must have your own secret values.

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=lnmiit_cse

JWT_SECRET=your-64-character-secret-key-here

PORT=3022
NODE_ENV=development

UPLOAD_DIR=./src/uploads

ORIGIN=http://localhost:3021


👉 Your .env.sample should NOT contain real credentials.

Run Migrations & Seeders
npm run migrate
npm run seed

Start Backend
npm run dev


Backend runs at:
👉 http://localhost:3022

🎨 3. Frontend Setup
cd frontend
npm install


Create .env file:

VITE_API_BASE_URL=http://localhost:3022/api


Start frontend:

npm run dev


Frontend runs at:
👉 http://localhost:3021

🔑 Default Admin Login
Email: admin@lnmiit.ac.in
Password: Admin@123


⚠️ Change this password in production immediately.

🗂️ Project Structure
CSE-DEPARTMENT/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── models/
│   │   │   └── seeders/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── uploads/ (auto created, gitignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── assets/
│   │   └── main.jsx
│   └── package.json
│
└── README.md

🔌 API Routes
Public Endpoints
Method	Endpoint	Description
GET	/api/sliders	Get hero sliders
GET	/api/people	Faculty list
GET	/api/people/:slug	Single faculty page
GET	/api/programs	Academic programs
GET	/api/news	News list
GET	/api/news/:id	News details
GET	/api/events	Upcoming & past events
GET	/api/achievements	Achievements
GET	/api/newsletters	Newsletter PDFs
GET	/api/directory	Phone directory
GET	/api/info/:key	Static info blocks
Authentication
Method	Endpoint	Description
POST	/api/auth/login	Login
GET	/api/auth/me	Verify token
Admin Endpoints (JWT Protected)

All under: /api/admin/*

sliders

people

programs

news

events

achievements

newsletters

directory

info-blocks

Each supports full:
✔ GET
✔ POST
✔ PUT
✔ DELETE

📦 Available Scripts
Backend
npm run dev
npm start
npm run migrate
npm run migrate:down
npm run seed
npm run reset

Frontend
npm run dev
npm run build
npm run preview

📁 File Uploads

Uploaded files stored at:

backend/src/uploads/
   ├── images/
   └── pdfs/


These folders are not committed to Git.

🔐 Security Features

JWT Authentication

Bcrypt password hashing

Helmet security middleware

CORS protection

Input validation

File type validation (images + PDFs)

Rate limiting for login & upload routes

❗ Troubleshooting
MySQL not connecting
sudo systemctl status mysql
mysql -u root -p

Port already in use
lsof -ti:3022 | xargs kill -9
lsof -ti:3021 | xargs kill -9

📚 Additional Resources

React Docs

Express Docs

Sequelize Docs

Tailwind Docs

MySQL Docs

📄 License

Proprietary project for LNMIIT CSE Department.

❤️ Built with dedication for LNMIIT