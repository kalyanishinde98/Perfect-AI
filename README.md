Perfect AI 
A full-stack web application that provides a unified interface for multiple AI tools, complete with user authentication and personal prompt history.
 
 **About The Project
Perfect AI is a web-based platform built with a Vanilla JS frontend and a Node.js, Express, and MongoDB backend. It's designed to be a one-stop-shop for accessing various AI services from a single, clean interface.

This project features a complete user authentication system where users can sign up for a new account or log in to an existing one. All user-submitted prompts are automatically saved to their personal profile, allowing them to review their history at any time.

 **Features
Secure User Authentication: Full signup and login functionality.

Password Hashing: Uses bcryptjs to securely hash and store user passwords.

User-Specific Data: All prompt history is linked directly to the logged-in user's ID.

Prompt History: All prompts submitted from the main page or individual tool pages are automatically saved.

User Profile Page: A dedicated page where users can view their name, email, and a complete, chronologically-sorted list of their prompt history.

Sign Out: A secure sign-out option to clear the user's session.

Full-Stack Application: A Vanilla JS frontend that communicates with a custom-built REST API backend.

Secret Management: Uses .env files to keep database connection strings and other secrets out of the codebase.

** Tech Stack
Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Frontend: HTML5, CSS3, Vanilla JavaScript (DOM Manipulation)

Prerequisites
You must have the following software installed on your machine:

Node.js (which includes npm)

MongoDB (either local or a free Atlas cluster)
