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
} from "@dnd/core";
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
		appearance: "",
		temperament: "",
		history: "",
		secret: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	// Met à jour automatiquement les caractéristiques si la race et la classe sont sélectionnées
	useEffect(() => {
		if (formData.race && formData.charClass) {
			const autoAbilities = generateStandardArray(
				formData.race as Race,
				formData.charClass as CharacterClass,
			);
			setFormData((prev) => ({
				...prev,
				abilities: autoAbilities,
			}));
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
											<div key={ability} className="ability-card">
												<span className="ability-name">
													{ABILITY_LABELS[ability]}
												</span>
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
												<div className="ability-modifier" title="Modificateur">
													{formatModifier(mod)}
												</div>
											</div>
										);
									},
								)}
							</div>
						</div>
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
