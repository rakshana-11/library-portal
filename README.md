# 📚 Library Portal - MERN Stack College Mini Project

A clean, beginner-friendly, and fully functional College Library Management System built on the **MERN** (MongoDB, Express.js, React.js, Node.js) stack with **Bootstrap 5** and **Vite**.

---

## 🚀 Key Features

- 🔐 **Role-Based Authentication (JWT & bcryptjs)**:
  - **Member (Student)**: Browse catalog, filter by category, view borrowing history, manage profile, view notifications.
  - **Librarian**: Add/edit/delete books, register and manage members, issue books (with real-time stock balance decrement), mark books returned (stock increment), view all circulation history.
  - **Admin**: All Librarian functions plus Admin Dashboard, system metrics, and User Role Management.
- ⚡ **Debounced Search Hook (`useDebounce`)**:
  - Delays API calls by ~400ms after user stops typing to optimize performance and prevent excessive server requests.
  - Search books by title, author, or ISBN.
- 🤖 **AI Smart Book Recommendation Engine**:
  - Content-based smart recommendation algorithm scoring category affinity (+35 pts), author matching (+30 pts), and topic/keyword similarity (+12 pts per matching token).
  - Displays match percentages (e.g. *98% Match*) and reasoning tags (*"By same author: Robert C. Martin"*, *"Shared topics: software, architecture"*).
  - Integrated into **Book Details (`/books/:id`)** and **Loan Circulation Details (`/loans/:id`)**.
- 🏷️ **Category Filtering & Directory**:
  - Filter books across Fiction, Science, Technology, History, Biography, Education, and Other.
  - Switch between visual Grid Card view and Table view.
- 🔄 **Circulation & Lending Audit Trail**:
  - Issue books with due date scheduling.
  - Automatically updates `availableQuantity` on book issue and return.
  - Creates audit records in `BookLending` history log.
- 🔔 **In-App Notifications**:
  - System alerts for newly cataloged books, issue receipts, and return confirmations.
- 📱 **Responsive UI**:
  - Clean Bootstrap 5 styling with modern cards, badges, modal-free intuitive forms, and zero blank screen error handling.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM, Axios, Bootstrap 5, Bootstrap Icons, Custom CSS |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB & Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **State Management** | React Context API (`AuthContext`), Custom Hooks (`useDebounce`) |

---

## 📁 Project Folder Structure

```
library-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # Auth & role model (bcryptjs hashed)
│   │   ├── Book.js               # Books catalog with quantities
│   │   ├── Member.js             # Student member profile
│   │   ├── Loan.js               # Loan circulation records
│   │   ├── BookLending.js        # History & audit log
│   │   └── Notification.js       # System notifications
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile
│   │   ├── bookController.js     # Book CRUD + debounced search & category
│   │   ├── memberController.js   # Member CRUD + search
│   │   ├── loanController.js     # Issue, Return, Stock management
│   │   ├── bookLendingController.js # Lending audit CRUD
│   │   ├── notificationController.js# User notification endpoints
│   │   ├── dashboardController.js# Role-tailored metrics
│   │   └── userController.js     # Admin user management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── loanRoutes.js
│   │   ├── bookLendingRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── roleMiddleware.js     # Role access authorization
│   ├── seed/
│   │   └── seed.js               # Database seeder with realistic data
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Role-based navbar
    │   │   ├── ProtectedRoute.jsx# Route guard
    │   │   ├── SearchBar.jsx     # Search bar with category chips
    │   │   ├── BookCard.jsx      # Reusable book card
    │   │   ├── Loading.jsx       # Loading spinner
    │   │   └── EmptyState.jsx    # Empty state component
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context
    │   ├── hooks/
    │   │   └── useDebounce.js    # Debounce custom hook (400ms delay)
    │   ├── pages/
    │   │   ├── Home.jsx          # Hero, featured books, modules
    │   │   ├── Login.jsx         # Login with quick demo buttons
    │   │   ├── Register.jsx      # Member / Librarian registration
    │   │   ├── Dashboard.jsx     # Role-based statistics
    │   │   ├── Profile.jsx       # User profile details
    │   │   ├── Notifications.jsx # System alerts
    │   │   ├── NotFound.jsx      # 404 page
    │   │   ├── books/
    │   │   │   ├── BookList.jsx  # Catalog with debounced search
    │   │   │   ├── BookDetails.jsx
    │   │   │   ├── AddBook.jsx
    │   │   │   └── EditBook.jsx
    │   │   ├── members/
    │   │   │   ├── MemberList.jsx
    │   │   │   ├── MemberDetails.jsx
    │   │   │   ├── AddMember.jsx
    │   │   │   └── EditMember.jsx
    │   │   ├── loans/
    │   │   │   ├── LoanList.jsx
    │   │   │   ├── LoanDetails.jsx
    │   │   │   └── IssueBook.jsx
    │   │   └── users/
    │   │       └── UserList.jsx  # Admin user list
    │   ├── services/
    │   │   ├── api.js            # Axios instance with interceptors
    │   │   ├── authService.js
    │   │   ├── bookService.js
    │   │   ├── memberService.js
    │   │   ├── loanService.js
    │   │   ├── dashboardService.js
    │   │   ├── notificationService.js
    │   │   └── userService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Sample Login Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@library.com` | `admin123` | Full control: Books, Members, Loans, User Roles, Statistics |
