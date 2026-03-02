import React, { useState, useRef } from "react";
import "../styles/tooltip.css";

interface TooltipProps {
	content: string;
	children: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
	content,
	children,
	position = "bottom",
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const timeoutRef = useRef<number | null>(null);

	const showTooltip = () => {
		timeoutRef.current = window.setTimeout(() => {
			setIsVisible(true);
		}, 300);
	};

	const hideTooltip = () => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
		}
		setIsVisible(false);
	};

	return (
		<div
			className="tooltip-wrapper"
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onFocus={showTooltip}
			onBlur={hideTooltip}
			role="tooltip"
			aria-describedby="tooltip-content"
		>
			<span className="tooltip-trigger">{children}</span>
			{isVisible && (
				<div id="tooltip-content" className={`tooltip-box tooltip-${position}`}>
					{content}
				</div>
			)}
		</div>
	);
}
