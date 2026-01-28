/**
 * Service for interacting with Google Sheets via a Google Apps Script Web App.
 * This approach allows for CRUD operations without a dedicated backend.
 */

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export const googleSheetsService = {
    /**
     * Fetch all reports from the spreadsheet
     */
    async fetchReports() {
        console.log("Fetching reports from:", SCRIPT_URL);
        if (!SCRIPT_URL) return null;

        try {
            const response = await fetch(`${SCRIPT_URL}?action=getReports`);
            const data = await response.json();

            if (data.status === 'success') {
                return data.data.map(row => ({
                    // Mapping for human-readable headers
                    id: row.id || row.ID || row['Report ID'] || '',
                    tenderNo: row.tenderNo || row['Tendor No.'] || row['Tender No'] || '',
                    projectName: row.projectName || row['Project Name'] || '',
                    agencyName: row.agencyName || row['Agency Name'] || '',
                    location: row.location || row.Location || '',
                    shift: row.shift || row.Shift || '',
                    inspectorName: row.inspectorName || row['Inspector Name'] || '',
                    submittedBy: row.submittedBy || row['Submitted By'] || '',
                    date: row.date || row.Date || '',
                    status: row.status || row.Status || 'Pending',
                    data: row.fullData ? JSON.parse(row.fullData) : {}
                }));
            }
            throw new Error(data.message || "Unknown error from script");
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw error;
        }
    },

    /**
     * Fetch master data (Tenders, Machinery, Materials)
     */
    async fetchMasterData() {
        console.log("Fetching master data from:", SCRIPT_URL);
        if (!SCRIPT_URL) return null;

        try {
            const response = await fetch(`${SCRIPT_URL}?action=getMasterData`);
            const data = await response.json();

            if (data.status === 'success') {
                // Normalize Tender headers
                const tenders = (data.data.tenders || []).map(t => ({
                    tenderNo: t.tenderNo || t['Tendor No.'] || t['Tender No'] || '',
                    projectName: t.projectName || t['Project Name'] || '',
                    agencyName: t.agencyName || t['Agency Name'] || '',
                    loaNo: t.loaNo || t['LOA No.'] || t['LOA No'] || '',
                    section: t.section || t.Section || ''
                }));

                return { ...data.data, tenders };
            }
            throw new Error(data.message || "Unknown error from script");
        } catch (error) {
            console.error('Error fetching master data:', error);
            throw error;
        }
    },

    /**
     * Create a new report in the spreadsheet
     */
    async createReport(report, role) {
        if (!SCRIPT_URL) {
            console.warn('VITE_GOOGLE_SHEETS_URL not configured.');
            return null;
        }

        const payload = {
            action: 'createReport',
            role: role || 'JE',
            report: {
                ...report,
                fullData: JSON.stringify(report.data || report)
            }
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    },

    /**
     * Update an existing report status
     */
    async updateReportStatus(reportId, status, role) {
        if (!SCRIPT_URL) return null;

        const payload = {
            action: 'updateStatus',
            reportId,
            status,
            role: role || 'SSE'
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (error) {
            console.error('Error updating report status:', error);
            throw error;
        }
    }
};
