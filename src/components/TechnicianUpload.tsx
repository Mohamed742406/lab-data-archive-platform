import { useState } from 'react';
import { BilingualButton } from './BilingualButton';
import { BilingualLabel } from './BilingualLabel';
import { DraftRecord, TestType } from '../types';

interface TechnicianUploadProps {
  onUpload: (draft: Omit<DraftRecord, 'id' | 'uploadedAt' | 'status'>) => void;
  technicianName: string;
}

export function TechnicianUpload({ onUpload, technicianName }: TechnicianUploadProps) {
  const [sampleId, setSampleId] = useState('');
  const [testType, setTestType] = useState<TestType>('concrete');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [excelFile, setExcelFile] = useState<string | null>(null);
  const [excelFileName, setExcelFileName] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setExcelFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleId || !imagePreview) return;

    onUpload({
      sampleId,
      testType,
      imageUrl: imagePreview,
      imageName,
      uploadedBy: technicianName,
      notes,
      excelFileUrl: excelFile || undefined,
      excelFileName: excelFileName || undefined,
    });

    // Reset form
    setSampleId('');
    setTestType('concrete');
    setNotes('');
    setImagePreview(null);
    setImageName('');
    setExcelFile(null);
    setExcelFileName('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6 text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">رفع صور الدرفت</h2>
        <p className="text-gray-500 text-sm">Upload Draft Images</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sample ID */}
        <div className="space-y-2">
          <BilingualLabel arabicText="رقم العينة" englishText="Sample ID" />
          <input
            type="text"
            value={sampleId}
            onChange={(e) => setSampleId(e.target.value)}
            placeholder="مثال: CON-2024-001"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Test Type */}
        <div className="space-y-2">
          <BilingualLabel arabicText="نوع الاختبار" englishText="Test Type" />
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value as TestType)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="concrete">خرسانة / Concrete</option>
            <option value="asphalt">أسفلت / Asphalt</option>
            <option value="soil">تربة / Soil</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <BilingualLabel arabicText="صورة الدرفت" englishText="Draft Image" />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="draft-image"
              required={!imagePreview}
            />
            <label
              htmlFor="draft-image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">اضغط لرفع الصورة</p>
                  <p className="text-xs text-gray-400">Click to upload image</p>
                </div>
              )}
            </label>
          </div>
          {imageName && (
            <p className="text-xs text-gray-500 mt-1">{imageName}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <BilingualLabel arabicText="ملاحظات" englishText="Notes" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف ملاحظات إضافية هنا..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Excel File Upload */}
        <div className="space-y-2">
          <BilingualLabel arabicText="ملف الحسابات (اختياري)" englishText="Calculations File (Optional)" />
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelChange}
              className="hidden"
              id="excel-file"
            />
            <label
              htmlFor="excel-file"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
            >
              {excelFileName ? (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{excelFileName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setExcelFile(null);
                      setExcelFileName('');
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm">اضغط لرفع ملف Excel</span>
                  <span className="text-xs text-gray-400">Click to upload Excel file (.xlsx, .xls, .csv)</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <BilingualButton
          arabicText="رفع الدرفت"
          englishText="Upload Draft"
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
        />
      </form>
    </div>
  );
}
