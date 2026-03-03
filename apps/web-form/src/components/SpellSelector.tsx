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

	return (
		<div className="spell-selector">
			<div className={`spell-limits ${errorShake ? "error-shake" : ""}`}>
				Sélectionnés : {selectedSpells.length} / {maxSelection}
			</div>

			<div className="spell-grid">
				{availableSpells.map((spell) => {
					const isSelected = selectedSpells.includes(spell);
					const description = SPELL_DESCRIPTIONS[spell];

					return (
						<label
							key={spell}
							className={`spell-checkbox-label ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
						>
							<input
								type="checkbox"
								className="spell-hidden-checkbox"
								checked={isSelected}
								onChange={() => handleToggle(spell)}
								disabled={disabled}
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
