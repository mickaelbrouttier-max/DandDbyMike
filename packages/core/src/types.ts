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

export interface CharacterConcept {
	playerName: string;
	charName: string;
	race: Race | "";
	charClass: CharacterClass | "";
	abilities?: AbilityScores;
	appearance: string;
	temperament: string;
	history: string;
	secret: string;
}
