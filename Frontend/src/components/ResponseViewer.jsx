export default function ResponseViewer({ responses }) {
  if (!responses.length) {
    return (
      <div className="p-6 text-gray-500 text-center italic bg-white/60 rounded-xl shadow-inner">
        🌻 No responses yet. Ask your first farming query above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((res, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-r from-green-50 to-yellow-50 shadow-md rounded-xl p-4 border border-green-200 animate-fadeIn"
        >
          <p className="text-gray-700">{res}</p>
        </div>
      ))}
    </div>
  );
}
