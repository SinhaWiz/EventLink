# EventLink Project Plan

## Phase 1: Backend Foundation (Current Focus)
- [ ] **Project Setup**: Initialize Node.js project, install dependencies.
- [ ] **Database Connection**: Connect to local MongoDB instance.
- [ ] **Server Configuration**: Set up Express server with basic middleware (CORS, Helmet, Logger).

## Phase 2: User Management & Authentication
- [ ] **User Model**: Define schema for users (students), including profile info and subscription status.
- [ ] **Auth API**: Implement registration and login (JWT based).
- [ ] **Middleware**: Create authentication and role-based authorization middleware.

## Phase 3: Event Management Core
- [ ] **Event Model**: Define schema for events (title, date, university, category, fees, etc.).
- [ ] **Event API**: CRUD operations for events (Create, Read, Update, Delete).
- [ ] **Filtering**: Implement query parameters for filtering by university, department, category.

## Phase 4: Registration & Participation
- [ ] **Registration Model**: Track which user registered for which event.
- [ ] **Registration API**: Handle event sign-ups.
- [ ] **History Tracking**: API to fetch user's past and upcoming events.

## Phase 5: Gamification & Portfolio
- [ ] **Points System**: Logic to award points for participation and wins.
- [ ] **Ranking Logic**: Calculate tiers (Bronze, Silver, Gold, Elite).
- [ ] **Portfolio API**: Endpoint to generate/fetch user portfolio data.
- [ ] **Certificate Generation**: (Placeholder) Logic to generate certificate data.

## Phase 6: Banglalink API Integration
- [ ] **SMS API**: Integrate for OTPs, confirmations, and reminders.
- [ ] **Subscription API**: Implement premium plan subscription logic.
- [ ] **CAAS API**: Implement payment processing for paid events.
- [ ] **USSD API**: (Optional) Basic lookup implementation.

## Phase 7: Frontend Development (Future)
- [ ] Setup Next.js/React project.
- [ ] Build UI components.
- [ ] Integrate with Backend APIs.
