export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userData = user?.user || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold mb-6">👤 Your Profile</h2>

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold uppercase">
            {userData?.name?.[0] || "U"}
          </div>

          <p className="text-lg font-semibold">
            Name : {userData?.name || "User"}
          </p>

          <p className="text-lg font-semibold">
            Email : {userData?.email || "N/A"}
          </p>

          <p className="text-lg font-semibold">
            Phone : {userData?.phone || "N/A"}
          </p>

        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
