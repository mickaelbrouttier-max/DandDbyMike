export enum Race {
	Humain = "Humain",
	Elfe = "Elfe",
	Nain = "Nain",
	Halfelin = "Halfelin",
	Drakeide = "Drakéide",
	Gnome = "Gnome",
	DemiElfe = "Demi-Elfe",
	DemiOrc = "Demi-Orc",
	Tieffelin = "Tieffelin",
}

export enum CharacterClass {
	Barbare = "Barbare",
	Barde = "Barde",
	Clerc = "Clerc",
	Druide = "Druide",
	Guerrier = "Guerrier",
	Moine = "Moine",
	Paladin = "Paladin",
	Rodeur = "Rôdeur",
	Roublard = "Roublard",
	Sorcier = "Sorcier",
	Occultiste = "Occultiste",
	Magicien = "Magicien",
}

export type AbilityName = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type AbilityScores = {
	[K in AbilityName]: number;
};

export interface ClassConfig {
	features: string;
	equipment: string;
	magicType: "Full Caster" | "Half Caster" | "Non-Caster";
	spells?: {
		knownCantrips: number;
		knownLevel1: number | "ALL";
		preparationType: "Preparator" | "Savant" | "Innate";
		spellCastingAbility?: AbilityName;
		spellSuggestions: {
			cantrips: string[];
			level1: string[];
		};
	};
}

export interface CharacterConcept {
	playerFirstName: string;
	playerLastName: string;
	charName: string;
	charAge: string;
	race: Race | "";
	charClass: CharacterClass | "";
	abilities?: AbilityScores;
	features?: string;
	equipment?: string;
	spells?: {
		cantrips: string[];
		level1: string[];
		preparedLevel1?: string[];
		racialSpells?: string[];
	};
	appearance: string;
	temperament: string;
	history: string;
	startingLocation: string;
	reasonLocation: string;
	secret: string;
}
