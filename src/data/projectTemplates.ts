import { FamilyProject, ProjectStep, ProjectType, ChecklistItem } from '@/lib/types';
import { generateId } from '@/lib/storage';

// ---------------------------------------------------------------------------
// Project type configuration
// ---------------------------------------------------------------------------

export const projectTypeConfig: Record<
  ProjectType,
  { label: string; icon: string; color: string; description: string }
> = {
  expatriation: {
    label: 'Expatriation',
    icon: '\u{1F30D}',
    color: '#6366F1',
    description:
      'Organisez votre expatriation familiale pas \u00e0 pas : visa, logement, scolarit\u00e9, d\u00e9m\u00e9nagement et int\u00e9gration.',
  },
  demenagement: {
    label: 'D\u00e9m\u00e9nagement',
    icon: '\u{1F4E6}',
    color: '#F59E0B',
    description:
      'Planifiez votre d\u00e9m\u00e9nagement de A \u00e0 Z : tri, emballage, administratif et installation.',
  },
  renovation: {
    label: 'R\u00e9novation',
    icon: '\u{1F528}',
    color: '#10B981',
    description:
      'G\u00e9rez vos travaux de r\u00e9novation : devis, artisans, autorisations et suivi de chantier.',
  },
  mariage: {
    label: 'Mariage',
    icon: '\u{1F48D}',
    color: '#EC4899',
    description:
      'Pr\u00e9parez le plus beau jour de votre vie : lieu, tenues, invit\u00e9s et prestataires.',
  },
  naissance: {
    label: 'Naissance',
    icon: '\u{1F476}',
    color: '#8B5CF6',
    description:
      "Pr\u00e9parez l'arriv\u00e9e de b\u00e9b\u00e9 : suivi m\u00e9dical, chambre, \u00e9quipement et d\u00e9marches administratives.",
  },
};

// ---------------------------------------------------------------------------
// Convenience label map
// ---------------------------------------------------------------------------

export const projectTypeLabels: Record<ProjectType, string> = Object.fromEntries(
  (Object.entries(projectTypeConfig) as [ProjectType, { label: string }][]).map(
    ([key, { label }]) => [key, label],
  ),
) as Record<ProjectType, string>;

// ---------------------------------------------------------------------------
// Internal helper – builds a ChecklistItem
// ---------------------------------------------------------------------------

function makeChecklistItem(text: string): ChecklistItem {
  return {
    id: generateId(),
    text,
    checked: false,
  };
}

// ---------------------------------------------------------------------------
// Internal helper – builds a ProjectStep
// ---------------------------------------------------------------------------

function makeStep(
  title: string,
  description: string,
  category: string,
  order: number,
  subStepTexts: string[],
): ProjectStep {
  return {
    id: generateId(),
    title,
    description,
    category,
    completed: false,
    order,
    subSteps: subStepTexts.map(makeChecklistItem),
  };
}

// ---------------------------------------------------------------------------
// Template step definitions per project type
// ---------------------------------------------------------------------------

interface StepDef {
  title: string;
  description: string;
  category: string;
  subSteps: string[];
}

