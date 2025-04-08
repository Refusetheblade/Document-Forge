import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Upload, Palette, Type } from 'lucide-react';
import type { DocumentTheme } from '../types';

interface DocumentCustomizerProps {
  theme: DocumentTheme;
  onThemeChange: (theme: DocumentTheme) => void;
}

export function DocumentCustomizer({ theme, onThemeChange }: DocumentCustomizerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary');

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onThemeChange({ ...theme, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    if (activeColor === 'primary') {
      onThemeChange({ ...theme, primaryColor: color });
    } else {
      onThemeChange({ ...theme, secondaryColor: color });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
              {theme.logo ? (
                <img src={theme.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <label className="flex-1">
              <div className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setActiveColor('primary');
                setShowColorPicker(true);
              }}
              className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
            >
              <div
                className="w-full h-8 rounded-md mb-2"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="text-sm font-medium text-gray-600">Primary</span>
            </button>
            <button
              onClick={() => {
                setActiveColor('secondary');
                setShowColorPicker(true);
              }}
              className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
            >
              <div
                className="w-full h-8 rounded-md mb-2"
                style={{ backgroundColor: theme.secondaryColor }}
              />
              <span className="text-sm font-medium text-gray-600">Secondary</span>
            </button>
          </div>
          {showColorPicker && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowColorPicker(false)}
              />
              <div className="relative bg-white p-4 rounded-xl shadow-xl">
                <HexColorPicker
                  color={activeColor === 'primary' ? theme.primaryColor : theme.secondaryColor}
                  onChange={handleColorChange}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Typography</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => onThemeChange({ ...theme, fontFamily: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Inter">Inter - Modern & Clean</option>
            <option value="Roboto">Roboto - Professional</option>
            <option value="Playfair Display">Playfair - Elegant</option>
            <option value="Montserrat">Montserrat - Contemporary</option>
          </select>
        </div>
      </div>
    </div>
  );
}