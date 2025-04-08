import React, { useState } from 'react';
import { FileText, Download, Sparkles } from 'lucide-react';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { DocumentForm } from './components/DocumentForm';
import { DocumentCustomizer } from './components/DocumentCustomizer';
import { DocumentEditor } from './components/DocumentEditor';
import { exportToPDF, exportToDOCX } from './utils/exportUtils';
import type { Document, FormField, DocumentTheme, DocumentComponent } from './types';

// Template fields configuration remains the same...
const templateFields: Record<Document['type'], FormField[]> = {
  invoice: [
    { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
    { id: 'clientName', label: 'Client Name', type: 'text', required: true },
    { id: 'amount', label: 'Amount', type: 'number', required: true },
    { id: 'dueDate', label: 'Due Date', type: 'date', required: true },
    { id: 'description', label: 'Description', type: 'textarea', required: true },
  ],
  contract: [
    { id: 'partyOne', label: 'First Party', type: 'text', required: true },
    { id: 'partyTwo', label: 'Second Party', type: 'text', required: true },
    { id: 'startDate', label: 'Start Date', type: 'date', required: true },
    { id: 'endDate', label: 'End Date', type: 'date', required: true },
    { id: 'terms', label: 'Contract Terms', type: 'textarea', required: true },
  ],
  nda: [
    { id: 'partyOne', label: 'First Party', type: 'text', required: true },
    { id: 'partyTwo', label: 'Second Party', type: 'text', required: true },
    { id: 'duration', label: 'Duration (months)', type: 'number', required: true },
    { id: 'confidentialInfo', label: 'Confidential Information', type: 'textarea', required: true },
  ],
  proposal: [
    { id: 'clientName', label: 'Client Name', type: 'text', required: true },
    { id: 'projectName', label: 'Project Name', type: 'text', required: true },
    { id: 'scope', label: 'Project Scope', type: 'textarea', required: true },
    { id: 'budget', label: 'Budget', type: 'number', required: true },
  ],
  socialMedia: [
    { id: 'platform', label: 'Platform', type: 'text', required: true },
    { id: 'startDate', label: 'Start Date', type: 'date', required: true },
    { id: 'content', label: 'Content Plan', type: 'textarea', required: true },
  ],
  pricing: [
    { id: 'productName', label: 'Product/Service Name', type: 'text', required: true },
    { id: 'basePrice', label: 'Base Price', type: 'number', required: true },
    { id: 'description', label: 'Description', type: 'textarea', required: true },
  ],
  businessPlan: [
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    { id: 'mission', label: 'Mission Statement', type: 'textarea', required: true },
    { id: 'marketAnalysis', label: 'Market Analysis', type: 'textarea', required: true },
    { id: 'financialProjections', label: 'Financial Projections', type: 'textarea', required: true },
  ],
};

function App() {
  const [selectedType, setSelectedType] = useState<Document['type'] | null>(null);
  const [theme, setTheme] = useState<DocumentTheme>({
    primaryColor: '#4f46e5',
    secondaryColor: '#6366f1',
    fontFamily: 'Inter',
  });
  const [components, setComponents] = useState<DocumentComponent[]>([]);

  const handleDocumentGeneration = async (data: Record<string, string>) => {
    const newComponents: DocumentComponent[] = Object.entries(data).map(([key, value], index) => ({
      id: key,
      type: templateFields[selectedType!].find((field) => field.id === key)?.type === 'textarea' ? 'text' : 'heading',
      content: value,
      order: index,
    }));
    
    setComponents(newComponents);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const blob = await (format === 'pdf'
        ? exportToPDF(components, theme)
        : exportToDOCX(components, theme));
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export document. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="glass-effect border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Forge</h1>
                <p className="text-sm text-gray-500">Professional documents in minutes</p>
              </div>
            </div>
            {components.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport('pdf')}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export DOCX
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!selectedType ? (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Professional Documents</h2>
              <p className="text-lg text-gray-600">Choose from our collection of professionally designed templates</p>
            </div>
            <DocumentTypeSelector onSelect={setSelectedType} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                </div>
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Change Template
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <DocumentForm
                  type={selectedType}
                  fields={templateFields[selectedType]}
                  onSubmit={handleDocumentGeneration}
                />
              </div>
              {components.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Customize Content</h3>
                  </div>
                  <DocumentEditor
                    components={components}
                    onComponentsChange={setComponents}
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <DocumentCustomizer theme={theme} onThemeChange={setTheme} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;