const expatriationSteps: StepDef[] = [
  {
    title: 'Recherche & D\u00e9cision',
    description: 'Rassembler les informations cl\u00e9s pour prendre la d\u00e9cision.',
    category: 'research',
    subSteps: [
      'Rechercher le co\u00fbt de la vie',
      'Comparer les quartiers',
      'Se renseigner sur le syst\u00e8me de sant\u00e9',
      "\u00c9tudier le march\u00e9 de l'emploi",
      'Visiter le pays si possible',
    ],
  },
  {
    title: 'Visa & Documents',
    description: 'Pr\u00e9parer tous les documents administratifs n\u00e9cessaires.',
    category: 'documents',
    subSteps: [
      'Obtenir/renouveler les passeports',
      'Demander le visa appropri\u00e9',
      'Faire apostiller les documents',
      'Traduire les documents officiels',
      'Constituer le dossier administratif',
    ],
  },
  {
    title: 'Logement',
    description: 'Trouver et s\u00e9curiser un logement dans le pays de destination.',
    category: 'housing',
    subSteps: [
      'D\u00e9finir le budget logement',
      'Rechercher un logement \u00e0 distance',
      'Organiser des visites',
      'Signer le bail/contrat',
    ],
  },
  {
    title: 'Scolarit\u00e9 des enfants',
    description: "Organiser la scolarit\u00e9 des enfants dans le nouveau pays.",
    category: 'school',
    subSteps: [
      'Lister les \u00e9coles possibles',
      'Comparer les programmes et frais',
      "Pr\u00e9parer les dossiers d'inscription",
      "Confirmer l'inscription",
    ],
  },
  {
    title: 'Sant\u00e9 & Assurances',
    description: "S'assurer d'une couverture sant\u00e9 adapt\u00e9e pour toute la famille.",
    category: 'health',
    subSteps: [
      'Souscrire une assurance sant\u00e9 internationale',
      'R\u00e9cup\u00e9rer les dossiers m\u00e9dicaux',
      'Faire les vaccinations n\u00e9cessaires',
      'Trouver un m\u00e9decin/p\u00e9diatre sur place',
    ],
  },
  {
    title: 'Finances & Banque',
    description: 'Organiser les aspects financiers de l\u2019expatriation.',
    category: 'finance',
    subSteps: [
      'Ouvrir un compte bancaire sur place',
      "Organiser les transferts d'argent",
      'V\u00e9rifier la fiscalit\u00e9',
      'Pr\u00e9parer un budget mensuel',
    ],
  },
  {
    title: 'D\u00e9m\u00e9nagement',
    description: 'Planifier le transport de vos affaires vers le nouveau pays.',
    category: 'moving',
    subSteps: [
      'Obtenir des devis d\u00e9m\u00e9nageurs',
      'Trier et emballer les affaires',
      'R\u00e9silier les contrats (\u00e9lectricit\u00e9, internet...)',
      'Organiser le transport des animaux (si applicable)',
    ],
  },
  {
    title: 'Installation & Int\u00e9gration',
    description: "S'installer et s'int\u00e9grer dans le nouveau pays.",
    category: 'settling',
    subSteps: [
      'Effectuer les d\u00e9marches locales (permis, carte SIM...)',
      'Inscrire les enfants aux activit\u00e9s',
      "Rejoindre des groupes d'expatri\u00e9s",
      'D\u00e9couvrir le quartier et les commodit\u00e9s',
    ],
  },
];

const demenagementSteps: StepDef[] = [
  {
    title: 'Pr\u00e9paration',
    description: 'Poser les bases du projet de d\u00e9m\u00e9nagement.',
    category: 'preparation',
    subSteps: [
      'D\u00e9finir le budget d\u00e9m\u00e9nagement',
      'Fixer la date de d\u00e9m\u00e9nagement',
      'Pr\u00e9venir propri\u00e9taire/agence',
      'Faire un inventaire des biens',
    ],
  },
  {
    title: 'Recherche de logement',
    description: 'Trouver le logement id\u00e9al pour la famille.',
    category: 'housing',
    subSteps: [
      'D\u00e9finir les crit\u00e8res (taille, quartier, budget)',
      'Visiter les logements',
      'Monter le dossier de location/achat',
      'Signer le bail/compromis',
    ],
  },
  {
    title: 'Administratif',
    description: 'G\u00e9rer tous les changements administratifs li\u00e9s au d\u00e9m\u00e9nagement.',
    category: 'admin',
    subSteps: [
      "Changement d'adresse (imp\u00f4ts, banque, s\u00e9cu)",
      'R\u00e9exp\u00e9dition du courrier',
      'Inscription sur les listes \u00e9lectorales',
      'Transfert des contrats \u00e9nergie/internet',
      'Mise \u00e0 jour de la carte grise',
    ],
  },
  {
    title: 'Tri & Emballage',
    description: 'Trier, donner et emballer ses affaires efficacement.',
    category: 'packing',
    subSteps: [
      'Faire le tri pi\u00e8ce par pi\u00e8ce',
      'Donner/vendre ce qui ne part pas',
      "Acheter le mat\u00e9riel d'emballage",
      'Emballer m\u00e9thodiquement par pi\u00e8ce',
    ],
  },
  {
    title: '\u00c9cole & Activit\u00e9s',
    description: 'Assurer la continuit\u00e9 scolaire et des activit\u00e9s des enfants.',
    category: 'school',
    subSteps: [
      'Inscrire les enfants dans la nouvelle \u00e9cole',
      'Transf\u00e9rer les dossiers scolaires',
      'Trouver des activit\u00e9s extrascolaires',
    ],
  },
  {
    title: 'Jour J',
    description: 'Tout pr\u00e9voir pour le jour du d\u00e9m\u00e9nagement.',
    category: 'moving-day',
    subSteps: [
      'Confirmer le d\u00e9m\u00e9nageur',
      'Pr\u00e9parer un sac essentiel (v\u00eatements, documents)',
      "Faire l'\u00e9tat des lieux d\u00e9part",
      'Superviser le chargement',
    ],
  },
  {
    title: 'Installation',
    description: 'S\u2019installer dans le nouveau logement et prendre ses marques.',
    category: 'settling',
    subSteps: [
      '\u00c9tat des lieux arriv\u00e9e',
      "D\u00e9baller l'essentiel en premier",
      'Pr\u00e9sentation aux voisins',
      'Rep\u00e9rer les commerces et services du quartier',
    ],
  },
];

