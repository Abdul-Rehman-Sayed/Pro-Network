# Pro-Network 
A professional networking platform built with Next.js and Redux, featuring profile management, connection requests, and dynamic PDF resume generation.

### Key Technical Highlights
* [cite_start]**Bidirectional Graph Logic:** Developed a symmetric connection system using MongoDB’s `$or` operator to merge incoming and outgoing requests into a unified list[cite: 251, 252, 254].
* [cite_start]**On-the-Fly PDF Engine:** Engineered profile-to-resume conversion using PDFKit, embedding user media and work history via Node.js file stream pipelines[cite: 246, 247, 249].
* [cite_start]**Coordinated State Management:** Built a Redux Toolkit async thunk chain that automatically refreshes pending and accepted states without page reloads[cite: 255, 256, 385].
* [cite_start]**Media Uploads:** Integrated Multer for local disk storage of profile pictures and post media with multi-format support[cite: 263, 264, 265].

### Tech Stack
* **Frontend:** Next.js, Redux Toolkit
* [cite_start]**Backend:** Node.js, Express.js [cite: 285, 286]
* [cite_start]**Database:** MongoDB [cite: 287]
* [cite_start]**Tools:** PDFKit, Multer [cite: 289, 290]
