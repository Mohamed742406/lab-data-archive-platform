import { DraftRecord, TestType } from '../types';
import { BilingualButton } from './BilingualButton';

interface PrintReportProps {
  draft: DraftRecord;
  onClose: () => void;
}

export function PrintReport({ draft, onClose }: PrintReportProps) {
  const getTestTypeName = (type: TestType) => {
    const names = {
      concrete: { arabic: 'خرسانة', english: 'Concrete' },
      asphalt: { arabic: 'أسفلت', english: 'Asphalt' },
      soil: { arabic: 'تربة', english: 'Soil' },
    };
    return names[type];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير العينة ${draft.sampleId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            direction: rtl;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .logo-en {
            font-size: 14px;
            color: #6b7280;
          }
          .report-title {
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
            color: #1f2937;
          }
          .report-title-en {
            font-size: 12px;
            color: #6b7280;
          }
          .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          .image-section img {
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
          }
          .image-caption {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
            text-align: center;
          }
          .details-section {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .detail-row {
            display: flex;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .detail-label {
            font-weight: bold;
            color: #374151;
            width: 120px;
            flex-shrink: 0;
          }
          .detail-label-en {
            font-size: 10px;
            color: #9ca3af;
            display: block;
          }
          .detail-value {
            color: #1f2937;
          }
          .notes-section {
            margin-top: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .notes-title {
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
          }
          .notes-title-en {
            font-size: 10px;
            color: #9ca3af;
          }
          .notes-content {
            color: #4b5563;
            font-size: 14px;
          }
          .engineer-notes {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
          }
          .status-approved {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #6b7280;
          }
          .signature-section {
            margin-top: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
          .signature-box {
            border-top: 2px solid #1f2937;
            padding-top: 10px;
            text-align: center;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">منصة أرشفة الدرفت والتقارير المعملية</div>
          <div class="logo-en">Lab Draft & Reports Archive Platform</div>
          <div class="report-title">تقرير اختبار معتمد</div>
          <div class="report-title-en">Approved Test Report</div>
        </div>
        
        <div class="content">
          <div class="image-section">
            <img src="${draft.imageUrl}" alt="صورة الدرفت" />
            <div class="image-caption">${draft.imageName}</div>
          </div>
          
          <div class="details-section">
            <div class="detail-row">
              <div class="detail-label">
                رقم العينة
                <span class="detail-label-en">Sample ID</span>
              </div>
              <div class="detail-value" style="font-weight: bold; color: #2563eb;">${draft.sampleId}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                نوع الاختبار
                <span class="detail-label-en">Test Type</span>
              </div>
              <div class="detail-value">${getTestTypeName(draft.testType).arabic} / ${getTestTypeName(draft.testType).english}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                الفني
                <span class="detail-label-en">Technician</span>
              </div>
              <div class="detail-value">${draft.uploadedBy}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                تاريخ الرفع
                <span class="detail-label-en">Upload Date</span>
              </div>
              <div class="detail-value">${formatDate(draft.uploadedAt)}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                الحالة
                <span class="detail-label-en">Status</span>
              </div>
              <div class="detail-value">
                <span class="status-approved">تم الاعتماد ✓</span>
              </div>
            </div>
          </div>
        </div>
        
        ${draft.notes ? `
        <div class="notes-section">
          <div class="notes-title">
            ملاحظات الفني
            <span class="notes-title-en">Technician Notes</span>
          </div>
          <div class="notes-content">${draft.notes}</div>
        </div>
        ` : ''}
        
        ${draft.engineerNotes ? `
        <div class="notes-section engineer-notes">
          <div class="notes-title" style="color: #166534;">
            ملاحظات المهندس المعتمِد
            <span class="notes-title-en">Engineer Approval Notes</span>
          </div>
          <div class="notes-content" style="color: #166534;">${draft.engineerNotes}</div>
        </div>
        ` : ''}
        
        <div class="signature-section">
          <div class="signature-box">
            <div>توقيع الفني</div>
            <div style="font-size: 10px; color: #9ca3af;">Technician Signature</div>
          </div>
          <div class="signature-box">
            <div>توقيع المهندس المعتمِد</div>
            <div style="font-size: 10px; color: #9ca3af;">Engineer Approval Signature</div>
          </div>
        </div>
        
        <div class="footer">
          <div>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</div>
          <div>© 2024 - مختبرات مواد البناء</div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">معاينة التقرير للطباعة</h3>
                <p className="text-gray-500 text-sm">Print Report Preview</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div id="print-content" className="p-6">
          {/* Preview Content */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
              <h4 className="text-lg font-bold text-blue-800">منصة أرشفة الدرفت والتقارير المعملية</h4>
              <p className="text-gray-500 text-xs">Lab Draft & Reports Archive Platform</p>
              <p className="mt-2 font-semibold text-gray-700">تقرير اختبار معتمد / Approved Test Report</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img src={draft.imageUrl} alt={draft.imageName} className="w-full rounded-lg border" />
                <p className="text-xs text-gray-500 mt-1 text-center">{draft.imageName}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">رقم العينة</span>
                  <span className="font-bold text-blue-600">{draft.sampleId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">نوع الاختبار</span>
                  <span>{getTestTypeName(draft.testType).arabic}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">الفني</span>
                  <span>{draft.uploadedBy}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">تاريخ الرفع</span>
                  <span className="text-xs">{formatDate(draft.uploadedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحالة</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    تم الاعتماد ✓
                  </span>
                </div>
              </div>
            </div>

            {draft.engineerNotes && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-1">ملاحظات المهندس:</p>
                <p className="text-sm text-green-800">{draft.engineerNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <BilingualButton
            arabicText="طباعة التقرير"
            englishText="Print Report"
            variant="primary"
            size="lg"
            onClick={handlePrint}
            className="flex-1"
          />
          <BilingualButton
            arabicText="إغلاق"
            englishText="Close"
            variant="secondary"
            size="lg"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