| **Librarian** | `librarian1@library.com` | `lib123` | Books CRUD, Members CRUD, Issue & Return Books |
| **Member** | `john@student.com` | `member123` | Browse catalog, view personal active/returned loans |

> 💡 *The Login page also includes 1-click **Quick Demo Login** buttons for instant testing.*

---

## ⚙️ Installation & Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) installed and running locally on port 27017

### 2. Backend Setup
```bash
# Navigate to backend folder
cd library-portal/backend

# Install dependencies
npm install

# Configure .env (already provided)
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/library_portal
# JWT_SECRET=library_portal_jwt_secret_key_2026

# Seed initial database records (Admin, Librarians, Members, Books, Loans)
npm run seed

# Start backend server
npm run dev
# Server will run at http://localhost:5000
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend folder
cd library-portal/frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🌐 Main API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new Member or Librarian
- `POST /api/auth/login` - Authenticate user & retrieve JWT
- `GET /api/auth/me` - Get current user profile (Private)

### Books (`/api/books`)
- `GET /api/books?search=...&category=...` - Get all books with search/filter (Public)
- `GET /api/books/:id` - Get single book details (Public)
- `POST /api/books` - Add book (Librarian/Admin)
- `PUT /api/books/:id` - Edit book (Librarian/Admin)
- `DELETE /api/books/:id` - Delete book (Librarian/Admin)

### Members (`/api/members`)
- `GET /api/members?search=...&department=...` - List members (Librarian/Admin)
- `GET /api/members/:id` - Get member details + loan history (Private)
- `POST /api/members` - Create member (Librarian/Admin)
- `PUT /api/members/:id` - Update member (Librarian/Admin)
- `DELETE /api/members/:id` - Delete member (Librarian/Admin)

### Loans & Circulation (`/api/loans`)
- `GET /api/loans?status=...` - Get loans (role-filtered for members)
- `GET /api/loans/:id` - Get loan details + audit history
- `POST /api/loans` - Issue book (decrements stock by 1)
- `PUT /api/loans/:id/return` - Mark book as returned (restores stock by 1)
- `DELETE /api/loans/:id` - Delete loan record (Admin)

### Dashboard & Notifications (`/api/dashboard`, `/api/notifications`)
- `GET /api/dashboard` - Role-tailored summary metrics
- `GET /api/notifications` - Get system alerts
- `PUT /api/notifications/:id/read` - Mark alert as read

---

## 💡 Debounced Search Explained

In `frontend/src/hooks/useDebounce.js`:
```javascript
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```
When a student types *"Python"* into the search bar, the `useDebounce` hook waits **400ms** after the last keystroke before querying `GET /api/books?search=Python`, reducing server requests by over 80%.
