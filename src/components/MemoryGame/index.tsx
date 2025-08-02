"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Card {
	id: number;
	imageUrl: string;
	isFlipped: boolean;
	isMatched: boolean;
}

interface MemoryGameProps {
	isOpen: boolean;
	onClose: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ isOpen, onClose }) => {
	const [cards, setCards] = useState<Card[]>([]);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);
	const [moves, setMoves] = useState(0);
	const [gameWon, setGameWon] = useState(false);
	const [difficulty, setDifficulty] = useState<12 | 24 | 36 | 100>(12);
	const [isGameStarted, setIsGameStarted] = useState(false);

	// Beach-themed images from f25 folder
	const gameImages = [
		"/f25/1.png", // Number 1
		"/f25/2.png", // Starfish
		"/f25/3.png", // Small starfish
		"/f25/4.png", // Fish
		"/f25/5.png", // Crab
		"/f25/6.png", // Shell
		"/f25/ball.png", // Beach ball
		"/f25/beach-towel.png", // Beach towel
		"/f25/chill_hacky.png", // Chill hacky
		"/f25/deepfish.png", // Deep fish
		"/f25/fish.png", // Fish
		"/f25/hacky_diver.png", // Hacky diver
		"/f25/starfish.png", // Green starfish
		"/f25/starfish-orange.png", // Orange starfish
		"/f25/surfboard.png", // Surfboard
	];

	const initializeGame = useCallback(() => {
		const numPairs = difficulty / 2;
		const availableImages = gameImages.length;
		
		// If we need more pairs than available images, repeat images
		const selectedImages: string[] = [];
		for (let i = 0; i < numPairs; i++) {
			selectedImages.push(gameImages[i % availableImages]);
		}
		
		// Create pairs of cards
		const cardPairs = selectedImages.flatMap((image, index) => [
			{
				id: index * 2,
				imageUrl: image,
				isFlipped: false,
				isMatched: false,
			},
			{
				id: index * 2 + 1,
				imageUrl: image,
				isFlipped: false,
				isMatched: false,
			},
		]);

		// Shuffle cards using Fisher-Yates algorithm for better randomization
		const shuffledCards = [...cardPairs];
		for (let i = shuffledCards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
		}
		
		setCards(shuffledCards);
		setFlippedCards([]);
		setMoves(0);
		setGameWon(false);
		setIsGameStarted(true);
	}, [difficulty]);

	const handleCardClick = (cardId: number) => {
		if (flippedCards.length === 2) return;
		if (flippedCards.includes(cardId)) return;
		if (cards.find(card => card.id === cardId)?.isMatched) return;

		const newFlippedCards = [...flippedCards, cardId];
		setFlippedCards(newFlippedCards);

		// Update card flip state
		setCards(prev => prev.map(card => 
			card.id === cardId ? { ...card, isFlipped: true } : card
		));

		if (newFlippedCards.length === 2) {
			setMoves(prev => prev + 1);
			
			const [firstCardId, secondCardId] = newFlippedCards;
			const firstCard = cards.find(card => card.id === firstCardId);
			const secondCard = cards.find(card => card.id === secondCardId);

			if (firstCard?.imageUrl === secondCard?.imageUrl) {
				// Match found
				setTimeout(() => {
					setCards(prev => prev.map(card => 
						card.id === firstCardId || card.id === secondCardId
							? { ...card, isMatched: true }
							: card
					));
					setFlippedCards([]);
				}, 1000);
			} else {
				// No match - flip back after delay
				setTimeout(() => {
					setCards(prev => prev.map(card => 
						card.id === firstCardId || card.id === secondCardId
							? { ...card, isFlipped: false }
							: card
					));
					setFlippedCards([]);
				}, 1000);
			}
		}
	};

	// Check for game completion
	useEffect(() => {
		if (cards.length > 0 && cards.every(card => card.isMatched)) {
			setGameWon(true);
		}
	}, [cards]);

	const resetGame = () => {
		setIsGameStarted(false);
		setGameWon(false);
	};

	const getGridClass = () => {
		switch (difficulty) {
			case 12: return "grid-cols-4"; // 3x4 grid
			case 24: return "grid-cols-6"; // 4x6 grid
			case 36: return "grid-cols-6"; // 6x6 grid
			case 100: return "grid-cols-10"; // 10x10 grid
			default: return "grid-cols-4";
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-hidden"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			>
				<motion.div
					className="relative w-full max-w-6xl max-h-full bg-gradient-to-b from-[#B1E8FF] to-[#84cefe] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.5, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Scrollable Content */}
					<div className="overflow-y-auto flex-1 p-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<h2 
							className="text-3xl font-bold text-[#215172]"
							style={{ fontFamily: "Monomaniac One, monospace" }}
						>
							 Memory Match 
						</h2>
						<button
							onClick={onClose}
							className="text-[#215172] hover:text-[#00DAB7] text-2xl font-bold"
						>
							✕
						</button>
					</div>

					{!isGameStarted ? (
						/* Difficulty Selection */
						<div className="text-center">
							<h3 className="text-xl font-bold text-[#215172] mb-4">
								Choose your difficulty:
							</h3>
							<div className="grid grid-cols-2 gap-4 mb-6">
								{[
									{ pairs: 12, label: "Easy (12 cards)" },
									{ pairs: 24, label: "Medium (24 cards)" },
									{ pairs: 36, label: "Hard (36 cards)" },
									{ pairs: 100, label: "Expert (100 cards)" },
								].map(({ pairs, label }) => (
									<button
										key={pairs}
										onClick={() => setDifficulty(pairs as 12 | 24 | 36 | 100)}
										className={`p-4 rounded-xl font-bold transition-all duration-200 ${
											difficulty === pairs
												? "bg-[#00DAB7] text-white shadow-lg"
												: "bg-white text-[#215172] hover:bg-[#00DAB7] hover:text-white"
										}`}
									>
										{label}
									</button>
								))}
							</div>
							<button
								onClick={initializeGame}
								className="px-8 py-3 bg-[#ff6b35] text-white font-bold rounded-xl hover:scale-105 transition-transform duration-200"
							>
								Start Game!
							</button>
						</div>
					) : (
						/* Game Board */
						<div>
							{/* Game Stats */}
							<div className="flex justify-between items-center mb-6">
								<div className="text-[#215172] font-bold">
									Moves: {moves}
								</div>
								<button
									onClick={resetGame}
									className="px-4 py-2 bg-[#ff6b35] text-white font-bold rounded-lg hover:scale-105 transition-transform duration-200"
								>
									New Game
								</button>
							</div>

							{/* Cards Grid */}
							<div className={`grid ${getGridClass()} gap-2 md:gap-4 mb-6 ${
								difficulty === 100 ? 'max-h-96 overflow-y-auto' : ''
							}`}>
								{cards.map((card) => (
									<motion.div
										key={card.id}
										className={`relative cursor-pointer ${
											difficulty === 100 
												? 'aspect-square w-8 h-8 md:w-12 md:h-12' 
												: 'aspect-square'
										}`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => handleCardClick(card.id)}
									>
										<div className="w-full h-full relative">
											{/* Card Back */}
											<motion.div
												className={`absolute inset-0 bg-[#215172] flex items-center justify-center shadow-lg ${
													difficulty === 100 ? 'rounded-md' : 'rounded-xl'
												}`}
												animate={{
													rotateY: card.isFlipped || card.isMatched ? 180 : 0
												}}
												transition={{ duration: 0.3 }}
												style={{
													backfaceVisibility: "hidden",
													zIndex: card.isFlipped || card.isMatched ? 1 : 2
												}}
											>
												<div className={`${
													difficulty === 100 ? 'text-xs' : 'text-4xl'
												}`}></div>
											</motion.div>
											
											{/* Card Front */}
											<motion.div
												className={`absolute inset-0 bg-white shadow-lg ${
													difficulty === 100 ? 'rounded-md p-0.5' : 'rounded-xl p-2'
												}`}
												animate={{
													rotateY: card.isFlipped || card.isMatched ? 0 : -180
												}}
												transition={{ duration: 0.3 }}
												style={{
													backfaceVisibility: "hidden",
													zIndex: card.isFlipped || card.isMatched ? 2 : 1
												}}
											>
												<Image
													src={card.imageUrl}
													alt="Memory card"
													fill
													className={`object-contain ${
														difficulty === 100 ? 'p-0.5' : 'p-1'
													}`}
												/>
											</motion.div>
										</div>
									</motion.div>
								))}
							</div>

							{/* Win Message */}
							{gameWon && (
								<motion.div
									className="text-center p-6 bg-[#00DAB7] text-white rounded-xl"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									<h3 className="text-2xl font-bold mb-2">🎉 You Won! 🎉</h3>
									<p className="text-lg">Completed in {moves} moves!</p>
									<button
										onClick={resetGame}
										className="mt-4 px-6 py-2 bg-white text-[#00DAB7] font-bold rounded-lg hover:scale-105 transition-transform duration-200"
									>
										Play Again
									</button>
								</motion.div>
							)}
						</div>
					)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default MemoryGame;