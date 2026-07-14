/**
 * Main Application Module
 * Gère la navigation, les thèmes et les interactions
 */

const app = {
  currentSlide: 0,
  slides: [],
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  stats: null,
  sheetData: null,
  cursor: null,
  halo: null,
  
  /**
   * Initialiser l'application
   */
  init() {
    this.setupDOM();
    this.setupTheme();
    this.setupCursor();
    this.setupEventListeners();
    this.loadSlides();
    this.populateSheetInput();
    this.loadInitialData();
    this.showSlide(0);
    this.updateSidebarStatus();
  },
  
  /**
   * Configurer le DOM
   */
  setupDOM() {
    this.slides = document.querySelectorAll('.slide');
    this.deckTracker = document.getElementById('deck-tracker');
    this.dotsContainer = document.getElementById('dots-container');
    this.sidebarToggle = document.querySelector('.sidebar-toggle');
    this.sidebar = document.querySelector('.sidebar');
  },
  
  /**
   * Configurer le thème
   */
  setupTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      this.updateThemeButton();
    }
  },

  /**
   * Remplir le champ de l'URL Google Sheet avec la valeur sauvegardée ou par défaut
   */
  populateSheetInput() {
    if (!sheetsSync.sheetUrl) {
      sheetsSync.loadDefaultSheetUrl();
    }

    const input = document.getElementById('sheet-url-input');
    if (input && sheetsSync.sheetUrl) {
      input.value = sheetsSync.sheetUrl;
    }
  },

  /**
   * Charger automatiquement les données si une URL est déjà configurée
   */
  async loadInitialData() {
    if (!sheetsSync.sheetUrl) return;
    await this.syncSheetData(false);
  },
  
  /**
   * Configurer le curseur personnalisé
   */
  setupCursor() {
    this.cursor = document.getElementById('custom-cursor');
    this.halo = document.getElementById('cursor-halo');
    
    if (!this.cursor || !this.halo) return;
    
    window.addEventListener('mousemove', (e) => {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top = e.clientY + 'px';
      
      this.halo.style.left = e.clientX + 'px';
      this.halo.style.top = e.clientY + 'px';
    });
    
    // Animations du curseur au survol
    document.querySelectorAll('button, a, [role="button"], .nav-link, .interactive-card').forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.width = '24px';
          this.cursor.style.height = '24px';
          this.cursor.style.backgroundColor = 'rgba(244, 0, 9, 0.6)';
        }
      });
      item.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.width = '8px';
          this.cursor.style.height = '8px';
          this.cursor.style.backgroundColor = '#F40009';
        }
      });
    });
  },
  
  /**
   * Configurer les écouteurs d'événements
   */
  setupEventListeners() {
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }

      if (e.ctrlKey && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        this.syncSheetData();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') this.nextSlide();
      if (e.key === 'ArrowLeft') this.prevSlide();

      if (this.currentSlide === 4) {
        const numericWeek = this.getWeekFromKey(e);
        if (numericWeek) {
          this.updateWeeklyData(numericWeek);
        }
      }
    });
    
    // Boutons de navigation
    document.querySelector('.arrow:nth-child(1)')?.addEventListener('click', () => this.prevSlide());
    document.querySelector('.arrow:nth-child(2)')?.addEventListener('click', () => this.nextSlide());
    
    // Boutons de contrôle de la sidebar
    document.querySelectorAll('.nav-link').forEach((link, index) => {
      link.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Boutons de langue
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.currentTarget.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });

    document.getElementById('language-toggle')?.addEventListener('click', () => {
      const nextLang = i18n.getLanguage() === 'fr' ? 'en' : 'fr';
      this.setLanguage(nextLang);
    });
    
    // Boutons de thème
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = e.currentTarget.getAttribute('data-theme');
        this.setTheme(theme);
      });
    });
    
    // Bouton de synchronisation
    document.getElementById('btn-sync')?.addEventListener('click', () => this.syncSheetData());
    
    // Bouton d'actualisation
    document.getElementById('btn-refresh')?.addEventListener('click', () => this.refreshData());
    
    // Input URL du Google Sheet
    const sheetUrlInput = document.getElementById('sheet-url-input');
    sheetUrlInput?.addEventListener('change', (e) => {
      sheetsSync.setSheetUrl(e.target.value);
      this.updateSidebarStatus();
    });
    sheetUrlInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.syncSheetData();
      }
    });
    
    // Toggle sidebar mobile
    this.sidebarToggle?.addEventListener('click', () => {
      this.sidebar.classList.toggle('active');
    });
    
    // Fermer la sidebar au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.sidebar.classList.remove('active');
      });
    });
    
    // Indicateurs (dots)
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Écouter les changements de langue
    window.addEventListener('languageChanged', () => {
      this.updateSlideContent();
    });
  },

  /**
   * Obtenir une semaine depuis une touche numérique
   */
  getWeekFromKey(e) {
    if (!e.key) return null;
    const key = e.key.trim();
    if (!/^[1-9]$/.test(key)) return null;
    const targetWeek = Number(key);
    if (!this.stats?.weeks) return null;
    return Object.keys(this.stats.weeks).find(w => Number(w) === targetWeek) || null;
  },
  
  /**
   * Charger les slides
   */
  loadSlides() {
    // Générer les indicateurs (dots)
    this.slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      this.dotsContainer.appendChild(dot);
    });
  },
  
  /**
   * Afficher une slide spécifique
   */
  showSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    
    this.slides[this.currentSlide]?.classList.remove('active');
    document.querySelectorAll('.dot')[this.currentSlide]?.classList.remove('active');
    
    this.currentSlide = index;
    
    this.slides[this.currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[this.currentSlide].classList.add('active');
    
    this.deckTracker.textContent = `Slide ${this.currentSlide + 1} / ${this.slides.length}`;
    
    // Mettre à jour le lien actif dans la sidebar
    document.querySelectorAll('.nav-link').forEach((link, i) => {
      link.classList.toggle('active', i === this.currentSlide);
    });
    
    // Mettre à jour le contenu de la slide
    this.updateSlideContent();
  },
  
  /**
   * Aller à la slide suivante
   */
  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.showSlide(this.currentSlide + 1);
    }
  },
  
  /**
   * Aller à la slide précédente
   */
  prevSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  },
  
  /**
   * Aller à une slide spécifique
   */
  goToSlide(index) {
    this.showSlide(index);
  },
  
  /**
   * Changer la langue
   */
  setLanguage(lang) {
    i18n.setLanguage(lang);
    this.updateLanguageButtons();
  },
  
  /**
   * Changer le thème
   */
  setTheme(theme) {
    const isDark = theme === 'dark';
    this.isDarkMode = isDark;
    
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('darkMode', isDark);
    this.updateThemeButton();
  },
  
  /**
   * Mettre à jour l'état actif des boutons de langue
   */
  updateLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === i18n.getLanguage();
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    const label = document.getElementById("current-language");
    if (label) {
        label.textContent = i18n.getLanguage().toUpperCase();
    }
  },
  
  /**
   * Mettre à jour le bouton de thème
   */
  updateThemeButton() {
    document.querySelectorAll('[data-theme]').forEach(btn => {
      const theme = btn.getAttribute('data-theme');
      const isActive = (theme === 'dark') === this.isDarkMode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  },
  
  /**
   * Synchroniser les données du Google Sheet
   */
  async syncSheetData(showStatus = true) {
    const syncBtn = document.getElementById('btn-sync');
    const syncStatus = document.getElementById('sync-status');
    
    if (!syncBtn) return { success: false, error: 'Missing UI' };

    const sheetUrlInput = document.getElementById('sheet-url-input');
    if (sheetUrlInput && !sheetUrlInput.value.trim()) {
      sheetUrlInput.value = sheetsSync.defaultSheetUrl;
    }

    const sheetValue = sheetUrlInput?.value.trim() || sheetsSync.defaultSheetUrl;
    const urlResult = sheetsSync.setSheetUrl(sheetValue);
    if (!urlResult.success) {
      if (syncStatus && showStatus) {
        syncStatus.textContent = urlResult.error;
        syncStatus.className = 'sync-status error';
      }
      return { success: false, error: urlResult.error };
    }

    syncBtn.disabled = true;
    syncBtn.classList.add('loading');
    
    if (!sheetsSync.sheetUrl) {
      if (syncStatus && showStatus) {
        syncStatus.textContent = i18n.t('status.invalid_url');
        syncStatus.className = 'sync-status error';
      }
      syncBtn.disabled = false;
      syncBtn.classList.remove('loading');
      return { success: false, error: i18n.t('status.invalid_url') };
    }
    
    if (syncStatus && showStatus) {
      syncStatus.textContent = i18n.t('status.syncing');
      syncStatus.className = 'sync-status loading';
    }
    
    const result = await sheetsSync.loadData();
    
    if (result.success) {
      this.sheetData = result.data;
      this.stats = sheetsSync.analyzeData(result.data);
      this.updateDashboardData();
      
      if (syncStatus && showStatus) {
        syncStatus.textContent = i18n.t('status.synced');
        syncStatus.className = 'sync-status success';
      }
    } else {
      if (syncStatus && showStatus) {
        syncStatus.textContent = i18n.t('status.error') + ': ' + result.error;
        syncStatus.className = 'sync-status error';
      }
    }
    
    syncBtn.disabled = false;
    syncBtn.classList.remove('loading');
    return result;
  },
  
  /**
   * Actualiser les données
   */
  async refreshData() {
    return this.syncSheetData();
  },
  
  /**
   * Mettre à jour les données du dashboard
   */
  updateDashboardData() {
    if (!this.stats) return;
    
    // Mettre à jour le KPI des lignes CRM
    const crmLinesElement = document.querySelector('[data-kpi=\"crm-lines\"]');
    if (crmLinesElement) {
      crmLinesElement.textContent = this.stats.totalTickets;
    }
    
    // Mettre à jour les données des semaines
    Object.keys(this.stats.weeks).forEach(week => {
      const weekData = this.stats.weeks[week];
      
      // Mettre à jour le bouton de filtre
      const filterBtn = document.querySelector(`[data-week=\"${week}\"]`);
      if (filterBtn) {
        filterBtn.textContent = `${i18n.t('slide5.week')} ${week}`;
      }
    });
    
    // Mettre à jour la slide 4 depuis les données source
    this.updateIncidentMatrix();

    // Mettre à jour le module dynamique (Slide 5)
    this.updateWeeklyModule();
    this.updateSlideSubtitle();
    
    // Mettre à jour les poids proportionnels (Slide 8)
    this.updateWeightSlide();
  },

  /**
   * Remplir la slide 4 avec toutes les lignes du G-Sheet
   */
  updateIncidentMatrix() {
    const table = document.getElementById('incident-matrix-table');
    if (!table) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!thead || !tbody) return;

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!this.sheetData?.headers?.length || !this.sheetData?.rows?.length) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 2;
      emptyCell.textContent = 'Aucune catégorie de plainte disponible';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }

    const headers = this.sheetData.headers;
    const categoryColumn = headers.find(header => /complaint/i.test(header) && /category/i.test(header));

    if (!categoryColumn) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 2;
      emptyCell.textContent = 'Aucune colonne Complaint Category disponible';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
      return;
    }

    const categoryCounts = {};
    this.sheetData.rows.forEach(row => {
      const value = String(row[categoryColumn] || '').trim();
      if (!value) return;
      categoryCounts[value] = (categoryCounts[value] || 0) + 1;
    });

    const headerRow = document.createElement('tr');
    const thCategory = document.createElement('th');
    thCategory.textContent = 'Complaint Category';
    const thCount = document.createElement('th');
    thCount.textContent = 'Occurrences';
    headerRow.appendChild(thCategory);
    headerRow.appendChild(thCount);
    thead.appendChild(headerRow);

    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    sortedCategories.forEach(([category, count]) => {
      const tr = document.createElement('tr');
      const tdCategory = document.createElement('td');
      tdCategory.textContent = category;
      const tdCount = document.createElement('td');
      tdCount.textContent = count;
      tr.appendChild(tdCategory);
      tr.appendChild(tdCount);
      tbody.appendChild(tr);
    });
  },
  
  /**
   * Mettre à jour le module hebdomadaire
   */
  updateWeeklyModule() {
    if (!this.stats) return;
    
    // Créer les boutons de filtre pour chaque semaine
    const filterNav = document.querySelector('.filter-nav');
    const weekKeys = Object.keys(this.stats.weeks).sort((a, b) => Number(a) - Number(b));
    const defaultWeek = weekKeys[0];

    if (filterNav) {
      filterNav.innerHTML = '';
      weekKeys.forEach(week => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${week === defaultWeek ? 'active' : ''}`;
        btn.textContent = `${i18n.t('slide5.week')} ${week}`;
        btn.onclick = () => this.updateWeeklyData(week);
        filterNav.appendChild(btn);
      });
    }
    
    // Afficher la première semaine par défaut
    if (defaultWeek) {
      this.updateWeeklyData(defaultWeek);
    }
  },
  
  /**
   * Mettre à jour les données d'une semaine
   */
  updateWeeklyData(week) {
    const weekData = this.stats.weeks[week];
    if (!weekData) return;

    const weekPanel = document.querySelector('#s5 .week-panel');
    if (weekPanel) {
      weekPanel.classList.add('is-changing');
    }

    window.setTimeout(() => {
      const weekTitle = document.getElementById('week-title');
      if (weekTitle) {
        weekTitle.textContent = `${i18n.t('slide5.week')} ${week}`;
      }

      const ticketCount = document.querySelector('[data-metric="ticket-count"]');
      if (ticketCount) {
        ticketCount.textContent = weekData.count;
      }

      const barFill = document.getElementById('bar-fill-1');
      if (barFill) {
        barFill.style.width = `${weekData.unreadableRate}%`;
      }

      this.updateWeeklyBarChart(week);

      const weekStatus = document.getElementById('week-status');
      if (weekStatus) {
        let status = 'Stable';
        let bgColor = 'rgba(34, 197, 94, 0.2)';
        let textColor = '#22c55e';

        if (week === '2' || week === '3') {
          status = week === '2' ? 'Alerte Impression' : 'Surcharge réseau';
          bgColor = 'rgba(234, 179, 8, 0.2)';
          textColor = '#eab308';
        } else if (week === '4') {
          status = 'Alerte Critique';
          bgColor = 'rgba(239, 68, 68, 0.2)';
          textColor = '#ef4444';
        }

        weekStatus.textContent = status;
        weekStatus.style.background = bgColor;
        weekStatus.style.color = textColor;
      }

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(week));
      });

      document.querySelectorAll('.week-legend-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-week') === week);
      });

      if (weekPanel) {
        weekPanel.classList.remove('is-changing');
      }
    }, 160);
  },

  /**
   * Mettre à jour les barres des semaines
   */
  updateWeeklyBarChart(selectedWeek) {
    const container = document.getElementById('week-bars');
    const legend = document.getElementById('week-pie-legend');
    if (!container || !legend || !this.stats?.weeks) return;

    const weeks = Object.keys(this.stats.weeks).sort((a, b) => Number(a) - Number(b));
    const maxValue = Math.max(...weeks.map(week => this.stats.weeks[week].count || 0), 1);

    container.innerHTML = '';
    weeks.forEach(week => {
      const weekData = this.stats.weeks[week];
      const row = document.createElement('div');
      row.className = `week-bar-row ${week === selectedWeek ? 'active' : ''}`;

      const label = document.createElement('div');
      label.className = 'week-bar-label';
      label.textContent = `${i18n.t('slide5.week')} ${week}`;

      const track = document.createElement('div');
      track.className = 'week-bar-track';

      const fill = document.createElement('div');
      fill.className = 'fill week-bar-fill';
      const width = Math.max(8, Math.round((weekData.count / maxValue) * 100));
      fill.style.width = `${width}%`;
      fill.style.transform = 'scaleX(1)';
      track.appendChild(fill);

      const value = document.createElement('div');
      value.className = 'week-bar-value';
      value.textContent = weekData.count;

      row.append(label, track, value);
      container.appendChild(row);
    });

    legend.innerHTML = '';
    weeks.forEach(week => {
      const item = document.createElement('div');
      item.className = `week-legend-item ${week === selectedWeek ? 'active' : ''}`;
      item.setAttribute('data-week', week);
      item.textContent = `${i18n.t('slide5.week')} ${week}`;
      legend.appendChild(item);
    });
  },
  
  /**
   * Mettre à jour la slide des poids proportionnels
   */
  updateWeightSlide() {
    if (!this.stats) return;
    
    // Calculer les poids globaux
    const total = this.stats.totalTickets;
    
    const unreadable = (this.stats.byCategory['Unreadable code'] || 0) + (this.stats.byCategory['Code rejected'] || 0);
    const delayed = (this.stats.byCategory['Delayed Gain'] || 0) + (this.stats.byCategory['Prize not received'] || 0);
    const info = (this.stats.byCategory['User does not know how to participate'] || 0) + (this.stats.byCategory['User cannot find the code'] || 0);
    
    const p_unreadable = Math.round((unreadable / total) * 100);
    const p_delayed = Math.round((delayed / total) * 100);
    const p_info = Math.round((info / total) * 100);
    const p_bugs = 100 - p_unreadable - p_delayed - p_info;

    const container = document.getElementById('weight-bars');
    if (container) {
      const metrics = [
        { id: 'metric-unreadable', value: p_unreadable, label: i18n.t('slide8.unreadable') },
        { id: 'metric-delayed', value: p_delayed, label: i18n.t('slide8.delayed') },
        { id: 'metric-bugs', value: p_bugs, label: i18n.t('slide8.bugs') },
        { id: 'metric-info', value: p_info, label: i18n.t('slide8.info') },
      ];

      container.innerHTML = '';
      metrics.forEach(metric => {
        const row = document.createElement('div');
        row.className = 'weight-bar-row';

        const label = document.createElement('div');
        label.className = 'metric-label';
        label.textContent = metric.label;

        const track = document.createElement('div');
        track.className = 'weight-bar-track';

        const fill = document.createElement('div');
        fill.className = 'fill weight-bar-fill';
        fill.style.width = `${Math.max(metric.value, 6)}%`;
        fill.style.transform = 'scaleX(1)';
        track.appendChild(fill);

        const value = document.createElement('div');
        value.className = 'metric-value';
        value.textContent = `${metric.value}%`;

        row.append(label, track, value);
        container.appendChild(row);
      });
    }
    
    const metrics = [
      { id: 'metric-unreadable', value: p_unreadable },
      { id: 'metric-delayed', value: p_delayed },
      { id: 'metric-bugs', value: p_bugs },
      { id: 'metric-info', value: p_info },
    ];
    
    metrics.forEach(metric => {
      const valueElement = document.querySelector(`#${metric.id} .metric-value`);
      if (valueElement) valueElement.textContent = `${metric.value}%`;
    });
  },
  
  /**
   * Mettre à jour le contenu de la slide actuelle
   */
  updateSlideContent() {
    // Mettre à jour les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = i18n.t(key);
    });
    this.updateSlideSubtitle();
  },

  /**
   * Mettre à jour le sous-titre dynamique de la slide 1
   */
  updateSlideSubtitle() {
    const subtitle = document.querySelector('[data-i18n="slide.subtitle"]');
    if (!subtitle) return;

    const defaultText = i18n.t('slide.subtitle');
    if (!this.stats?.weeks || Object.keys(this.stats.weeks).length === 0) {
      subtitle.textContent = defaultText;
      return;
    }

    const weekKeys = Object.keys(this.stats.weeks)
      .map(Number)
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => a - b);

    if (weekKeys.length === 0) {
      subtitle.textContent = defaultText;
      return;
    }

    const range = `${weekKeys[0]} — ${weekKeys[weekKeys.length - 1]}`;
    const pattern = i18n.t('slide.subtitle.pattern');

    subtitle.textContent = pattern.includes('{range}')
      ? pattern.replace('{range}', range)
      : `${pattern} ${range}`;
  },
  
  /**
   * Mettre à jour le statut de la sidebar
   */
  updateSidebarStatus() {
    const status = sheetsSync.getSyncStatus();
    const statusElement = document.getElementById('sync-status');
    
    if (statusElement && status.lastSync) {
      const date = new Date(status.lastSync);
      statusElement.textContent = `${i18n.t('status.synced')} • ${date.toLocaleTimeString()}`;
      statusElement.className = 'sync-status success';
    }
  }
};

// Initialiser l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
