# Pro-Network

A full-stack professional networking platform built with Next.js and Express. Users can create posts, manage their profiles, connect with others, and download resumes as PDFs.

---

## Tech Stack

**Frontend**

- Next.js (Pages Router)
- Redux Toolkit
- Axios
- CSS Modules

**Backend**

- Node.js with Express
- MongoDB with Mongoose
- PDFKit
- Multer
- bcrypt
- JSON Web Tokens via crypto

---

## Features

- User registration and login with hashed passwords
- Profile management including bio, work history, and education
- Profile picture upload
- Create, delete, and like posts
- Comment on posts
- Send, accept, and manage connection requests
- Download user profiles as generated PDF resumes
- Discover other users on the platform
- Responsive design across desktop and mobile

---

## Known Limitations

- Uploaded files are stored locally in the `uploads/` folder. These will not persist if the backend is redeployed without a persistent volume or external storage.
- There is no email verification on registration.
- Token-based auth uses a random hex string stored in the database rather than JWT with expiry.
