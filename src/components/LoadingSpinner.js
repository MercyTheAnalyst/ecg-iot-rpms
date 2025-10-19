export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
}
