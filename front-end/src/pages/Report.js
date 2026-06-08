import React, { useEffect, useState } from 'react';
import API from '../api';
import { PageLayout } from '../components/PageLayout';
import { Badge, btnPrimary, SearchBar, TABLE_TH, TABLE_TD, Card, TableEmpty } from '../components/UI';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Report() {
  const [data,    setData]    = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/report').then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((r) =>
    `${r.CustomerName} ${r.VehicleBrand} ${r.PromotionTitle}`.toLowerCase().includes(search.toLowerCase())
  );

  const fmtValue = (r) => r.Discount_Type === 'Percentage' ? `${r.Discount_Value}%` : `${r.Discount_Value}`;

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('Customer Promotion Report', 14, 15);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    autoTable(doc, {
      startY: 27,
      head: [['#', 'Customer Name', 'Vehicle Brand', 'Vehicle Model', 'Promotion Title', 'Discount Type', 'Discount Value', 'Performance']],
      body: filtered.map((r, i) => [
        i + 1,
        r.CustomerName,
        r.VehicleBrand,
        r.VehicleModel,
        r.PromotionTitle,
        r.Discount_Type,
        fmtValue(r),
        r.Performance,
      ]),
      headStyles: { fillColor: [30, 58, 138] },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      styles: { fontSize: 9 },
    });
    doc.save('customer-promotion-report.pdf');
  };

  return (
    <PageLayout
      title="Customer Promotion Report"
      subtitle="Active customers matched with active vehicle promotions"
      action={
        <div className="no-print flex gap-2">
          <button type="button" onClick={() => window.print()} className={btnPrimary}>
             Print
          </button>
          <button type="button" onClick={generatePDF} className={btnPrimary}>
            Generate PDF
          </button>
        </div>
      }
    >
      <div className="hidden print:block mb-4">
        <h1 className="text-xl font-bold text-blue-900">Customer Promotion Report</h1>
        <p className="text-xs text-gray-500">Printed: {new Date().toLocaleString()}</p>
      </div>

      <div className="no-print">
        <SearchBar value={search} onChange={setSearch} placeholder="Filter by customer, brand or promotion..." />
      </div>

      {loading ? (
        <div className="card p-12 text-center text-gray-500 text-sm animate-pulse-soft">Loading report...</div>
      ) : (
        <>
          <Card>
            <table className="hidden sm:table min-w-full">
              <thead className="bg-blue-900 text-white border-b-[3px] border-accent-500">
                <tr>
                  {['#','Customer Name','Vehicle Brand','Vehicle Model','Promotion Title','Discount Type','Discount Value','Performance'].map(h => (
                    <th key={h} className={TABLE_TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && <TableEmpty colSpan={8} message="No report data found" />}
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-accent-50 transition-colors">
                    <td className={TABLE_TD}>{i + 1}</td>
                    <td className={`${TABLE_TD} font-medium`}>{r.CustomerName}</td>
                    <td className={TABLE_TD}>{r.VehicleBrand}</td>
                    <td className={TABLE_TD}>{r.VehicleModel}</td>
                    <td className={TABLE_TD}>{r.PromotionTitle}</td>
                    <td className={TABLE_TD}>{r.Discount_Type}</td>
                    <td className={`${TABLE_TD} font-semibold text-swift-800`}>{fmtValue(r)}</td>
                    <td className={TABLE_TD}><Badge label={r.Performance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col divide-y divide-gray-100 sm:hidden">
              {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No report data found</p>}
              {filtered.map((r, i) => (
                <div key={i} className="px-4 py-4 hover:bg-accent-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-900">{r.CustomerName}</span>
                    <Badge label={r.Performance} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Vehicle</span><span className="text-gray-800 text-right text-xs">{r.VehicleBrand} {r.VehicleModel}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Promotion</span><span className="text-gray-800 text-right text-xs">{r.PromotionTitle}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Discount</span><span className="text-gray-800 text-right font-semibold text-swift-800 text-xs">{r.Discount_Type} · {fmtValue(r)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-right text-xs text-gray-600 mt-3">
            Total records: <span className="font-bold text-black">{filtered.length}</span>
          </p>
        </>
      )}
    </PageLayout>
  );
}
