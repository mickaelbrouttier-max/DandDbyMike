import React, { useState } from "react";
import Tooltip from "./Tooltip";
import SpellSelector from "./SpellSelector";
import {
	CharacterClass,
	Race,
	AbilityScores,
	CLASS_DATA,
	RACE_LORE,
	calculateModifier,
	SPELL_DESCRIPTIONS,
} from "@dnd/core";
import "../styles/spells.css";

interface SpellState {
	cantrips: string[];
	level1: string[];
	preparedLevel1: string[];
}

interface MagicSectionProps {
	charClass: CharacterClass | "";
	race: Race | "";
	abilities?: AbilityScores;
	spells?: SpellState;
	onChange: (spells: SpellState) => void;
	disabled?: boolean;
}

export default function MagicSection({
	charClass,
	race,
	abilities,
	spells,
	onChange,
	disabled = false,
}: MagicSectionProps) {
	if (!charClass) return null;
	const classConfig = CLASS_DATA[charClass];
	const racialSpells = race ? RACE_LORE[race]?.spells : undefined;
	const hasClassSpells = !!classConfig?.spells;

	if (!hasClassSpells && !racialSpells) return null;

	const knownCantrips = hasClassSpells ? classConfig.spells!.knownCantrips : 0;
	const knownLevel1Raw = hasClassSpells ? classConfig.spells!.knownLevel1 : 0;
	// S'il connaît "ALL", son nombre affiché de spells connus est simplement la taille des suggestions
	const knownLevel1 =
		knownLevel1Raw === "ALL"
			? classConfig.spells?.spellSuggestions.level1.length || 0
			: knownLevel1Raw;

	const prepType = hasClassSpells
		? classConfig.spells!.preparationType
		: undefined;
	const spellCastingAbility = hasClassSpells
		? classConfig.spells!.spellCastingAbility
		: undefined;
	const spellSuggestions = hasClassSpells
		? classConfig.spells!.spellSuggestions
		: { cantrips: [], level1: [] };

	const abilityScore =
		spellCastingAbility && abilities
			? abilities[spellCastingAbility]
			: undefined;
	const abilityMod =
		abilityScore !== undefined ? calculateModifier(abilityScore) : 0;

	// Minimum 1 preparation (level 1 + ability mod)
	const maxPrepared = Math.max(1, 1 + abilityMod);

	// Cantrip limits are strictly enforced by the SpellSelector maxSelection
	const handleCantripChange = (selected: string[]) => {
		if (!spells) return;
		onChange({ ...spells, cantrips: selected });
	};

	const handleKnownLevel1Change = (selected: string[]) => {
		if (!spells) return;
		// When known spells change, remove any prepared spells that are no longer known
		const safePrepared = spells.preparedLevel1 || [];
		const newPrepared = safePrepared.filter((s) => selected.includes(s));

		onChange({ ...spells, level1: selected, preparedLevel1: newPrepared });
	};

	const togglePrepared = (spell: string) => {
		if (disabled || !spells) return;
		const safePrepared = spells.preparedLevel1 || [];
		const isPrepared = safePrepared.includes(spell);

		if (isPrepared) {
			onChange({
				...spells,
				preparedLevel1: safePrepared.filter((s) => s !== spell),
			});
		} else {
			if (safePrepared.length >= maxPrepared) return;
			onChange({
				...spells,
				preparedLevel1: [...safePrepared, spell],
			});
		}
	};

	return (
		<div className="magic-section">
			{/* Sorts Mineurs (Cantrips) */}
			{knownCantrips > 0 && (
				<div className="spell-input-group">
					<div className="spell-group-header">
						<div>
							<span className="spell-group-title">
								1. SORTS MINEURS (Cantrips)
							</span>
							<p className="spell-group-subtitle">
								Ces choix sont définitifs à la création. Ce sont vos sorts
								innés, toujours disponibles.
							</p>
						</div>
					</div>

					<SpellSelector
						availableSpells={spellSuggestions.cantrips}
						selectedSpells={spells?.cantrips || []}
						maxSelection={knownCantrips}
						onChange={handleCantripChange}
						disabled={disabled}
					/>
				</div>
			)}

			{/* Magie de Race */}
			{racialSpells && (
				<div className="spell-input-group fade-in">
					<span className="spell-group-title">2. SORTS DE RACE</span>
					<div className="racial-spell-box">
						<span className="always-prepared-badge">Sort racial : </span>
						<span>{racialSpells} (Toujours disponible)</span>
					</div>
				</div>
			)}

			{/* Emplacements de Sorts removed as per user request */}

			{/* Sorts de Niveau 1 (Préparation ou Connus) */}
			{knownLevel1 > 0 && prepType === "Innate" && (
				<div className="spell-input-group fade-in">
					<div className="spell-group-header">
						<div>
							<span className="spell-group-title">
								3. SORTS CONNUS (Niveau 1)
							</span>
							<p className="spell-group-subtitle">
								Ces choix sont définitifs. Sélectionnez les sorts qui font
								partie de votre répertoire inné.
							</p>
						</div>
					</div>
					<SpellSelector
						availableSpells={spellSuggestions.level1}
						selectedSpells={spells?.level1 || []}
						maxSelection={knownLevel1}
						onChange={handleKnownLevel1Change}
						disabled={disabled}
					/>
				</div>
			)}

			{knownLevel1 > 0 && prepType === "Preparator" && (
				<div className="spell-input-group fade-in">
					<div className="spell-group-header">
						<div>
							<span className="spell-group-title">
								3. PRÉPARATION JOURNALIÈRE (Le Choix du Jour)
							</span>
							<p className="spell-group-subtitle">
								Vous connaissez toute votre liste de classe. Cochez les sorts
								préparés pour la journée.
							</p>
						</div>
						<div className="preparation-counter">
							Nombre de sorts à choisir ce matin ={" "}
							<strong>
								[Niveau + Mod. de Caractéristique] = {maxPrepared}
							</strong>
						</div>
					</div>

					{/* For Preparators */}
					<div className="spell-grid">
						{spellSuggestions.level1.map((spell) => {
							// Fix requested by user: If the maximum amount is greater than or equal to the total available,
							// do not show checkboxes, just show the description. (ex: maxPrepared = 4, but only 2 spells in DB so they get them all)
							const canCheckAll = maxPrepared >= spellSuggestions.level1.length;
							const description = SPELL_DESCRIPTIONS[spell];

							if (canCheckAll) {
								return (
									<div key={`prep-${spell}`} className="spell-description-only">
										<span
											className="spell-name"
											style={{
												color: "var(--color-gold)",
												display: "block",
												marginBottom: "0.25rem",
											}}
										>
											✤ {spell}
										</span>
										{description && (
											<p
												style={{
													fontSize: "0.85rem",
													opacity: 0.8,
													marginLeft: "1rem",
												}}
											>
												{description}
											</p>
										)}
									</div>
								);
							}

							const safePrepared = spells?.preparedLevel1 || [];
							const isPrepared = safePrepared.includes(spell) || false;
							const limitReached = safePrepared.length >= maxPrepared;
							const isItemDisabled = disabled || (!isPrepared && limitReached);

							return (
								<label
									key={`prep-${spell}`}
									className={`spell-checkbox-label ${
										isPrepared ? "prepared selected" : ""
									} ${isItemDisabled ? "disabled" : ""}`}
								>
									<input
										type="checkbox"
										className="spell-hidden-checkbox"
										checked={isPrepared}
										onChange={() => togglePrepared(spell)}
										disabled={isItemDisabled}
									/>
									<span className="spell-custom-checkbox prep-checkbox"></span>
									{description ? (
										<Tooltip content={description} position="top">
											<span className="spell-name">{spell}</span>
										</Tooltip>
									) : (
										<span className="spell-name">{spell}</span>
									)}
								</label>
							);
						})}
					</div>
				</div>
			)}

			{knownLevel1 > 0 && prepType === "Savant" && (
				<div className="spell-input-group fade-in">
					<div className="spell-group-header">
						<div>
							<span className="spell-group-title">
								3. GRIMOIRE & PRÉPARATION (Magicien)
							</span>
						</div>
						<div className="preparation-counter">
							Nombre de sorts à choisir ce matin ={" "}
							<strong>[Niveau + Mod. d'Intelligence] = {maxPrepared}</strong>
						</div>
					</div>

					<div className="preparation-manager">
						<div className="prep-column known-column">
							<h4 className="prep-column-title">A. Grimoire</h4>
							<p className="prep-column-subtitle">
								Choisissez {knownLevel1} sorts qui sont inscrits dans votre
								grimoire à la création.
							</p>
							<SpellSelector
								availableSpells={spellSuggestions.level1}
								selectedSpells={spells?.level1 || []}
								maxSelection={knownLevel1}
								onChange={handleKnownLevel1Change}
								disabled={disabled}
							/>
						</div>

						<div className="prep-divider" />

						<div className="prep-column prepared-column">
							<h4 className="prep-column-title">
								B. Sorts Actifs pour la Session
							</h4>
							<p className="prep-column-subtitle">
								Vous ne pouvez cocher que {maxPrepared} sorts parmi votre
								grimoire.
							</p>
							<div className="spell-grid">
								{(!spells || spells.level1.length === 0) && (
									<p className="empty-prep-msg">
										Inscrivez des sorts dans la colonne A d'abord.
									</p>
								)}
								{spells &&
									(spells.level1 || []).map((spell) => {
										const safePrepared = spells.preparedLevel1 || [];
										const isPrepared = safePrepared.includes(spell);
										const limitReached = safePrepared.length >= maxPrepared;
										const isItemDisabled =
											disabled || (!isPrepared && limitReached);
										const description = SPELL_DESCRIPTIONS[spell];

										return (
											<label
												key={`prep-${spell}`}
												className={`spell-checkbox-label ${
													isPrepared ? "prepared selected" : ""
												} ${isItemDisabled ? "disabled" : ""}`}
											>
												<input
													type="checkbox"
													className="spell-hidden-checkbox"
													checked={isPrepared}
													onChange={() => togglePrepared(spell)}
													disabled={isItemDisabled}
												/>
												<span className="spell-custom-checkbox prep-checkbox"></span>
												{description ? (
													<Tooltip content={description} position="top">
														<span className="spell-name">{spell}</span>
													</Tooltip>
												) : (
													<span className="spell-name">{spell}</span>
												)}
											</label>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
