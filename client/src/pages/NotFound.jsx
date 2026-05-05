import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
      <p className="text-7xl font-black text-primary/10">404</p>
      <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-2">
        <HiHome className="w-4 h-4" /> Go Home
      </Link>
    </div>
  );
}