const renovationSteps: StepDef[] = [
  {
    title: 'Projet & Budget',
    description: 'D\u00e9finir le p\u00e9rim\u00e8tre et le budget des travaux.',
    category: 'planning',
    subSteps: [
      'D\u00e9finir les travaux \u00e0 r\u00e9aliser',
      '\u00c9tablir un budget pr\u00e9visionnel',
      'Prendre des mesures pr\u00e9cises',
      "Cr\u00e9er un plan/moodboard d'inspiration",
    ],
  },
  {
    title: 'Devis & Artisans',
    description: 'S\u00e9lectionner les bons artisans avec des devis comp\u00e9titifs.',
    category: 'quotes',
    subSteps: [
      'Demander au moins 3 devis',
      'V\u00e9rifier les assurances et r\u00e9f\u00e9rences',
      'Comparer les devis',
      'S\u00e9lectionner les artisans',
    ],
  },
  {
    title: 'Autorisations',
    description: 'Obtenir toutes les autorisations n\u00e9cessaires avant de d\u00e9marrer.',
    category: 'permits',
    subSteps: [
      'V\u00e9rifier si un permis est n\u00e9cessaire',
      'D\u00e9poser les demandes (mairie, copropri\u00e9t\u00e9)',
      'Obtenir les autorisations',
    ],
  },
  {
    title: 'Pr\u00e9paration du chantier',
    description: 'Pr\u00e9parer le logement et commander les mat\u00e9riaux.',
    category: 'preparation',
    subSteps: [
      'Commander les mat\u00e9riaux',
      'Prot\u00e9ger les zones non concern\u00e9es',
      'Organiser le stockage temporaire',
      'Pr\u00e9voir un logement de repli si n\u00e9cessaire',
    ],
  },
  {
    title: 'Travaux',
    description: 'Suivre et contr\u00f4ler l\u2019avancement des travaux.',
    category: 'works',
    subSteps: [
      "Suivre l'avancement du planning",
      'V\u00e9rifier la qualit\u00e9 \u00e0 chaque \u00e9tape',
      'G\u00e9rer les impr\u00e9vus et le budget',
      'Documenter avec des photos',
    ],
  },
  {
    title: 'Finitions',
    description: 'Assurer les finitions pour un r\u00e9sultat impeccable.',
    category: 'finishing',
    subSteps: [
      'Peinture et rev\u00eatements finals',
      'Pose des \u00e9quipements (luminaires, prises...)',
      'Nettoyage de fin de chantier',
      'V\u00e9rification de tous les d\u00e9tails',
    ],
  },
  {
    title: 'R\u00e9ception',
    description: 'V\u00e9rifier, valider et r\u00e9ceptionner les travaux.',
    category: 'reception',
    subSteps: [
      "Faire le tour avec l'artisan",
      'Lister les r\u00e9serves \u00e9ventuelles',
      'Valider et r\u00e9gler le solde',
    ],
  },
];

