import React from 'react';
import {
  Utensils,
  Car,
  Home,
  Smile,
  Heart,
  Briefcase,
  TrendingUp,
  ShoppingCart,
  Wifi,
  Banknote,
  Zap,
  Smartphone,
  Coffee,
  Plane,
  Dumbbell,
  GraduationCap,
  Gift,
  AlertCircle,
  Droplet,
  Flame,
  Pill,
  Store,
  Wrench,
  Fuel,
  Gamepad2
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export function CategoryIcon({ iconName, className = "h-4 w-4" }: CategoryIconProps) {
  const icons: Record<string, React.ElementType> = {
    'Utensils': Utensils,
    'Car': Car,
    'Home': Home,
    'Smile': Smile,
    'Heart': Heart,
    'Briefcase': Briefcase,
    'TrendingUp': TrendingUp,
    'ShoppingCart': ShoppingCart,
    'Wifi': Wifi,
    'Banknote': Banknote,
    'Zap': Zap,
    'Smartphone': Smartphone,
    'Coffee': Coffee,
    'Plane': Plane,
    'Dumbbell': Dumbbell,
    'GraduationCap': GraduationCap,
    'Gift': Gift,
    'Droplet': Droplet,
    'Flame': Flame,
    'Pill': Pill,
    'Store': Store,
    'Wrench': Wrench,
    'Fuel': Fuel,
    'Gamepad2': Gamepad2,
  };

  const IconComponent = icons[iconName] || AlertCircle;

  return <IconComponent className={className} />;
}
