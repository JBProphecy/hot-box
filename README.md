# INTRODUCTION

This is a project I've been working on for the past month or so now. It's going to be a social music app and as of right now, the best name I have for it is "Hot Box" or "Hot Baux"... I haven't decided yet and I may not use either of those names.

---

# PROJECT STRUCTURE

- The root folder is a git repository with three primary folders: `client` | `server` | `shared`

- The client and server folders are independent of one another, but everything in the shared folder can be used in both.
- When building the app, the shared folder will be built into each of the client and server `dist` folders.

- The main purpose of the shared folder is for global variables like APP_NAME and shared types for the API.
- As for the client and server folders, they each serve their own purpose and they each have their own set of dependencies.

- In each of the client and server folders, the alias @ (import ... from "@/...") can be used to import from its corresponding src folder.
- In both the client and server folders, the alias shared (import ... from "shared/...") can be used to import from the shared folder.

---

# PROJECT TECHNOLOGY

- Node.js
- TypeScript
- Express.js
- React
- Vite
- Prisma
- MySQL

---

# PROJECT FEATURES

- user authentication
- logging library

---
