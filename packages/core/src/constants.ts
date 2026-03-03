import { CharacterClass, ClassConfig } from "./types";

export const CLASS_DATA: Record<CharacterClass, ClassConfig> = {
	[CharacterClass.Barbare]: {
		features:
			"Rage (Bonus aux dégâts de mêlée, Résistance aux dégâts contondants, perforants et tranchants).\nDéfense sans armure (CA = 10 + Mod. Dex + Mod. Con).",
		equipment:
			"- Hache à deux mains\n- 2 Hachettes\n- Sac d'explorateur\n- 4 Javelots",
		magicType: "Non-Caster",
	},
	[CharacterClass.Barde]: {
		features:
			"Incantation (Magie bardique).\nInspiration bardique (1d6 pour allier).\nÉrudition.",
		equipment:
			"- Rapière\n- Pack de diplomate\n- Luth\n- Armure de cuir et Dague",
		magicType: "Full Caster",
		spells: {
			knownCantrips: 2,
			knownLevel1: 4,
			preparationType: "Innate",
			spellCastingAbility: "cha",
			spellSuggestions: {
				cantrips: [
					"Moquerie vicieuse",
					"Prestidigitation",
					"Lumière",
					"Illusion mineure",
				],
				level1: [
					"Mot de guérison",
					"Charme-personne",
					"Sommeil",
					"Vague tonnante",
					"Soins",
					"Détection de la magie",
				],
			},
		},
	},
	[CharacterClass.Clerc]: {
		features:
			"Incantation divine.\nDomaine divin (Niveau 1).\nAversion pour les morts-vivants.",
		equipment:
			"- Masse d'armes\n- Cotte de mailles\n- Arbalète légère (20 carreaux)\n- Pack de prêtre\n- Bouclier et Symbole sacré",
		magicType: "Full Caster",
		spells: {
			knownCantrips: 3,
			knownLevel1: "ALL",
			preparationType: "Preparator",
			spellCastingAbility: "wis",
			spellSuggestions: {
				cantrips: ["Flamme sacrée", "Guidance", "Thaumaturgie", "Lumière"],
				level1: [
					"Soins",
					"Bénédiction",
					"Mot de guérison",
					"Détection de la magie",
					"Bouclier",
				],
			},
		},
	},
	[CharacterClass.Druide]: {
		features: "Incantation druidique.\nDruidique (Langue secrète).",
		equipment:
			"- Bouclier de bois\n- Cimeterre\n- Armure de cuir\n- Sac d'explorateur\n- Focaliseur druidique",
		magicType: "Full Caster",
		spells: {
			knownCantrips: 2,
			knownLevel1: "ALL",
			preparationType: "Preparator",
			spellCastingAbility: "wis",
			spellSuggestions: {
				cantrips: ["Gourdin magique", "Assistance", "Guidance"],
				level1: [
					"Enchevêtrement",
					"Mot de guérison",
					"Soins",
					"Charme-personne",
					"Détection de la magie",
				],
			},
		},
	},
	[CharacterClass.Guerrier]: {
		features:
			"Style de combat (Archerie, Défense, Duel, etc.).\nSecond souffle (Récupère 1d10 + niveau PV).",
		equipment:
			"- Cotte de mailles\n- Épée longue et Bouclier\n- Arbalète légère (20 carreaux)\n- Sac d'explorateur",
		magicType: "Non-Caster",
	},
	[CharacterClass.Magicien]: {
		features:
			"Incantation (Livre de sorts).\nRestauration arcanique (Récupère un emplacement de sort lors d'un repos court).",
		equipment:
			"- Bâton\n- Focaliseur arcanique\n- Sac d'érudit\n- Livre de sorts",
		magicType: "Full Caster",
		spells: {
			knownCantrips: 3,
			knownLevel1: 6, // 6 in spellbook
			preparationType: "Savant",
			spellCastingAbility: "int",
			spellSuggestions: {
				cantrips: ["Trait de feu", "Prestidigitation", "Illusion mineure"],
				level1: [
					"Bouclier",
					"Projectile magique",
					"Détection de la magie",
					"Sommeil",
					"Armure de mage",
					"Charme-personne",
				],
			},
		},
	},
	[CharacterClass.Moine]: {
		features:
			"Défense sans armure (CA = 10 + Mod. Dex + Mod. Sag).\nArts martiaux (Attaque à mains nues 1d4).",
		equipment:
			"- Épée courte\n- Sac d'artisan ou Sac d'explorateur\n- 10 fléchettes",
		magicType: "Non-Caster",
	},
	[CharacterClass.Occultiste]: {
		features:
			"Magie de pacte.\nPatron d'outreterre (Féé, Fiélon, Grand Ancien).",
		equipment:
			"- Armure de cuir\n- Arme simple\n- Pack d'érudit ou Pack d'exploration\n- Dagues, focaliseur arcanique",
		magicType: "Full Caster", // Mechanically unique, but full progression
		spells: {
			knownCantrips: 2,
			knownLevel1: 2,
			preparationType: "Innate",
			spellCastingAbility: "cha",
			spellSuggestions: {
				cantrips: [
					"Décharge occulte",
					"Illusion mineure",
					"Contact glacial",
					"Prestidigitation",
				],
				level1: [
					"Maléfice",
					"Armure d'Agathys",
					"Charme-personne",
					"Armure de mage",
					"Protection contre le Mal et le Bien",
				],
			},
		},
	},
	[CharacterClass.Paladin]: {
		features: "Sens divin.\nImposition des mains (Soigne 5 PV x niveau).",
		equipment:
			"- Épée longue\n- Bouclier\n- 5 Javelots\n- Pack de prêtre\n- Cotte de mailles et symbole sacré",
		magicType: "Half Caster",
		spells: {
			knownCantrips: 0,
			knownLevel1: "ALL",
			preparationType: "Preparator",
			spellCastingAbility: "cha",
			spellSuggestions: {
				cantrips: [],
				level1: ["Soins", "Bénédiction", "Bouclier de la foi", "Héroïsme"],
			},
		},
	},
	[CharacterClass.Rodeur]: {
		features: "Ennemi favori.\nExplorateur né (Terrain favori).",
		equipment:
			"- Armure d'écailles ou Armure de cuir\n- Deux épées courtes\n- Pack d'exploration\n- Arc long et carquois (20 flèches)",
		magicType: "Half Caster",
		spells: {
			knownCantrips: 0,
			knownLevel1: 2,
			preparationType: "Innate",
			spellCastingAbility: "wis",
			spellSuggestions: {
				cantrips: [],
				level1: [
					"Soins",
					"Enchevêtrement",
					"Marque du chasseur",
					"Communication avec les animaux",
				],
			},
		},
	},
	[CharacterClass.Roublard]: {
		features:
			"Attaque sournoise (+1d6 dégâts si avantage ou allié proche).\nExpertise (Double maîtrise sur 2 compétences).\nJargon des voleurs.",
		equipment:
			"- Rapière\n- Arc court et carquois (20 flèches)\n- Pack de cambrioleur\n- Armure de cuir, 2 dagues et Outils de voleur",
		magicType: "Non-Caster",
	},
	[CharacterClass.Sorcier]: {
		features:
			"Incantation.\nOrigine ensorcelée (Lignée draconique, Magie sauvage).",
		equipment:
			"- Arbalète légère (20 carreaux)\n- Focaliseur arcanique\n- Pack d'explorateur\n- 2 dagues",
		magicType: "Full Caster",
		spells: {
			knownCantrips: 4,
			knownLevel1: 2,
			preparationType: "Innate",
			spellCastingAbility: "cha",
			spellSuggestions: {
				cantrips: [
					"Trait de feu",
					"Lumière",
					"Contact glacial",
					"Prestidigitation",
					"Illusion mineure",
				],
				level1: [
					"Bouclier",
					"Projectile magique",
					"Armure de mage",
					"Sommeil",
					"Détection de la magie",
					"Charme-personne",
					"Vague tonnante",
				],
			},
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
