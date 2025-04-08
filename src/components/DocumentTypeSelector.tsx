import React from 'react';
import { FileText, Contact as FileContract, Shield, FileCheck, Calendar, DollarSign, Briefcase } from 'lucide-react';
import type { Document } from '../types';

interface DocumentTypeSelectorProps {
  onSelect: (type: Document['type']) => void;
}

const documentTypes = [
  { 
    type: 'invoice' as const,
    icon: FileText,
    label: 'Invoice',
    description: 'Professional invoices with customizable fields and branding'
  },
  { 
    type: 'contract' as const,
    icon: FileContract,
    label: 'Contract',
    description: 'Legally-sound contracts with customizable terms'
  },
  { 
    type: 'nda' as const,
    icon: Shield,
    label: 'NDA',
    description: 'Non-disclosure agreements to protect your intellectual property'
  },
  { 
    type: 'proposal' as const,
    icon: FileCheck,
    label: 'Business Proposal',
    description: 'Compelling proposals to win new clients'
  },
  { 
    type: 'socialMedia' as const,
    icon: Calendar,
    label: 'Social Media Calendar',
    description: 'Organize your social media content strategy'
  },
  { 
    type: 'pricing' as const,
    icon: DollarSign,
    label: 'Pricing Sheet',
    description: 'Clear and professional service pricing documents'
  },
  { 
    type: 'businessPlan' as const,
    icon: Briefcase,
    label: 'Business Plan',
    description: 'Comprehensive business plans for growth and funding'
  },
];

export function DocumentTypeSelector({ onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentTypes.map(({ type, icon: Icon, label, description }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="group relative p-6 bg-white rounded-xl hover-lift gradient-border flex flex-col items-center gap-4 text-left transition-all duration-300 hover:shadow-xl"
        >
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Icon className="w-7 h-7 text-indigo-600 group-hover:text-indigo-700" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          </div>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-100 transition-colors" />
        </button>
      ))}
    </div>
  );
}