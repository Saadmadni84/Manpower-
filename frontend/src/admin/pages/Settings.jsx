import React, { useState } from 'react';
import GeneralSettings from '../components/Settings/GeneralSettings';
import AdminUsers from '../components/Settings/AdminUsers';
import EmailSettings from '../components/Settings/EmailSettings';
import SecuritySettings from '../components/Settings/SecuritySettings';
import SystemSettings from '../components/Settings/SystemSettings';
import BackupSettings from '../components/Settings/BackupSettings';
import LanguageSettings from '../components/Settings/LanguageSettings';
import APISettings from '../components/Settings/APISettings';
import WebsiteSettings from '../components/Settings/WebsiteSettings';
import '../components/Settings/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const settingsTabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: 'fas fa-cog',
      component: GeneralSettings
    },
    {
      id: 'users',
      label: 'Admin Users',
      icon: 'fas fa-users',
      component: AdminUsers
    },
    {
      id: 'email',
      label: 'Email & Notifications',
      icon: 'fas fa-envelope',
      component: EmailSettings
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'fas fa-shield-alt',
      component: SecuritySettings
    },
    {
      id: 'system',
      label: 'System Configuration',
      icon: 'fas fa-server',
      component: SystemSettings
    },
    {
      id: 'backup',
      label: 'Backup & Maintenance',
      icon: 'fas fa-database',
      component: BackupSettings
    },
    {
      id: 'language',
      label: 'Language & Localization',
      icon: 'fas fa-language',
      component: LanguageSettings
    },
    {
      id: 'api',
      label: 'API Configuration',
      icon: 'fas fa-plug',
      component: APISettings
    },
    {
      id: 'website',
      label: 'Website Settings',
      icon: 'fas fa-globe',
      component: WebsiteSettings
    }
  ];

  const ActiveComponent = settingsTabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="settings-container">
      {/* Settings Sidebar */}
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          <h2>Settings</h2>
          <p>Admin Panel Configuration</p>
        </div>

        <nav className="settings-nav">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Settings;
