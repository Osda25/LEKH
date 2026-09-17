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

Once Sprint 2 begins, add a **User Manual** section to this README, covering:
- **Installing** — what's needed to set up your project locally (dependencies, environment, etc.)
- **Running** — how to start/execute the application

