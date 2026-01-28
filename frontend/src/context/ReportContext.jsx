import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleSheetsService } from '../services/googleSheetsService';

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [masterData, setMasterData] = useState({ tenders: [], machinery: [], materials: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            try {
                const [fetchedReports, fetchedMaster] = await Promise.all([
                    googleSheetsService.fetchReports(),
                    googleSheetsService.fetchMasterData()
                ]);

                if (fetchedReports) setReports(fetchedReports);
                else setReports(MOCK_DATA);

                if (fetchedMaster) setMasterData(fetchedMaster);
            } catch (error) {
                console.error("Failed to fetch from Google Sheets", error);
                setReports(MOCK_DATA);
            } finally {
                setIsLoading(false);
            }
        };
        loadAllData();
    }, []);

    const addReport = async (newReport, role) => {
        const reportWithMeta = {
            id: `REF-${Math.floor(Math.random() * 900) + 100}`,
            tenderNo: newReport.tenderNo,
            projectName: newReport.projectName,
            agencyName: newReport.agencyName,
            location: newReport.location,
            shift: newReport.shift,
            inspectorName: newReport.inspectorName,
            submittedBy: role === 'SSE' ? `${newReport.inspectorName} (SSE)` : 'Rajesh Kumar (JE)',
            date: newReport.date,
            status: role === 'SSE' ? 'Approved' : 'Pending',
            data: { ...newReport }
        };

        // Update local state for immediate UI response
        setReports(prev => [reportWithMeta, ...prev]);

        // Sync to Google Sheets
        try {
            await googleSheetsService.createReport(reportWithMeta, role);
        } catch (error) {
            console.error("Failed to sync new report to Google Sheets", error);
        }
    };

    const updateReportStatus = async (id, status, role) => {
        // Update local state
        setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));

        // Sync to Google Sheets
        try {
            await googleSheetsService.updateReportStatus(id, status, role);
        } catch (error) {
            console.error("Failed to update status in Google Sheets", error);
        }
    };

    return (
        <ReportContext.Provider value={{
            reports,
            masterData,
            isLoading,
            addReport,
            updateReportStatus
        }}>
            {children}
        </ReportContext.Provider>
    );
};

const MOCK_DATA = [
    {
        id: 'REF-101',
        tenderNo: 'RE/TRD/2023/45',
        projectName: 'GHY Section Electrification',
        agencyName: 'ABC Infra',
        location: 'KM 142/0',
        shift: 'Day',
        inspectorName: 'S.K. Biswas',
        submittedBy: 'Rajesh Kumar (JE)',
        date: '2026-01-27',
        status: 'Pending',
        data: {
            weather: 'Sunny',
            progressItems: [
                { workDescription: 'Mast Erection', doneTillToday: '10 Nos' },
                { workDescription: 'Cantilever Adjustment', doneTillToday: '5 Nos' }
            ],
            materialDetails: [
                { name: 'OHE Mast', quantity: '10' },
                { name: 'Contact Wire', quantity: '500' }
            ],
            manpowerItems: [
                { category: 'Skilled', count: '12' },
                { category: 'Unskilled', count: '25' }
            ],
            machineryItems: [
                { machineryName: 'Crane', count: '1' },
                { machineryName: 'Tower Wagon', count: '1' }
            ],
            inspectionInfo: 'Work is as per schedule. Ensure safety belts for height work.',
            safetyDeclared: true
        }
    },
    {
        id: 'REF-102',
        tenderNo: 'RE/TRD/2023/45',
        projectName: 'GHY Section Electrification',
        agencyName: 'ABC Infra',
        location: 'KM 145/2',
        shift: 'Night',
        inspectorName: 'V.P. Singh',
        submittedBy: 'Rajesh Kumar (JE)',
        date: '2026-01-26',
        status: 'Approved',
        data: {
            weather: 'Cloudy',
            progressItems: [
                { workDescription: 'Foundation Casting', doneTillToday: '8 Nos' }
            ],
            materialDetails: [
                { name: 'Cement Bag', quantity: '40' },
                { name: 'Steel Rods', quantity: '200' },
                { name: 'OHE Mast', quantity: '5' }
            ],
            manpowerItems: [
                { category: 'Skilled', count: '10' },
                { category: 'Unskilled', count: '30' }
            ],
            machineryItems: [
                { machineryName: 'Batching Plant', count: '1' }
            ],
            inspectionInfo: 'Night shift supervision was adequate.',
            safetyDeclared: true
        }
    },
    {
        id: 'REF-103',
        tenderNo: 'CORE/OHE/GHY-02',
        projectName: 'LKG Site Foundation',
        agencyName: 'XYZ Projects',
        location: 'KM 10/5',
        shift: 'Day',
        inspectorName: 'M. Pathak',
        submittedBy: 'Rajesh Kumar (JE)',
        date: '2026-01-26',
        status: 'Approved',
        data: {
            weather: 'Rainy',
            progressItems: [{ workDescription: 'Excavation', doneTillToday: '100m' }],
            materialDetails: [{ name: 'Diesel', quantity: '50' }],
            manpowerItems: [{ category: 'Operators', count: '4' }],
            machineryItems: [{ machineryName: 'JCB', count: '2' }],
            inspectionInfo: 'Underground cables identified. Careful excavation required.',
            safetyDeclared: true
        }
    }
];

export const useReports = () => useContext(ReportContext);
