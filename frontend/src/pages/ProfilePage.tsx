import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address } from '../api/api-spec';
import { getMyProfile, updateMyProfile, listAddresses, deleteAddress } from '../api/customers';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { getApiError } from '../api/client';

export default function ProfilePage() {
  const { isAuthenticated, customer: ctxCustomer } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    async function load() {
      try {
        const [profile, addrs] = await Promise.all([getMyProfile(), listAddresses()]);
        setUsername(profile.username);
        setAddresses(addrs);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [isAuthenticated, navigate]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateMyProfile({ username });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(getApiError(err));
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      {ctxCustomer && <p className="text-sm text-gray-500 mt-1">ID: {ctxCustomer.id.slice(0, 8)}…</p>}

      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {/* Profile form */}
      <form onSubmit={handleSave} className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Account Details</h2>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={64}
          required
        />
        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Addresses */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Saved Addresses</h2>
        </div>

        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No addresses saved yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {addresses.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.label ?? 'Address'}</p>
                  <p className="text-xs text-gray-500">{a.countryCode}{a.isDefault ? ' · Default' : ''}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(a.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
