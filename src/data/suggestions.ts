import { Suggestion, FamilyProject } from '@/lib/types';

export function getWeatherSuggestions(temp: number, description: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (temp > 25) {
    suggestions.push({
      id: 'w1',
      text: 'Il fait beau ! Pourquoi ne pas aller au parc en famille ?',
      category: 'weather',
      icon: '☀️',
      priority: 1,
    });
    suggestions.push({
      id: 'w2',
      text: 'Pensez à bien vous hydrater et à mettre de la crème solaire',
      category: 'weather',
      icon: '💧',
      priority: 2,
    });
  } else if (temp > 15) {
    suggestions.push({
      id: 'w3',
      text: 'Température agréable pour une balade ou du vélo en famille',
      category: 'weather',
      icon: '🚴',
      priority: 1,
    });
  } else if (temp > 5) {
    suggestions.push({
      id: 'w4',
      text: 'Temps frais : pensez aux vêtements chauds pour les enfants',
      category: 'weather',
      icon: '🧥',
      priority: 1,
    });
  } else {
    suggestions.push({
      id: 'w5',
      text: 'Il fait froid ! Journée idéale pour des jeux de société en famille',
      category: 'weather',
      icon: '🎲',
      priority: 1,
    });
  }

  if (description.includes('rain') || description.includes('pluie')) {
    suggestions.push({
      id: 'w6',
      text: 'Il pleut - prenez les parapluies ! Cinéma ou musée en famille ?',
      category: 'weather',
      icon: '🌧️',
      priority: 1,
    });
  }

  return suggestions;
}

export function getSeasonalSuggestions(): Suggestion[] {
  const month = new Date().getMonth();
  const suggestions: Suggestion[] = [];

  if (month >= 8 && month <= 9) {
    suggestions.push({
      id: 'season1',
      text: 'Rentrée scolaire : vérifiez les fournitures et les inscriptions',
      category: 'seasonal',
      icon: '📚',
      priority: 1,
    });
  }
  if (month === 11) {
    suggestions.push({
      id: 'season2',
      text: 'Pensez aux cadeaux de Noël ! Créez une liste de souhaits famille',
      category: 'seasonal',
      icon: '🎄',
      priority: 1,
    });
  }
  if (month >= 5 && month <= 7) {
    suggestions.push({
      id: 'season3',
      text: 'Vacances d\'été : avez-vous planifié vos vacances familiales ?',
      category: 'seasonal',
      icon: '🏖️',
      priority: 1,
    });
  }
  if (month === 0) {
    suggestions.push({
      id: 'season4',
      text: 'Nouvelle année, nouveaux objectifs ! Planifiez les résolutions famille',
      category: 'seasonal',
      icon: '🎯',
      priority: 1,
    });
  }

  return suggestions;
}

