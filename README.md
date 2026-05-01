<div align="center">

# 🏥 Med4U

### Production-grade cross-platform healthcare application

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

</div>

---

## 📌 Overview

**Med4U** is a full-featured, production-grade healthcare application built with React Native and Expo. It connects patients and doctors through a seamless digital experience — covering appointment booking, real-time video consultations, prescription management, lab test booking, and push notifications.

Designed with clean architecture, offline-first thinking, and real-world scalability in mind.

---

## 🎯 Problem Statement

Healthcare access in India is fragmented — patients struggle to find verified doctors, book reliable appointments, and access their medical records in one place. Existing apps are either too complex or lack real-time communication features.

## 💡 Solution

Med4U provides a unified platform where:
- Patients can discover doctors, book appointments, and consult via video — all in one app
- Doctors can manage availability, conduct consultations, and upload prescriptions
- Admins can verify doctors and manage platform integrity
- The system works offline-first and syncs seamlessly when back online

---

## ⚙️ Tech Stack

### Frontend
| Area | Technology |
|---|---|
| Framework | React Native + Expo |
| Language | TypeScript (strict mode) |
| State Management | Redux Toolkit |
| Navigation | React Navigation v6 |
| API Client | Axios |
| Real-time | Socket.IO client |
| Video | WebRTC (react-native-webrtc) |
| Notifications | Firebase FCM |
| Storage | AsyncStorage, SecureStore |

### Backend
| Area | Technology |
|---|---|
| Framework | NestJS (Node.js) |
| Language | TypeScript |
| Database | PostgreSQL + TypeORM |
| Cache / OTP | Redis |
| Auth | JWT + Refresh Token rotation |
| OTP | Twilio SMS |
| Real-time | Socket.IO |
| File Storage | Cloudinary |
| Docs | Swagger (OpenAPI 3.0) |

---

## 🧩 Core Features

### 🔐 Authentication
- Phone number login with 6-digit OTP (Twilio)
- JWT access tokens (15 min) + refresh token rotation (7 days)
- Tokens stored securely via Expo SecureStore
- Auto-refresh on token expiry
- Logout with server-side session invalidation

### 👨‍⚕️ Doctor Discovery
- Browse doctors by specialization, rating, experience
- Real-time availability slots per doctor per date
- Detailed doctor profiles with education, bio, reviews
- Search by name or specialty

### 📅 Appointment System
- Book appointments with slot selection
- Cancel or reschedule existing appointments
- Real-time status updates via Socket.IO
- View complete appointment history (upcoming / past)

### 📹 Video Consultation
- WebRTC peer-to-peer video calls
- Socket.IO signaling server for:
  - Call initiation and room joining
  - ICE candidate exchange
  - Accept / reject / end call events
- Call session logs stored in database
- STUN/TURN server support for NAT traversal

### 💊 Prescription Management
- Doctors upload prescriptions (PDF/image) post-consultation
- Stored securely in Cloudinary
- Patients access via time-limited signed URLs
- Prescription linked to appointment and patient record

### 🧪 Lab Tests & Medicines
- Browse and search lab tests by category
- Book lab tests with home collection option
- Medicine search with generic name support
- Track lab booking status

### 🔔 Notifications
- Firebase FCM push notifications
- Appointment reminders (24hr and 1hr before)
- Prescription ready alerts
- Incoming call notifications
- In-app notification centre with read/unread state

### 🛡️ Role-Based Access Control
| Feature | Patient | Doctor | Admin |
|---|:---:|:---:|:---:|
| Book appointment | ✅ | ❌ | ✅ |
| Upload prescription | ❌ | ✅ | ✅ |
| Manage availability | ❌ | ✅ | ✅ |
| Verify doctors | ❌ | ❌ | ✅ |
| Video consultation | ✅ | ✅ | ❌ |
| View all users | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
med4u/
├── src/
│   ├── screens/
│   │   ├── auth/           # OTP login, verify
│   │   ├── home/           # dashboard, doctor list
│   │   ├── doctor/         # profile, availability
│   │   ├── appointment/    # booking, history, detail
│   │   ├── consultation/   # video call screen
│   │   ├── prescription/   # view, download
│   │   ├── lab/            # browse tests, bookings
│   │   └── notifications/
│   ├── components/         # reusable UI components
│   ├── store/
│   │   ├── slices/         # auth, user, doctor, appointment
│   │   └── store.ts
│   ├── services/
│   │   ├── api.ts          # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── doctor.service.ts
│   │   ├── appointment.service.ts
│   │   └── socket.service.ts
│   ├── hooks/              # useAuth, useSocket, useWebRTC
│   ├── navigation/         # stack + tab navigators
│   ├── types/              # TypeScript interfaces
│   └── utils/              # formatters, validators
├── app.json
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Expo CLI
- Android Studio / physical device
- Running Med4U backend (see backend repo)

### Installation

```bash
# Clone the repo
git clone https://github.com/abhishek040901/med4u.git
cd med4u

# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Fill in your API base URL, Firebase config, etc.

# Start Expo
npx expo start
```

### Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
EXPO_PUBLIC_STUN_SERVER=stun:stun.l.google.com:19302
```

---

## 📡 API Overview

All endpoints follow the structure:

```
/api/v1/{module}/{action}
```

| Module | Base Route |
|---|---|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Doctors | `/api/v1/doctors` |
| Appointments | `/api/v1/appointments` |
| Consultations | `/api/v1/consultations` |
| Prescriptions | `/api/v1/prescriptions` |
| Labs | `/api/v1/labs` |
| Medicines | `/api/v1/medicines` |
| Notifications | `/api/v1/notifications` |

Full Swagger docs available at `/api/docs` when running the backend.

---

## 🔌 Socket.IO Events

```
Client emits:   join-room · offer · answer · ice-candidate · leave-room
Server emits:   user-joined · offer · answer · ice-candidate · user-left · call-ended
```

---

## 🧠 Architecture Decisions

- **Offline-first**: API responses cached locally; app remains usable during network loss
- **Token rotation**: Refresh tokens rotated on every use and stored server-side (hashed)
- **WebRTC P2P**: Direct peer connection for low-latency video; TURN server fallback for NAT traversal
- **Modular screens**: Each screen owns its own state slice — no prop drilling
- **Typed API layer**: All API calls and responses fully typed with TypeScript interfaces

---

## 📸 Screenshots

> Coming soon — add your screenshots here

---

## 📫 Contact

**Abhishek Kumar** — React Native Developer  
📧 abhi040901@gmail.com  
📍 Pune, India

---

<div align="center">
  Built with care for real-world healthcare accessibility
</div>
