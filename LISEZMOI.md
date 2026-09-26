# Constructions Michel Labbé — site web (refonte)

Site statique HTML / CSS / JS, sans dépendance ni étape de build. Polices auto-hébergées (aucune requête à Google).

## Pages
| Fichier | Rôle | Remplace (ancien site) |
|---|---|---|
| index.html | Accueil | / |
| expertises.html | 5 champs d'activité | /champs-d-activites |
| modes-de-realisation.html | 4 formules + méthode | /projets-et-realisations |
| entreprise.html | Profil, engagements, clients et partenaires | /a-propos-de-nous/* , /clients-et-partenaires |
| soumission.html | Formulaire + coordonnées | /nous-joindre |
| sous-traitants.html | Accès aux documents de soumission | fenêtre « Accès aux documents de soumissions » |
| 404.html | Page introuvable | — |

Redirections 301 : `_redirects` (Netlify / Cloudflare Pages) et `.htaccess` (Apache).

## Avant la mise en ligne
1. **Formulaire** : dans soumission.html, remplir `data-endpoint` (Formspree, Netlify Forms, etc.). Sans endpoint, le bouton ouvre le logiciel de courriel du visiteur, avec la demande déjà rédigée pour cml@cmlabbe.com.
2. **Portail sous-traitants** : conserver l'actuel (/echange_document.php) ou fournir la nouvelle adresse.
3. Chercher `À FOURNIR` et `À VALIDER` dans les fichiers : chaque commentaire décrit ce qui manque.

## À fournir
- Numéro de licence RBQ (à afficher dans le pied de page)
- Photos réelles de chantiers et fiches de réalisations (nom, lieu, année, formule)
- Nom exact de la certification en décontamination d'amiante
- Heures d'ouverture
- Logo en haute résolution (SVG ou PNG transparent), favicon officiel, image Open Graph 1200×630
- Politique de confidentialité (Loi 25) si le formulaire passe par un service tiers

## À valider avec le client
- Autorisation d'afficher les noms des clients et partenaires (liste reprise du site actuel)
- Territoire desservi
- Colonne « Convient quand… » (modes-de-realisation.html) et étapes d'accès des sous-traitants : déduites, pas tirées du site
- Formulation « métaux ouvrés, avec de la main-d'œuvre à temps plein en usine »
- Lien avec « Les Installations L'Assomption (1985) enr. » (nom légal trouvé sur Portail Constructo)

## Notes techniques
- Scène « La coupe » (accueil) : animation SVG liée au défilement, en JS natif (assets/js/site.js). Sur mobile, avec la réduction des mouvements ou sans JS, le dessin s'affiche directement complet.
- Palette tirée du logo (bleu acier), du bouton du site actuel (#013A71) et de sa couleur de tuile (#DA532C, assombrie en #B8431F pour atteindre le contraste AA).