const mariageSteps: StepDef[] = [
  {
    title: 'Budget & Organisation',
    description: 'D\u00e9finir le cadre global du mariage.',
    category: 'planning',
    subSteps: [
      'D\u00e9finir le budget global',
      'Choisir la date',
      '\u00c9tablir la liste des invit\u00e9s',
      'Cr\u00e9er un r\u00e9troplanning',
    ],
  },
  {
    title: 'Lieu & R\u00e9ception',
    description: 'Trouver les lieux parfaits pour la c\u00e9r\u00e9monie et la r\u00e9ception.',
    category: 'venue',
    subSteps: [
      'Visiter les lieux de c\u00e9r\u00e9monie',
      'Choisir le lieu de r\u00e9ception',
      'R\u00e9server le traiteur',
      'D\u00e9guster les menus',
    ],
  },
  {
    title: 'Look & Style',
    description: 'D\u00e9finir le style et l\u2019esth\u00e9tique du mariage.',
    category: 'style',
    subSteps: [
      'Choisir les tenues (mari\u00e9\u00b7e\u00b7s)',
      'Essayages et retouches',
      'Choisir la d\u00e9coration florale',
      'D\u00e9finir le th\u00e8me/couleurs',
    ],
  },
  {
    title: 'Faire-part & Invit\u00e9s',
    description: 'G\u00e9rer les invitations et le plan de table.',
    category: 'guests',
    subSteps: [
      'Cr\u00e9er les faire-part',
      'Envoyer les invitations',
      'G\u00e9rer les r\u00e9ponses (RSVP)',
      'Organiser le plan de table',
    ],
  },
  {
    title: 'Animation & Musique',
    description: 'Pr\u00e9voir les animations et la musique pour la f\u00eate.',
    category: 'entertainment',
    subSteps: [
      'R\u00e9server DJ/groupe/orchestre',
      'Planifier les animations',
      'Pr\u00e9parer les surprises',
    ],
  },
  {
    title: 'Administratif',
    description: 'Remplir toutes les formalit\u00e9s administratives du mariage.',
    category: 'admin',
    subSteps: [
      'Constituer le dossier de mariage (mairie)',
      'Publier les bans',
      'Choisir les t\u00e9moins',
      'Pr\u00e9parer les documents officiels',
    ],
  },
  {
    title: 'Prestataires',
    description: 'R\u00e9server et coordonner tous les prestataires.',
    category: 'vendors',
    subSteps: [
      'R\u00e9server le photographe/vid\u00e9aste',
      'R\u00e9server le wedding planner (si souhait\u00e9)',
      'Commander le g\u00e2teau',
      'R\u00e9server les h\u00e9bergements invit\u00e9s',
    ],
  },
  {
    title: 'Derniers pr\u00e9paratifs',
    description: 'Les ultimes v\u00e9rifications avant le grand jour.',
    category: 'final',
    subSteps: [
      'Confirmer tous les prestataires',
      'R\u00e9p\u00e9tition c\u00e9r\u00e9monie',
      "Pr\u00e9parer le kit d'urgence",
      'Profiter du jour J !',
    ],
  },
];

