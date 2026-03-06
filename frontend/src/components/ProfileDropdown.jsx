import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ left: 0, bottom: 0 });

  // Notifications
  const [expandedNotif, setExpandedNotif] = useState(null);

  // Settings
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notifPrefs, setNotifPrefs] = useState({
    cycleReminders: true, doctorTips: true, aiAlerts: true, healthWarnings: true
  });

  // Privacy
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consents, setConsents] = useState({ dataCollection: true, analytics: true, marketing: false });

  // Help
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [reportForm, setReportForm] = useState({ type: 'Bug', description: '' });

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // ============ FETCH PROFILE ============
  useEffect(() => {
    // Apply saved dark mode on mount (from localStorage)
    const savedDark = localStorage.getItem('darkMode') === 'true';
    if (savedDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !profile) {
      apiCall('/user/profile', 'GET')
        .then(data => {
          setProfile(data);
          setEditData({
            name: data.name || '', phone: data.phone || '',
            age: data.age || '', height: data.height || '', weight: data.weight || ''
          });
          if (data.language) setLanguage(data.language);
          if (data.notificationPrefs) setNotifPrefs(data.notificationPrefs);
          // Sync dark mode from DB (overrides localStorage)
          if (data.darkMode !== undefined) {
            setDarkMode(data.darkMode);
            if (data.darkMode) {
              document.documentElement.classList.add('dark');
              localStorage.setItem('darkMode', 'true');
            } else {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('darkMode', 'false');
            }
          }
        })
        .catch(() => showStatus('Service temporarily unavailable'));
    }
  }, [isOpen]);

  // ============ CLICK OUTSIDE ============
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAll = () => {
    setIsOpen(false); setActiveSection(null); setEditMode(false);
    setConfirmDelete(false); setShowPasswordModal(false);
    setShowConsentModal(false); setShowContactModal(false);
    setShowReportModal(false); setStatusMsg('');
  };

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // ============ HANDLERS ============
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updated = await apiCall('/user/profile', 'PUT', editData);
      setProfile(prev => ({ ...prev, ...updated }));
      setEditMode(false);
      showStatus('✅ Profile saved');
    } catch { showStatus('Service temporarily unavailable'); }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showStatus('❌ Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showStatus('❌ Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await apiCall('/user/change-password', 'PUT', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showStatus('✅ Password changed');
    } catch (err) { showStatus(`❌ ${err.message || 'Service temporarily unavailable'}`); }
    setLoading(false);
  };

  const handleToggleDarkMode = async () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    // ✅ Actually apply dark mode to the page
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Persist in localStorage so it survives page refresh
    localStorage.setItem('darkMode', String(newVal));
    try {
      await apiCall('/user/settings', 'PUT', { darkMode: newVal, language, notificationPrefs: notifPrefs });
      showStatus(newVal ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    } catch { showStatus('Service temporarily unavailable'); }
  };

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    try {
      await apiCall('/user/settings', 'PUT', { darkMode, language: lang, notificationPrefs: notifPrefs });
      showStatus(`🌐 Language set to ${lang}`);
    } catch { showStatus('Service temporarily unavailable'); }
  };

  const handleNotifPrefToggle = async (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    try {
      await apiCall('/user/settings', 'PUT', { darkMode, language, notificationPrefs: updated });
    } catch { showStatus('Service temporarily unavailable'); }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/user/profile', 'GET');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'saheli_my_data.json'; a.click();
      URL.revokeObjectURL(url);
      showStatus('✅ Data downloaded');
    } catch { showStatus('Service temporarily unavailable'); }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await apiCall('/user/account', 'DELETE');
      onLogout();
    } catch { showStatus('Service temporarily unavailable'); }
    setLoading(false);
  };

  const handleSaveConsents = async () => {
    showStatus('✅ Consent preferences saved');
    setShowConsentModal(false);
  };

  const handleContactSubmit = () => {
    showStatus('✅ Message sent to support');
    setShowContactModal(false);
    setContactForm({ subject: '', message: '' });
  };

  const handleReportSubmit = () => {
    showStatus('✅ Issue reported — we\'ll look into it');
    setShowReportModal(false);
    setReportForm({ type: 'Bug', description: '' });
  };

  const menuSections = [
    { key: 'profile', icon: '👤', label: 'My Profile' },
    { key: 'notifications', icon: '🔔', label: 'Notifications' },
    { key: 'settings', icon: '⚙️', label: 'Settings' },
    { key: 'privacy', icon: '🔒', label: 'Privacy & Data' },
    { key: 'help', icon: '❓', label: 'Help & Support' },
  ];

  // ============ STATUS BAR ============
  const StatusBar = () => statusMsg ? (
    <div className="px-4 py-2 text-xs font-bold text-center bg-slate-100 text-slate-700 border-t border-slate-200">
      {statusMsg}
    </div>
  ) : null;

  // ============ SECTION: PROFILE ============
  const renderProfile = () => (
    <div className="space-y-3">
      {editMode ? (
        <>
          {['name', 'phone', 'age', 'height', 'weight'].map(field => (
            <div key={field}>
              <label className="text-xs font-bold text-[#E88C9A] uppercase tracking-wider">{field}</label>
              <input
                type={['age', 'height', 'weight'].includes(field) ? 'number' : 'text'}
                value={editData[field]}
                onChange={e => setEditData({ ...editData, [field]: e.target.value })}
                className="w-full p-2 rounded-xl border border-rose-100 text-sm text-[#5C3A4D] mt-1 bg-[#FFF8F6] font-bold"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSaveProfile} disabled={loading} className="flex-1 bg-[#E88C9A] text-white py-2 rounded-2xl text-sm font-bold hover:bg-[#D97A88] disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)} className="flex-1 bg-white border border-rose-50 text-[#4A4A4A] py-2 rounded-2xl text-sm font-bold hover:bg-rose-50">Cancel</button>
          </div>
        </>
      ) : (
        <>
          {[
            { label: 'Name', value: profile?.name || 'Not set' },
            { label: 'Email', value: profile?.email },
            { label: 'Phone', value: profile?.phone || 'Not set' },
            { label: 'Age', value: profile?.age || 'Not set' },
            { label: 'Height', value: profile?.height ? `${profile.height} cm` : 'Not set' },
            { label: 'Weight', value: profile?.weight ? `${profile.weight} kg` : 'Not set' },
            { label: 'PCOS Status', value: profile?.pcosStatus || 'Not assessed' },
            { label: 'Cycle Length', value: profile?.cycleLength || 'Unknown' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-[#4A4A4A] tracking-wider">{item.label}</span>
              <span className="text-sm font-black text-[#5C3A4D]">{item.value}</span>
            </div>
          ))}
          <button onClick={() => setEditMode(true)} className="w-full mt-3 py-2 bg-rose-50 text-[#E88C9A] rounded-2xl text-sm font-bold hover:bg-rose-100 transition shadow-sm border border-rose-100">
            ✏️ Edit Profile
          </button>
        </>
      )}
    </div>
  );

  // ============ SECTION: NOTIFICATIONS ============
  const notifications = [
    {
      icon: '📅', title: 'Cycle Reminder', desc: 'Your next cycle check-in is due', time: 'Today',
      detail: 'Based on your cycle length, your next period is expected soon. Track your symptoms daily for better insights. Log any irregularities in your health questionnaire.'
    },
    {
      icon: '💊', title: 'Doctor Tip', desc: 'Consider adding Inositol to your routine', time: '2h ago',
      detail: 'Myo-Inositol (2000mg) + D-Chiro-Inositol (50mg) daily has shown significant improvement in PCOS symptoms including insulin resistance and ovulation. Always consult your doctor before starting supplements.'
    },
    {
      icon: '🤖', title: 'AI Alert', desc: 'New personalized insights available', time: '5h ago',
      detail: 'Your latest health assessment has generated new AI-powered insights. Visit your Dashboard to review updated recommendations for diet, exercise, and stress management.'
    },
    {
      icon: '⚠️', title: 'Health Warning', desc: 'BMI change detected — review your diet plan', time: '1d ago',
      detail: 'A shift in your BMI has been detected based on recent data. This could affect your PCOS management plan. Please review your personalized diet plan and consult with your healthcare provider if needed.'
    },
  ];

  const renderNotifications = () => (
    <div className="space-y-2">
      {notifications.map((notif, i) => (
        <div key={i} onClick={() => setExpandedNotif(expandedNotif === i ? null : i)}
          className="p-3 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 hover:bg-rose-50/50 transition cursor-pointer shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-lg bg-white w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">{notif.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-[#5C3A4D]">{notif.title}</p>
              <p className="text-xs text-[#4A4A4A] font-medium tracking-wide">{notif.desc}</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#E88C9A] whitespace-nowrap">{notif.time}</span>
          </div>
          {expandedNotif === i && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-rose-100 text-xs text-[#4A4A4A] font-medium leading-relaxed shadow-sm">
              {notif.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ============ SECTION: SETTINGS ============
  const renderSettings = () => (
    <div className="space-y-3">
      {/* Change Password */}
      {showPasswordModal ? (
        <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 space-y-3 shadow-sm">
          <p className="text-sm font-black text-[#5C3A4D]">🔑 Change Password</p>
          {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
            <div key={field}>
              <label className="text-[10px] font-bold text-[#E88C9A] tracking-widest uppercase">
                {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
              </label>
              <input type="password" value={passwordData[field]}
                onChange={e => setPasswordData({ ...passwordData, [field]: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-rose-100 text-sm font-bold text-[#5C3A4D] mt-1 bg-white" />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={handleChangePassword} disabled={loading} className="flex-1 bg-[#E88C9A] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#D97A88] disabled:opacity-50 shadow-sm">
              {loading ? 'Changing...' : 'Change'}
            </button>
            <button onClick={() => setShowPasswordModal(false)} className="flex-1 bg-white text-[#4A4A4A] border border-rose-50 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 shadow-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowPasswordModal(true)} className="w-full text-left p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 hover:bg-rose-50 transition text-sm text-[#5C3A4D] font-bold shadow-sm">
          🔑 Change Password
        </button>
      )}

      {/* Dark Mode Toggle */}
      <div className="flex justify-between items-center p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 cursor-pointer shadow-sm" onClick={handleToggleDarkMode}>
        <span className="text-sm text-[#5C3A4D] font-bold">🌙 Dark Mode</span>
        <div className={`w-10 h-5 rounded-full relative transition-all ${darkMode ? 'bg-[#5C3A4D]' : 'bg-[#E88C9A]/30'}`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${darkMode ? 'left-[22px]' : 'left-0.5'}`} />
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 shadow-sm">
        <label className="text-sm text-[#5C3A4D] font-bold block mb-2">🌐 Language</label>
        <select value={language} onChange={e => handleLanguageChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-rose-100 text-sm font-bold text-[#5C3A4D] bg-white">
          {['English', 'Hindi', 'Spanish', 'French', 'German'].map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Notification Preferences */}
      <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 shadow-sm">
        <p className="text-sm text-[#5C3A4D] font-bold mb-3 border-b border-rose-100 pb-2">🔔 Notification Preferences</p>
        {[
          { key: 'cycleReminders', label: 'Cycle Reminders' },
          { key: 'doctorTips', label: 'Doctor Tips' },
          { key: 'aiAlerts', label: 'AI Alerts' },
          { key: 'healthWarnings', label: 'Health Warnings' }
        ].map(pref => (
          <label key={pref.key} className="flex items-center justify-between py-2 cursor-pointer border-b border-rose-50 last:border-0 last:pb-0"
            onClick={() => handleNotifPrefToggle(pref.key)}>
            <span className="text-xs font-bold text-[#4A4A4A]">{pref.label}</span>
            <div className={`w-8 h-4 rounded-full relative transition-all ${notifPrefs[pref.key] ? 'bg-[#8FBF9F]' : 'bg-rose-100'}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-all ${notifPrefs[pref.key] ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  // ============ SECTION: PRIVACY ============
  const renderPrivacy = () => (
    <div className="space-y-3">
      <button onClick={handleDownloadData} disabled={loading}
        className="w-full text-left p-4 rounded-[2xl] bg-[#FFF8F6] hover:bg-rose-50 border border-rose-50 transition text-sm text-[#5C3A4D] font-bold disabled:opacity-50 shadow-sm">
        {loading ? '⏳ Downloading...' : '📥 Download My Data'}
      </button>

      {/* Consent Settings */}
      {showConsentModal ? (
        <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 space-y-3 shadow-sm">
          <p className="text-sm font-black text-[#5C3A4D]">📋 Consent Settings</p>
          {[
            { key: 'dataCollection', label: 'Health Data Collection', desc: 'Allow collection of health assessment data' },
            { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve Saheli with anonymous usage data' },
            { key: 'marketing', label: 'Health Tips & Updates', desc: 'Receive PCOS care tips via email' },
          ].map(c => (
            <label key={c.key} className="flex items-start gap-3 py-2 cursor-pointer border-b border-rose-50 last:border-0 last:pb-0"
              onClick={() => setConsents({ ...consents, [c.key]: !consents[c.key] })}>
              <div className={`w-8 h-4 rounded-full relative flex-shrink-0 mt-1.5 transition-all ${consents[c.key] ? 'bg-[#8FBF9F]' : 'bg-rose-100'}`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow transition-all ${consents[c.key] ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#5C3A4D]">{c.label}</p>
                <p className="text-[10px] text-[#4A4A4A] font-medium leading-relaxed mt-0.5">{c.desc}</p>
              </div>
            </label>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSaveConsents} className="flex-1 bg-[#E88C9A] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#D97A88] shadow-sm">Save</button>
            <button onClick={() => setShowConsentModal(false)} className="flex-1 bg-white border border-rose-50 text-[#4A4A4A] py-2 rounded-xl text-sm font-bold hover:bg-rose-50 shadow-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowConsentModal(true)}
          className="w-full text-left p-4 rounded-[2xl] bg-[#FFF8F6] hover:bg-rose-50 border border-rose-50 transition text-sm text-[#5C3A4D] font-bold shadow-sm">
          📋 Consent Settings
        </button>
      )}

      {/* Delete Account */}
      {confirmDelete ? (
        <div className="p-4 rounded-[2xl] bg-red-50/50 border border-red-100 shadow-sm">
          <p className="text-sm text-red-700 font-bold mb-3 leading-relaxed">⚠️ This will permanently delete your account and all health data. This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={handleDeleteAccount} disabled={loading} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 shadow-sm">
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="flex-1 bg-white border border-rose-50 text-slate-600 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 shadow-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setConfirmDelete(true)} className="w-full text-left p-4 rounded-[2xl] bg-red-50/30 hover:bg-red-50/80 border border-red-50 transition text-sm text-red-500 font-bold shadow-sm">
          🗑️ Delete Account
        </button>
      )}
    </div>
  );

  // ============ SECTION: HELP ============
  const faqs = [
    { q: 'What is PCOS?', a: 'Polycystic Ovary Syndrome (PCOS) is a hormonal disorder causing enlarged ovaries with small cysts. It affects 1 in 10 women of reproductive age.' },
    { q: 'How does Saheli help?', a: 'Saheli uses AI to analyze your health data, predict PCOS risk, and provide personalized diet, exercise, and lifestyle recommendations.' },
    { q: 'Is my health data secure?', a: 'Yes. Your data is encrypted and stored securely. You can download or delete your data at any time from Privacy & Data settings.' },
    { q: 'Can I share my report with my doctor?', a: 'Yes! Use the "Download My Data" option in Privacy & Data to export your health report as a JSON file you can share.' },
  ];

  const renderHelp = () => (
    <div className="space-y-3">
      {/* FAQ Accordion */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-[#E88C9A] tracking-widest uppercase px-1">Frequently Asked Questions</p>
        {faqs.map((faq, i) => (
          <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
            className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 hover:bg-rose-50/50 transition cursor-pointer shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-[#5C3A4D] pr-4">{faq.q}</p>
              <span className="text-[#E88C9A] font-bold text-xs">{expandedFaq === i ? '▲' : '▼'}</span>
            </div>
            {expandedFaq === i && (
              <p className="mt-3 text-xs text-[#4A4A4A] font-medium leading-relaxed">{faq.a}</p>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      {showContactModal ? (
        <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 space-y-3 shadow-sm">
          <p className="text-sm font-black text-[#5C3A4D]">📧 Contact Support</p>
          <input type="text" placeholder="Subject" value={contactForm.subject}
            onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-rose-100 text-sm text-[#5C3A4D] font-bold bg-white" />
          <textarea placeholder="Your message..." value={contactForm.message} rows={3}
            onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-rose-100 text-sm text-[#5C3A4D] font-bold bg-white resize-none" />
          <div className="flex gap-2">
            <button onClick={handleContactSubmit} className="flex-1 bg-[#E88C9A] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#D97A88] shadow-sm">Send</button>
            <button onClick={() => setShowContactModal(false)} className="flex-1 bg-white border border-rose-50 text-[#4A4A4A] py-2 rounded-xl text-sm font-bold hover:bg-rose-50 shadow-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowContactModal(true)}
          className="w-full text-left p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 hover:bg-rose-50 transition text-sm text-[#5C3A4D] font-bold flex items-center gap-2 shadow-sm">
          📧 Contact Support
        </button>
      )}

      {/* Report Issue */}
      {showReportModal ? (
        <div className="p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 space-y-3 shadow-sm">
          <p className="text-sm font-black text-[#5C3A4D]">🐛 Report Issue</p>
          <select value={reportForm.type} onChange={e => setReportForm({ ...reportForm, type: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-rose-100 text-sm text-[#5C3A4D] font-bold bg-white">
            {['Bug', 'Feature Request', 'UI Issue', 'Performance', 'Other'].map(t => <option key={t}>{t}</option>)}
          </select>
          <textarea placeholder="Describe the issue..." value={reportForm.description} rows={3}
            onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-rose-100 text-sm text-[#5C3A4D] font-bold bg-white resize-none" />
          <div className="flex gap-2">
            <button onClick={handleReportSubmit} className="flex-1 bg-[#E88C9A] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#D97A88] shadow-sm">Submit</button>
            <button onClick={() => setShowReportModal(false)} className="flex-1 bg-white border border-rose-50 text-[#4A4A4A] py-2 rounded-xl text-sm font-bold hover:bg-rose-50 shadow-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowReportModal(true)}
          className="w-full text-left p-4 rounded-[2xl] bg-[#FFF8F6] border border-rose-50 hover:bg-rose-50 transition text-sm text-[#5C3A4D] font-bold flex items-center gap-2 shadow-sm">
          🐛 Report Issue
        </button>
      )}

      {/* AI Assistant */}
      <button onClick={() => { navigate('/dashboard/assistant'); closeAll(); }}
        className="w-full text-left p-4 rounded-[2xl] bg-gradient-to-r from-[#D97A88] to-[#E88C9A] hover:opacity-90 transition text-sm text-white border border-rose-200 font-bold flex items-center gap-2 shadow-sm">
        🤖 Chat with AI Assistant
      </button>
    </div>
  );

  const sectionContent = {
    profile: renderProfile, notifications: renderNotifications,
    settings: renderSettings, privacy: renderPrivacy, help: renderHelp
  };

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        left: rect.left,
        bottom: window.innerHeight - rect.top + 8
      });
    }
    setIsOpen(!isOpen);
    setActiveSection(null);
    setEditMode(false);
    setConfirmDelete(false);
    setStatusMsg('');
  };

  return (
    <div ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 text-sm font-semibold text-[#4A4A4A] hover:bg-white hover:text-[#5C3A4D] hover:shadow-sm border border-transparent hover:border-rose-50 cursor-pointer select-none"
      >
        <span className="text-xl opacity-70">⚙️</span>
        Settings
      </button>

      {isOpen && (
        <div
          className="fixed w-80 max-h-[75vh] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-rose-50 overflow-hidden z-[60]"
          style={{ left: dropdownPos.left, bottom: dropdownPos.bottom }}
        >
          {/* Banner */}
          <div className="relative overflow-hidden bg-[#FFF8F6] p-5 text-[#5C3A4D] border-b border-rose-50">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#E88C9A] rounded-full opacity-10 blur-xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white rounded-[2xl] flex items-center justify-center text-xl font-bold shadow-sm text-[#E88C9A] border border-rose-50">
                {profile?.name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-extrabold text-lg tracking-tight">{profile?.name || 'Saheli User'}</p>
                <p className="text-xs text-[#8FBF9F] font-bold tracking-wider">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
            {activeSection ? (
              <div className="p-4">
                <button onClick={() => { setActiveSection(null); setEditMode(false); setConfirmDelete(false); setShowPasswordModal(false); setShowConsentModal(false); setShowContactModal(false); setShowReportModal(false); }}
                  className="text-[#E88C9A] text-sm font-bold mb-4 hover:opacity-70 transition-opacity flex items-center gap-1">
                  ← Back
                </button>
                {sectionContent[activeSection]()}
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {menuSections.map(section => (
                  <button key={section.key} onClick={() => setActiveSection(section.key)}
                    className="w-full text-left p-3 rounded-[2xl] hover:bg-[#FFF8F6] transition flex items-center gap-4 text-[#5C3A4D] font-bold">
                    <span className="text-xl">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
                <div className="border-t border-rose-50 mt-2 pt-2">
                  <button onClick={() => { closeAll(); onLogout(); }}
                    className="w-full text-left p-3 rounded-[2xl] hover:bg-rose-50 transition flex items-center gap-4 text-rose-500 font-bold">
                    <span className="text-xl">🚪</span> Logout Securely
                  </button>
                </div>
              </div>
            )}
          </div>

          <StatusBar />
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
