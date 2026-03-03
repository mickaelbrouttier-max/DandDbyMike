import React, { useState, useEffect } from "react";
import {
	CharacterConcept,
	Race,
	CharacterClass,
	AbilityName,
	generateStandardArray,
	calculateModifier,
	formatModifier,
	ABILITY_LABELS,
	CLASS_DATA,
	TOOLTIP_DEFINITIONS,
	FEATURE_DESCRIPTIONS,
	RACE_LORE,
	CLASS_LORE,
} from "@dnd/core";
import Tooltip from "./Tooltip";
import SpellSelector from "./SpellSelector";
import "../styles/form.css";

// Remplacez 'YOUR_FORMSPREE_ID' par l'ID de votre formulaire Formspree
// qui est configuré pour envoyer à mickael.brouttier@gmail.com
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvndqzn";

export default function ConceptForm() {
	const [formData, setFormData] = useState<CharacterConcept>({
		playerName: "",
		charName: "",
		race: "",
		charClass: "",
		abilities: {
			str: 10,
			dex: 10,
			con: 10,
			int: 10,
			wis: 10,
			cha: 10,
		},
		features: "",
		equipment: "",
		spells: undefined,
		appearance: "",
		temperament: "",
		history: "",
		secret: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [autoFilledFields, setAutoFilledFields] = useState<boolean>(false);

	// Met à jour automatiquement les caractéristiques, capacités et équipement
	// si la race et la classe sont sélectionnées
	useEffect(() => {
		if (formData.race && formData.charClass) {
			const autoAbilities = generateStandardArray(
				formData.race as Race,
				formData.charClass as CharacterClass,
			);

			const classConfig = CLASS_DATA[formData.charClass as CharacterClass];

			setFormData((prev) => ({
				...prev,
				abilities: autoAbilities,
				features: classConfig?.features || "",
				equipment: classConfig?.equipment || "",
				spells: classConfig?.spells
					? {
							cantrips: [],
							level1: [],
						}
					: undefined,
			}));

			// Déclenche l'animation de glow temporaire
			setAutoFilledFields(true);
			const timer = setTimeout(() => setAutoFilledFields(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [formData.race, formData.charClass]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAbilityChange = (ability: AbilityName, valueStr: string) => {
		const value = parseInt(valueStr, 10);
		if (isNaN(value)) return;

		setFormData((prev) => ({
			...prev,
			abilities: {
				...prev.abilities!,
				[ability]: value,
			},
		}));
	};

	const handleSpellChange = (
		level: "cantrips" | "level1",
		selected: string[],
	) => {
		setFormData((prev) => {
			if (!prev.spells) return prev;
			return {
				...prev,
				spells: {
					...prev.spells,
					[level]: selected,
				},
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation basique (HTML required gère déjà la majorité)
		if (
			!formData.playerName ||
			!formData.charName ||
			!formData.race ||
			!formData.charClass
		) {
			alert(
				"Veuillez remplir les champs obligatoires (Pseudo, Nom, Race, Classe).",
			);
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			const response = await fetch(FORMSPREE_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					"Pseudo Joueur": formData.playerName,
					"Nom du Personnage": formData.charName,
					Race: formData.race,
					Classe: formData.charClass,
					Caractéristiques: formData.abilities,
					"Capacités de Classe": formData.features,
					Équipement: formData.equipment,
					Héritage: formData.race ? RACE_LORE[formData.race] : "Inconnu",
					"Voie du Héros": formData.charClass
						? CLASS_LORE[formData.charClass]
						: "Inconnue",
					Grimoire: formData.spells
						? `Cantrips: ${formData.spells.cantrips.filter(Boolean).join(", ")} | Niveau 1: ${formData.spells.level1.filter(Boolean).join(", ")}`
						: "Non applicable",
					Apparence: formData.appearance,
					Tempérament: formData.temperament,
					Histoire: formData.history,
					"Secret / Peur": formData.secret,
				}),
			});

			if (response.ok) {
				setSubmitStatus("success");
				setFormData({
					playerName: "",
					charName: "",
					race: "",
					charClass: "",
					appearance: "",
					temperament: "",
					history: "",
					secret: "",
				});
			} else {
				setSubmitStatus("error");
			}
		} catch (error) {
			console.error(error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="parchment-container">
			<div className="form-header">
				<h1>Concept de Personnage</h1>
				<p>Phase Prélude - Registre des Héros</p>
			</div>

			{submitStatus === "success" && (
				<div className="status-message success fade-in">
					<h2>Votre destin est scellé !</h2>
					<p>Les archives ont bien reçu votre concept.</p>
				</div>
			)}

			{submitStatus === "error" && (
				<div className="status-message error fade-in">
					<h2>Malédiction !</h2>
					<p>
						Le message n'a pas pu être transmis par les corbeaux. Veuillez
						réessayer.
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-grid">
					<div className="form-group">
						<label className="form-label" htmlFor="playerName">
							Pseudo Joueur *
						</label>
						<input
							className="form-input"
							type="text"
							id="playerName"
							name="playerName"
							value={formData.playerName}
							onChange={handleChange}
							required
							disabled={isSubmitting}
							placeholder="Ex: Maître corbeau"
						/>
					</div>

					<div className="form-group">
						<label className="form-label" htmlFor="charName">
							Nom du Personnage *
						</label>
						<input
							className="form-input"
							type="text"
							id="charName"
							name="charName"
							value={formData.charName}
							onChange={handleChange}
							required
							disabled={isSubmitting}
							placeholder="Ex: Kaelen le Brave"
						/>
					</div>

					<div className="form-group">
						<label className="form-label" htmlFor="race">
							Race *
						</label>
						<select
							className="form-select"
							id="race"
							name="race"
							value={formData.race}
							onChange={handleChange}
							required
							disabled={isSubmitting}
						>
							<option value="" disabled>
								Choisir une ascendance...
							</option>
							{Object.values(Race).map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>
						{formData.race && RACE_LORE[formData.race] && (
							<div className="lore-box fade-in">
								<strong>Héritage : </strong>
								{RACE_LORE[formData.race]}
							</div>
						)}
					</div>

					<div className="form-group">
						<label className="form-label" htmlFor="charClass">
							Classe *
						</label>
						<select
							className="form-select"
							id="charClass"
							name="charClass"
							value={formData.charClass}
							onChange={handleChange}
							required
							disabled={isSubmitting}
						>
							<option value="" disabled>
								Choisir une voie...
							</option>
							{Object.values(CharacterClass).map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						{formData.charClass && CLASS_LORE[formData.charClass] && (
							<div className="lore-box fade-in">
								<strong>Voie du Héros : </strong>
								{CLASS_LORE[formData.charClass]}
							</div>
						)}
					</div>

					{/* Grille des Caractéristiques */}
					{formData.race && formData.charClass && (
						<div className="abilities-section fade-in">
							<h3 className="abilities-title">Caractéristiques</h3>
							<div className="abilities-grid">
								{(Object.keys(formData.abilities!) as AbilityName[]).map(
									(ability) => {
										const score = formData.abilities![ability];
										const mod = calculateModifier(score);

										return (
											<div
												key={ability}
												className={`ability-card ${autoFilledFields ? "auto-filled" : ""}`}
											>
												<Tooltip
													content={TOOLTIP_DEFINITIONS[ability as string]}
												>
													<span className="ability-name">
														{ABILITY_LABELS[ability]}
													</span>
												</Tooltip>
												<div className="ability-input-container">
													<input
														type="number"
														className="ability-input"
														value={score}
														onChange={(e) =>
															handleAbilityChange(ability, e.target.value)
														}
														min="3"
														max="20"
														disabled={isSubmitting}
													/>
												</div>
												<Tooltip
													content={TOOLTIP_DEFINITIONS.modifier}
													position="top"
												>
													<div
														className="ability-modifier"
														title="Modificateur"
													>
														{formatModifier(mod)}
													</div>
												</Tooltip>
											</div>
										);
									},
								)}
							</div>
						</div>
					)}

					{formData.charClass && (
						<>
							<div className="form-group full-width fade-in">
								<label className="form-label" htmlFor="features">
									Capacités de Classe
								</label>
								<div
									className={`features-display ${autoFilledFields ? "auto-filled" : ""}`}
								>
									<ul>
										{formData.features?.split("\n").map((feature, idx) => {
											const featureName = feature.split(" (")[0].trim();
											const description = FEATURE_DESCRIPTIONS[featureName];
											return (
												<li key={idx}>
													{description ? (
														<Tooltip content={description} position="top">
															<span
																style={{
																	cursor: "help",
																	borderBottom:
																		"2px dotted var(--color-gold-dark)",
																}}
															>
																{feature}
															</span>
														</Tooltip>
													) : (
														feature
													)}
												</li>
											);
										})}
									</ul>
								</div>
							</div>

							<div className="form-group full-width fade-in">
								<label className="form-label" htmlFor="equipment">
									Équipement de Départ
								</label>
								<textarea
									className={`form-textarea ${autoFilledFields ? "auto-filled" : ""}`}
									id="equipment"
									name="equipment"
									value={formData.equipment || ""}
									onChange={handleChange}
									disabled={isSubmitting}
									placeholder="Inventaire et armes..."
								/>
							</div>

							{formData.spells && (
								<div className="form-group full-width fade-in">
									<label className="form-label" htmlFor="spells">
										Grimoire /{" "}
										<Tooltip
											content={TOOLTIP_DEFINITIONS.cantrips}
											position="top"
										>
											Sorts mineurs
										</Tooltip>{" "}
										&{" "}
										<Tooltip
											content={TOOLTIP_DEFINITIONS.spellSlots}
											position="top"
										>
											Emplacements
										</Tooltip>
									</label>
									<div className="spells-container">
										{CLASS_DATA[formData.charClass as CharacterClass]
											?.spells && (
											<>
												{CLASS_DATA[formData.charClass as CharacterClass]!
													.spells!.knownCantrips > 0 && (
													<div className="spell-input-group">
														<span className="spell-group-title">
															Sorts Mineurs (Cantrips)
														</span>
														<SpellSelector
															availableSpells={
																CLASS_DATA[
																	formData.charClass as CharacterClass
																]!.spells!.spellSuggestions.cantrips
															}
															selectedSpells={formData.spells.cantrips}
															maxSelection={
																CLASS_DATA[
																	formData.charClass as CharacterClass
																]!.spells!.knownCantrips
															}
															onChange={(selected) =>
																handleSpellChange("cantrips", selected)
															}
															disabled={isSubmitting}
														/>
													</div>
												)}
												{CLASS_DATA[formData.charClass as CharacterClass]!
													.spells!.knownLevel1 > 0 && (
													<div className="spell-input-group">
														<span className="spell-group-title">Niveau 1</span>
														<SpellSelector
															availableSpells={
																CLASS_DATA[
																	formData.charClass as CharacterClass
																]!.spells!.spellSuggestions.level1
															}
															selectedSpells={formData.spells.level1}
															maxSelection={
																CLASS_DATA[
																	formData.charClass as CharacterClass
																]!.spells!.knownLevel1
															}
															onChange={(selected) =>
																handleSpellChange("level1", selected)
															}
															disabled={isSubmitting}
														/>
													</div>
												)}
											</>
										)}
									</div>
								</div>
							)}
						</>
					)}

					<div className="form-group full-width">
						<label className="form-label" htmlFor="appearance">
							Apparence
						</label>
						<textarea
							className="form-textarea"
							id="appearance"
							name="appearance"
							value={formData.appearance}
							onChange={handleChange}
							disabled={isSubmitting}
							placeholder="Traits distinctifs, cicatrices, aura générale..."
						/>
					</div>

					<div className="form-group full-width">
						<label className="form-label" htmlFor="temperament">
							Tempérament
						</label>
						<textarea
							className="form-textarea"
							id="temperament"
							name="temperament"
							value={formData.temperament}
							onChange={handleChange}
							disabled={isSubmitting}
							placeholder="Calme, colérique, joueur, mystérieux..."
						/>
					</div>

					<div className="form-group full-width">
						<label className="form-label" htmlFor="history">
							Histoire Courte
						</label>
						<textarea
							className="form-textarea"
							id="history"
							name="history"
							value={formData.history}
							onChange={handleChange}
							disabled={isSubmitting}
							placeholder="D'où venez-vous ? Qu'est-ce qui vous a poussé à partir à l'aventure ?"
						/>
					</div>

					<div className="form-group full-width">
						<label className="form-label" htmlFor="secret">
							Secret ou Peur
						</label>
						<textarea
							className="form-textarea"
							id="secret"
							name="secret"
							value={formData.secret}
							onChange={handleChange}
							disabled={isSubmitting}
							placeholder="Un lourd fardeau, une phobie irrationnelle..."
						/>
					</div>
				</div>

				<button type="submit" className="form-submit" disabled={isSubmitting}>
					{isSubmitting ? "Envoi par les corbeaux..." : "Sceller le Pacte"}
				</button>
			</form>
		</div>
	);
}
