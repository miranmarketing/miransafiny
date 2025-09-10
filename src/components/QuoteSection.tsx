import React from 'react'

const QuoteSection: React.FC = () => {
	return (
		<section id="quote" className="w-full bg-black text-white py-24">
			<div className="max-w-6xl mx-auto px-6 text-center">
				<div className="relative inline-block">
					<p className="relative text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
						<span className="relative">
							<span className="relative z-10">"TO BUILD AND SUPPORT VENTURES THAT SOLVE REAL-WORLD PROBLEMS."</span>
							<span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 md:h-4 w-0 bg-[#007BFF] animate-[wipe_1.6s_ease-out_forwards]" />
						</span>
					</p>
				</div>
				<p className="mt-4 text-xs md:text-sm font-bold tracking-widest">MIRAN SAFINY</p>
			</div>
			<style>{`@keyframes wipe{to{width:100%}}`}</style>
		</section>
	)
}

export default QuoteSection