export function getProjectSuggestions(projects: FamilyProject[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const activeProjects = projects.filter((p) => p.status === 'active');

  for (const project of activeProjects) {
    const totalSubSteps = project.steps.reduce(
      (acc, step) => acc + step.subSteps.length,
      0
    );
    const completedSubSteps = project.steps.reduce(
      (acc, step) => acc + step.subSteps.filter((s) => s.checked).length,
      0
    );
    const progress = totalSubSteps > 0 ? completedSubSteps / totalSubSteps : 0;

    switch (project.type) {
      case 'expatriation':
        if (progress < 0.2) {
          suggestions.push({
            id: `proj-${project.id}-1`,
            text: `${project.name} : commencez par vous renseigner sur les visas et le coût de la vie`,
            category: 'project',
            icon: '🌍',
            priority: 1,
          });
        } else if (progress < 0.5) {
          suggestions.push({
            id: `proj-${project.id}-2`,
            text: `${project.name} : pensez à la scolarité des enfants et au logement`,
            category: 'project',
            icon: '🏫',
            priority: 1,
          });
        } else if (progress < 0.8) {
          suggestions.push({
            id: `proj-${project.id}-3`,
            text: `${project.name} : n'oubliez pas l'assurance santé et le compte bancaire`,
            category: 'project',
            icon: '💪',
            priority: 1,
          });
        } else {
          suggestions.push({
            id: `proj-${project.id}-4`,
            text: `${project.name} : presque prêts ! Vérifiez les derniers détails du déménagement`,
            category: 'project',
            icon: '✈️',
            priority: 1,
          });
        }
        break;

      case 'demenagement':
        if (progress < 0.2) {
          suggestions.push({
            id: `proj-${project.id}-1`,
            text: `${project.name} : commencez par trier vos affaires et demander des devis`,
            category: 'project',
            icon: '📦',
            priority: 1,
          });
        } else if (progress < 0.5) {
          suggestions.push({
            id: `proj-${project.id}-2`,
            text: `${project.name} : pensez à résilier vos contrats et faire le changement d'adresse`,
            category: 'project',
            icon: '📮',
            priority: 1,
          });
        } else if (progress < 0.8) {
          suggestions.push({
            id: `proj-${project.id}-3`,
            text: `${project.name} : commencez à emballer ! Étiquetez bien les cartons`,
            category: 'project',
            icon: '🏷️',
            priority: 1,
          });
        } else {
          suggestions.push({
            id: `proj-${project.id}-4`,
            text: `${project.name} : dernière ligne droite ! Vérifiez le nouveau logement`,
            category: 'project',
            icon: '🏠',
            priority: 1,
          });
        }
        break;

      case 'renovation':
        if (progress < 0.2) {
          suggestions.push({
            id: `proj-${project.id}-1`,
            text: `${project.name} : définissez votre budget et demandez des devis aux artisans`,
            category: 'project',
            icon: '🔨',
            priority: 1,
          });
        } else if (progress < 0.5) {
          suggestions.push({
            id: `proj-${project.id}-2`,
            text: `${project.name} : les travaux avancent ! Suivez le planning de chantier`,
            category: 'project',
            icon: '🏗️',
            priority: 1,
          });
        } else if (progress < 0.8) {
          suggestions.push({
            id: `proj-${project.id}-3`,
            text: `${project.name} : pensez aux finitions et à la décoration`,
            category: 'project',
            icon: '🎨',
            priority: 1,
          });
        } else {
          suggestions.push({
            id: `proj-${project.id}-4`,
            text: `${project.name} : presque terminé ! Vérifiez les derniers détails`,
            category: 'project',
            icon: '✨',
            priority: 1,
          });
        }
        break;

      case 'mariage':
        if (progress < 0.2) {
          suggestions.push({
            id: `proj-${project.id}-1`,
            text: `${project.name} : commencez par choisir la date et le lieu de la cérémonie`,
            category: 'project',
            icon: '💍',
            priority: 1,
          });
        } else if (progress < 0.5) {
          suggestions.push({
            id: `proj-${project.id}-2`,
            text: `${project.name} : pensez aux invitations, au traiteur et au photographe`,
            category: 'project',
            icon: '💌',
            priority: 1,
          });
        } else if (progress < 0.8) {
          suggestions.push({
            id: `proj-${project.id}-3`,
            text: `${project.name} : n'oubliez pas les essayages et la décoration`,
            category: 'project',
            icon: '👗',
            priority: 1,
          });
        } else {
          suggestions.push({
            id: `proj-${project.id}-4`,
            text: `${project.name} : le grand jour approche ! Vérifiez les derniers préparatifs`,
            category: 'project',
            icon: '🎉',
            priority: 1,
          });
        }
        break;

      case 'naissance':
        if (progress < 0.2) {
          suggestions.push({
            id: `proj-${project.id}-1`,
            text: `${project.name} : commencez par choisir la maternité et le suivi médical`,
            category: 'project',
            icon: '👶',
            priority: 1,
          });
        } else if (progress < 0.5) {
          suggestions.push({
            id: `proj-${project.id}-2`,
            text: `${project.name} : pensez à préparer la chambre et la liste de naissance`,
            category: 'project',
            icon: '🍼',
            priority: 1,
          });
        } else if (progress < 0.8) {
          suggestions.push({
            id: `proj-${project.id}-3`,
            text: `${project.name} : préparez la valise de maternité et les documents administratifs`,
            category: 'project',
            icon: '🧳',
            priority: 1,
          });
        } else {
          suggestions.push({
            id: `proj-${project.id}-4`,
            text: `${project.name} : tout est presque prêt pour accueillir bébé !`,
            category: 'project',
            icon: '🎀',
            priority: 1,
          });
        }
        break;
    }
  }

  return suggestions;
}

export function getDailySuggestions(): Suggestion[] {
  const day = new Date().getDay();
  const hour = new Date().getHours();
  const suggestions: Suggestion[] = [];

  if (day === 0) {
    suggestions.push({
      id: 'daily1',
      text: 'Dimanche : profitez d\'un brunch en famille !',
      category: 'activity',
      icon: '🥞',
      priority: 2,
    });
  }
  if (day >= 1 && day <= 5 && hour >= 7 && hour <= 9) {
    suggestions.push({
      id: 'daily2',
      text: 'Bonne journée à tous ! Vérifiez les cartables et les goûters',
      category: 'task',
      icon: '🎒',
      priority: 1,
    });
  }
  if (hour >= 17 && hour <= 19) {
    suggestions.push({
      id: 'daily3',
      text: 'C\'est l\'heure des devoirs ! Accompagnez les enfants',
      category: 'task',
      icon: '📝',
      priority: 1,
    });
  }
  if (day === 6) {
    suggestions.push({
      id: 'daily4',
      text: 'Samedi : idéal pour une activité en famille ou des courses',
      category: 'activity',
      icon: '🛒',
      priority: 2,
    });
  }

  return suggestions;
}
