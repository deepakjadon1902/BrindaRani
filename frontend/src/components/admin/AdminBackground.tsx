import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const ADMIN_BG_IMAGES = [
  '/admin-bg/krishna-01.png',
  '/admin-bg/krishna-02.jpg',
  '/admin-bg/krishna-03.jpg',
  '/admin-bg/krishna-04.png',
  '/admin-bg/krishna-05.png',
];

type AdminBackgroundProps = {
  className?: string;
  intervalMs?: number;
};

const AdminBackground = ({ className, intervalMs = 5000 }: AdminBackgroundProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % ADMIN_BG_IMAGES.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 bg-cover bg-center transition-opacity duration-1000", className)}
      style={{ backgroundImage: `url(${ADMIN_BG_IMAGES[index]})` }}
    />
  );
};

export default AdminBackground;
