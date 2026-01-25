import { useState } from 'react';
import { usageAPI } from '../services/api';
import { format } from 'date-fns';
import { formatMinutesToHours } from '../utils/timeFormatter';

const APP_OPTIONS = [
  'Instagram',
  'Facebook',
  'Twitter (X)',
  'TikTok',
  'YouTube',
  'Snapchat',
  'WhatsApp',
  'Other'
];

export const UsageEntry = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    appName: '',
    customAppName: '',
    minutesSpent: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Reset customAppName if appName changes from "Other"
      ...(name === 'appName' && value !== 'Other' ? { customAppName: '' } : {})
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
      // Use customAppName if "Other" is selected, otherwise use appName
      const finalAppName = formData.appName === 'Other' 
        ? formData.customAppName.trim() 
        : formData.appName.trim();

      if (!finalAppName) {
        setError('Please enter an app name');
        setLoading(false);
        return;
      }

      await usageAPI.create({
        appName: finalAppName,
        minutesSpent: parseFloat(formData.minutesSpent),
        date: formData.date
      });

      setSuccess('Usage entry added successfully!');
      setFormData({
        appName: '',
        customAppName: '',
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

  // Calculate preview time
  const previewMinutes = parseFloat(formData.minutesSpent) || 0;
  const timePreview = previewMinutes > 0 ? formatMinutesToHours(previewMinutes) : null;

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
            <select
              id="appName"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select an app</option>
              {APP_OPTIONS.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
            {formData.appName === 'Other' && (
              <input
                type="text"
                name="customAppName"
                value={formData.customAppName}
                onChange={handleChange}
                className="input-field mt-2"
                placeholder="Enter app name"
                required
                maxLength={100}
              />
            )}
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
            {timePreview && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You spent: <span className="font-medium">{timePreview}</span>
              </p>
            )}
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
