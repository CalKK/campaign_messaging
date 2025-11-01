# WhatsApp Messaging App for Campaign Contacts

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your-username/whatsapp-messaging-app/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/whatsapp-messaging-app/ci.yml)](https://github.com/your-username/whatsapp-messaging-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack web application designed to streamline campaign messaging via WhatsApp. Upload Excel files containing contact lists (names and phone numbers), clean and validate the data, and generate personalized "Click to Chat" WhatsApp links for efficient, manual message sending. Specifically tailored for Kenyan phone numbers with automatic international format conversion.

## Features

- **Excel File Processing**: Supports .xls and .xlsx formats with automatic cleaning (removes empty rows, trims data, standardizes columns).
- **Phone Number Validation**: Validates and auto-converts Kenyan local numbers (e.g., 712345678 → 254712345678) to international WhatsApp format.
- **Personalized Messaging**: Generates pre-filled WhatsApp links using a customizable message template.
- **Error Handling**: Detailed error reporting for invalid contacts, with row-specific feedback.
- **User-Friendly UI**: Bootstrap-based React interface for easy file uploads and link generation.
- **API-Driven Backend**: Node.js/Express server with RESTful endpoints for file processing.

## Installation

### Prerequisites

- Node.js (v14 or higher) and npm installed on your system.
- A web browser for accessing the frontend.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/whatsapp-messaging-app.git
   cd whatsapp-messaging-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up the Backend Server**:
   - Ensure a `server.js` file exists in the root directory to serve the Express app (integrating the `/api` routes). If missing, create one with basic Express setup:
     ```javascript
     const express = require('express');
     const cors = require('cors');
     const path = require('path');
     const app = express();
     const PORT = process.env.PORT || 3001;

     app.use(cors());
     app.use(express.json());

     // API routes
     app.use('/api', require('./api/process'));
     app.use('/api', require('./api/clean'));

     // Serve React build in production
     if (process.env.NODE_ENV === 'production') {
       app.use(express.static(path.join(__dirname, 'build')));
       app.get('*', (req, res) => {
         res.sendFile(path.join(__dirname, 'build', 'index.html'));
       });
     }

     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
     ```
   - Run the server:
     ```bash
     npm run server
     ```
     The backend will start on `http://localhost:3001` (or your configured port).

4. **Run the Frontend**:
   - In a new terminal:
     ```bash
     npm start
     ```
     The React app will launch on `http://localhost:3000` and proxy API requests to the backend.

5. **Access the Application**:
   - Open `http://localhost:3000` in your browser to use the app.

## Usage

### Basic Workflow

1. **Prepare Your Excel File**:
   - Create an Excel file (.xls or .xlsx) with two columns:
     - Column A: Names (e.g., "John Doe")
     - Column B: Phone numbers (e.g., 712345678 for Kenyan local, or 254712345678 for international).
   - Example data:
     | Name      | Telephone  |
     |-----------|------------|
     | Alice     | 712345678 |
     | Bob       | 254798765432 |

2. **Upload and Clean the File** (Optional but Recommended):
   - Click "Choose File" and select your Excel file.
   - Click "Clean File" to download a standardized version (`cleaned_contacts.xlsx`). This removes formatting issues and ensures the file meets the required format.
   - Upload the cleaned file for processing.

3. **Generate WhatsApp Links**:
   - With the file uploaded, click "Generate Links".
   - Review the summary (valid contacts, errors) and any detailed error list.
   - Click "Send Message" buttons to open WhatsApp Web/App with pre-filled, personalized messages.

### Code Example (Frontend Integration)

If integrating the UI component elsewhere, use the `App` component from `src/App.js`:

```javascript
import React from 'react';
import App from './src/App'; // Assuming relative path

function MyApp() {
  return <App />;
}

export default MyApp;
```

### API Usage Examples

Use tools like `curl` or Postman to test endpoints directly.

- **Clean File Endpoint**:
  ```bash
  curl -X POST -F "file=@contacts.xlsx" http://localhost:3001/api/clean --output cleaned_contacts.xlsx
  ```
  - Downloads a cleaned Excel file.

- **Process File Endpoint**:
  ```bash
  curl -X POST -F "file=@contacts.xlsx" http://localhost:3001/api/process
  ```
  - Response (JSON):
    ```json
    {
      "contacts": [
        {
          "name": "Alice",
          "telephone": "254712345678",
          "link": "https://wa.me/254712345678?text=Dear%20Alice%2C%0A%0AThe%20Wait%20is%20Finally%20Over%EF%B8%8F.%20This%20rerun%20represents%20a%20vote%20for%20courage...%0A%0A%23Alvin4president%0A%0A%23the17th"
        }
      ],
      "summary": {
        "found": 2,
        "errors": 0,
        "errorDetails": []
      }
    }
    ```

## API Documentation

The backend provides two main endpoints for file processing. All requests use `multipart/form-data` for file uploads.

### POST /api/clean
Cleans and standardizes an uploaded Excel file, removing empty rows and ensuring two-column format (Name, Phone).

- **Parameters**:
  - `file` (required): Excel file (.xls or .xlsx).
- **Response**:
  - Success: Downloads `cleaned_contacts.xlsx` as a file attachment.
  - Error: JSON with `error` field (e.g., "Failed to read Excel file").
- **Status Codes**:
  - 200: Success.
  - 400: Invalid file.
  - 405: Method not allowed.
  - 500: Server error.

### POST /api/process
Processes an uploaded Excel file, validates contacts, and generates WhatsApp links.

- **Parameters**:
  - `file` (required): Excel file (.xls or .xlsx).
- **Response** (JSON):
  - `contacts`: Array of valid contacts with `name`, `telephone`, and `link`.
  - `summary`: Object with `found` (total rows), `errors` (invalid count), and `errorDetails` (array of error objects with `rowIndex`, `name`, `phone`, `error`).
- **Status Codes**:
  - 200: Success.
  - 400: Invalid file or data.
  - 405: Method not allowed.
  - 500: Server error.

## Configuration Options

- **Message Template**: Edit `messaging.js` to customize the campaign message. The `[name]` placeholder is replaced with the contact's name.
  ```javascript
  const messageTemplate = "Dear [name],\n\nYour custom message here.";
  ```
- **Phone Validation Rules**: Modify `fileProcessing.js` for custom validation (e.g., country codes, length checks). Currently auto-handles Kenyan numbers (adds 254 for 7xxx or 1xxx prefixes).
- **Server Port**: Set `PORT` environment variable for the backend (default: 3001).
- **Upload Directory**: Files are temporarily stored in `/tmp` (suitable for serverless). For persistent storage, update `multer` config in API files.

## Contributing

We welcome contributions to improve the app! Follow these guidelines:

1. **Fork the Repository**: Create a fork on GitHub.
2. **Create a Feature Branch**: `git checkout -b feature/your-feature-name`.
3. **Make Changes**: Ensure code follows ESLint rules (run `npm test` for linting).
4. **Test Thoroughly**: Upload sample Excel files, test cleaning/processing, and verify links open WhatsApp correctly.
5. **Commit and Push**: Use clear commit messages (e.g., "Add phone validation for international numbers").
6. **Submit a Pull Request**: Provide a detailed description of changes and reference any issues.

### Development Setup
- Run `npm start` for frontend development.
- Run `npm run server` for backend.
- Use `npm run build` to create a production build.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this software, provided you include the original license.

## Troubleshooting

### Common Issues and Solutions

- **File Upload Fails**:
  - Ensure the file is a valid .xls or .xlsx (no merged cells or complex formatting). Try saving as .xlsx from Excel.
  - Check file size (large files may timeout; split if necessary).

- **Phone Number Errors**:
  - "Invalid phone length": Numbers must be 10-15 digits after sanitization. Kenyan local (7xxx) are auto-converted to 2547xxx.
  - "Phone starts with 0": Use international format (e.g., 254 instead of 07).
  - Review detailed errors for row-specific issues.

- **No Valid Links Generated**:
  - Check for empty names/phones or invalid formats. Use "Clean File" first.
  - Ensure Column A has names and Column B has phones.

- **Server Errors (500)**:
  - Verify Node.js version and dependencies (`npm install`).
  - Check console logs for details (e.g., XLSX read failures).
  - Ensure `/tmp` directory is writable (for file uploads).

- **Frontend Not Loading**:
  - Confirm backend is running on the correct port (proxied via React).
  - Clear browser cache or try incognito mode.

- **WhatsApp Links Not Working**:
  - Links require WhatsApp Web/App installed. Test on a device with WhatsApp.
  - Ensure phone numbers are valid and registered on WhatsApp.

### Getting Help
- Check the console (F12) for error messages.
- Review API responses for detailed error fields.
- Open an issue on GitHub with steps to reproduce and sample files (anonymized).

For further assistance, contact the maintainers or refer to the [GitHub Issues](https://github.com/your-username/whatsapp-messaging-app/issues) page.
