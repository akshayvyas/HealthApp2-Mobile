# HealthHabits Mobile App 🏃‍♂️💚

A comprehensive React Native mobile application for health tracking and gamification, converted from the original React web app. Track your wellness journey across 6 health pillars and earn rewards for healthy habits!

## 🚀 Features

### Core Functionality
- **📱 Complete Mobile Experience**: Native mobile app with smooth navigation
- **🏥 Health Assessment**: Personalized health evaluation across 6 wellness pillars
- **🎯 Activity Tracking**: Complete 5-minute health activities and track progress
- **💰 Points System**: Earn $HEALTH points for completing healthy activities
- **📊 Progress Visualization**: Beautiful charts and progress indicators
- **🏆 Achievement System**: Unlock badges and milestones for consistent progress
- **🔥 Streak Tracking**: Build and maintain daily activity streaks

### Health Pillars
- **🍎 Eating**: Nutrition and healthy eating habits
- **��‍♂️ Movement**: Physical activity and exercise
- **👥 Community**: Social connections and relationships
- **🌿 Nature**: Outdoor activities and environmental wellness
- **🧘‍♀️ Mind & Relaxation**: Mental health and stress management
- **😴 Sleep**: Sleep quality and rest optimization

## 🛠 Tech Stack

### Frontend (Mobile)
- **React Native** with Expo SDK 49
- **TypeScript** for type safety
- **React Navigation** for screen navigation
- **React Native Paper** for Material Design components
- **Expo Vector Icons** for beautiful icons
- **Expo Linear Gradient** for gradient backgrounds

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **bcrypt** for password hashing
- **Zod** for request validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/akshayvyas/HealthApp2-Mobile.git
cd HealthApp2-Mobile
```

### 2. Set Up the Backend
```bash
# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL:
# DATABASE_URL="postgresql://username:password@localhost:5432/healthhabits"

# Set up the database
npm run db:push

# Start the backend server
npm run dev
```

### 3. Set Up the Mobile App
```bash
# Navigate to mobile directory
cd mobile

# Install mobile app dependencies
npm install

# Start the Expo development server
npm start
```

### 4. Run on Your Device
- **iOS**: Install Expo Go from App Store, scan QR code
- **Android**: Install Expo Go from Play Store, scan QR code
- **Simulator**: Press `i` for iOS simulator or `a` for Android emulator

## 📁 Project Structure

```
HealthApp2-Mobile/
├── mobile/                     # React Native mobile app
│   ├── src/
│   │   ├── screens/           # App screens
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities and helpers
│   ├── App.tsx               # Main app component
│   └── package.json          # Mobile app dependencies
├── server/                   # Backend Express API
├── shared/                   # Shared types and schemas
└── README.md                 # This file
```

## 🎯 App Screens

### Onboarding Flow
1. **Welcome**: App introduction and features overview
2. **Signup**: User registration and account creation
3. **Assessment**: Health assessment questions
4. **Results**: Personalized health insights
5. **Commitment**: Goal setting and commitment

### Main App (Tab Navigation)
- **🏃‍♂️ Explore**: Discover new activities and challenges
- **📋 Activities**: Manage and complete daily activities
- **📅 Today**: Daily progress and current activities
- **📊 Insights**: Analytics and progress visualization
- **👤 Profile**: User settings and achievements

## 🔧 Development

### Available Scripts

#### Backend (Root Directory)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push database schema changes
```

#### Mobile App (mobile/ Directory)
```bash
npm start            # Start Expo development server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📋 Roadmap

### Phase 1: Core Features ✅
- [x] Basic navigation structure
- [x] Welcome screen
- [x] Placeholder screens
- [ ] Complete screen implementations

### Phase 2: Backend Integration 🔄
- [ ] API client setup
- [ ] Authentication flow
- [ ] Data synchronization

### Phase 3: Advanced Features 📈
- [ ] Push notifications
- [ ] Offline support
- [ ] Social features

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original React web app team
- Expo team for the amazing development platform
- React Navigation for smooth mobile navigation
- React Native Paper for beautiful UI components

---

Made with ❤️ by the HealthHabits team

*Last updated: June 2024*
