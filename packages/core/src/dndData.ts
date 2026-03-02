import { Race, CharacterClass, AbilityName, AbilityScores } from "./types";

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Bonus raciaux selon le Player's Handbook
export const RACE_BONUSES: Record<Race, Partial<AbilityScores>> = {
	[Race.Humain]: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
	[Race.Elfe]: { dex: 2, int: 1 }, // Haut-Elfe standard
	[Race.Nain]: { con: 2, str: 2 }, // Nain des montagnes standard
	[Race.Halfelin]: { dex: 2, cha: 1 }, // Pied-Léger standard
	[Race.Drakeide]: { str: 2, cha: 1 },
	[Race.Gnome]: { int: 2, con: 1 }, // Gnome des roches standard
	[Race.DemiElfe]: { cha: 2, dex: 1, con: 1 }, // +2 Cha, +1 a deux autres
	[Race.DemiOrc]: { str: 2, con: 1 },
	[Race.Tieffelin]: { cha: 2, int: 1 },
};

// Priorités des caractéristiques par classe (du plus important au moins important)
export const CLASS_PRIORITIES: Record<CharacterClass, AbilityName[]> = {
	[CharacterClass.Barbare]: ["str", "con", "dex", "wis", "cha", "int"],
	[CharacterClass.Barde]: ["cha", "dex", "con", "wis", "int", "str"],
	[CharacterClass.Clerc]: ["wis", "con", "str", "dex", "int", "cha"],
	[CharacterClass.Druide]: ["wis", "con", "dex", "int", "cha", "str"],
	[CharacterClass.Guerrier]: ["str", "con", "dex", "wis", "int", "cha"],
	[CharacterClass.Moine]: ["dex", "wis", "con", "str", "int", "cha"],
	[CharacterClass.Paladin]: ["str", "cha", "con", "wis", "dex", "int"],
	[CharacterClass.Rodeur]: ["dex", "wis", "con", "str", "int", "cha"],
	[CharacterClass.Roublard]: ["dex", "int", "con", "wis", "cha", "str"],
	[CharacterClass.Sorcier]: ["cha", "con", "dex", "wis", "int", "str"], // Sorcerer
	[CharacterClass.Occultiste]: ["cha", "con", "dex", "wis", "int", "str"], // Warlock
	[CharacterClass.Magicien]: ["int", "dex", "con", "wis", "cha", "str"], // Wizard
};

export function calculateModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
	return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function generateStandardArray(
	race: Race,
	charClass: CharacterClass,
): AbilityScores {
	const priorities = CLASS_PRIORITIES[charClass];
	const raceBonus = RACE_BONUSES[race];

	const abilities: Partial<AbilityScores> = {};

	// Assign standard array scores based on class priority
	priorities.forEach((ability, index) => {
		let score = STANDARD_ARRAY[index];
		// Add racial bonus if any
		if (raceBonus[ability]) {
			score += raceBonus[ability]!;
		}
		abilities[ability] = score;
	});

	return abilities as AbilityScores;
}

export const ABILITY_LABELS: Record<AbilityName, string> = {
	str: "Force",
	dex: "Dextérité",
	con: "Constitution",
	int: "Intelligence",
	wis: "Sagesse",
	cha: "Charisme",
};
