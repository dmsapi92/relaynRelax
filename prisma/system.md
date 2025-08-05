# Vehicle Management System Structure

## Overview

This document outlines the system structure for the Vehicle Management System, which includes both admin and client interfaces for managing vehicles, driving licenses, and document reminders.

## Database Models

We've implemented the following models in the Prisma schema:

### User

- Core user model with authentication details
- Has relations to vehicles, driving licenses, and reminders

### Vehicle

- Stores vehicle registration information
- Connected to a specific user
- Contains vehicle details (make, model, year, color)
- Has associated reminders

### DrivingLicense

- Stores driving license information
- Connected to a specific user
- Contains license details (number, issue date, expiry date)
- Has associated reminders

### Reminder

- Multi-purpose reminder system for different document types
- Types include: PUCC, FITNESS, TAX, INSURANCE, PERMIT, NATIONAL_PERMIT, LICENSE_EXPIRY
- Connected to either a vehicle, license, or directly to a user
- Contains reminder date and notification settings

## Application Structure

### Admin Interface

- Dashboard (main admin view)
- Users Management (view and manage all users)
- Alerts (system notifications)
- User Actions (edit, delete, view user details, WhatsApp communication)

### Client Interface

- Home screen with user profile
- Vehicle management tab
- Driving license management tab
- Add/edit/delete vehicles
- Add/edit/delete driving licenses
- Set reminders for different document types with expiry dates

## Workflow

### Admin Workflow

1. Admin logs in
2. Views dashboard with system overview
3. Manages users through the Users table
4. Can edit, delete, view user details or send WhatsApp messages

### Client Workflow

1. User logs in to home screen
2. Views personal profile and registered vehicles/licenses
3. Can add new vehicles or driving licenses
4. Can set reminder dates for different document types
5. Receives notifications before document expiry

## Technical Implementation

- MongoDB database with Prisma ORM
- NextUI components for the frontend
- Remix for routing and server-side functionality
- TypeScript for type safety
- Proper authentication and authorization controls
