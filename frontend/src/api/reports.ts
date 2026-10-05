import client from './client';
import { Report } from '../types';

export function normalizeReport(r: any): Report {
  if (!r) return r;
  // If wrapped in report object (e.g. upload response { message, report })
  const reportObj = r.report || r;
  const id = reportObj.reportId ?? reportObj.id ?? 0;
  const name = reportObj.reportName ?? reportObj.name ?? 'Medical Report';
  const date = reportObj.reportDate ?? reportObj.date ?? '';
  const parameters = reportObj.parameters || [];

  let statusSummary = reportObj.statusSummary;
  if (!statusSummary && Array.isArray(parameters)) {
    statusSummary = {
      normal: parameters.filter((p: any) => p.status === 'normal' || p.status === 'Normal').length,
      above: parameters.filter((p: any) => p.status === 'above' || p.status === 'High').length,
      below: parameters.filter((p: any) => p.status === 'below' || p.status === 'Low').length,
    };
  }

  return {
    ...reportObj,
    id,
    reportId: id,
    name,
    reportName: name,
    date,
    reportDate: date,
    parameterCount: parameters.length,
    statusSummary,
    parameters,
  };
}

export const reportsApi = {
  list: (): Promise<Report[]> =>
    client.get('/reports').then((r) => (Array.isArray(r.data) ? r.data.map(normalizeReport) : [])),

  getById: (id: number): Promise<Report> =>
    client.get(`/reports/${id}`).then((r) => normalizeReport(r.data)),

  upload: (formData: FormData): Promise<Report> =>
    client.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => normalizeReport(r.data)),

  delete: (id: number): Promise<any> => client.delete(`/reports/${id}`).then((r) => r.data),
};