const naissanceSteps: StepDef[] = [
  {
    title: 'Suivi de grossesse',
    description: 'Assurer un suivi m\u00e9dical optimal pendant la grossesse.',
    category: 'pregnancy',
    subSteps: [
      'Choisir la maternit\u00e9',
      'Planifier les rendez-vous m\u00e9dicaux',
      'Commencer les cours de pr\u00e9paration',
      'Mettre en place un suivi alimentaire',
    ],
  },
  {
    title: 'Administratif',
    description: "G\u00e9rer les d\u00e9marches administratives li\u00e9es \u00e0 l'arriv\u00e9e de b\u00e9b\u00e9.",
    category: 'admin',
    subSteps: [
      'D\u00e9clarer la grossesse (employeur, s\u00e9cu)',
      'Pr\u00e9parer le dossier de cong\u00e9 maternit\u00e9/paternit\u00e9',
      'V\u00e9rifier les droits et aides (CAF)',
      'Choisir le mode de garde (cr\u00e8che, assistante maternelle)',
    ],
  },
  {
    title: 'Chambre & \u00c9quipement',
    description: 'Am\u00e9nager la chambre et pr\u00e9parer le mat\u00e9riel pour b\u00e9b\u00e9.',
    category: 'nursery',
    subSteps: [
      'Am\u00e9nager la chambre de b\u00e9b\u00e9',
      'Acheter le lit et le matelas',
      'Acheter la poussette et le si\u00e8ge auto',
      'Pr\u00e9parer la garde-robe (0-3 mois)',
      'Installer la table \u00e0 langer et le n\u00e9cessaire de bain',
    ],
  },
  {
    title: 'Mat\u00e9riel m\u00e9dical',
    description: 'Pr\u00e9parer le n\u00e9cessaire m\u00e9dical et de soin.',
    category: 'medical',
    subSteps: [
      'Pr\u00e9parer la valise de maternit\u00e9',
      'Acheter les essentiels sant\u00e9 (thermom\u00e8tre, mouche-b\u00e9b\u00e9...)',
      'Commander les couches et produits de soin',
    ],
  },
  {
    title: 'Pr\u00e9paration des a\u00een\u00e9s',
    description: "Pr\u00e9parer les fr\u00e8res et s\u0153urs \u00e0 l'arriv\u00e9e du b\u00e9b\u00e9.",
    category: 'siblings',
    subSteps: [
      "Pr\u00e9parer les fr\u00e8res et s\u0153urs \u00e0 l'arriv\u00e9e",
      'Choisir un cadeau du b\u00e9b\u00e9 aux a\u00een\u00e9s',
      "Organiser la garde pendant l'accouchement",
    ],
  },
  {
    title: 'Naissance & Retour',
    description: 'Planifier le jour de la naissance et le retour \u00e0 la maison.',
    category: 'birth',
    subSteps: [
      'Pr\u00e9parer le plan de naissance',
      'Pr\u00e9voir le trajet vers la maternit\u00e9',
      'Pr\u00e9venir famille et proches',
      'Organiser le retour \u00e0 la maison',
    ],
  },
  {
    title: 'Administratif post-naissance',
    description: 'Effectuer les d\u00e9marches administratives apr\u00e8s la naissance.',
    category: 'post-admin',
    subSteps: [
      'D\u00e9clarer la naissance \u00e0 la mairie',
      'Mettre \u00e0 jour le livret de famille',
      'Inscrire b\u00e9b\u00e9 \u00e0 la s\u00e9cu et mutuelle',
      'Demander les allocations familiales',
    ],
  },
  {
    title: 'Organisation du quotidien',
    description: 'Mettre en place les routines du quotidien avec b\u00e9b\u00e9.',
    category: 'daily',
    subSteps: [
      "Mettre en place un planning d'allaitement/biberons",
      'Organiser les visites des proches',
      'Pr\u00e9voir du soutien (aide m\u00e9nag\u00e8re, famille)',
    ],
  },
];

// ---------------------------------------------------------------------------
// Map of type -> step definitions
// ---------------------------------------------------------------------------

const stepDefinitions: Record<ProjectType, StepDef[]> = {
  expatriation: expatriationSteps,
  demenagement: demenagementSteps,
  renovation: renovationSteps,
  mariage: mariageSteps,
  naissance: naissanceSteps,
};

// ---------------------------------------------------------------------------
// Public API – generate a full FamilyProject from a template
// ---------------------------------------------------------------------------

export function getProjectTemplate(
  type: ProjectType,
  name: string,
  metadata?: Record<string, string>,
): FamilyProject {
  const config = projectTypeConfig[type];
  const defs = stepDefinitions[type];

  const steps: ProjectStep[] = defs.map((def, index) =>
    makeStep(def.title, def.description, def.category, index + 1, def.subSteps),
  );

  return {
    id: generateId(),
    name,
    type,
    description: config.description,
    icon: config.icon,
    color: config.color,
    steps,
    createdAt: new Date().toISOString(),
    status: 'active',
    ...(metadata ? { metadata } : {}),
  };
}
