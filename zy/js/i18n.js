/* i18n: English lives in the HTML. This file holds the French (`fr`) and Dutch (`nl`) strings
   and the English strings that are not in the markup (aria labels, palette, toasts).
   To change wording, edit the HTML (English) or the `fr` / `nl` objects below. */
(function () {
  "use strict";

  var fr = {
    "meta.title": "Zirari Yassîn | Technicien informatique & développeur logiciel à Bruxelles",
    "meta.desc": "Zirari Yassîn est technicien informatique et développeur logiciel junior à Bruxelles. Matériel, réseaux et support IT, ainsi que Java, Python, C# et développement web. Français et anglais.",

    "ui.skip": "Aller au contenu",
    "ui.openMenu": "Ouvrir le menu de commandes",
    "ui.theme": "Basculer entre thème clair et sombre",
    "ui.menu": "Ouvrir le menu",
    "ui.close": "Fermer",
    "ui.clear": "Effacer la sélection",
    "ui.highlighting": "Mise en avant :",
    "ui.show": "Voir",
    "ui.palettePlaceholder": "Rechercher une section, un projet ou une action",
    "ui.noResults": "Aucun résultat. Essayez un autre mot.",

    "nav.about": "À propos",
    "nav.experience": "Expérience",
    "nav.projects": "Projets",
    "nav.skills": "Compétences",
    "nav.contact": "Contact",
    "nav.search": "Rechercher",

    "hero.legendInfra": "Infrastructure",
    "hero.legendCode": "Code",
    "hero.online": "en ligne",
    "hero.status": "Disponible, basé à Bruxelles",
    "hero.role": "Technicien informatique & développeur logiciel",
    "hero.lede": "Je monte, répare et exploite des systèmes informatiques, et j'écris le code qui tourne dessus. Formé comme analyste-programmeur à l'EPFC (ULB), je travaille en français et en anglais.",
    "hero.cv": "Télécharger le CV",
    "hero.cvHref": "zy/CV_Zirari_Yassin_FR.pdf",
    "hero.contact": "Me contacter",
    "hero.hint": "Survolez ou touchez les nœuds pour explorer. Sélectionnez-en un pour voir où je l'ai utilisé.",

    "facts.basedLabel": "Basé à",
    "facts.basedValue": "Bruxelles, Belgique",
    "facts.fluentLabel": "Courant en",
    "facts.fluentValue": "français, anglais",
    "facts.freelanceLabel": "Indépendant",
    "facts.freelanceValue": "4 ans, IT et web",
    "facts.builtLabel": "Montés ou réparés",
    "facts.builtValue": "100+ systèmes",

    "about.title": "À propos",
    "about.lead": "Analyste-programmeur junior avec une solide expérience pratique du support informatique, de la réparation de matériel et du développement logiciel.",
    "about.body": "J'ai l'habitude du dépannage matériel, des bases du réseau et du développement web, appuyé par mes études à l'ULB/EPFC. Je suis à l'aise en français et en anglais, et autant en autonomie qu'au sein d'une équipe technique.",

    "focus.supportTitle": "Support et matériel",
    "focus.supportBody": "Je monte, mets à niveau et répare des PC (plus de 100 à ce jour), diagnostique les pannes matérielles, LAN ou Wi-Fi, et optimise les systèmes et la sécurité de base. J'automatise aussi l'administration Windows avec PowerShell.",
    "focus.softwareTitle": "Logiciel",
    "focus.softwareBody": "Java, Python et C#, avec POO, Agile et Git. J'ai développé HelpDesk, une application de tickets IT sur ASP.NET Core, et AssetTrack, un inventaire d'équipements sous Django. Chez SPEOS, j'ai travaillé sur un programme de gestion de spool d'impression construit avec Jenkins.",
    "focus.webTitle": "Web",
    "focus.webBody": "Sites clients en HTML, CSS et JavaScript, ainsi que React et Angular. J'ai développé des extensions Chrome pour une entreprise de médias et des jeux navigateur avec Three.js.",

    "exp.title": "Expérience",
    "exp.kindInterim": "Intérim",
    "exp.kindStudent": "Job étudiant",
    "exp.novarys.role": "Technicien informatique de cluster",
    "exp.novarys.b1": "Assurer le support informatique sur site pour les utilisateurs et le matériel du cluster.",
    "exp.novarys.b2": "Installer, configurer et remplacer postes de travail et périphériques.",
    "exp.novarys.b3": "Diagnostiquer les pannes matérielles, logicielles, LAN ou Wi-Fi et suivre chaque cas jusqu'à sa résolution.",
    "exp.novarys.b4": "Travailler avec les collègues et les utilisateurs en français et en anglais.",
    "exp.bump.kind": "Entreprise de médias",
    "exp.bump.role": "Développeur d'extensions Chrome",
    "exp.bump.b1": "Développement d'extensions Chrome pour une entreprise de médias.",
    "exp.bump.b2": "Réalisées en JavaScript, HTML et CSS.",
    "exp.speosDev.role": "Développeur junior / assistant informatique",
    "exp.speosDev.b1": "Participation au développement d'un programme de gestion de spool d'impression pour l'automatisation interne.",
    "exp.speosDev.b2": "Utilisation de Git et Jenkins pour le versionnage du code et les builds.",
    "exp.speosDev.b3": "Collaboration avec les équipes QA et exploitation pour résoudre les erreurs de travaux d'impression et améliorer les performances.",
    "exp.speosDev.b4": "Aide au déploiement et au suivi des builds de test sur les différents environnements.",
    "exp.freelance.org": "Indépendant",
    "exp.freelance.kind": "4 ans, en parallèle des études",
    "exp.freelance.role": "Technicien informatique indépendant & développeur web",
    "exp.freelance.b1": "Montage, mise à niveau, réparation et optimisation de PC fixes pour des particuliers et de petites entreprises.",
    "exp.freelance.b2": "Diagnostic de problèmes matériels, logiciels et réseau, y compris LAN/Wi-Fi, connectivité et sécurité de base.",
    "exp.freelance.b3": "Conception et création de sites web pour des clients : structure, mise en forme et fonctionnalités.",
    "exp.freelance.b4": "Gestion autonome des clients : communication, planning et suivi technique.",
    "exp.speosPrint.role": "Opérateur d'impression polyvalent",
    "exp.speosPrint.b1": "Conduite et maintenance de machines d'impression à haut volume : Riso T2100, Xerox Nuvera et Canon ColorStream 6000 (papier en continu).",
    "exp.speosPrint.b2": "Travail d'équipe pour tenir des délais serrés dans un environnement de production rapide.",
    "exp.speosPrint.b3": "Contrôle de la qualité d'impression et résolution des incidents pour limiter les arrêts.",
    "exp.okay.role": "Assistant de magasin",
    "exp.okay.b1": "Cuisson du pain et maintien d'un stock frais et disponible tout au long de la journée.",
    "exp.okay.b2": "Tenue de la caisse et aide aux clients : questions, conseils et problèmes.",
    "exp.okay.b3": "Travail en équipe pour assurer le fonctionnement du magasin et atteindre les objectifs quotidiens.",

    "work.title": "Projets",
    "work.sub": "Trois projets phares, deux jeux jouables dans le navigateur et quatre projets IT et de développement.",
    "work.filterLabel": "Filtrer les projets",
    "work.fAll": "Tous",
    "work.fGames": "Jeux",
    "work.fInfra": "Infrastructure",
    "work.fSoftware": "Logiciel",
    "work.read": "Lire l'étude",
    "work.covers": "Contenu",
    "work.inconito.type": "Jeu navigateur",
    "work.inconito.desc": "Un jeu de déduction sociale qui tourne dans le navigateur, jouable sur mobile et ordinateur.",
    "work.inconito.cta": "Jouer à Inconito",
    "work.sandwake.type": "Jeu 3D navigateur",
    "work.sandwake.desc": "Un jeu 3D rendu dans le navigateur avec Three.js et WebGL.",
    "work.sandwake.cta": "Jouer à SandWake",
    "work.login.type": "Cas de dépannage",
    "work.login.title": "Échec de connexion Windows",
    "work.login.desc": "Diagnostic et réparation d'un compte Windows qui ne parvient plus à ouvrir de session.",
    "work.login.c1": "Démarrer Windows en mode sans échec pour retrouver l'accès.",
    "work.login.c2": "Réinitialiser le compte concerné.",
    "work.login.c3": "Lire les journaux d'événements pour trouver la cause.",
    "work.login.c4": "Une politique préventive pour éviter que cela se reproduise.",
    "work.login.t1": "Mode sans échec",
    "work.login.t2": "Analyse des journaux",
    "work.lab.type": "Laboratoire personnel",
    "work.lab.title": "Laboratoire virtuel de support IT",
    "work.lab.desc": "Un laboratoire virtuel pour pratiquer le support informatique sur un domaine Windows Server.",
    "work.lab.c1": "Windows Server avec Active Directory dans VirtualBox.",
    "work.lab.c2": "Stratégies de groupe pour gérer les paramètres des postes clients.",
    "work.lab.c3": "Un espace sûr pour reproduire les problèmes courants du help desk.",
    "work.net.type": "Démo réseau",
    "work.net.title": "Configuration et dépannage réseau",
    "work.net.desc": "Configuration d'un petit réseau et recherche des pannes jusqu'au niveau du paquet.",
    "work.net.t1": "IP statique",
    "work.net.c1": "Adressage IP statique et configuration DNS.",
    "work.net.t3": "Capture de paquets",
    "work.net.c2": "Diagnostic de la connectivité avec ping et des captures de paquets.",
    "work.net.c3": "Un schéma réseau qui documente l'installation.",
    "work.spool.type": "Outil interne, SPEOS",
    "work.spool.title": "Programme de gestion de spool d'impression",
    "work.spool.desc": "Un outil qui automatise la gestion des files d'impression, développé pendant mon intérim chez SPEOS.",
    "work.spool.c1": "Automatise la gestion des files d'impression en interne.",
    "work.spool.c2": "Versionné avec Git et construit via Jenkins.",
    "work.spool.c3": "Testé avec les équipes QA et exploitation, avec des builds de test déployés sur plusieurs environnements.",
    "work.help.type": "Application métier",
    "work.help.title": "HelpDesk : système de gestion du support IT",
    "work.help.desc": "Une application web de gestion des demandes de support IT. Les utilisateurs créent des tickets ; les techniciens attribuent les priorités, suivent les incidents et mettent à jour l'état de résolution.",
    "work.help.c1": "Création, attribution et suivi de l'état des tickets.",
    "work.help.c2": "Comptes utilisateurs et techniciens avec permissions selon le rôle.",
    "work.help.c3": "Niveaux de priorité, catégories et échéances.",
    "work.help.c4": "Tableau de bord avec statistiques et temps de réponse.",
    "work.help.c5": "Historique des tickets et commentaires.",
    "work.help.t6": "Authentification",
    "skills.auth": "Authentification",
    "skills.automation": "Automatisation",
    "work.sys.type": "Automatisation d'infrastructure",
    "work.sys.title": "SysAdmin Toolkit : automatisation de l'administration Windows",
    "work.sys.desc": "Une collection de scripts PowerShell qui automatisent les tâches courantes d'administration système dans un environnement Windows.",
    "work.sys.c1": "Création automatisée d'utilisateurs Active Directory.",
    "work.sys.c2": "Gestion des groupes et des permissions.",
    "work.sys.c3": "Import d'utilisateurs en masse à partir d'un fichier CSV.",
    "work.sys.c4": "Suivi de l'expiration des mots de passe et audit des comptes.",
    "work.sys.c5": "Informations sur les PC et diagnostics système.",
    "work.sys.c6": "Rapports automatiques et journalisation des erreurs.",
    "work.sys.t5": "Automatisation",
    "work.asset.type": "Outil de gestion IT",
    "work.asset.title": "AssetTrack : inventaire du parc informatique",
    "work.asset.desc": "Un système d'inventaire pour que les entreprises suivent leurs ordinateurs, écrans, périphériques et autres équipements informatiques.",
    "work.asset.c1": "Inventaire du matériel avec numéros de série.",
    "work.asset.c2": "Génération de QR codes pour identifier les équipements.",
    "work.asset.c3": "Attribution des appareils aux employés.",
    "work.asset.c4": "Historique de maintenance et de réparation.",
    "work.asset.c5": "Suivi des garanties et du cycle de vie.",
    "work.asset.c6": "Inventaire consultable avec export CSV.",

    "skills.title": "Compétences",
    "skills.sub": "Sélectionnez une compétence pour voir où je l'ai utilisée.",
    "skills.prog": "Programmation et logiciel",
    "skills.web": "Web",
    "skills.chromeext": "Extensions Chrome",
    "skills.db": "Bases de données",
    "skills.it": "Support IT et matériel",
    "skills.tools": "Outils et plateformes",
    "skills.oop": "POO",
    "skills.dbdesign": "Conception de bases de données",
    "skills.datamodel": "Modélisation de données",
    "skills.hardware": "Montage, mise à niveau et réparation de PC",
    "skills.diagnostics": "Diagnostic matériel",
    "skills.network": "LAN / Wi-Fi",
    "skills.optimization": "Optimisation système",
    "skills.security": "Sécurité de base",
    "skills.capture": "Capture de paquets",

    "edu.title": "Formation et langues",
    "edu.focus": "Génie logiciel, systèmes et développement web.",
    "lang.fr": "Français",
    "lang.en": "Anglais",
    "lang.nl": "Néerlandais",
    "lang.ar": "Arabe",
    "lang.fluent": "Courant",
    "lang.basics": "Notions",

    "contact.title": "Contact",
    "contact.lead": "Ouvert aux postes en support informatique, développement web et développeur junior : temps plein, temps partiel ou freelance, à distance ou sur site.",
    "contact.place": "Jette, Bruxelles, Belgique",
    "contact.copyEmail": "Copier l'adresse e-mail",
    "contact.copyPhone": "Copier le numéro de téléphone",
    "form.name": "Nom",
    "form.email": "E-mail",
    "form.message": "Message",
    "form.send": "Envoyer par e-mail",
    "form.note": "Ouvre votre application e-mail avec le message prêt à envoyer.",
    "form.errRequired": "Renseignez votre nom, votre e-mail et votre message.",
    "form.errEmail": "Saisissez une adresse e-mail valide.",
    "foot.term": "Ouvrir le terminal",
    "foot.top": "Haut de page",

    "toast.email": "Adresse e-mail copiée",
    "toast.phone": "Numéro copié",
    "toast.mail": "Ouverture de votre application e-mail",
    "toast.cv": "Téléchargement du CV",

    "js.subject": "Message de {name}",
    "pal.navigate": "Naviguer",
    "pal.projects": "Projets",
    "pal.actions": "Actions",
    "act.cv": "Télécharger le CV",
    "act.copyEmail": "Copier l'adresse e-mail",
    "act.theme": "Changer de thème",
    "act.toFr": "Passer en français",
    "act.toEn": "Passer en anglais",
    "act.toNl": "Passer en néerlandais",
    "act.term": "Ouvrir le terminal",
    "act.zirafix": "Ouvrir ZiraFix, dépannage à domicile",
    "zf.kicker": "Dépannage à domicile à Bruxelles",
    "zf.desc": "PC, imprimantes, consoles de jeu, Wi-Fi : je me déplace chez vous à Bruxelles pour dépanner, réparer et monter votre matériel.",
    "zf.cta": "Découvrir les prestations",
    "zf.t1": "PC et portables",
    "zf.t2": "Imprimantes",
    "zf.t3": "Consoles de jeu",
    "zf.t4": "Wi-Fi et réseau",
    "act.play": "Jouer",
    "act.read": "Lire l'étude",
    "act.section": "Section",
    "sec.top": "Accueil",
    "sec.education": "Formation et langues"
  };

  /* Dutch (Belgium). Same keys as `fr`. */
  var nl = {
    "meta.title": "Zirari Yassîn | IT-technieker & softwareontwikkelaar in Brussel",
    "meta.desc": "Zirari Yassîn is IT-technieker en junior softwareontwikkelaar in Brussel. Hardware, netwerken en IT-support, plus Java, Python, C# en webontwikkeling. Frans en Engels.",

    "ui.skip": "Naar de inhoud",
    "ui.openMenu": "Opdrachtenmenu openen",
    "ui.theme": "Wisselen tussen licht en donker thema",
    "ui.menu": "Menu openen",
    "ui.close": "Sluiten",
    "ui.clear": "Selectie wissen",
    "ui.highlighting": "Gemarkeerd:",
    "ui.show": "Tonen",
    "ui.palettePlaceholder": "Zoek een sectie, project of actie",
    "ui.noResults": "Geen resultaten. Probeer een ander woord.",

    "nav.about": "Over mij",
    "nav.experience": "Ervaring",
    "nav.projects": "Projecten",
    "nav.skills": "Vaardigheden",
    "nav.contact": "Contact",
    "nav.search": "Zoeken",

    "hero.legendInfra": "Infrastructuur",
    "hero.legendCode": "Code",
    "hero.online": "online",
    "hero.status": "Beschikbaar, gevestigd in Brussel",
    "hero.role": "IT-technieker & softwareontwikkelaar",
    "hero.lede": "Ik bouw, herstel en beheer IT-systemen en schrijf de code die erop draait. Opgeleid als analist-programmeur aan de EPFC (ULB), werkzaam in het Frans en het Engels.",
    "hero.cv": "CV downloaden",
    "hero.contact": "Contact opnemen",
    "hero.hint": "Beweeg over de knooppunten of tik erop om te verkennen. Selecteer er één om te zien waar ik het heb gebruikt.",

    "facts.basedLabel": "Gevestigd in",
    "facts.basedValue": "Brussel, België",
    "facts.fluentLabel": "Vloeiend in",
    "facts.fluentValue": "Frans, Engels",
    "facts.freelanceLabel": "Freelance",
    "facts.freelanceValue": "4 jaar, IT en web",
    "facts.builtLabel": "Gebouwd of hersteld",
    "facts.builtValue": "100+ systemen",

    "about.title": "Over mij",
    "about.lead": "Junior analist-programmeur met sterke praktijkervaring in IT-support, hardwareherstel en softwareontwikkeling.",
    "about.body": "Ik ben vertrouwd met het oplossen van hardwareproblemen, netwerkbasis en webontwikkeling, ondersteund door mijn studies aan de ULB/EPFC. Ik voel me thuis in het Frans en het Engels en werk even graag zelfstandig als in een technisch team.",

    "focus.supportTitle": "Support en hardware",
    "focus.supportBody": "Ik assembleer, upgrade en herstel pc's (al meer dan 100), diagnosticeer hardwareproblemen en lan- of wifistoringen en optimaliseer systemen en basisbeveiliging. Daarnaast automatiseer ik Windows-beheer met PowerShell.",
    "focus.softwareTitle": "Software",
    "focus.softwareBody": "Java, Python en C#, met OOP, Agile en Git. Ik bouwde HelpDesk, een IT-ticketapplicatie op ASP.NET Core, en AssetTrack, een apparatuurinventaris in Django. Bij SPEOS werkte ik aan een programma voor printspoolbeheer dat via Jenkins werd gebouwd.",
    "focus.webTitle": "Web",
    "focus.webBody": "Klantwebsites in HTML, CSS en JavaScript, plus React en Angular. Ik ontwikkelde Chrome-extensies voor een mediabedrijf en browsergames met Three.js.",

    "exp.title": "Ervaring",
    "exp.kindInterim": "Interim",
    "exp.kindStudent": "Studentenjob",
    "exp.novarys.role": "IT-technieker cluster",
    "exp.novarys.b1": "Verleende IT-support ter plaatse aan gebruikers en apparatuur in de hele cluster.",
    "exp.novarys.b2": "Installeerde, configureerde en verving werkstations en randapparatuur.",
    "exp.novarys.b3": "Diagnosticeerde hardware-, software-, lan- en wifiproblemen en volgde elk geval op tot de oplossing.",
    "exp.novarys.b4": "Werkte met collega's en eindgebruikers in het Frans en het Engels.",
    "exp.bump.kind": "Mediabedrijf",
    "exp.bump.role": "Ontwikkelaar van Chrome-extensies",
    "exp.bump.b1": "Ontwikkelde Chrome-extensies voor een mediabedrijf.",
    "exp.bump.b2": "Gebouwd met JavaScript, HTML en CSS.",
    "exp.speosDev.role": "Junior ontwikkelaar / IT-assistent",
    "exp.speosDev.b1": "Droeg bij aan de ontwikkeling van een programma voor printspoolbeheer voor interne automatisering.",
    "exp.speosDev.b2": "Gebruikte Git en Jenkins voor versiebeheer en builds.",
    "exp.speosDev.b3": "Werkte samen met QA en operations om afdrukfouten op te lossen en de prestaties te verbeteren.",
    "exp.speosDev.b4": "Hielp testbuilds uit te rollen en op te volgen in verschillende omgevingen.",
    "exp.freelance.org": "Freelance",
    "exp.freelance.kind": "4 jaar, naast mijn studies",
    "exp.freelance.role": "Zelfstandig computertechnieker & webontwikkelaar",
    "exp.freelance.b1": "Bouwde, upgradede, herstelde en optimaliseerde desktopsystemen voor particulieren en kleine bedrijven.",
    "exp.freelance.b2": "Diagnosticeerde hardware-, software- en netwerkproblemen, waaronder lan/wifi, connectiviteit en basisbeveiliging.",
    "exp.freelance.b3": "Ontwierp en bouwde websites voor klanten: structuur, opmaak en functionaliteit.",
    "exp.freelance.b4": "Beheerde klanten zelfstandig: communicatie, planning en technische opvolging.",
    "exp.speosPrint.role": "Polyvalent drukker",
    "exp.speosPrint.b1": "Bediende en onderhield drukmachines met hoog volume: Riso T2100, Xerox Nuvera en Canon ColorStream 6000 (doorlopend papier).",
    "exp.speosPrint.b2": "Werkte met het team om strakke deadlines te halen in een snelle productieomgeving.",
    "exp.speosPrint.b3": "Controleerde de afdrukkwaliteit en loste storingen op om stilstand te beperken.",
    "exp.okay.role": "Winkelmedewerker",
    "exp.okay.b1": "Bakte brood en zorgde dat er de hele dag vers aanbod beschikbaar was.",
    "exp.okay.b2": "Bediende de kassa en hielp klanten met vragen, advies en problemen.",
    "exp.okay.b3": "Werkte in team om de winkel draaiende te houden en de dagelijkse doelen te halen.",

    "work.title": "Projecten",
    "work.sub": "Drie topprojecten, twee browsergames die u kunt spelen en vier IT- en ontwikkelingsprojecten.",
    "work.filterLabel": "Projecten filteren",
    "work.fAll": "Alles",
    "work.fGames": "Games",
    "work.fInfra": "Infrastructuur",
    "work.fSoftware": "Software",
    "work.read": "Bekijk de case",
    "work.covers": "Wat het omvat",
    "work.inconito.type": "Browsergame",
    "work.inconito.desc": "Een sociaal deductiespel dat in de browser draait, speelbaar op mobiel en desktop.",
    "work.inconito.cta": "Speel Inconito",
    "work.sandwake.type": "3D-browsergame",
    "work.sandwake.desc": "Een 3D-game die in de browser wordt gerenderd met Three.js en WebGL.",
    "work.sandwake.cta": "Speel SandWake",
    "work.login.type": "Troubleshootingcase",
    "work.login.title": "Windows-aanmeldingsprobleem",
    "work.login.desc": "Een Windows-account diagnosticeren en herstellen dat niet meer kan aanmelden.",
    "work.login.c1": "Windows in veilige modus starten om weer toegang te krijgen.",
    "work.login.c2": "Het betrokken account resetten.",
    "work.login.c3": "De gebeurtenislogboeken nalopen om de oorzaak te vinden.",
    "work.login.c4": "Een preventief beleid om herhaling te voorkomen.",
    "work.login.t1": "Veilige modus",
    "work.login.t2": "Logboekanalyse",
    "work.lab.type": "Thuislab",
    "work.lab.title": "Virtueel IT-supportlab",
    "work.lab.desc": "Een virtueel lab om IT-support te oefenen op een Windows Server-domein.",
    "work.lab.c1": "Windows Server met Active Directory in VirtualBox.",
    "work.lab.c2": "Groepsbeleid om de instellingen van clientpc's te beheren.",
    "work.lab.c3": "Een veilige plek om veelvoorkomende helpdeskproblemen na te bootsen.",
    "work.net.type": "Netwerkdemo",
    "work.net.title": "Netwerkconfiguratie en troubleshooting",
    "work.net.desc": "Een klein netwerk configureren en problemen opsporen tot op pakketniveau.",
    "work.net.t1": "Statisch IP",
    "work.net.c1": "Statische IP-adressering en DNS-configuratie.",
    "work.net.t3": "Pakketcapture",
    "work.net.c2": "Connectiviteit diagnosticeren met ping en pakketcaptures.",
    "work.net.c3": "Een netwerkschema dat de opstelling documenteert.",
    "work.spool.type": "Interne tool, SPEOS",
    "work.spool.title": "Programma voor printspoolbeheer",
    "work.spool.desc": "Een tool die het beheer van printwachtrijen automatiseert, gebouwd tijdens mijn interim bij SPEOS.",
    "work.spool.c1": "Automatiseert intern het beheer van printwachtrijen.",
    "work.spool.c2": "Beheerd met Git en gebouwd via Jenkins.",
    "work.spool.c3": "Getest met QA en operations, met testbuilds die in verschillende omgevingen werden uitgerold.",
    "work.help.type": "Bedrijfsapplicatie",
    "work.help.title": "HelpDesk: IT-supportbeheersysteem",
    "work.help.desc": "Een webapplicatie voor het beheer van IT-supportaanvragen. Gebruikers dienen tickets in; technici wijzen prioriteiten toe, volgen incidenten op en werken de oplossingsstatus bij.",
    "work.help.c1": "Tickets aanmaken, toewijzen en de status opvolgen.",
    "work.help.c2": "Gebruikers- en technicusaccounts met rolgebaseerde rechten.",
    "work.help.c3": "Prioriteitsniveaus, categorieën en deadlines.",
    "work.help.c4": "Dashboard met statistieken en reactietijden.",
    "work.help.c5": "Tickethistoriek en opmerkingen.",
    "work.help.t6": "Authenticatie",
    "skills.auth": "Authenticatie",
    "skills.automation": "Automatisering",
    "work.sys.type": "Infrastructuurautomatisering",
    "work.sys.title": "SysAdmin Toolkit: automatisering van Windows-beheer",
    "work.sys.desc": "Een verzameling PowerShell-scripts om veelvoorkomende systeembeheertaken in een Windows-omgeving te automatiseren.",
    "work.sys.c1": "Geautomatiseerde aanmaak van Active Directory-gebruikers.",
    "work.sys.c2": "Beheer van groepen en rechten.",
    "work.sys.c3": "Bulkimport van gebruikers via CSV.",
    "work.sys.c4": "Wachtwoordverloop en accountaudits.",
    "work.sys.c5": "Pc-informatie en systeemdiagnostiek.",
    "work.sys.c6": "Geautomatiseerde rapporten en foutenlogging.",
    "work.sys.t5": "Automatisering",
    "work.asset.type": "IT-beheertool",
    "work.asset.title": "AssetTrack: inventaris van IT-apparatuur",
    "work.asset.desc": "Een inventarissysteem waarmee bedrijven computers, monitoren, randapparatuur en andere IT-apparatuur kunnen opvolgen.",
    "work.asset.c1": "Hardware-inventaris met serienummers.",
    "work.asset.c2": "QR-codes genereren om apparatuur te identificeren.",
    "work.asset.c3": "Toewijzing van apparaten aan medewerkers.",
    "work.asset.c4": "Onderhouds- en herstelhistoriek.",
    "work.asset.c5": "Opvolging van garantie en levenscyclus.",
    "work.asset.c6": "Doorzoekbare inventaris met export naar CSV.",

    "skills.title": "Vaardigheden",
    "skills.sub": "Selecteer een vaardigheid om te zien waar ik die heb gebruikt.",
    "skills.prog": "Programmeren en software",
    "skills.web": "Web",
    "skills.chromeext": "Chrome-extensies",
    "skills.db": "Databases",
    "skills.it": "IT-support en hardware",
    "skills.tools": "Tools en platformen",
    "skills.oop": "OOP",
    "skills.dbdesign": "Databaseontwerp",
    "skills.datamodel": "Datamodellering",
    "skills.hardware": "Pc's assembleren, upgraden en herstellen",
    "skills.diagnostics": "Hardwarediagnose",
    "skills.network": "LAN / wifi",
    "skills.optimization": "Systeemoptimalisatie",
    "skills.security": "Basisbeveiliging",
    "skills.capture": "Pakketcapture",

    "edu.title": "Opleiding en talen",
    "edu.focus": "Software engineering, systemen en webontwikkeling.",
    "lang.fr": "Frans",
    "lang.en": "Engels",
    "lang.nl": "Nederlands",
    "lang.ar": "Arabisch",
    "lang.fluent": "Vloeiend",
    "lang.basics": "Basiskennis",

    "contact.title": "Contact",
    "contact.lead": "Open voor functies in IT-support, webontwikkeling en als junior developer: voltijds, deeltijds of freelance, op afstand of ter plaatse.",
    "contact.place": "Jette, Brussel, België",
    "contact.copyEmail": "E-mailadres kopiëren",
    "contact.copyPhone": "Telefoonnummer kopiëren",
    "form.name": "Naam",
    "form.email": "E-mail",
    "form.message": "Bericht",
    "form.send": "Verzenden per e-mail",
    "form.note": "Opent uw e-mailapp met het bericht klaar om te verzenden.",
    "form.errRequired": "Vul uw naam, e-mailadres en bericht in.",
    "form.errEmail": "Geef een geldig e-mailadres op.",
    "foot.term": "Terminal openen",
    "foot.top": "Naar boven",

    "toast.email": "E-mailadres gekopieerd",
    "toast.phone": "Nummer gekopieerd",
    "toast.mail": "Uw e-mailapp wordt geopend",
    "toast.cv": "CV wordt gedownload",

    "js.subject": "Bericht van {name}",
    "pal.navigate": "Navigeren",
    "pal.projects": "Projecten",
    "pal.actions": "Acties",
    "act.cv": "CV downloaden",
    "act.copyEmail": "E-mailadres kopiëren",
    "act.theme": "Thema wisselen",
    "act.toFr": "Overschakelen naar het Frans",
    "act.toEn": "Overschakelen naar het Engels",
    "act.toNl": "Overschakelen naar het Nederlands",
    "act.term": "Terminal openen",
    "act.zirafix": "ZiraFix openen, computerhulp aan huis",
    "zf.kicker": "Computerhulp aan huis in Brussel",
    "zf.desc": "Pc’s, printers, spelconsoles, wifi: ik kom bij u thuis in Brussel om uw materiaal te depanneren, te herstellen en samen te stellen.",
    "zf.cta": "Bekijk de diensten",
    "zf.t1": "Pc’s en laptops",
    "zf.t2": "Printers",
    "zf.t3": "Spelconsoles",
    "zf.t4": "Wifi en netwerk",
    "act.play": "Spelen",
    "act.read": "Bekijk de case",
    "act.section": "Sectie",
    "sec.top": "Bovenaan",
    "sec.education": "Opleiding en talen"
  };

  /* English strings that are not in the markup. */
  var en = {
    "ui.openMenu": "Open command menu",
    "ui.theme": "Toggle light or dark theme",
    "ui.menu": "Open menu",
    "ui.close": "Close",
    "ui.clear": "Clear highlight",
    "work.filterLabel": "Filter projects",
    "contact.copyEmail": "Copy email address",
    "contact.copyPhone": "Copy phone number",
    "meta.title": "Zirari Yassîn | IT technician & software developer in Brussels",
    "meta.desc": "Zirari Yassîn is an IT technician and junior software developer based in Brussels. Hardware, networks and IT support, plus Java, Python, C# and web development. French and English.",
    "form.errRequired": "Fill in your name, email and message.",
    "form.errEmail": "Enter a valid email address.",
    "toast.email": "Email address copied",
    "toast.phone": "Phone number copied",
    "toast.mail": "Opening your email app",
    "toast.cv": "Downloading CV",
    "js.subject": "Message from {name}",
    "pal.navigate": "Navigate",
    "pal.projects": "Projects",
    "pal.actions": "Actions",
    "act.cv": "Download CV",
    "act.copyEmail": "Copy email address",
    "act.theme": "Switch theme",
    "act.toFr": "Switch to French",
    "act.toEn": "Switch to English",
    "act.toNl": "Switch to Dutch",
    "act.term": "Open terminal",
    "act.zirafix": "Open ZiraFix, home IT repair",
    "act.play": "Play",
    "act.read": "Read the case",
    "act.section": "Section",
    "sec.top": "Top",
    "sec.education": "Education and languages"
  };

  var LANGS = { fr: fr, nl: nl };
  var enDom = {};
  var lang = "en";
  var KEY = "zy-lang";

  function capture() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in enDom)) enDom[k] = el.textContent.trim();
    });
    // Attributes that already carry English text in the markup
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        var a = p[0].trim(), k = p[1].trim();
        if (!(k in en) && !(k in enDom) && el.hasAttribute(a)) enDom[k] = el.getAttribute(a);
      });
    });
  }

  function t(key, vars) {
    var dict = LANGS[lang], s = dict && key in dict ? dict[key] : (key in en ? en[key] : (key in enDom ? enDom[key] : key));
    if (vars) Object.keys(vars).forEach(function (v) { s = s.replace("{" + v + "}", vars[v]); });
    return s;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
  }

  function setLang(next, opts) {
    lang = next === "fr" || next === "nl" ? next : "en";
    document.documentElement.lang = lang;
    apply();
    document.title = t("meta.title");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.desc"));
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    if (!opts || opts.persist !== false) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function init() {
    capture();
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var nav = (navigator.language || "en").toLowerCase();
    var guess = nav.indexOf("fr") === 0 ? "fr" : nav.indexOf("nl") === 0 ? "nl" : "en";
    var start = saved || guess;
    // Always sync the toggle state; only touch the DOM if a translation is needed.
    if (start === "fr" || start === "nl") setLang(start, { persist: !!saved });
    else document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === "en")); });
  }

  window.ZY = window.ZY || {};
  window.ZY.i18n = { t: t, apply: apply, setLang: setLang, get lang() { return lang; } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
