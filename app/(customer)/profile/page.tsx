export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Profile</p>
          <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        <p className="text-gray-500">Manage your personal details and preferences.</p>
      </div>
    </div>
  );
}