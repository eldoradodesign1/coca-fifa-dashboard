# Coca-Cola FIFA 2026 - Dashboard Interactif

## 📊 Vue d'ensemble

Dashboard professionnel et interactif pour la présentation des rapports d'activité de la promotion Coca-Cola FIFA 2026. L'application offre une synchronisation en temps réel avec Google Sheets, un support multilingue (FR/EN), et un mode sombre/clair.

## ✨ Fonctionnalités principales

### 🎯 Présentation Interactive
- **10 slides** professionnelles avec animations fluides
- Navigation au clavier (flèches, espace)
- Indicateurs visuels et progression
- Design responsive

### 🌐 Multilingue
- Support complet **Français** et **Anglais**
- Basculement instantané entre les langues
- Sauvegarde de la préférence utilisateur

### 🌓 Thèmes
- **Mode Clair** (par défaut)
- **Mode Sombre** pour les présentations en salle sombre
- Transition fluide entre les thèmes
- Sauvegarde de la préférence

### 📊 Synchronisation Google Sheets
- Lien direct avec votre Google Sheet
- Mise à jour automatique des données
- Calcul dynamique des KPIs
- Support des semaines multiples

### 🎨 Design Premium
- Glassmorphism moderne
- Palette de couleurs Coca-Cola
- Animations sophistiquées
- Typographie professionnelle

## 🚀 Démarrage rapide

### 1. Installation
```bash
# Extraire l'archive ZIP
unzip coca-fifa-dashboard.zip
cd coca-fifa-dashboard

# Ouvrir dans un navigateur
# Double-cliquez sur index.html ou utilisez un serveur local
```

### 2. Configuration Google Sheets

#### Préparer votre Google Sheet
1. Ouvrez votre Google Sheet avec les données CRM
2. Assurez-vous que la première feuille s'appelle "Reports"
3. Les colonnes doivent inclure:
   - `creation_date` (format: DD/MM/YYYY)
   - `complaint_category` (catégorie de plainte)
   - Autres colonnes de données

#### Rendre le Sheet public
1. Cliquez sur "Partager" en haut à droite
2. Sélectionnez "Modifier" → "Accès général"
3. Changez en "Lecteur" ou "Éditeur"
4. Copiez l'URL du Sheet

#### Configurer dans le Dashboard
1. Dans la **Sidebar** (à gauche), collez l'URL du Google Sheet
2. Cliquez sur le bouton **"Synchroniser"**
3. Les données se mettront à jour automatiquement

### 3. Navigation

#### Clavier
- **Flèche droite** ou **Espace** : Slide suivante
- **Flèche gauche** : Slide précédente

#### Souris
- Cliquez sur les **numéros de slides** en bas
- Cliquez sur les **sections** dans la Sidebar
- Utilisez les **flèches** de navigation

#### Sidebar
- **Langue** : Basculez entre FR et EN
- **Thème** : Passez du mode clair au mode sombre
- **Google Sheet** : Collez l'URL et synchronisez
- **Actualiser** : Mettez à jour les données manuellement

## 📁 Structure du projet

```
coca-fifa-dashboard/
├── index.html              # Fichier HTML principal
├── css/
│   └── main.css           # Tous les styles (variables CSS, responsive)
├── js/
│   ├── i18n.js            # Module de traductions
│   ├── sheets-sync.js     # Module de synchronisation Google Sheets
│   └── app.js             # Logique principale de l'application
├── data/                   # Dossier pour les données locales (optionnel)
├── assets/                 # Images, icônes (optionnel)
└── README.md              # Cette documentation
```

## 🔧 Personnalisation

### Modifier les couleurs
Ouvrez `css/main.css` et modifiez les variables CSS au début du fichier:

```css
:root {
  --accent-red: #F40009;      /* Couleur primaire */
  --bg-primary: #ffffff;      /* Fond clair */
  /* ... autres variables */
}
```

### Ajouter des slides
1. Ouvrez `index.html`
2. Dupliquez une `<div class="slide">` existante
3. Modifiez le contenu
4. Ajoutez un lien dans la Sidebar

