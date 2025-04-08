export interface Document {
  id: string;
  type: 'invoice' | 'contract' | 'nda' | 'proposal' | 'socialMedia' | 'pricing' | 'businessPlan';
  title: string;
  createdAt: Date;
  theme: DocumentTheme;
  components: DocumentComponent[];
}

export interface DocumentTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo?: string;
}

export interface DocumentComponent {
  id: string;
  type: 'text' | 'heading' | 'image' | 'table' | 'signature';
  content: any;
  order: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export interface DocumentTemplate {
  id: string;
  type: Document['type'];
  name: string;
  description: string;
  fields: FormField[];
}