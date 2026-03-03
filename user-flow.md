# User Flow Documentation - Baraka Immo Application

> **Document Purpose**: This document describes all available actions and navigation flows for each user role in the Baraka Immo real estate application.

---

## Table of Contents

1. [User Roles Overview](#user-roles-overview)
2. [Client User Flow](#1-client-user-flow)
3. [VIP Client User Flow](#2-vip-client-user-flow)
4. [Technician User Flow](#3-technician-user-flow)
5. [Administrator User Flow](#4-administrator-user-flow)
6. [Permissions Matrix](#permissions-matrix)

---

## User Roles Overview

| Role | Description | Access Level |
|------|-------------|--------------|
| **Client** | Standard customer who can browse properties and make requests | Basic |
| **VIP** | Premium client with exclusive access and priority services | Enhanced |
| **Technician** | Sales agent managing leads and client portfolio | Operational |
| **Admin** | System administrator with full control | Full Access |

---

## 1. Client User Flow

### 1.1 Authentication & Access
| Action | Description | Entry Point |
|--------|-------------|-------------|
| Login | Access account with email and password | Login Page |
| Logout | End current session | User Menu |
| Change Password | Update account password | Profile Settings |

### 1.2 Properties Management (My Properties)
| Action | Description | Location |
|--------|-------------|----------|
| View owned properties | Display list of purchased properties | My Properties Page |
| Switch view mode | Toggle between card view and table view | My Properties Page |
| Access property folder | View complete details of a specific property | Property Card |
| Track payment progress | Monitor payment status and remaining balance | Property Folder |
| Download documents | Access contracts and receipts | Property Folder |
| View payment history | Check all past payments for a property | Property Folder |

### 1.3 Property Catalog
| Action | Description | Location |
|--------|-------------|----------|
| Browse available properties | View all properties available for purchase | Catalog Page |
| Search properties | Find properties by keyword (title, location) | Search Bar |
| Filter by type | Filter by villa, apartment, land, commercial space | Filter Panel |
| Filter by price range | Select low, mid, or high price categories | Filter Panel |
| Filter by location | Narrow results by geographic area | Filter Panel |
| View property details | Access complete information about a property | Property Card |
| Send property request | Submit interest for a specific property | Property Detail |

### 1.4 Property Requests
| Action | Description | Request Types |
|--------|-------------|---------------|
| Request property visit | Schedule a visit to view a property | Visit Request |
| Request information | Ask questions about a property | Information Request |
| Request reservation | Express intent to purchase | Reservation Request |
| Request financing info | Inquire about payment plans | Financing Request |

### 1.5 My Requests Management
| Action | Description | Location |
|--------|-------------|----------|
| View all requests | See list of submitted property requests | My Requests Page |
| Filter by status | Show pending, confirmed, rejected, or completed | Filter Tabs |
| View request details | Check status and admin response | Request Card |
| View appointments | See scheduled appointments | Appointments Tab |
| Respond to alternatives | Accept or decline proposed alternative slots | Appointment Details |
| Cancel appointment | Request cancellation of scheduled appointment | Appointment Actions |

### 1.6 VEFA Tracking (Off-Plan Property)
| Action | Description | Location |
|--------|-------------|----------|
| View VEFA projects | See all off-plan property investments | VEFA Tracking Page |
| Track construction progress | Monitor project milestones and completion | Project Details |
| View milestone details | Check individual phase status | Milestone Card |
| View payment schedule | See required payments for each milestone | Milestone Details |
| Download proofs | Access construction photos and documents | Proofs Section |
| Make milestone payment | Submit payment for completed milestones | Payment Modal |
| Upload payment proof | Attach receipt for payment verification | Payment Modal |

### 1.7 Messages & Documents
| Action | Description | Location |
|--------|-------------|----------|
| View messages | Read communications from agents | Messages Page |
| View documents | Access all property-related documents | Documents Page |
| Download files | Save documents to device | Document Actions |

### 1.8 Profile & Settings
| Action | Description | Location |
|--------|-------------|----------|
| View profile | See account information | Profile Settings |
| Update profile | Modify name, email, phone | Profile Settings |
| Change password | Update security credentials | Password Section |

---

## 2. VIP Client User Flow

> VIP clients have all Client permissions PLUS the following exclusive features:

### 2.1 All Client Features
- All actions available to standard clients (see Client User Flow above)

### 2.2 Exclusive Property Access
| Action | Description | Location |
|--------|-------------|----------|
| View VIP-only properties | Access properties with VIP exclusivity | Catalog Page |
| Early access to new listings | See new properties before public release | Catalog Page |
| View exclusive VEFA projects | Access premium off-plan opportunities | VEFA Catalog |

### 2.3 VIP Space (Exclusive Zone)
| Action | Description | Location |
|--------|-------------|----------|
| Access VIP dashboard | View exclusive VIP space | VIP Space Page |
| Browse exclusive properties | See properties reserved for VIP members | VIP Properties Tab |
| View VIP services | Access premium service offerings | VIP Services Tab |
| Request VIP service | Submit request for premium services | Service Card |
| Track service progress | Monitor status of requested services | My Requests Tab |
| View service milestones | Check progress steps for ongoing services | Request Details |
| Upload service documents | Submit required documents for services | Request Details |
| Download service reports | Access completed service documentation | Request Details |

### 2.4 VIP Services Available
| Service Type | Description | Actions |
|--------------|-------------|---------|
| Property Search | Personalized property search assistance | Request, Track, Complete |
| Legal Assistance | Due diligence and legal verification | Request, Track, Complete |
| Negotiation Support | Professional negotiation assistance | Request, Track, Complete |
| Investment Advisory | Expert investment recommendations | Request, Track, Complete |

### 2.5 Appointment Booking (VIP Exclusive)
| Action | Description | Location |
|--------|-------------|----------|
| Book a call | Schedule call with real estate advisor | Book Call Page |
| Select appointment type | Choose online or in-person meeting | Booking Form |
| Select date and time | Pick available slot from calendar | Calendar View |
| Enter appointment details | Provide subject and message | Booking Form |
| Receive first free appointment | First appointment is free for new VIP | Booking Confirmation |
| Make appointment payment | Pay for subsequent appointments | Payment Modal |
| View booking confirmation | See confirmed appointment details | Confirmation Page |

---

## 3. Technician User Flow

### 3.1 Authentication & Access
| Action | Description | Entry Point |
|--------|-------------|-------------|
| Login | Access technician account | Login Page |
| Logout | End current session | User Menu |
| View own profile | See account details | Profile Section |

### 3.2 Leads Management
| Action | Description | Location |
|--------|-------------|----------|
| View all leads | See list of potential clients | Leads Page |
| Filter leads by status | Show new, in-progress, won, or lost | Status Tabs |
| Filter leads by type | Show property requests or VIP requests | Type Filter |
| Search leads | Find leads by name or email | Search Bar |
| View lead details | Access complete lead information | Lead Modal |
| Change lead status | Update lead progress (new → in-progress → won/lost) | Status Modal |
| Create client account | Convert lead to registered client | Access Creation Modal |
| Create VIP account | Convert lead to VIP client | Access Creation Modal |

### 3.3 Client Portfolio
| Action | Description | Location |
|--------|-------------|----------|
| View all clients | See list of managed clients | Portfolio Page |
| Search clients | Find clients by name or email | Search Bar |
| Filter by client type | Show all, VIP, or standard clients | Filter Tabs |
| View client details | Access complete client information | Client Details Modal |
| View client properties | See properties owned by client | Properties Tab |
| View client payments | Check payment status and history | Payments Tab |
| View client documents | Access client's contracts and receipts | Documents Tab |
| Create new client | Register a new client with properties | Create Client Modal |
| Assign properties | Link properties to a client | Property Selection |
| Configure payment plan | Set up payment schedule for client | Payment Plan Form |
| Mark payments as paid | Confirm receipt of payments | Payment Actions |
| Upload payment proofs | Attach receipts for verification | Upload Modal |

### 3.4 Properties List
| Action | Description | Location |
|--------|-------------|----------|
| Browse all properties | View complete property catalog | Properties List Page |
| Search properties | Find properties by keyword | Search Bar |
| Filter by type | Show specific property types | Type Filter |
| View property details | Access full property information | Property Details |

### 3.5 My Clients (Direct Management)
| Action | Description | Location |
|--------|-------------|----------|
| View assigned clients | See clients under direct management | My Clients Page |
| Search assigned clients | Find specific assigned clients | Search Bar |
| View client profile | Access detailed client information | Client Details Modal |
| Toggle VIP status | Upgrade or downgrade client status | VIP Actions |
| Promote to VIP | Upgrade standard client to VIP | Promotion Button |
| Remove VIP status | Downgrade VIP to standard client | Downgrade Button |

### 3.6 Messages
| Action | Description | Location |
|--------|-------------|----------|
| View messages | Read client communications | Messages Page |
| Send messages | Communicate with clients | Message Composer |
| Reply to messages | Respond to client inquiries | Message Thread |

---

## 4. Administrator User Flow

### 4.1 Dashboard & Analytics
| Action | Description | Location |
|--------|-------------|----------|
| View dashboard | Access main administration panel | Dashboard Page |
| View total sales | Monitor overall sales performance | KPI Cards |
| View collected amounts | Track received payments | KPI Cards |
| View overdue payments | Identify late payments | KPI Cards |
| View VIP client count | Monitor VIP membership | KPI Cards |
| View sales evolution | Analyze sales trends over time | Line Chart |
| View monthly sales | Compare monthly performance | Bar Chart |
| View recent transactions | Check latest property sales | Transactions List |
| View new accounts | Monitor user registrations | Accounts List |

### 4.2 Leads & Requests Management
| Action | Description | Location |
|--------|-------------|----------|
| View all leads | Access complete leads database | Leads Page |
| Filter and search leads | Find specific leads | Filters & Search |
| Change lead status | Update lead progress | Status Modal |
| Create user accounts | Convert leads to clients | Account Creation |
| Assign leads to technicians | Distribute leads to sales agents | Assignment Modal |

### 4.3 Client Portfolio (Full Access)
| Action | Description | Location |
|--------|-------------|----------|
| View all clients | See complete client database | Portfolio Page |
| Manage any client | Full access to all client data | Client Details |
| Create clients | Register new clients | Create Modal |
| Edit client profiles | Modify client information | Edit Form |
| Manage payments | Process and verify payments | Payment Section |
| Manage documents | Upload and organize documents | Documents Section |

### 4.4 Properties Catalog Management
| Action | Description | Location |
|--------|-------------|----------|
| View all properties | Access complete property catalog | Properties Admin |
| Add new property | Create new property listing | Add Property Modal |
| Edit property | Modify existing property details | Edit Modal |
| Delete property | Remove property from catalog | Delete Action |
| Set property status | Mark as available, reserved, or sold | Status Selector |
| Configure financing options | Set available payment methods | Financing Section |
| Set VIP exclusivity | Make property VIP-only for a period | VIP Settings |
| Mark as featured | Highlight property in listings | Featured Toggle |

### 4.5 VEFA Management (Off-Plan Projects)
| Action | Description | Location |
|--------|-------------|----------|
| View all VEFA projects | Access off-plan project management | VEFA Management Page |
| Create VEFA project | Set up new construction project | Create Project Modal |
| Edit project details | Modify project information | Edit Modal |
| Delete project | Remove project from system | Delete Action |
| Add milestones | Create project phases | Milestone Form |
| Edit milestones | Modify phase details | Milestone Modal |
| Delete milestones | Remove project phases | Delete Action |
| Mark milestone complete | Update phase status | Status Toggle |
| Upload progress proofs | Add construction photos/documents | Upload Modal |
| Assign clients to VEFA | Link buyers to projects | Client Assignment |
| Remove clients from VEFA | Unlink buyers from projects | Client Removal |
| Track payments | Monitor milestone payments | Payment Overview |
| Verify payment proofs | Confirm payment receipts | Verification Actions |

### 4.6 Appointments Management
| Action | Description | Location |
|--------|-------------|----------|
| View all appointments | See complete appointment schedule | Appointments Admin |
| Filter by status | Show pending, confirmed, etc. | Status Filter |
| Filter by type | Show online or in-person | Type Filter |
| Search appointments | Find specific appointments | Search Bar |
| View appointment details | Access full booking information | Appointment Modal |
| Confirm appointment | Approve pending booking | Confirm Action |
| Reject appointment | Decline booking request | Reject Action |
| Propose alternative | Suggest different time slot | Alternative Modal |
| Cancel appointment | Cancel confirmed booking | Cancel Action |
| Manage time slots | Configure available booking times | Slots Tab |
| Add time slots | Create new available slots | Add Slot Modal |
| Remove time slots | Delete available slots | Delete Action |
| Configure settings | Set pricing and availability | Settings Tab |

### 4.7 VIP Services Administration
| Action | Description | Location |
|--------|-------------|----------|
| View all services | Access VIP service catalog | VIP Services Admin |
| Create service | Add new VIP service offering | Create Service Modal |
| Edit service | Modify service details | Edit Modal |
| Delete service | Remove service from catalog | Delete Action |
| Configure pricing | Set service prices by zone | Pricing Section |
| View service requests | Monitor all VIP service requests | Requests Tab |
| Approve request | Accept service request | Approve Action |
| Reject request | Decline service request | Reject Action |
| Update request status | Change request progress | Status Update |
| Manage milestones | Handle service phases | Milestone Management |
| Upload deliverables | Add service outputs | Upload Section |
| Configure zones | Set intervention areas and pricing | Zones Tab |

### 4.8 Users & Roles Management
| Action | Description | Location |
|--------|-------------|----------|
| View all users | Access complete user database | Users Management |
| Search users | Find specific users | Search Bar |
| Filter by role | Show clients, VIP, technicians | Role Filter |
| Create user | Add new user to system | Create User Modal |
| Edit user profile | Modify user information | Edit Modal |
| Delete user | Remove user from system | Delete Action |
| Promote to VIP | Upgrade client to VIP status | VIP Promotion |
| Downgrade from VIP | Remove VIP status | VIP Downgrade |
| Assign technician role | Make user a sales agent | Role Assignment |
| Remove technician role | Revoke agent privileges | Role Removal |

### 4.9 Activity Log
| Action | Description | Location |
|--------|-------------|----------|
| View activity log | Access system activity history | Activity Log Page |
| Filter by action type | Show specific action categories | Action Filter |
| Filter by user | Show actions by specific user | User Filter |
| Filter by date | Show actions in date range | Date Filter |
| Search activities | Find specific actions | Search Bar |
| Export activity log | Download activity report | Export Action |

### 4.10 System Configuration
| Action | Description | Location |
|--------|-------------|----------|
| Access settings | Open configuration panel | Settings Page |
| Configure pricing | Set access fees and commissions | Pricing Tab |
| Set standard access fee | Define client registration cost | Fee Input |
| Set VIP access fee | Define VIP upgrade cost | Fee Input |
| Configure commission rates | Set transaction percentages | Rate Inputs |
| Configure appointments | Set appointment pricing | Appointment Settings |
| Set online price | Define video call cost | Price Input |
| Set in-person price | Define physical meeting cost | Price Input |
| Enable/disable first free | Toggle free first appointment | Toggle Switch |
| Manage bank accounts | Configure payment recipients | Bank Accounts Tab |
| Add bank account | Register new payment account | Add Account Modal |
| Edit bank account | Modify account details | Edit Modal |
| Delete bank account | Remove payment account | Delete Action |
| Toggle account status | Enable/disable payment account | Status Toggle |

---

## Permissions Matrix

### Feature Access by Role

| Feature | Client | VIP | Technician | Admin |
|---------|:------:|:---:|:----------:|:-----:|
| View own properties | ✓ | ✓ | - | ✓ |
| Browse property catalog | ✓ | ✓ | ✓ | ✓ |
| View VIP-exclusive properties | ✗ | ✓ | ✓ | ✓ |
| Send property requests | ✓ | ✓ | - | - |
| Track own requests | ✓ | ✓ | - | - |
| Track VEFA projects | ✓ | ✓ | - | ✓ |
| Make payments | ✓ | ✓ | - | - |
| Access VIP services | ✗ | ✓ | - | ✓ |
| Book appointments | ✗ | ✓ | - | - |
| Manage leads | - | - | ✓ | ✓ |
| Manage client portfolio | - | - | ✓ | ✓ |
| Manage properties catalog | - | - | - | ✓ |
| Manage VEFA projects | - | - | - | ✓ |
| Manage appointments | - | - | - | ✓ |
| Manage VIP services | - | - | - | ✓ |
| Manage users | - | - | - | ✓ |
| View activity log | - | - | - | ✓ |
| Configure system settings | - | - | - | ✓ |

### Legend
- ✓ : Full access
- ✗ : No access
- `-` : Not applicable to this role

---

## Navigation Structure

### Client & VIP Navigation Menu

```
├── My Properties (Mes biens)
├── Catalog (Catalogue)
├── My Requests (Mes demandes)
├── VEFA Tracking (Suivi VEFA)
├── VIP Space* (Espace VIP) [VIP only]
└── Book a Call* (Réserver un appel) [VIP only]
```

### Technician Navigation Menu

```
├── Leads (Leads)
├── Client Portfolio (Portefeuille clients)
├── Properties List (Liste des Biens)
├── My Clients (Mes Clients)
└── Messages (Messages)
```

### Administrator Navigation Menu

```
├── Dashboard (Tableau de bord)
├── Leads / Requests (Demandes / Leads)
├── Client Portfolio (Portefeuille clients)
├── Properties Catalog (Catalogue biens)
├── VEFA Management (Gestion VEFA)
├── Appointments (Rendez-vous)
├── VIP Services (Services VIP)
├── Users Management (Utilisateurs & rôles)
├── Activity Log (Journal d'activité)
└── Configuration (Configuration)
```

---

## Document Information

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Last Updated | January 20, 2026 |
| Application | Baraka Immo |
| Language | English (B2) |

---

*This document covers all user flows based on the current application design. Update this document when new features are added or existing features are modified.*
