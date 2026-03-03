import { useState } from "react";
import Tooltip from "./Tooltip";
import { SPELL_DESCRIPTIONS } from "@dnd/core";
import "../styles/spells.css";

interface SpellSelectorProps {
	availableSpells: string[];
	selectedSpells: string[];
	maxSelection: number;
	onChange: (selected: string[]) => void;
	disabled?: boolean;
}

export default function SpellSelector({
	availableSpells,
	selectedSpells,
	maxSelection,
	onChange,
	disabled = false,
}: SpellSelectorProps) {
	const [errorShake, setErrorShake] = useState(false);

	const handleToggle = (spell: string) => {
		if (disabled) return;

		const isSelected = selectedSpells.includes(spell);

		if (isSelected) {
			onChange(selectedSpells.filter((s) => s !== spell));
		} else {
			if (selectedSpells.length >= maxSelection) {
				// Trigger the error animation
				setErrorShake(true);
				setTimeout(() => setErrorShake(false), 500);
			} else {
				onChange([...selectedSpells, spell]);
			}
		}
	};

	const limitReached = selectedSpells.length >= maxSelection;

	return (
		<div className="spell-selector">
			<div
				className="spell-header-row"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div
					className={`spell-limit-msg ${errorShake ? "error-shake" : ""}`}
					style={{
						fontSize: "0.85rem",
						fontStyle: "italic",
						opacity: errorShake ? 1 : 0.6,
						transition: "opacity 0.3s",
						color: errorShake ? "var(--color-red-wax)" : "inherit",
					}}
				>
					{limitReached
						? `Plafond atteint : votre esprit ne peut contenir que ${maxSelection} sorts de ce rang.`
						: ""}
				</div>
				<div className={`spell-limits ${errorShake ? "error-shake" : ""}`}>
					Sélectionnés : {selectedSpells.length} / {maxSelection}
				</div>
			</div>

			<div className="spell-grid">
				{availableSpells.map((spell) => {
					const isSelected = selectedSpells.includes(spell);
					const isItemDisabled = disabled || (!isSelected && limitReached);
					const description = SPELL_DESCRIPTIONS[spell];

					return (
						<label
							key={spell}
							className={`spell-checkbox-label ${isSelected ? "selected" : ""} ${isItemDisabled ? "disabled" : ""}`}
						>
							<input
								type="checkbox"
								className="spell-hidden-checkbox"
								checked={isSelected}
								onChange={() => handleToggle(spell)}
								disabled={isItemDisabled}
							/>
							<span className="spell-custom-checkbox"></span>
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
	);
}
