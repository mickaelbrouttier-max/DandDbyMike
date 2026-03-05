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
	EQUIPMENT_DESCRIPTIONS,
	FEATURE_DESCRIPTIONS,
	RACE_LORE,
	CLASS_LORE,
} from "@dnd/core";
import Tooltip from "./Tooltip";
import MagicSection from "./MagicSection";
import "../styles/form.css";

// Remplacez 'YOUR_FORMSPREE_ID' par l'ID de votre formulaire Formspree
// qui est configuré pour envoyer à mickael.brouttier@gmail.com
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvndqzn";

export default function ConceptForm() {
	const [formData, setFormData] = useState<CharacterConcept>({
		playerFirstName: "",
		playerLastName: "",
		charName: "",
		charAge: "",
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
		startingLocation: "",
		reasonLocation: "",
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
			const raceLore = formData.race ? RACE_LORE[formData.race] : undefined;
			const hasSpells =
				!!classConfig?.spells ||
				(raceLore && (!!raceLore.spells || !!raceLore.spellOptions));

			setFormData((prev) => ({
				...prev,
				abilities: autoAbilities,
				features: classConfig?.features || "",
				equipment: classConfig?.equipment || "",
				spells: hasSpells
					? {
							cantrips: [],
							level1: [],
							preparedLevel1: [],
							racialSpells: [],
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation basique (HTML required gère déjà la majorité)
		if (
			!formData.playerFirstName ||
			!formData.playerLastName ||
			!formData.charName ||
			!formData.charAge ||
			!formData.race ||
			!formData.charClass
		) {
			alert(
				"Veuillez remplir les champs obligatoires (Prénom Joueur, Nom Joueur, Nom Personnage, Âge Personnage, Race, Classe).",
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
					"Prénom Joueur": formData.playerFirstName,
					"Nom Joueur": formData.playerLastName,
					Âge: formData.charAge,
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
						? `Sort Raciaux: ${formData.spells.racialSpells?.filter(Boolean).join(", ") || "Aucun"} | Cantrips: ${formData.spells.cantrips.filter(Boolean).join(", ")} | Connus NIV 1: ${formData.spells.level1.filter(Boolean).join(", ")} | Préparés: ${formData.spells.preparedLevel1?.filter(Boolean).join(", ") || ""}`
						: "Non applicable",
					Apparence: formData.appearance,
					Tempérament: formData.temperament,
					Histoire: formData.history,
					"Lieu de départ (Barzhûr)": formData.startingLocation,
					"Raison de la présence": formData.reasonLocation,
					"Secret / Peur": formData.secret,
				}),
			});

			if (response.ok) {
				setSubmitStatus("success");
				setFormData({
					playerFirstName: "",
					playerLastName: "",
					charName: "",
					charAge: "",
					race: "",
					charClass: "",
					appearance: "",
					temperament: "",
					history: "",
					startingLocation: "",
					reasonLocation: "",
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

	const resetForm = () => {
		setSubmitStatus("idle");
		setFormData({
			playerFirstName: "",
			playerLastName: "",
			charName: "",
			charAge: "",
			race: "",
			charClass: "",
			abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
			features: "",
			equipment: "",
			spells: undefined,
			appearance: "",
			temperament: "",
			history: "",
			startingLocation: "",
			reasonLocation: "",
			secret: "",
		});
	};

	const renderEquipmentWithTooltips = (text: string): React.ReactNode => {
		let elements: React.ReactNode[] = [text];

		Object.entries(EQUIPMENT_DESCRIPTIONS).forEach(
			([equipName, description]) => {
				elements = elements.flatMap((part, i): React.ReactNode[] => {
					if (typeof part !== "string") return [part];

					const regex = new RegExp(`(${equipName})`, "gi");
					const pieces = part.split(regex);

					return pieces.map((piece, j): React.ReactNode => {
						if (piece.toLowerCase() === equipName.toLowerCase()) {
							return (
								<Tooltip
									key={`${equipName}-${i}-${j}`}
									content={description}
									position="top"
								>
									<span
										style={{
											cursor: "help",
											borderBottom: "1px dotted var(--color-gold-dark)",
										}}
									>
										{piece}
									</span>
								</Tooltip>
							);
						}
						return piece;
					});
				});
			},
		);

		return <>{elements}</>;
	};

	return (
		<div className="parchment-container">
			<div className="form-header">
				<h1>Concept de Personnage</h1>
				<p>Phase Prélude - Registre des Héros</p>
			</div>

			{submitStatus === "success" && (
				<div className="modal-overlay fade-in">
					<div className="medieval-modal modal-content flex-center">
						<div className="seal-icon">📜</div>
						<h2>Votre destin est scellé !</h2>
						<p>
							Les archives ancestrales ont réceptionné vos actes de naissance.
							Vos choix sont désormais gravés dans la roche.
						</p>
						<button type="button" className="btn-seal" onClick={resetForm}>
							Nouvelle Légende
						</button>
					</div>
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
						<label className="form-label" htmlFor="playerFirstName">
							Prénom Joueur *
						</label>
						<input
							className="form-input"
							type="text"
							id="playerFirstName"
							name="playerFirstName"
							value={formData.playerFirstName}
							onChange={handleChange}
							required
							disabled={isSubmitting}
							placeholder="Ex: Jean"
						/>
					</div>

					<div className="form-group">
						<label className="form-label" htmlFor="playerLastName">
							Nom Joueur *
						</label>
						<input
							className="form-input"
							type="text"
							id="playerLastName"
							name="playerLastName"
							value={formData.playerLastName}
							onChange={handleChange}
							required
							disabled={isSubmitting}
							placeholder="Ex: Dupont"
						/>
					</div>

					<div className="form-group">
						<label className="form-label" htmlFor="charAge">
							Âge du Personnage *
						</label>
						<input
							className="form-input"
							type="number"
							id="charAge"
							name="charAge"
							value={formData.charAge}
							onChange={handleChange}
							required
							min="1"
							max="120"
							disabled={isSubmitting}
							placeholder="Ex: 25"
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
								<span>{RACE_LORE[formData.race]!.description}</span>
								<ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
									<li>
										<span className="mechanical-highlight">Bonus :</span>{" "}
										<span className="mechanical-highlight">
											{RACE_LORE[formData.race]!.bonuses}
										</span>
									</li>
									<li>
										<span className="mechanical-highlight">Capacités :</span>{" "}
										{RACE_LORE[formData.race]!.abilities.map((ability, idx) => {
											const desc = FEATURE_DESCRIPTIONS[ability];
											return (
												<span key={`race-ability-${ability}`}>
													{desc ? (
														<Tooltip content={desc} position="top">
															<span
																style={{
																	cursor: "help",
																	borderBottom:
																		"1px dotted var(--color-gold-dark)",
																}}
															>
																{ability}
															</span>
														</Tooltip>
													) : (
														ability
													)}
													{idx < RACE_LORE[formData.race]!.abilities.length - 1
														? ", "
														: ""}
												</span>
											);
										})}
									</li>
									{RACE_LORE[formData.race]!.spells && (
										<li>
											<span className="mechanical-highlight">
												Magie innée :
											</span>{" "}
											{RACE_LORE[formData.race]!.spells}
										</li>
									)}
								</ul>
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
								<span>{CLASS_LORE[formData.charClass]!.description}</span>
								<ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
									<li>
										<span className="mechanical-highlight">Avantage :</span>{" "}
										{CLASS_LORE[formData.charClass]!.advantage}
									</li>
									<li>
										<span className="mechanical-highlight">
											Compétences clés :
										</span>{" "}
										<span className="mechanical-highlight">
											{CLASS_LORE[formData.charClass]!.keyStats}
										</span>
									</li>
									<li>
										<span className="mechanical-highlight">
											Équipement signature :
										</span>{" "}
										{CLASS_LORE[formData.charClass]!.equipment}
									</li>
								</ul>
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
														readOnly
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
								<label className="form-label">Équipement de Départ</label>
								<div
									className={`features-display ${autoFilledFields ? "auto-filled" : ""}`}
								>
									<ul>
										{formData.equipment?.split("\n").map((item, idx) => (
											<li key={idx}>
												{renderEquipmentWithTooltips(
													item.replace(/^- /, "").trim(),
												)}
											</li>
										))}
									</ul>
								</div>
							</div>

							{(formData.spells ||
								(formData.race &&
									RACE_LORE[formData.race as Race]?.spells)) && (
								<div className="form-group full-width fade-in">
									<MagicSection
										charClass={formData.charClass as CharacterClass}
										race={formData.race as Race}
										abilities={formData.abilities}
										spells={formData.spells}
										onChange={(spells) =>
											setFormData((prev) => ({ ...prev, spells }))
										}
										disabled={isSubmitting}
									/>
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
							Votre Histoire
						</label>
						<p
							style={{
								marginBottom: "0.5rem",
								fontSize: "0.9rem",
								fontStyle: "italic",
								opacity: 0.8,
							}}
						>
							À la fin de l'histoire que vous aurez inventée, vos pas vous
							mènent dans le village de Barzhûr, une bourgade moyenne de plus
							d'un millier d'habitants.
						</p>
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

					<div className="form-group">
						<label className="form-label" htmlFor="startingLocation">
							Où vous trouvez-vous à Barzhûr ? *
						</label>
						<select
							className="form-select"
							id="startingLocation"
							name="startingLocation"
							value={formData.startingLocation}
							onChange={handleChange}
							required
							disabled={isSubmitting}
						>
							<option value="" disabled>
								Choisir un emplacement...
							</option>
							<option value="À l'auberge locale">À l'auberge locale</option>
							<option value="Aux portes du village">
								Aux portes du village
							</option>
							<option value="Dans les rues de Barzhûr">
								Dans les rues de Barzhûr
							</option>
							<option value="Chez le forgeron ou artisan">
								Chez le forgeron ou artisan
							</option>
							<option value="Au campement des voyageurs">
								Au campement des voyageurs
							</option>
							<option value="Dans le cimetière">Dans le cimetière</option>
							<option value="Dans les bois environnants">
								Dans les bois environnants
							</option>
							<option value="Dans l'église">Dans l'église</option>
							<option value="Sur la place du marché">
								Sur la place du marché
							</option>
						</select>
					</div>

					<div className="form-group full-width">
						<label className="form-label" htmlFor="reasonLocation">
							Pourquoi ici ? *
						</label>
						<textarea
							className="form-textarea"
							id="reasonLocation"
							name="reasonLocation"
							value={formData.reasonLocation}
							onChange={handleChange}
							required
							disabled={isSubmitting}
							placeholder="Pourquoi étiez vous dans cette partie du village ?"
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
