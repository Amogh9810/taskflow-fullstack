import { useEffect, useState } from 'react';

export default function Toast({ type = 'info', message = '', duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary';
  const textColor = 'text-white';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg animate-pulse z-50`}>
      <p className="font-medium">{message}</p>
    </div>
  );
}
