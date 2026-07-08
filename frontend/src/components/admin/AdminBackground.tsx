import { cn } from '@/lib/utils';

type AdminBackgroundProps = {
  className?: string;
  intervalMs?: number;
};

const AdminBackground = ({ className }: AdminBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.11),transparent_24%),radial-gradient(circle_at_82%_0%,rgba(144,135,142,0.32),transparent_34%),linear-gradient(135deg,#212020_0%,#212020_62%,#90878E_100%)]",
        className
      )}
    />
  );
};

export default AdminBackground;
