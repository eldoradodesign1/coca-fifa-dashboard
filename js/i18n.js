/**
 * Internationalization Module
 * Gère les traductions FR/EN
 */

const i18n = {
  currentLanguage: 'fr',
  
  translations: {
    fr: {
      // Sidebar
      'sidebar.title': 'Coca-Cola FIFA 2026',
      'sidebar.sections': 'Sections',
      'sidebar.nav.overview': 'Aperçu',
      'sidebar.nav.context': 'Contexte',
      'sidebar.nav.kpis': 'Indicateurs Clés',
      'sidebar.nav.matrix': 'Matrice',
      'sidebar.nav.analysis': 'Analyse Chronologique',
      'sidebar.nav.critical': 'Point Critique',
      'sidebar.nav.methodology': 'Méthodologie',
      'sidebar.nav.weighting': 'Poids',
      'sidebar.nav.recommendations': 'Recommandations',
      'sidebar.nav.qa': 'Questions & Réponses',
      
      // Controls
      'controls.language': 'Langue',
      'controls.theme': 'Thème',
      'controls.light': '☀️',
      'controls.dark': '🌙',
      'controls.sync': 'Synchroniser',
      'controls.refresh': 'Actualiser',
      'controls.sheet_url': 'URL du Google Sheet',
      'controls.sheet_placeholder': 'Collez l\'URL du G-Sheet ici...',
      
      // Header
      'header.title': 'Rapport d\'Activité',
      'header.subtitle': 'Promo Coca-Cola FIFA 2026',
      
      // Slides
      'slide.title': 'CRM PROMO FIFA 2026',
      'slide.subtitle': 'Rapport Consolidé Activité • Semaines 1 — 4',
      
      'slide2.title': 'Contexte Opérationnel',
      'slide2.description': 'Lancement stratégique de la campagne d\'activation le 8 Juin 2026. Prise en main immédiate du support de gestion par l\'équipe CRM le 9 Juin afin de structurer la remontée de données et optimiser l\'entonnoir d\'engagement.',
      'slide2.mission': 'Mission Clé',
      'slide2.mission_desc': 'Transformer le flux brut d\'appels entrants et d\'interactions WhatsApp en rapports qualitatifs exploitables pour l\'audit marketing final.',
      
      'slide3.title': 'Indicateurs Majeurs (KPI)',
      'slide3.crm_lines': 'Lignes CRM',
      'slide3.crm_desc': 'Enregistrements d\'incidents consolidés et qualifiés.',
      'slide3.segmentation': 'Segmentation',
      'slide3.segmentation_desc': 'Saisie rigoureuse par type de plainte et région.',
      'slide3.hub': 'Hub',
      'slide3.hub_desc': 'Épicentre du traitement opérationnel Eldorado.',
      
      'slide4.title': 'Matrice des Incidents',
      'slide4.category': 'Catégorisation',
      'slide4.reality': 'Réalité Terrain Constatée',
      'slide4.unreadable': 'Code Illisible',
      'slide4.unreadable_desc': 'Impression défaillante sous capsule (caractères effacés ou ambigus).',
      'slide4.rejected': 'Code Rejeté',
      'slide4.rejected_desc': 'Le consommateur tape le code correctement mais le Chatbot l\'invalide.',
      'slide4.delayed': 'Gain Différé',
      'slide4.delayed_desc': 'Validation du lot acquise mais latence de distribution via les API partenaires.',
      'slide4.error': 'Erreur Système',
      'slide4.error_desc': 'Coupure technique de communication réseau sur le bot WhatsApp officiel.',
      
      'slide5.title': 'Analyse Chronologique par Filtre',
      'slide5.week': 'Semaine',
      'slide5.tickets': 'Tickets Enregistrés',
      'slide5.rate': 'Taux d\'incidents capsule',
      'slide5.hint': 'Cliquez sur les boutons de semaine ci-dessus pour observer l\'évolution exponentielle des goulots d\'étranglement.',
      
      'slide6.title': 'Point Critique : Lisibilité',
      'slide6.anomaly': 'Anomalie Majeure',
      'slide6.anomaly_desc': 'Les codes imprimés sous les capsules présentent des défauts de lisibilité chroniques, transformant l\'expérience utilisateur en source de frustration.',
      'slide6.overload': 'Surcharge Équipe',
      'slide6.overload_desc': 'Ce défaut technique transforme l\'expérience automatisée (Chatbot) en une obligation de traitement manuel par l\'équipe d\'Eldorado Design, provoquant un allongement des délais de réponse en Semaine 4.',
      
      'slide7.title': 'Rapprochements Statistiques',
      'slide7.note': 'Note méthodologique pour la lecture des tableaux de bord marketing :',
      'slide7.unreadable_vs': 'Codes Illisibles vs Rejetés',
      'slide7.unreadable_vs_desc': 'La majorité des codes catégorisés comme "rejetés par le système informatique" découlent en réalité d\'une mauvaise lecture induite par l\'impression floue.',
      'slide7.delayed_vs': 'Gain Différé vs Non Reçu',
      'slide7.delayed_vs_desc': 'La nuance repose uniquement sur l\'état d\'esprit et l\'urgence exprimée par le consommateur au téléphone lors de son appel au support.',
      
      'slide8.title': 'Poids Proportionnel des Requêtes',
      'slide8.unreadable': 'Codes Illisibles & Rejetés',
      'slide8.delayed': 'Gains Différés (Opérateurs)',
      'slide8.bugs': 'Bugs d\'Accès Chatbot',
      'slide8.info': 'Demandes d\'Informations',
      
      'slide9.title': 'Recommandations Immédiates',
      'slide9.tech': 'Technique',
      'slide9.tech_desc': 'Mettre en place un script de tolérance sur le Chatbot permettant de tester automatiquement les substitutions courantes (ex: remplacer \'O\' par \'0\').',
      'slide9.process': 'Process',
      'slide9.process_desc': 'Ajouter un message d\'attente automatique rappelant aux participants un délai de vérification réseau pouvant atteindre 48 heures maximum.',
      'slide9.print': 'Print',
      'slide9.print_desc': 'Ajuster la calibration des têtes d\'impression en usine d\'embouteillage pour contrer les anomalies de déchiffrage.',
      
      'slide10.title': 'Questions & Réponses',
      'slide10.thanks': 'Merci pour votre attention. Le registre de données CRM historique reste consultable pour audit complémentaire.',
      'slide10.footer': 'Livrable Stratégique Eldorado Design • Kinshasa 2026',
      
      // Status messages
      'status.syncing': 'Synchronisation en cours...',
      'status.synced': 'Données mises à jour avec succès',
      'status.error': 'Erreur lors de la synchronisation',
      'status.invalid_url': 'URL Google Sheet invalide',
    },
    
    en: {
      // Sidebar
      'sidebar.title': 'Coca-Cola FIFA 2026',
      'sidebar.sections': 'Sections',
      'sidebar.nav.overview': 'Overview',
      'sidebar.nav.context': 'Context',
      'sidebar.nav.kpis': 'Key Indicators',
      'sidebar.nav.matrix': 'Matrix',
      'sidebar.nav.analysis': 'Chronological Analysis',
      'sidebar.nav.critical': 'Critical Point',
      'sidebar.nav.methodology': 'Methodology',
      'sidebar.nav.weighting': 'Weighting',
      'sidebar.nav.recommendations': 'Recommendations',
      'sidebar.nav.qa': 'Q&A',
      
      // Controls
      'controls.language': 'Language',
      'controls.theme': 'Theme',
      'controls.light': '☀️',
      'controls.dark': '🌙',
      'controls.sync': 'Sync',
      'controls.refresh': 'Refresh',
      'controls.sheet_url': 'Google Sheet URL',
      'controls.sheet_placeholder': 'Paste G-Sheet URL here...',
      
      // Header
      'header.title': 'Activity Report',
      'header.subtitle': 'Coca-Cola FIFA 2026 Promo',
      
      // Slides
      'slide.title': 'CRM PROMO FIFA 2026',
      'slide.subtitle': 'Consolidated Activity Report • Weeks 1 — 4',
      
      'slide2.title': 'Operational Context',
      'slide2.description': 'Strategic launch of the activation campaign on June 8, 2026. Immediate takeover of management support by the CRM team on June 9 to structure data collection and optimize the engagement funnel.',
      'slide2.mission': 'Key Mission',
      'slide2.mission_desc': 'Transform the raw flow of incoming calls and WhatsApp interactions into actionable qualitative reports for final marketing audit.',
      
      'slide3.title': 'Major Indicators (KPI)',
      'slide3.crm_lines': 'CRM Lines',
      'slide3.crm_desc': 'Consolidated and qualified incident records.',
      'slide3.segmentation': 'Segmentation',
      'slide3.segmentation_desc': 'Rigorous data entry by complaint type and region.',
      'slide3.hub': 'Hub',
      'slide3.hub_desc': 'Epicenter of Eldorado operational processing.',
      
      'slide4.title': 'Incident Matrix',
      'slide4.category': 'Categorization',
      'slide4.reality': 'Ground Reality Observed',
      'slide4.unreadable': 'Unreadable Code',
      'slide4.unreadable_desc': 'Defective printing under cap (erased or ambiguous characters).',
      'slide4.rejected': 'Rejected Code',
      'slide4.rejected_desc': 'Consumer enters code correctly but Chatbot invalidates it.',
      'slide4.delayed': 'Delayed Prize',
      'slide4.delayed_desc': 'Batch validation acquired but distribution latency via partner APIs.',
      'slide4.error': 'System Error',
      'slide4.error_desc': 'Technical communication breakdown on official WhatsApp bot.',
      
      'slide5.title': 'Chronological Analysis by Filter',
      'slide5.week': 'Week',
      'slide5.tickets': 'Recorded Tickets',
      'slide5.rate': 'Cap incident rate',
      'slide5.hint': 'Click the week buttons above to observe the exponential evolution of bottlenecks.',
      
      'slide6.title': 'Critical Point: Readability',
      'slide6.anomaly': 'Major Anomaly',
      'slide6.anomaly_desc': 'Codes printed under caps present chronic readability defects, transforming user experience into a source of frustration.',
      'slide6.overload': 'Team Overload',
      'slide6.overload_desc': 'This technical defect transforms automated experience (Chatbot) into manual processing obligation by Eldorado Design team, causing response delays in Week 4.',
      
      'slide7.title': 'Statistical Reconciliation',
      'slide7.note': 'Methodological note for reading marketing dashboards:',
      'slide7.unreadable_vs': 'Unreadable vs Rejected Codes',
      'slide7.unreadable_vs_desc': 'Most codes categorized as "rejected by IT system" actually result from misreading due to poor print quality.',
      'slide7.delayed_vs': 'Delayed Prize vs Not Received',
      'slide7.delayed_vs_desc': 'The distinction relies solely on consumer sentiment and urgency expressed during support call.',
      
      'slide8.title': 'Proportional Weight of Requests',
      'slide8.unreadable': 'Unreadable & Rejected Codes',
      'slide8.delayed': 'Delayed Prizes (Operators)',
      'slide8.bugs': 'Chatbot Access Bugs',
      'slide8.info': 'Information Requests',
      
      'slide9.title': 'Immediate Recommendations',
      'slide9.tech': 'Technical',
      'slide9.tech_desc': 'Implement tolerance script on Chatbot to automatically test common substitutions (e.g., replace \'O\' with \'0\').',
      'slide9.process': 'Process',
      'slide9.process_desc': 'Add automatic wait message reminding participants of network verification delay up to 48 hours maximum.',
      'slide9.print': 'Print',
      'slide9.print_desc': 'Adjust print head calibration at bottling plant to counter decoding anomalies.',
      
      'slide10.title': 'Questions & Answers',
      'slide10.thanks': 'Thank you for your attention. The historical CRM data registry remains available for further audit.',
      'slide10.footer': 'Strategic Deliverable Eldorado Design • Kinshasa 2026',
      
      // Status messages
      'status.syncing': 'Syncing...',
      'status.synced': 'Data updated successfully',
      'status.error': 'Sync error occurred',
      'status.invalid_url': 'Invalid Google Sheet URL',
    }
  },
  
  /**
   * Obtenir une traduction
   */
  t2(key, defaultValue = key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return typeof value === 'string' ? value : defaultValue;
  },

  t(key, defaultValue = key) {
    return this.translations[this.currentLanguage][key] || defaultValue;
  },
  
  /**
   * Changer la langue
   */
  setLanguage(lang) {
    if (lang === 'fr' || lang === 'en') {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      this.updatePageTextNow();
    }
  },
  
  /**
   * Obtenir la langue actuelle
   */
  getLanguage() {
    return this.currentLanguage;
  },
  
  /**
   * Charger la langue sauvegardée
   */
  loadLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'fr' || saved === 'en')) {
      this.currentLanguage = saved;
    }
  },
  
  /**
   * Mettre à jour tous les textes de la page
   */
  updatePageText() {
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updatePageTextNow());
    } else {
      this.updatePageTextNow();
    }
  },
  
  /**
   * Mettre à jour immédiatement tous les textes
   */
  updatePageTextNow() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = this.t(key);
      element.textContent = text;
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const text = this.t(key);
      element.placeholder = text;
    });
    
    // Dispatch event pour les composants qui écoutent
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLanguage } }));
  }
};

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n.loadLanguage();
    i18n.updatePageTextNow();
  });
} else {
  i18n.loadLanguage();
  i18n.updatePageTextNow();
}
