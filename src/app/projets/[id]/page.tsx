'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  Trash2,
  Calendar,
  Edit3,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { FamilyProject } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  expatriation: 'Expatriation',
  demenagement: 'Demenagement',
  renovation: 'Renovation',
  mariage: 'Mariage',
  naissance: 'Naissance',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  paused: 'En pause',
  completed: 'Termine',
};

const STEP_COLORS = [
  'border-indigo-500',
  'border-amber-500',
  'border-emerald-500',
  'border-purple-500',
  'border-red-500',
  'border-yellow-500',
  'border-orange-500',
  'border-teal-500',
];

const STEP_BG_COLORS = [
  'bg-indigo-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-teal-500',
];

const STEP_TEXT_COLORS = [
  'text-indigo-500',
  'text-amber-500',
  'text-emerald-500',
  'text-purple-500',
  'text-red-500',
  'text-yellow-500',
  'text-orange-500',
  'text-teal-500',
];

const TIMELINE_COLORS = [
  'bg-indigo-200',
  'bg-amber-200',
  'bg-emerald-200',
  'bg-purple-200',
  'bg-red-200',
  'bg-yellow-200',
  'bg-orange-200',
  'bg-teal-200',
];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loaded, toggleProjectSubStep, updateProject, deleteProject } =
    useAppData();

  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  const project = useMemo(
    () => data.projects.find((p) => p.id === id),
    [data.projects, id]
  );

  const progress = useMemo(() => {
    if (!project) return { percentage: 0, completedSteps: 0, totalSteps: 0, completedSubSteps: 0, totalSubSteps: 0 };

    const totalSteps = project.steps.length;
    let completedSubSteps = 0;
    let totalSubSteps = 0;
    let completedSteps = 0;

    for (const step of project.steps) {
      const stepTotal = step.subSteps.length;
      const stepCompleted = step.subSteps.filter((ss) => ss.checked).length;
      totalSubSteps += stepTotal;
      completedSubSteps += stepCompleted;
      if (stepTotal > 0 && stepCompleted === stepTotal) {
        completedSteps++;
      }
    }

    const percentage = totalSubSteps > 0 ? Math.round((completedSubSteps / totalSubSteps) * 100) : 0;

    return { percentage, completedSteps, totalSteps, completedSubSteps, totalSubSteps };
  }, [project]);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleStartEditName = () => {
    if (!project) return;
    setNameValue(project.name);
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (!project || !nameValue.trim()) return;
    updateProject({ ...project, name: nameValue.trim() });
    setEditingName(false);
  };

  const handleChangeTargetDate = (date: string) => {
    if (!project) return;
    updateProject({ ...project, targetDate: date || undefined });
  };

  const handleChangeStatus = (status: FamilyProject['status']) => {
    if (!project) return;
    updateProject({ ...project, status });
  };

  const handleDelete = () => {
    if (!project) return;
    deleteProject(project.id);
    router.push('/projets');
  };

  // Loading state
  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Projet" showBack />
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <p className="text-slate-500 text-lg mb-4">Projet introuvable</p>
          <Link
            href="/projets"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const sortedSteps = [...project.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title={project.name} showBack />

      {/* Hero progress card */}
      <div
        className="mx-4 mt-4 rounded-2xl p-5 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${project.color}, ${project.color}dd)`,
        }}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">{project.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{project.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm opacity-90">
                {TYPE_LABELS[project.type] || project.type}
              </span>
              <Badge
                variant={
                  project.status === 'active'
                    ? 'success'
                    : project.status === 'paused'
                    ? 'warning'
                    : 'default'
                }
                size="sm"
              >
                {STATUS_LABELS[project.status]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="mt-5">
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{progress.percentage}%</span>
            <span className="text-sm opacity-80">Progression globale</span>
          </div>

          {/* White progress bar on semi-transparent bg */}
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="opacity-80" />
            <span>
              {progress.completedSteps}/{progress.totalSteps} etapes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={14} className="opacity-80" />
            <span>
              {progress.completedSubSteps}/{progress.totalSubSteps} sous-etapes
            </span>
          </div>
        </div>

        {/* Target date */}
        {project.targetDate && (
          <div className="flex items-center gap-1.5 mt-3 text-sm opacity-80">
            <Calendar size={14} />
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

      {/* Steps list — timeline layout */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Etapes du projet
        </h3>

        <div className="relative">
          {sortedSteps.map((step, index) => {
            const colorIndex = index % STEP_COLORS.length;
            const isExpanded = expandedSteps.has(step.id);
            const stepSubTotal = step.subSteps.length;
            const stepSubCompleted = step.subSteps.filter(
              (ss) => ss.checked
            ).length;
            const isStepComplete = stepSubTotal > 0 && stepSubCompleted === stepSubTotal;
            const stepProgress =
              stepSubTotal > 0
                ? Math.round((stepSubCompleted / stepSubTotal) * 100)
                : 0;
            const isLast = index === sortedSteps.length - 1;

            return (
              <div key={step.id} className="relative flex gap-3">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                      isStepComplete
                        ? 'bg-emerald-500 text-white'
                        : `${STEP_BG_COLORS[colorIndex]} text-white`
                    }`}
                  >
                    {isStepComplete ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[16px] ${TIMELINE_COLORS[colorIndex]}`}
                    />
                  )}
                </div>

                {/* Step card */}
                <div className="flex-1 pb-4 min-w-0">
                  <Card
                    padding="none"
                    className={`border-l-4 ${STEP_COLORS[colorIndex]} overflow-hidden`}
                  >
                    {/* Step header — clickable */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-semibold text-sm ${
                              isStepComplete
                                ? 'line-through text-slate-400'
                                : 'text-slate-900'
                            }`}
                          >
                            {step.title}
                          </h4>
                          {isStepComplete && (
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500 shrink-0"
                            />
                          )}
                        </div>
                        {step.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {step.description}
                          </p>
                        )}
                        {/* Category badge */}
                        {step.category && (
                          <Badge size="sm" variant="default" className="mt-2">
                            {step.category}
                          </Badge>
                        )}
                        {/* Mini progress */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isStepComplete
                                  ? 'bg-emerald-500'
                                  : STEP_BG_COLORS[colorIndex]
                              }`}
                              style={{ width: `${stepProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {stepSubCompleted}/{stepSubTotal}
                          </span>
                        </div>
                      </div>

                      {/* Expand chevron */}
                      <div
                        className={`shrink-0 mt-0.5 ${STEP_TEXT_COLORS[colorIndex]}`}
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </div>
                    </button>

                    {/* Expanded substeps */}
                    {isExpanded && step.subSteps.length > 0 && (
                      <div className="border-t border-slate-100 px-4 py-2">
                        {step.subSteps.map((subStep) => (
                          <label
                            key={subStep.id}
                            className="flex items-start gap-3 py-2.5 cursor-pointer group"
                          >
                            <div className="relative shrink-0 mt-0.5">
                              <input
                                type="checkbox"
                                checked={subStep.checked}
                                onChange={() =>
                                  toggleProjectSubStep(
                                    project.id,
                                    step.id,
                                    subStep.id
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  subStep.checked
                                    ? 'bg-indigo-500 border-indigo-500'
                                    : 'border-slate-300 group-hover:border-indigo-400'
                                }`}
                              >
                                {subStep.checked && (
                                  <Check
                                    size={12}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-sm leading-tight ${
                                subStep.checked
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-700'
                              }`}
                            >
                              {subStep.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings section */}
      <div className="px-4 mt-8">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4"
        >
          <Settings size={16} />
          <span>Parametres</span>
          {showSettings ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {showSettings && (
          <div className="space-y-3">
            {/* Edit name */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit3 size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    Nom du projet
                  </span>
                </div>
                {!editingName ? (
                  <button
                    onClick={handleStartEditName}
                    className="text-sm text-indigo-600 font-medium"
                  >
                    Modifier
                  </button>
                ) : null}
              </div>
              {editingName ? (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="px-3 py-2 text-slate-500 text-sm rounded-lg font-medium hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500 mt-1 ml-[30px]">
                  {project.name}
                </p>
              )}
            </Card>

            {/* Target date */}
            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Date objectif
                </span>
              </div>
              <input
                type="date"
                value={project.targetDate || ''}
                onChange={(e) => handleChangeTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </Card>

            {/* Status */}
            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Statut
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChangeStatus('active')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    project.status === 'active'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Play size={14} />
                  Actif
                </button>
                <button
                  onClick={() => handleChangeStatus('paused')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    project.status === 'paused'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Pause size={14} />
                  En pause
                </button>
                <button
                  onClick={() => handleChangeStatus('completed')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    project.status === 'completed'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  Termine
                </button>
              </div>
            </Card>

            {/* Delete */}
            <Card padding="md">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full"
              >
                <Trash2 size={18} />
                <span className="text-sm font-medium">
                  Supprimer ce projet
                </span>
              </button>
            </Card>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer le projet"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Etes-vous sur de vouloir supprimer le projet{' '}
            <strong>{project.name}</strong> ? Cette action est irreversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
