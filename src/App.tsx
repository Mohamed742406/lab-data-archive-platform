import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { TechnicianUpload } from './components/TechnicianUpload';
import { EngineerDashboard } from './components/EngineerDashboard';
import { Draft } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<{ role: 'technician' | 'engineer'; id: string } | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  // Load drafts from Supabase
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (role: 'technician' | 'engineer', id: string) => {
    setUser({ role, id });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddDraft = async (draft: Omit<Draft, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .insert([draft])
        .select()
        .single();

      if (error) throw error;
      
      setDrafts(prev => [data, ...prev]);
      alert('تم إضافة الدرفت بنجاح ✅');
    } catch (error) {
      console.error('Error adding draft:', error);
      alert('حدث خطأ أثناء إضافة الدرفت ❌');
    }
  };

  const handleUpdateDraft = async (id: number, updates: Partial<Draft>) => {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => prev.map(d => d.id === id ? data : d));
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };

  const handleDeleteDraft = async (id: number) => {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-xl text-slate-600">جاري التحميل...</div>
      </div>
    );
  }

  return user.role === 'technician' ? (
    <TechnicianUpload
      onAddDraft={handleAddDraft}
      technicianId={user.id}
      onLogout={handleLogout}
    />
  ) : (
    <EngineerDashboard
      drafts={drafts}
      onUpdateDraft={handleUpdateDraft}
      onDeleteDraft={handleDeleteDraft}
      engineerId={user.id}
      onLogout={handleLogout}
    />
  );
}

export default App;
