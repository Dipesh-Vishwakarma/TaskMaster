import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Mail, Calendar, Edit2, Save, X, Upload } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (!user) return null;

  const handleSave = async () => {
    // TODO: Implement API call to update user profile
    console.log('Updating profile:', formData);
    setIsEditing(false);
    // You would call an API endpoint here to update the user
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Profile</h1>
          <p className="text-text-secondary">Manage your account information</p>
        </div>
        <div className="flex gap-3">
          <ThemeSwitcher />
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-background text-text rounded-xl font-semibold hover:bg-opacity-80 transition-all flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2"
              >
                <Save size={20} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.full_name.charAt(0).toUpperCase()
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Upload size={24} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{user.full_name}</h2>
            <p className="text-text-secondary">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-6">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-text"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <User size={24} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Username</p>
                  <p className="text-lg font-semibold text-text">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <Mail size={24} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="text-lg font-semibold text-text">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <Calendar size={24} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Member Since</p>
                  <p className="text-lg font-semibold text-text">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;