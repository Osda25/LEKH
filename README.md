# PA1493 Software Development Project (Distance) HT26

---

## Project Description

**Project Name:** *Lab Equipment Knowledge Hub*

**Customer Name:** *Zeth Danielsson*

**Student Full Name:** *Oskar Davidsson*

### Project Aim and Objectives

*The goal with this project is to create an application for students and staff that can contain guides, manuals and project inspiration for lab equipment and manage loans and reservations for them. It can also support maintenance and repairs of the equipment which is managed by the caretakers of the lab.*

### User Personas

| Name | Characteristics | Needs and Expectations | How will they use the system? |
|---|---|---|---|
| **Elin Andersson** | *Elin is 26 years old and third-year student in the Computer Science programme at BTH. She has her bachelor's degree project coming up and has some theoretical technical knowledge but is quite new to using lab equipment.* | *Elin wants an easy way to see what equipment is available in the lab, get some inspiration for her upcoming project and get information on how to use the equipment. She also wants to be able to see whether her desired equipment is available for the time period she needs it, and if so, reserve or borrow it.* | *Elin will both use the system to browse projects and search for inspiration at home, but also when walking around in the lab and scanning equipment for information and guides. She will check availability and make reservations or borrowing requests.* |
| **Erik Holmström** | *Erik is 37 years old and is a doctoral student at BTH. Through his research, he regularly uses a wide range of technical lab equipment and has gained extensive practical experience with it. Because of this experience, he is also a caretaker responsible for a large part of the lab equipment.* | *Erik needs a clear overview of the equipment he is responsible for and to receive reports when equipment needs maintenance or repair. The system should make it possible for him to manage equipment units, availability, borrowing rules, guides and product information without creating unnecessary administrative work. He also needs to be able to handle borrowing requests and other responsibilities related to the equipment assigned to him.* | *Erik will use the system to add and update individual equipment units for the equipment types he is responsible for, maintain guides and product information, manage availability, handle borrowing requests and returns, and follow up on reported faults. He will also collect or arrange maintenance and repairs for equipment that has been reported as faulty. Erik can also use the regular user functions when he needs equipment for his own research.* |
| **Anna Lindberg** | *Anna is 48 years old and works at BTH with overall responsibility for the university lab and its equipment management. She has a good understanding of how the lab is organised but does not necessarily work directly with every piece of equipment. She is one of the administrators of the system.* | *Anna needs full oversight of the system and a reliable way to manage responsibilities and permissions. She needs to be able to add new equipment types, appoint users as caretakers and decide which equipment each caretaker is responsible for. She also needs access to all parts of the system so that she can correct information or resolve administrative issues when necessary.* | *Anna will use the system to add and manage equipment types, assign caretaker permissions, decide which equipment types each caretaker is responsible for, and manage user roles. She can access and manage all equipment and administrative functions in the system when needed.* |

### Software Requirements

**Functional Requirements**

- *FR01: The system shall allow users to register an account and log in using their email address and password.*

- *FR02: The system shall support User, Caretaker and Administrator roles with different permissions.*

- *FR03: The system shall allow users to browse and search for equipment available in the lab.*

- *FR04: The system shall allow users to view information about equipment, including availability, location and related information.*

- *FR05: The system shall distinguish between equipment types and individual physical equipment units.*

- *FR06: The system shall allow administrators to add and update equipment types, and caretakers to add and update individual equipment units for equipment types they are responsible for.*

- *FR07: The system shall allow users to view guides and instructions connected to equipment, and caretakers to manage this information for equipment they are responsible for.*

- *FR08: The system shall support different borrowing and booking rules for different types of equipment.*

- *FR09: The system shall allow users to request reservations or loans and allow caretakers to manage these requests for equipment they are responsible for when approval is required.*

- *FR10: The system shall allow users to view active reservations and loans and support returning borrowed equipment.*

- *FR11: The system shall allow users to browse student projects and see which equipment was used in each project, as well as see related projects from an equipment page.*

- *FR12: The system shall allow users to access equipment information by scanning a QR code.*

- *FR13: The system shall allow users to report faults or problems with equipment.*

- *FR14: The system shall allow administrators to grant or revoke caretaker permissions for users and assign those permissions to specific equipment types or all equipment.*

**Non-Functional Requirements**

- *NFR01: The system shall use a mobile-first and responsive interface so that common tasks such as finding equipment, viewing guides and checking availability can be performed on a mobile phone*

- *NFR02: User passwords shall be stored securely and never in plain text.*

- *NFR03: Users shall only have access to information and functionality permitted by their role and assigned permissions.*

- *NFR04: User input shall be validated before being processed or stored by the system.*

---

## Your Backlog

Your backlog lives in two places, working together:

### 1. GitHub Issues (the content)

For every user story, feature, and task, create a GitHub Issue with a clear title and description. Use the issue template provided in this repository (see `.github/ISSUE_TEMPLATE/`).

