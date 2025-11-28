import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../state/AuthContext';
import { api } from '../../utils/api';

const StudentProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [birthday, setBirthday] = useState<string>(user?.birthday ?? '');
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl ?? '');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [facebookUrl, setFacebookUrl] = useState(user?.facebookUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(user?.instagramUrl ?? '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      let newProfileImageUrl = profileImageUrl;

      if (profileFile) {
        const formData = new FormData();
        formData.append('file', profileFile);

        const { data } = await api.post<{ url: string }>('/uploads/thumbnail', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        newProfileImageUrl = data.url;
      }

      await updateProfile({
        fullName: fullName || undefined,
        contactNumber: contactNumber || undefined,
        address: address || undefined,
        birthday: birthday || undefined,
        profileImageUrl: newProfileImageUrl || undefined,
        facebookUrl: facebookUrl || undefined,
        instagramUrl: instagramUrl || undefined,
        githubUrl: githubUrl || undefined,
      });

      setProfileImageUrl(newProfileImageUrl || '');
      setProfileFile(null);
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to update profile.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to change password.';
      setPasswordError(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-1">Profile</h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Manage your personal details. These details are used on the public landing page when visitors view the
          author information for your approved project.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 space-y-4 text-xs md:text-sm"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border border-slate-700/80 bg-slate-900/80 flex items-center justify-center overflow-hidden">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${fullName || user?.fullName || 'Student'} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[11px] text-slate-400 px-2 text-center">No profile photo</span>
            )}
          </div>
          <div className="space-y-1.5 text-[11px]">
            <p className="font-medium text-slate-300">Profile picture</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setProfileFile(file);
              }}
              className="w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            />
            <p className="text-[10px] text-slate-500">Optional. This photo appears in the author modal on the landing page.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Contact number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="09XX XXX XXXX"
            />
            <p className="text-[10px] text-slate-500">Optional. Shown only in the author details modal.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="City, Province"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Birthday (Month, day, year)</label>
            <input
              type="text"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="March 10, 2004"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Facebook URL</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="https://facebook.com/your.profile"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Instagram URL</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="https://instagram.com/your.profile"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        {error && (
          <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
        {message && !error && (
          <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-2">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal text-white text-xs md:text-sm font-medium shadow-lg shadow-royal/40 hover:bg-blue-600 transition-colors disabled:opacity-70"
        >
          {saving ? 'Saving changes...' : 'Save profile'}
        </button>
      </motion.form>

      <motion.form
        onSubmit={handleChangePassword}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 space-y-4 text-xs md:text-sm"
      >
        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-50 mb-1">Change password</h2>
          <p className="text-[11px] text-slate-400">
            Use your temporary password once, then set a new password that only you know.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="Temporary password"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="At least 6 characters"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
              placeholder="Re-type new password"
            />
          </div>
        </div>

        {passwordError && (
          <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2">
            {passwordError}
          </div>
        )}
        {passwordMessage && !passwordError && (
          <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-2">
            {passwordMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={passwordSaving}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs md:text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-70"
        >
          {passwordSaving ? 'Updating password...' : 'Update password'}
        </button>
      </motion.form>
    </div>
  );
};

export default StudentProfilePage;
