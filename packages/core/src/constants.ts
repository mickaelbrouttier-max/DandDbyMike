import { CharacterClass, ClassConfig } from "./types";

export const CLASS_DATA: Partial<Record<CharacterClass, ClassConfig>> = {
	[CharacterClass.Barbare]: {
		features:
			"Rage (Bonus aux dégâts de mêlée, Résistance aux dégâts contondants, perforants et tranchants).\nDéfense sans armure (CA = 10 + Mod. Dex + Mod. Con).",
		equipment:
			"- Hache à deux mains\n- 2 Hachettes\n- Sac d'explorateur\n- 4 Javelots",
	},
	[CharacterClass.Roublard]: {
		features:
			"Attaque sournoise (+1d6 dégâts si avantage ou allié proche).\nExpertise (Double maîtrise sur 2 compétences).\nJargon des voleurs.",
		equipment:
			"- Rapière\n- Arc court et carquois (20 flèches)\n- Pack de cambrioleur\n- Armure de cuir, 2 dagues et Outils de voleur",
	},
	[CharacterClass.Magicien]: {
		features:
			"Incantation (Livre de sorts).\nRestauration arcanique (Récupère un emplacement de sort lors d'un repos court).",
		equipment:
			"- Bâton\n- Focaliseur arcanique\n- Sac d'érudit\n- Livre de sorts",
		spells: {
			cantrips: "Trait de feu\nPrestidigitation\nLumière",
			level1: "Bouclier\nProjectile magique\nDétection de la magie\nSommeil",
		},
	},
	[CharacterClass.Clerc]: {
		features:
			"Incantation divine.\nDomaine divin (Niveau 1).\nAversion pour les morts-vivants.",
		equipment:
			"- Masse d'armes\n- Cotte de mailles\n- Arbalète légère (20 carreaux)\n- Pack de prêtre\n- Bouclier et Symbole sacré",
		spells: {
			cantrips: "Flamme sacrée\nGuidance\nThaumaturgie",
			level1: "Soins\nMot de guérison\nBénédiction\nFléau",
		},
	},
};
export const TOOLTIP_DEFINITIONS: Record<string, string> = {
	// Caractéristiques
	str: "Force : Puissance physique et athlétisme.",
	dex: "Dextérité : Agilité, réflexes et équilibre.",
	con: "Constitution : Santé, vitalité et endurance.",
	int: "Intelligence : Mémoire, raisonnement et logique.",
	wis: "Sagesse : Perception, intuition et instinct.",
	cha: "Charisme : Force de personnalité et leadership.",

	// Combat
	ac: "CA (Classe d'Armure) : Difficulté à vous toucher en combat.",
	initiative: "Initiative : Ordre de passage lors d'un affrontement.",
	modifier:
		"Modificateur : Le bonus (ou malus) dérivé de votre score, ajouté à vos jets de dés.",

	// Magie
	spellSlots: "Emplacements de sorts : Vos 'munitions' magiques quotidiennes.",
	cantrips:
		"Sorts mineurs (Cantrips) : Sorts simples et maîtrisés, utilisables à volonté sans dépenser d'emplacement.",
};