### Modifier les traductions
Ouvrez `js/i18n.js` et modifiez l'objet `translations`:

```javascript
translations: {
  fr: {
    'slide.title': 'Votre texte ici',
    // ...
  },
  en: {
    'slide.title': 'Your text here',
    // ...
  }
}
```

## 📊 Format des données Google Sheets

Votre Google Sheet doit avoir cette structure:

| creation_date | creation_time | complaint_category | ... |
|---|---|---|---|
| 08/06/2026 | 09:00 | Unreadable code | ... |
| 09/06/2026 | 10:30 | Code rejected | ... |
| 10/06/2026 | 14:15 | Delayed Gain | ... |

### Catégories de plaintes reconnues
- `Unreadable code`
- `Code rejected`
- `Delayed Gain`
- `Prize not received`
- `User does not know how to participate`
- `User cannot find the code`
- `No gain`
- `System error`
- `Phone number rejected`
- `Other`

## 🌐 Serveur local (recommandé)

Pour une meilleure expérience, utilisez un serveur local:

### Avec Python 3
```bash
cd coca-fifa-dashboard
python -m http.server 8000
# Ouvrez http://localhost:8000
```

### Avec Node.js
```bash
cd coca-fifa-dashboard
npx http-server
# Ouvrez http://localhost:8080
```

## 💾 Sauvegarde des préférences

L'application sauvegarde automatiquement:
- Langue sélectionnée
- Thème (clair/sombre)
- URL du Google Sheet
- Date de dernière synchronisation

Ces données sont stockées dans le `localStorage` du navigateur.

## 🔒 Sécurité

- **Pas de stockage de données sensibles** : Les données ne sont pas sauvegardées localement
- **Accès public au Sheet** : Assurez-vous que votre Google Sheet n'expose pas d'informations confidentielles
- **CORS** : La synchronisation fonctionne via l'export CSV public de Google Sheets

## 🐛 Dépannage

### Les données ne se synchronisent pas
1. Vérifiez que l'URL du Google Sheet est correcte
2. Assurez-vous que le Sheet est **public** ou **partagé**
3. Vérifiez la console du navigateur (F12) pour les erreurs
4. Attendez quelques secondes après avoir cliqué sur "Synchroniser"

### Le design s'affiche mal
1. Actualisez la page (Ctrl+F5 ou Cmd+Shift+R)
2. Videz le cache du navigateur
3. Essayez avec un autre navigateur

### Les traductions ne s'affichent pas
1. Assurez-vous que les éléments ont l'attribut `data-i18n`
2. Vérifiez que la clé existe dans `js/i18n.js`
3. Actualisez la page après le changement de langue

## 📝 Notes de développement

### Architecture
- **Modulaire** : Chaque fonctionnalité est dans un fichier séparé
- **Maintenable** : Code bien commenté et organisé
- **Extensible** : Facile d'ajouter de nouvelles fonctionnalités

### Technologies
- HTML5 sémantique
- CSS3 avec variables et media queries
- JavaScript vanilla (pas de dépendances externes)
- Google Sheets API (export CSV)

### Performance
- Chargement rapide (fichiers légers)
- Animations GPU-accélérées
- Pas de requêtes réseau inutiles

## 🎓 Conseils de présentation

1. **Test avant** : Testez la synchronisation avant votre présentation
2. **Mode sombre** : Utilisez le mode sombre dans une salle sombre
3. **Plein écran** : Appuyez sur F11 pour le mode plein écran
4. **Préparation** : Préparez votre Google Sheet avec les données à jour
5. **Backup** : Gardez une copie locale des données

## 📞 Support

Pour toute question ou problème:
1. Consultez ce README
2. Vérifiez la console du navigateur (F12)
3. Testez avec un autre navigateur
4. Contactez votre administrateur système

## 📄 Licence

Développé par **Eldorado Design** - Kinshasa 2026

---

**Version** : 1.0.0  
**Dernière mise à jour** : Juillet 2026
