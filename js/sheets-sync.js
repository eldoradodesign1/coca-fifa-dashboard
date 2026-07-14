/**
 * Google Sheets Sync Module
 * Gère la synchronisation des données avec Google Sheets
 */

const sheetsSync = {
  defaultSheetUrl: 'https://docs.google.com/spreadsheets/d/1dotJ95xAX-AzP5aCdH8gUPMjrelrsuXvWD1FMZK1Kso/edit?usp=sharing',
  sheetUrl: localStorage.getItem('sheetUrl') || '',
  sheetId: null,
  lastSync: localStorage.getItem('lastSync') || null,
  
  /**
   * Extraire l'ID du Google Sheet depuis l'URL
   */
  extractSheetId(url) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  },
  
  /**
   * Valider l'URL du Google Sheet
   */
  isValidSheetUrl(url) {
    return /https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url);
  },
  
  /**
   * Définir l'URL du Google Sheet
   */
  setSheetUrl(url) {
    if (!url || !url.trim()) {
      url = this.defaultSheetUrl;
    }

    if (!this.isValidSheetUrl(url)) {
      return { success: false, error: i18n.t('status.invalid_url') };
    }
    
    this.sheetUrl = url;
    this.sheetId = this.extractSheetId(url);
    localStorage.setItem('sheetUrl', url);
    
    return { success: true };
  },

  /**
   * Charger l'URL du Google Sheet sauvegardée ou la valeur par défaut
   */
  loadDefaultSheetUrl() {
    const savedUrl = localStorage.getItem('sheetUrl');
    if (this.isValidSheetUrl(savedUrl)) {
      return this.setSheetUrl(savedUrl);
    }
    return this.setSheetUrl(this.defaultSheetUrl);
  },
  
  /**
   * Construire l'URL d'export CSV pour une feuille
   */
  getExportUrl(sheetName = 'Reports') {
    if (!this.sheetId) return null;
    
    // Format: https://docs.google.com/spreadsheets/d/{id}/export?format=csv&gid={gid}
    // Pour la feuille "Reports", gid=0 (première feuille)
    return `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=0`;
  },
  
  /**
   * Charger les données depuis Google Sheets
   */
  async loadData() {
    if (!this.sheetId) {
      return { success: false, error: 'No sheet URL configured' };
    }
    
    try {
      const url = this.getExportUrl();
      const csv = await this.fetchCsvWithFallback(url);
      const data = this.parseCSV(csv);
      
      // Sauvegarder la date de synchronisation
      this.lastSync = new Date().toISOString();
      localStorage.setItem('lastSync', this.lastSync);
      
      return { success: true, data };
    } catch (error) {
      console.error('Sheet sync error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Tenter un fetch direct puis des proxys pour Chrome/local file
   */
  async fetchCsvWithFallback(url) {
    const candidates = [
      url,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`
    ];

    let lastError = null;

    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const csv = await response.text();
        if (csv && csv.trim()) {
          return csv;
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to fetch sheet data');
  },
  
  /**
   * Parser le CSV
   */
  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = this.parseCSVLine(lines[0]).map(header => header.replace(/^\uFEFF/, ''));
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      rows.push(row);
    }
    
    return { headers, rows };
  },
  
  /**
   * Parser une ligne CSV en tenant compte des guillemets
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  },
  
  /**
   * Analyser les données et générer les statistiques
   */
  analyzeData(data) {
    const stats = {
      totalTickets: data.rows.length,
      weeks: {},
      byCategory: {},
      byWeek: {},
    };
    
    // Grouper par semaine
    data.rows.forEach(row => {
      const date = row.creation_date;
      const category = row.complaint_category;
      
      if (!date || !category) return;
      
      // Déterminer la semaine
      const week = this.getWeekNumber(date);
      
      if (!stats.weeks[week]) {
        stats.weeks[week] = {
          count: 0,
          categories: {},
          unreadableRate: 0,
        };
      }
      
      stats.weeks[week].count++;
      
      // Compter par catégorie
      if (!stats.weeks[week].categories[category]) {
        stats.weeks[week].categories[category] = 0;
      }
      stats.weeks[week].categories[category]++;
      
      // Compter globalement
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = 0;
      }
      stats.byCategory[category]++;
    });
    
    // Calculer les taux
    Object.keys(stats.weeks).forEach(week => {
      const weekData = stats.weeks[week];
      const unreadable = (weekData.categories['Unreadable code'] || 0) + (weekData.categories['Code rejected'] || 0);
      weekData.unreadableRate = weekData.count > 0 ? Math.round((unreadable / weekData.count) * 100) : 0;
    });

    const weekNumbers = Object.keys(stats.weeks)
      .map(Number)
      .filter(n => !Number.isNaN(n));

    if (weekNumbers.length > 0) {
      const maxWeek = Math.max(...weekNumbers);
      for (let week = 1; week <= maxWeek; week++) {
        if (!stats.weeks[week]) {
          stats.weeks[week] = {
            count: 0,
            categories: {},
            unreadableRate: 0,
          };
        }
      }
    }
    
    return stats;
  },
  
  /**
   * Déterminer le numéro de semaine à partir d'une date (format DD/MM/YYYY)
   */
  getWeekNumber(dateStr) {
    if (!dateStr) return 0;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    const startDate = new Date(2026, 5, 8); // 8 Juin 2026
    const weekDiff = Math.floor((date - startDate) / (7 * 24 * 60 * 60 * 1000));
    
    return Math.max(1, weekDiff + 1);
  },
  
  /**
   * Obtenir le statut de synchronisation
   */
  getSyncStatus() {
    return {
      configured: !!this.sheetUrl,
      lastSync: this.lastSync,
      url: this.sheetUrl,
    };
  }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  sheetsSync.loadDefaultSheetUrl();
});
