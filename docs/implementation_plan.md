# RWPM Implementation Plan

## Phase 1: Foundation & Design System
- [x] Initialize Vite + React project.
- [x] Define CSS Design System (Glassmorphism, Navy Blue, Safety Yellow).
- [x] Create shared components (Sidebar, Layout, Progress Bar).
- [x] Set up Auth Context (JE/SSE Roles).

## Phase 2: Core Form Engine (Junior Engineer Flow)
- [x] Implement multi-step state management.
- [x] **Step 1:** Basic Info + Mock Weather API.
- [x] **Step 2:** Progress Detail tables.
- [x] **Step 3:** Material Detail lists.
- [x] **Step 4 & 5:** Manpower & Machinery management.
- [x] **Step 6 & 7:** Inspection & Final Review.
- [x] Mobile Responsiveness (Card-based table view).

## Phase 3: SSE Approval & Dashboard
- [ ] Implement SSE "Pending Approvals" list.
- [ ] Detail view for SSE to approve/reject JE drafts.
- [ ] Dashboard Charts (Material consumption, Progress trends).

## Phase 4: Reporting & PDF
- [ ] Integrate PDF generation (jsPDF/html2canvas).
- [ ] Official "Railway Work Progress Report" PDF template.
- [ ] Digital Signature placeholder.

## Phase 5: Google Sheets Integration
- [ ] Create `googleSheetsService.js` for CRUD operations.
- [ ] Design Sheet Schema (Headers: Report ID, Tender No, Date, Agency, etc.).
- [ ] Implement `GET` reports from Google Sheets on app load.
- [ ] Implement `POST` new report to Google Sheets on JE submission.
- [ ] Implement `PATCH` status update (Approval/Rejection) in Sheets.
