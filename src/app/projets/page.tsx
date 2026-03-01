'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FolderKanban, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { projectTypeConfig } from '@/data/projectTemplates';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import type { ProjectType } from '@/lib/types';

const PROJECT_TYPES: ProjectType[] = [
  'expatriation',
  'demenagement',
  'renovation',
  'mariage',
  'naissance',
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' }> = {
  active: { label: 'En cours', variant: 'default' },
  completed: { label: 'Terminé', variant: 'success' },
  paused: { label: 'En pause', variant: 'warning' },
};

export default function ProjetsPage() {
  const { data, loaded, addProject } = useAppData();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [creationStep, setCreationStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const openModal = () => {
    setCreationStep(1);
    setSelectedType(null);
    setProjectName('');
    setTargetDate('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSelectType = (type: ProjectType) => {
    setSelectedType(type);
    setProjectName(projectTypeConfig[type].label);
    setCreationStep(2);
  };

  const handleCreate = () => {
    if (!selectedType || !projectName.trim()) return;

    const metadata: Record<string, string> = {};
    if (targetDate) {
      metadata.targetDate = targetDate;
    }

    const newProject = addProject(
      selectedType,
      projectName.trim(),
      Object.keys(metadata).length > 0 ? metadata : undefined
    );

    closeModal();
    router.push(`/projets/${newProject.id}`);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Mes Projets" showBack />
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      </div>
    );
  }

  const projects = data.projects;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Mes Projets" showBack />

      <main className="mx-auto max-w-lg px-4 py-6">
        {projects.length === 0 ? (
          /* ---------- Empty State ---------- */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
              <FolderKanban className="h-12 w-12 text-indigo-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              Aucun projet
            </h2>
            <p className="mb-8 max-w-xs text-sm text-gray-500">
              Créez votre premier projet familial pour organiser vos étapes
              importantes.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-indigo-700 active:bg-indigo-800"
            >
              <Sparkles className="h-4 w-4" />
              Créer un projet
            </button>
          </div>
        ) : (
          /* ---------- Project List ---------- */
          <div className="space-y-4">
            {projects.map((project) => {
              const totalSub = project.steps.reduce(
                (a, s) => a + s.subSteps.length,
                0
              );
              const completedSub = project.steps.reduce(
                (a, s) => a + s.subSteps.filter((ss) => ss.checked).length,
                0
              );
              const progress = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
              const typeConf = projectTypeConfig[project.type];
              const status = statusConfig[project.status] ?? statusConfig.active;

              return (
                <Link key={project.id} href={`/projets/${project.id}`}>
                  <Card padding="md" className="transition-shadow hover:shadow-md active:shadow-sm">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <span className="text-2xl leading-none" aria-hidden>
                        {project.icon}
                      </span>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        </div>

                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {typeConf?.label ?? project.type}
                          </span>
                          <Badge
                            variant={status.variant}
                            size="sm"
                          >
                            {status.label}
                          </Badge>
                        </div>

                        {/* Progress */}
                        <div className="mb-1">
                          <ProgressBar
                            value={progress}
                            color={project.status === 'completed' ? 'emerald' : 'indigo'}
                            size="sm"
                            showLabel
                          />
                        </div>

                        {/* Target date */}
                        {project.targetDate && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Objectif :{' '}
                              {new Date(project.targetDate).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* ---------- Floating Action Button ---------- */}
      {projects.length > 0 && (
        <button
          onClick={openModal}
          aria-label="Créer un nouveau projet"
          className="fixed bottom-28 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* ---------- Creation Modal ---------- */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={creationStep === 1 ? 'Type de projet' : 'Nouveau projet'}
      >
        {creationStep === 1 ? (
          /* --- Step 1: Choose project type --- */
          <div className="space-y-3">
            <p className="mb-4 text-sm text-gray-500">
              Choisissez le type de projet à créer&nbsp;:
            </p>
            {PROJECT_TYPES.map((type) => {
              const conf = projectTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className="flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {conf.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{conf.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {conf.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                </button>
              );
            })}
          </div>
        ) : (
          /* --- Step 2: Name + target date --- */
          <div className="space-y-5">
            {selectedType && (
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                <span className="text-lg" aria-hidden>
                  {projectTypeConfig[selectedType].icon}
                </span>
                <span className="font-medium">
                  {projectTypeConfig[selectedType].label}
                </span>
              </div>
            )}

            {/* Project name */}
            <div>
              <label
                htmlFor="project-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Nom du projet
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Déménagement Paris"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Target date */}
            <div>
              <label
                htmlFor="target-date"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Date objectif{' '}
                <span className="font-normal text-gray-400">(optionnel)</span>
              </label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCreationStep(1)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                Retour
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Créer le projet
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
