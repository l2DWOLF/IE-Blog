# 📝 IE Blog Frontend (React)

A responsive, full-featured frontend for a full-stack blogging platform, built with **React** and integrated with a **Django REST API** backend. This frontend supports article creation, editing, nested comments, user roles, search, and more.

## 🌐 Live Deployment
> Live Site: [https://ie-blog.onrender.com/](https://ie-blog.onrender.com/)\
> Backend Repo: [https://github.com/l2DWOLF/Django-Blog](https://github.com/l2DWOLF/Django-Blog)

---

## 🚀 Features

- **JWT Authentication** with refresh token rotation
- **Role-Based Access Control**:
  - Guest
  - Authenticated Users
  - Moderators & Admins (can manage articles/comments)
- **Authorization-Aware CRUD**:
  - Profiles
  - Articles
  - Comments / Replies (nested)
- **Like/Dislike Reactions** on articles
- **Dynamic Search with Debounce**
- **Formik + Yup** custom reusable form components ("Form Factory")
- **Animated UI** using Framer Motion
- **Responsive Design** with animated mobile menu
- **Toastify Alerts** for feedback
- **Mod Key Registration**:
  - Users can enter a secret mod key during registration to become a Moderator/Admin
  - *"Send me a message on GitHub/LinkedIn for the mod key."*

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router v7
- **State Management**: Redux Toolkit, React Redux
- **Forms**: Formik, Yup
- **API**: AxiosInstance + Retry Interceptor
- **Auth**: JWT with Refresh Token flow
- **Utilities**: JWT-Decode
- **Styling**: Custom CSS (desktop + mobile)
- **Animations**: Framer Motion, keyframes
- **Icons**: Lucide React
- **Notifications**: React Toastify

---

## 📁 Project Structure Highlights

```
/src
├── auth
│   ├── guards/RouteGuards.jsx
│   ├── services/authService.js
│   └── utils/permissions.js
│
├── components
│   ├── articles
│   │   ├── Articles.jsx
│   │   ├── CreateArticle.jsx
│   │   ├── EditArticle.jsx
│   │   ├── LikedArticles.jsx
│   │   ├── features/ArticleFeed.jsx
│   │   └── ArticleCard.jsx
│   ├── comments
│   │   ├── Comment.jsx
│   │   ├── CreateComment.jsx
│   │   └── EditComment.jsx
│   ├── user
│   │   ├── login/Login.jsx
│   │   ├── register/Register.jsx
│   │   └── profile/ProfilePage.jsx
│   └── common
│       ├── forms/FormInput.jsx
│       ├── forms/FormWrapper.jsx
│       └── modal/ModalPortal.jsx
│
├── contexts
│   └── ArticleContext.jsx
├── services
│   ├── AxiosInstance.js
│   ├── articleServices.js
│   ├── commentServices.js
│   └── userServices.js
├── utils
│   ├── errors/handleException.js
│   ├── toastify/toast.js
│   └── validations/yupValidations.js
└── App.jsx
```

---

## 🔧 Getting Started

```bash
# Clone this repo
$ git clone https://github.com/l2DWOLF/IE-Blog.git
$ cd blog-frontend

# Install dependencies
$ npm install

# Set API base URL in .env file
VITE_API_BASE_URL=/api
VITE_API_AUTH_URL=/auth

# Start dev server
$ npm run dev
```

> **Note**: You need the Django backend running separately. Check out the [Backend README](https://github.com/l2DWOLF/Django-Blog/blob/main/README.md).

> Live Site: [https://ie-blog.onrender.com/](https://ie-blog.onrender.com/)\
> Backend Repo: [https://github.com/l2DWOLF/Django-Blog](https://github.com/l2DWOLF/Django-Blog)
---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙌 Connect with Me

If you’d like to collaborate or have feedback:

- GitHub: [https://github.com/l2DWOLF](https://github.com/l2DWOLF)
- LinkedIn: [https://www.linkedin.com/in/idan-elimeleh-itegroupnyc](https://www.linkedin.com/in/idan-elimeleh-itegroupnyc)

Feel free to reach out if you'd like the **moderator/admin registration key**. 😄