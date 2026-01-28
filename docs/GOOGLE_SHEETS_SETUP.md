# Google Sheets API Integration Setup

To enable persistent data storage and analysis via Google Sheets, follow these steps to set up the Google Apps Script Web App.

## 1. Create the Google Sheet
1. Create a new Google Sheet.
2. Create the following tabs and add their respective headers:

### Tab: `Reports` (Master Sheet)
Headers (Row 1): `id`, `tenderNo`, `projectName`, `agencyName`, `location`, `shift`, `inspectorName`, `submittedBy`, `date`, `status`, `fullData`

### Tab: `Drafts` (New)
Headers (Row 1): `id`, `tenderNo`, `projectName`, `agencyName`, `location`, `shift`, `inspectorName`, `submittedBy`, `date`, `status`, `fullData`
*Note: This matches the Reports structure and stores JE submissions awaiting approval.*

... (Tenders, Machinery, Materials tabs remain the same) ...

## 2. Set up Google Apps Script (v3 - Workflow Enhanced)
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Replace the existing code with the following snippet:

```javascript
/**
 * RWPM Google Sheets Backend - v3
 * Handles Role-Based Workflow (JE drafts -> SSE approval -> Master)
 */

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getReports') {
    return getAllReports();
  } else if (action === 'getMasterData') {
    return getMasterData();
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  
  if (action === 'createReport') {
    return createReport(data.report, data.role);
  } else if (action === 'updateStatus') {
    return updateStatus(data.reportId, data.status, data.role);
  }
}

function getAllReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var reports = getSheetDataArray(ss.getSheetByName('Reports'));
  var drafts = getSheetDataArray(ss.getSheetByName('Drafts'));
  
  // Combine both for the UI, label them if needed
  var all = reports.concat(drafts);
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: all }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createReport(report, role) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var targetSheetName = (role === 'SSE') ? 'Reports' : 'Drafts';
  var sheet = ss.getSheetByName(targetSheetName);
  
  if (role === 'SSE') report.status = 'Approved';
  else report.status = 'Pending';
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newRow = headers.map(function(h) {
    return report[h] || '';
  });
  
  sheet.appendRow(newRow);
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', sheet: targetSheetName }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateStatus(reportId, status, role) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var draftSheet = ss.getSheetByName('Drafts');
  var reportSheet = ss.getSheetByName('Reports');
  
  var draftData = draftSheet.getDataRange().getValues();
  var headers = draftData[0];
  
  for (var i = 1; i < draftData.length; i++) {
    if (draftData[i][0] === reportId) {
      if (status === 'Approved' && role === 'SSE') {
        // 1. Prepare data for Master Report Sheet
        var reportData = {};
        for (var j = 0; j < headers.length; j++) {
          reportData[headers[j]] = draftData[i][j];
        }
        reportData.status = 'Approved';
        
        // 2. Append to Master Sheet
        var masterHeaders = reportSheet.getRange(1, 1, 1, reportSheet.getLastColumn()).getValues()[0];
        var newRow = masterHeaders.map(function(h) { return reportData[h] || ''; });
        reportSheet.appendRow(newRow);
        
        // 3. Delete from Drafts
        draftSheet.deleteRow(i + 1);
        
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Moved to Master' }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        // Just update status (e.g., Rejected) in Drafts
        draftSheet.getRange(i + 1, 10).setValue(status);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  // If not found in drafts, check master (for SSE edits/rejections if needed)
  var masterData = reportSheet.getDataRange().getValues();
  for (var k = 1; k < masterData.length; k++) {
    if (masterData[k][0] === reportId) {
      reportSheet.getRange(k + 1, 10).setValue(status);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Report not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ... (previous functions same as v3)

function getMasterData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var masterData = {
    tenders: getSheetDataArray(ss.getSheetByName('Tenders')),
    machinery: getSheetDataArray(ss.getSheetByName('Machinery')),
    materials: getSheetDataArray(ss.getSheetByName('Materials'))
  };
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: masterData }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetDataArray(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = data[i][j];
    }
    result.push(item);
  }
  return result;
}
```

## 3. Deploy the Script
1. Click **Deploy** > **New Deployment**.
2. Select **Type** as **Web App**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone** (This allows the frontend to call the API without OAuth complexity for this prototype).
5. Copy the **Web App URL**.

## 4. Configure Frontend
1. Open `.env` in the `frontend` directory.
2. Paste the URL:
   ```env
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXXX/exec
   ```
3. Restart the development server.

## 5. Analysis in Google Sheets
Because the data is stored in a structured format, you can now:
- Create **Pivot Tables** to analyze material consumption.
- Build **Charts** within Google Sheets for management.
- Access the `fullData` JSON column via simple App Script functions if you need deeply nested analytics directly in the sheet.
