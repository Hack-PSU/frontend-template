export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="subpage-bg min-h-screen pt-24 md:pt-28 lg:pt-32">
			{children}
		</div>
	);
}
