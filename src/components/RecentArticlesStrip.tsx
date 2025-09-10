import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'

const RecentArticlesStrip: React.FC = () => {
	const [items, setItems] = useState<Article[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchLatest = async () => {
			const { data } = await supabase
				.from('articles')
				.select('*')
				.order('published_at', { ascending: false })
				.limit(2)
			setItems(data || [])
		}
		fetchLatest()
	}, [])

	return (
		<section className="w-full bg-black text-white" aria-label="Recent Articles">
			<div className="w-full bg-[#007BFF] text-white">
				<div className="max-w-6xl mx-auto px-6 py-4">
					<h3 className="text-xl md:text-2xl font-black tracking-widest">RECENT ARTICLES</h3>
				</div>
			</div>
			<div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
				{items.map((a) => (
					<article
						key={a.id}
						className="bg-white text-black p-4 cursor-pointer"
						onClick={() => navigate(`/articles/${a.slug}`)}
					>
						<div className="aspect-[16/9] bg-black/10 overflow-hidden">
							{a.image_url ? (
								<img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
							) : null}
						</div>
						<div className="pt-4">
							<p className="text-xs font-bold opacity-70">{a.author || 'ARTICLE'}</p>
							<h4 className="font-black text-2xl mt-2">{a.title}</h4>
							{a.excerpt ? <p className="text-base mt-3">{a.excerpt}</p> : null}
							{(a as any).source ? <p className="text-xs mt-3 opacity-70">{(a as any).source}</p> : null}
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default RecentArticlesStrip


