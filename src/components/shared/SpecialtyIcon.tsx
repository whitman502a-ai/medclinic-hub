import { Stethoscope, SmilePlus, Baby, Scan, Apple, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  SmilePlus,
  Baby,
  Scan,
  Apple,
};

export function SpecialtyIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Stethoscope;
  return <Icon className={className} />;
}