Write them in this order:
1. All **user stories** first (format: *"As [a user], I want [action] so that [goal]"*)
2. Then all **features**
3. Then all **tasks**

### 2. Project Board (the backlog itself)

Add every Issue to a Project board. The board is your backlog, not the issue text.

Your repository does not come with a board already set up — see **[PROJECT_BOARD.md](PROJECT_BOARD.md)** for step-by-step instructions on creating your board and setting up the required fields (Priority, Estimated Effort, Sprint). 

You'll need a working board by the end of Sprint 1, as Status Report 3 requires it.


---

## Development

From Week 38 onward:
- Set up your development environment and start development.
- You're free to organise your code however works best for you — for example, using `src/` and `docs/` folders, or any other structure. There's no required folder layout; 
- At the end of each sprint, your work will be demonstrated to the customer at that sprint's Demo
- Keep this README as the one place that always explains how to install and run your project.


Your repository must remain **Private** for the entire course. This protects your customer's requirements and your own work.

---

## Documenting Your Project

### Technical Overview

The application uses a client-server architecture. The React client communicates with an Express REST API, while Prisma is used as the database layer for PostgreSQL.

`React client → Express REST API → Prisma ORM → PostgreSQL`

| Technology | What it does | Why I selected it |
| -----------| -------------| ----------------- |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)   | Main programming language for both the client and server. | I already have experience with JavaScript, and using the same language throughout the application makes the project easier for me to understand and maintain. |
| [React](https://react.dev/) | Builds the user interface using reusable components. | I have some previous experience with React, and I think its component-based structure fits an application with several pages, forms and changing states. |
| [Vite](https://vite.dev/) | Provides the frontend development server and creates production builds. | I selected Vite because it provides a simple setup for React and gives me a fast development environment with automatic updates while working. |
| [Tailwind CSS](https://tailwindcss.com/docs) | Provides utility classes for styling and responsive design. | It supports the mobile-first requirement and I already have some previous experience using it. |
| [React Router](https://reactrouter.com/start/modes) | Handles navigation between pages in the React application. | I only need straightforward client-side routing, so Declarative Mode gives me the functionality I need without introducing a more advanced framework. |
| [Node.js](https://nodejs.org/docs/latest-v22.x/api/) | Runs JavaScript outside the browser and provides the runtime for the backend. | I selected Node.js because it allows me to use JavaScript for both the frontend and backend while learning more about server-side development. |
| [Express](https://expressjs.com/) | Handles HTTP requests, middleware and API routes. | I wanted a relatively small framework that lets me build the API myself and understand how routes, requests and middleware work. |
| [PostgreSQL](https://www.postgresql.org/docs/) | Stores the application's persistent data in a relational database. | Working with databases is new to me but I selected PostgreSQL because the system contains clearly related data, such as users, equipment types, equipment units and future reservations.                           |
| [Prisma ORM 7](https://www.prisma.io/docs/orm/v7) | Defines the database schema, manages migrations and provides an API for database operations. | Prisma gives me a clearer structure for defining models and migrations while still allowing me to work mainly with JavaScript. |
| [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) | Sends HTTP requests from the React client to the Express API. | I have used Fetch before, and since it is built into modern browsers I do not need to add another library for API requests. |

#### Supporting Tools

* [dotenv](https://github.com/motdotla/dotenv) loads environment-specific configuration, such as ports and database connection details, from local environment files. I use it to avoid hardcoding local configuration and credentials in the source code.
* [CORS middleware](https://expressjs.com/en/resources/middleware/cors/) allows the React development server to communicate with the Express API when they are running on different ports.
* [ESLint](https://eslint.org/docs/latest/) checks the source code for common problems and helps me maintain a consistent code style.

Environment files containing local configuration or credentials are excluded from Git. Example environment files are included to document which variables are required without exposing passwords or other private values.

---

## User Manual

### Installing

#### Prerequisites

The following tools are required to run the application locally:

- **Node.js** (version 22 used during development) and npm
- **PostgreSQL**
- **Git**

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dipt-pa1493-ht26/pa1493-osda25-lekh-zda.git
   cd pa1493-osda25-lekh-zda
   ```

2. Install the frontend and backend dependencies:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Make sure PostgreSQL is running and create a local database named `lekh_dev`.

4. Configure the backend environment:

   From the `server` directory, copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Update `DATABASE_URL` with your PostgreSQL credentials and set a secure `JWT_SECRET`. Instructions for generating a secret are included in `.env.example`.

5. Apply the database migrations and generate Prisma Client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. Configure the frontend environment:

   ```bash
   cd ../client
   cp .env.example .env
   ```

   The default `VITE_API_URL` points to `http://localhost:3001`.

   Do not commit `.env` files containing credentials or secrets.

### Running

The frontend and backend must be started in separate terminals.

**Start the backend**

From the `server` directory:

```bash
npm run dev
```

The backend runs at `http://localhost:3001`.

**Start the frontend**

From the `client` directory:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser to access the application. You can register a new user account and log in.