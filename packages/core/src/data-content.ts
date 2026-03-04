export interface RaceLore {
	description: string;
	bonuses: string;
	abilities: string[];
	spells?: string;
	spellOptions?: {
		available: string[];
		maxSelection: number;
		label?: string;
	};
}

export interface ClassLore {
	description: string;
	advantage: string;
	keyStats: string;
	equipment: string;
}

export const RACE_LORE: Record<string, RaceLore> = {
	Humain: {
		description:
			"Polyvalence incarnée. De l'artisanat aux plus hautes magies, les humains s'adaptent à toutes les carrières avec une ambition farouche.",
		bonuses: "+1 à toutes les caractéristiques",
		abilities: ["Apprentissage Rapide", "Détermination"],
	},
	Elfe: {
		description:
			"Grâce ancestrale et longévité. Un lien spirituel éternel avec la féerie originelle.",
		bonuses: "+2 Dextérité",
		abilities: [
			"Vision dans le noir",
			"Sens Aiguisés",
			"Ascendance Féerique",
			"Transe",
		],
		spells: "Haut-Elfe : 1 sort mineur de Magicien au choix",
		spellOptions: {
			available: [
				"Trait de feu",
				"Prestidigitation",
				"Illusion mineure",
				"Lumière",
				"Contact glacial",
			],
			maxSelection: 1,
			label: "Sort mineur de Haut-Elfe",
		},
	},
	Nain: {
		description:
			"Peuple d'artisans légendaires capables de soulever des montagnes au combat.",
		bonuses: "+2 Constitution",
		abilities: [
			"Vision dans le noir",
			"Résistance Naine",
			"Formation Martiale Naine",
		],
	},
	Halfelin: {
		description:
			"Discrets et chanceux. Toujours optimistes face à l'adversité, ils se glissent subtilement entre le danger.",
		bonuses: "+2 Dextérité",
		abilities: ["Chanceux", "Bravoure", "Agilité Halfeline"],
	},
	Drakéide: {
		description:
			"Imprégnés du sang des dragons, projetant la puissance destructrice de leur ancêtre.",
		bonuses: "+2 Force, +1 Charisme",
		abilities: [
			"Ascendance Draconique",
			"Souffle Draconique",
			"Résistance aux Dégâts",
		],
	},
	"Demi-Elfe": {
		description:
			"Mêlant l'ambition humaine à la grâce elfique, d'excellents diplomates dotés d'une grande polyvalence.",
		bonuses: "+2 Charisme, +1 à deux autres caractéristiques",
		abilities: ["Vision dans le noir", "Ascendance Féerique", "Polyvalence"],
	},
	"Demi-Orc": {
		description:
			"Bénis d'une constitution phénoménale, ils refusent de mourir là où la plupart rendraient leur dernier souffle.",
		bonuses: "+2 Force, +1 Constitution",
		abilities: [
			"Vision dans le noir",
			"Menaçant",
			"Endurance Implacable",
			"Attaques Sauvages",
		],
	},
	Tieffelin: {
		description:
			"Héritiers d'un ancien pacte avec les Neuf Enfers, ils manipulent naturellement les ombres.",
		bonuses: "+2 Charisme, +1 Intelligence",
		abilities: [
			"Vision dans le noir",
			"Résistance Infernale",
			"Ascendance Infernale",
		],
		spells: "Thaumaturgie",
	},
	Gnome: {
		description:
			"Dotés d'un intellect bouillonnant et d'une affinité pour la magie ou l'artisanat.",
		bonuses: "+2 Intelligence",
		abilities: ["Vision dans le noir", "Ruse Gnomique"],
	},
};

