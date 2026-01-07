import React from "react";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
	return (
		<div className={`max-w-4xl mx-auto px-6 md:px-12 ${className}`}>
			{children}
		</div>
	);
}
