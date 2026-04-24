# Pro-Network 
A professional networking platform built with Next.js and Redux, featuring profile management, connection requests, and dynamic PDF resume generation.

### Key Technical Highlights
* **Bidirectional Graph Logic:** Developed a symmetric connection system using MongoDB’s `$or` operator to merge incoming and outgoing requests into a unified list.
* **On-the-Fly PDF Engine:** Engineered profile-to-resume conversion using PDFKit, embedding user media and work history via Node.js file stream pipelines.
* **Coordinated State Management:** Built a Redux Toolkit async thunk chain that automatically refreshes pending and accepted states without page reloads.
* **Media Uploads:** Integrated Multer for local disk storage of profile pictures and post media with multi-format support.

### Tech Stack
* **Frontend:** Next.js, Redux Toolkit
* **Backend:** Node.js, Express.js 
* **Database:** MongoDB 
* **Tools:** PDFKit, Multer 