export const CLASS_LORE: Record<string, ClassLore> = {
	Barbare: {
		description:
			"Un guerrier féroce puisant dans sa colère originelle pour dévaster les lignes de front.",
		advantage: "PV les plus élevés du jeu et mitigation de dégâts via la Rage.",
		keyStats: "Force et Constitution",
		equipment: "Hache à deux mains, haches de lancer, sac d'explorateur.",
	},
	Barde: {
		description:
			"Tisseur de mots et de magie. Ses prestations musicales insufflent courage aux alliés tout en modelant la réalité.",
		advantage:
			"Polyvalence ultime : excellent soutien, contrôle de foule et compétences sociales.",
		keyStats: "Charisme et Dextérité",
		equipment: "Rapière, instrument de musique, armure de cuir.",
	},
	Clerc: {
		description:
			"Un thaumaturge servant une Entité supérieure, spécialisé dans les miracles vitaux et le courroux céleste.",
		advantage:
			"Maître incontesté du soin et des buffs divins (Bénédiction), très résistant.",
		keyStats: "Sagesse et Force",
		equipment: "Masse d'armes, cotte de mailles, bouclier, symbole sacré.",
	},
	Druide: {
		description:
			"Manipulant les forces primitives de la nature, des éléments et capable de revêtir l'apparence physique de bêtes sauvages.",
		advantage:
			"Transformation en animaux (Forme Sauvage) et puissants sorts de contrôle (Enchevêtrement).",
		keyStats: "Sagesse et Constitution",
		equipment:
			"Bouclier en bois, cimeterre, armure de cuir, focaliseur druidique.",
	},
	Guerrier: {
		description:
			"Maître absolu des armes. Que ce soit au tir à l'arc, à l'escrime ou en armure lourde, sa discipline tactique est irremplaçable.",
		advantage:
			"Nombreuses attaques, grande robustesse et Action Sursaut pour briser l'économie d'action.",
		keyStats: "Force ou Dextérité",
		equipment: "Armure de mailles, arme martiale et bouclier, arc long.",
	},
	Moine: {
		description:
			"Combattant sans arme ni armure, canalisant l'énergie vitale (Ki) de l'univers pour des frappes fulgurantes.",
		advantage:
			"Mobilité extrême, esquive sans armure et déferlement de coups (Déluge de coups).",
		keyStats: "Dextérité et Sagesse",
		equipment: "Épée courte, jeu de fléchettes, sac d'exploration.",
	},
	Paladin: {
		description:
			"Mêlant prouesses martiales et bénédictions curatives, toujours en première ligne pour châtier le Mal absolu.",
		advantage:
			"Dégâts explosifs au corps-à-corps (Châtiment Divin) et auras protectrices.",
		keyStats: "Force, Charisme et Constitution",
		equipment: "Arme martiale et bouclier, cotte de mailles, symbole sacré.",
	},
	Rôdeur: {
		description:
			"Traqueur des confins, fusionnant la survie, l'archerie mortelle et des bribes de magies naturelles.",
		advantage:
			"Dégâts soutenus (Marque du Chasseur), excellent pisteur et spécialiste des embuscades.",
		keyStats: "Dextérité et Sagesse",
		equipment: "Armure d'écailles, deux épées courtes, arc long.",
	},
	Roublard: {
		description:
			"Spécialiste des coups bas meurtriers, de l'infiltration et du désamorçage méticuleux des pièges.",
		advantage:
			"Dégâts massifs sur cible unique (Attaque Sournoise) et expertise dans de multiples compétences.",
		keyStats: "Dextérité",
		equipment: "Rapière, arc court, armure de cuir, outils de voleur.",
	},
	Sorcier: {
		description:
			"Le pouvoir ne s'apprend pas, il coule dans ses veines. Une puissance brute mystique.",
		advantage:
			"Méta-magie : Capacité à modifier les règles de ses propres sorts (ex: lancer deux cibles au lieu d'une).",
		keyStats: "Charisme",
		equipment: "Arbalète légère, focaliseur arcanique, sac d'érudit.",
	},
	Occultiste: {
		description:
			"Un lanceur de sorts ayant forgé un accord avec une Entité insondable en échange de secrets surnaturels.",
		advantage:
			"Cantrip dévastateur (Décharge Occulte) et emplacements de sorts récupérables en repos court.",
		keyStats: "Charisme",
		equipment: "Arme courante, armure de cuir, grimoire ou arme de pacte.",
	},
	Magicien: {
		description:
			"Érudit arcanique suprême tirant ses pouvoirs d'années passées à décrypter un redoutable Grimoire.",
		advantage:
			"La plus grande et polyvalente liste de sorts de toutes les classes confondues.",
		keyStats: "Intelligence",
		equipment: "Bâton, focaliseur arcanique, grimoire.",
	},
};
