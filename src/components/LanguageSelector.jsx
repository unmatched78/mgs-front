// src/components/LanguageSelector.jsx
// This component provides a language selector dropdown using shadcn/ui Select component.
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

/**
 * LanguageSelector component using shadcn/ui Select dropdown
 * @param {Array<{ code: string, label: string }>} languages - list of languages to display
 * @param {string} defaultLang - default selected language code
 */
export default function LanguageSelector({
  languages = [
    { code: 'en', label: 'English' },
    { code: 'rw', label: 'Kinyarwanda' }
  ],
  defaultLang = 'en'
}) {
  const { i18n } = useTranslation();

  // Initialize current language state
  const [current, setCurrent] = React.useState(i18n.language || defaultLang);

  const handleChange = (lng) => {
    i18n.changeLanguage(lng);
    setCurrent(lng);
  };

  return (
    <Select
      defaultValue={current}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ code, label }) => (
          <SelectItem key={code} value={code}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
