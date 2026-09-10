# MediLens 🩺

An AI-powered medical report analysis and OCR platform designed to extract, interpret, and visualize clinical health data.

## Features

- **Automated Report Digitization:** Extracts critical text and lab values from uploaded medical records using OCR.
- **Interactive Analytics:** Visualizes health parameters and diagnostic trends using dynamic charts.
- **Secure Record Management:** Structured backend for managing and storing patient report data.
- **Modern User Interface:** Built with a responsive React frontend for seamless file uploads and record viewing.

## Tech Stack

- **Frontend:** React, Vite, Lucide Icons, Recharts
- **Backend:** Node.js, Express.js
- **OCR Engine:** Tesseract.js / OCR Service
- **Styling:** Modern CSS

## System Architecture & Workflow

### 1. Client Layer (React Frontend)
* **User Authentication:** Login and signup workflows.
* **Document Upload:** Interface for uploading medical files and lab reports.
* **Dashboard:** Interactive health visualizations, statistics, and parameter tracking.
* **Reports:** Detailed views of analyzed records and historic data.

### 3. Data & Processing Layer
* **MongoDB:** Document storage for user profiles, metadata, extracted clinical records, and structured lab metrics.
* **OCR / AI Engine:** Optical character recognition and parsing services to digitize raw medical documents and parse clinical insights.