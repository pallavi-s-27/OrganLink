# Organ Donation Platform

A comprehensive MERN stack application for managing organ donations with real-time tracking and modern UI.

## Features

- **Donor/Recipient Registration**: Easy registration process for donors and recipients
- **Organ Request/Availability Forms**: Streamlined forms for organ requests and availability
- **Real-time Tracking Dashboard**: Live tracking of organ transport with GPS integration
- **Authentication System**: Role-based access control (donor, recipient, doctor, admin)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Database Management**: MongoDB for secure data storage and audit logs

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Maps**: Google Maps API integration
- **State Management**: React Context/Redux

## Simplified Architecture

1. **Frontend (React + Vite)**
	- Donor and recipient onboarding flows
	- Organ request and availability forms
	- Real-time dashboards with transport tracking (Leaflet/OpenStreetMap)
2. **Backend (Node.js + Express)**
	- REST API for authentication, matchmaking, tracking, and admin workflows
	- Role-based authorization for doctors and admins
3. **Database (MongoDB + Mongoose)**
	- Collections for users, organ requests, donations, transports, approvals, and audit logs
4. **Matching Engine (Extensible)**
	- Placeholder services prepared for future ML integration (Random Forest, Logistic Regression)
5. **Telemetry (Leaflet + Future GPS Provider)**
	- Courier tracking map with dynamic ETA and timeline updates

## Project Structure

```
OrganDonPlt/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Configure environment variables for the backend by copying `server/.env.example` to `server/.env`
5. Run the development servers (frontend + backend)

### Scripts

```bash
# install dependencies
npm install --prefix client
npm install --prefix server

# start development environments
npm run dev --prefix client
npm run dev --prefix server
```

The frontend runs on `http://localhost:5173` (Vite) and proxies API calls to the Express backend on `http://localhost:5000`.

## Usage

1. Register as a donor or recipient
2. Fill out organ availability/request forms
3. View matches through the dashboard
4. Track organ transport in real-time
5. Manage approvals through admin panel

## Contributing

Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.