export function getStatusIcon(status) {
  if (status === "onGoing") {
    // حلقه چرخان با گرادینت
    return (
      <span className="inline-flex items-center mr-2 align-middle">
        <svg
          className="w-5 h-5 animate-spin text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </span>
    );
  }
  if (status === "waiting") {
    // سه نقطه چشمک‌زن مدرن
    return (
      <span className="inline-flex items-center mr-2 align-middle gap-0.5">
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-yellow-200 rounded-full animate-bounce delay-300"></span>
      </span>
    );
  }
  if (status === "gameOver") {
    // تیک سبز با افکت پاپ
    return (
      <span className="inline-flex items-center mr-2 align-middle animate-pulse">
        <svg
          className="w-6 h-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    );
  }
  return null;
}
