import { useState } from 'react';
import { usageAPI } from '../services/api';
import { format } from 'date-fns';

export const UsageEntry = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    appName: '',
    minutesSpent: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await usageAPI.create({
        appName: formData.appName.trim(),
        minutesSpent: parseFloat(formData.minutesSpent),
        date: formData.date
      });

      setSuccess('Usage entry added successfully!');
      setFormData({
        appName: '',
        minutesSpent: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add usage entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Add Usage Entry</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="appName" className="block text-sm font-medium mb-2">
              App Name
            </label>
            <input
              type="text"
              id="appName"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Instagram, TikTok"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="minutesSpent" className="block text-sm font-medium mb-2">
              Minutes Spent
            </label>
            <input
              type="number"
              id="minutesSpent"
              name="minutesSpent"
              value={formData.minutesSpent}
              onChange={handleChange}
              className="input-field"
              placeholder="0"
              required
              min="0"
              max="1440"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Adding...' : 'Add Entry'}
        </button>
      </form>
    </div>
  );
};
