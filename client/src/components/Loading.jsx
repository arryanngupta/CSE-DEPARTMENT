const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#A6192E] border-t-transparent rounded-full animate-spin" aria-label="Loading spinner"></div>
        <p className="text-gray-700">Loading…</p>
      </div>
    </div>
  );
};

export default Loading;
