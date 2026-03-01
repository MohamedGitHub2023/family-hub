'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { User, MapPin, Download, Upload, Trash2, Palette, Save, Edit3, Users } from 'lucide-react';

export default function SettingsPage() {
  const { data, loaded, updateMember, updateSettings, updateFamilyName } = useAppData();
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [city, setCity] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const avatarOptions = ['👨', '👩', '👦', '👧', '👶', '🧑', '👱', '👸', '🤴', '🧒', '👨‍💼', '👩‍💼', '🦸‍♂️', '🦸‍♀️'];

  const startEditMember = (id: string) => {
    const member = data.family.find(m => m.id === id);
    if (member) {
      setEditName(member.name);
      setEditAvatar(member.avatar);
      setEditingMember(id);
    }
  };

  const saveMember = () => {
    if (!editingMember) return;
    const member = data.family.find(m => m.id === editingMember);
    if (member) {
      updateMember({ ...member, name: editName, avatar: editAvatar });
    }
    setEditingMember(null);
  };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familyhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const imported = JSON.parse(importText);
      if (imported.family && imported.tasks) {
        localStorage.setItem('familyhub_data', JSON.stringify(imported));
        window.location.reload();
      }
    } catch {
      alert('Format de fichier invalide');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('familyhub_data');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Paramètres" showBack />

      <div className="px-4 pt-4 pb-24 space-y-6">
        {/* Family Name */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Nom de la famille
          </h2>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Nom affiché sur le dashboard</p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder={data.familyName}
                    value={familyName}
                    onChange={e => setFamilyName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    onClick={() => {
                      if (familyName.trim()) {
                        updateFamilyName(familyName.trim());
                        setFamilyName('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Family Members */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Membres de la famille
          </h2>
          <div className="space-y-2">
            {data.family.map(member => (
              <Card key={member.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                      style={{ borderColor: member.color, backgroundColor: `${member.color}15` }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{member.role === 'parent' ? 'Parent' : 'Enfant'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => startEditMember(member.id)}
                    className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* City Setting */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Localisation
          </h2>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Ville pour la météo</p>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder={data.settings.city}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    onClick={() => {
                      if (city.trim()) {
                        updateSettings({ city: city.trim() });
                        setCity('');
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Gestion des données
          </h2>
          <div className="space-y-2">
            <Card padding="md" onClick={handleExport}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Download className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Exporter les données</p>
                  <p className="text-xs text-slate-500">Télécharger une sauvegarde JSON</p>
                </div>
              </div>
            </Card>

            <Card padding="md" onClick={() => setShowImport(true)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Importer des données</p>
                  <p className="text-xs text-slate-500">Restaurer depuis une sauvegarde</p>
                </div>
              </div>
            </Card>

            <Card padding="md" onClick={() => setShowResetConfirm(true)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-red-600">Réinitialiser l&apos;application</p>
                  <p className="text-xs text-slate-500">Supprimer toutes les données</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* App Info */}
        <section>
          <Card padding="md">
            <div className="text-center text-sm text-slate-400">
              <p className="font-medium text-slate-600">FamilyHub</p>
              <p>Version 1.0.0</p>
              <p className="mt-1">Application familiale</p>
            </div>
          </Card>
        </section>
      </div>

      {/* Edit Member Modal */}
      <Modal isOpen={!!editingMember} onClose={() => setEditingMember(null)} title="Modifier le profil">
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Avatar</label>
            <div className="grid grid-cols-7 gap-2">
              {avatarOptions.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setEditAvatar(emoji)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    editAvatar === emoji
                      ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveMember}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Importer des données">
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600">
            Collez le contenu du fichier JSON de sauvegarde ci-dessous :
          </p>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder='{"family": [...], "tasks": [...]}'
            className="w-full h-40 px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            Importer
          </button>
        </div>
      </Modal>

      {/* Reset Confirm Modal */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Confirmer la réinitialisation">
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600">
            Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
