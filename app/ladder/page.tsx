'use client'

import React, { useState } from 'react'
import LadderGame from '@/components/LadderGame'

const Home: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number>(2)
    const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2'])
    const [results, setResults] = useState<string[]>(['Result 1', 'Result 2'])

    const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value)
        setPlayerCount(count)
        setPlayers(Array(count).fill('').map((_, i) => `Player ${i + 1}`))
        setResults(Array(count).fill('').map((_, i) => `Result ${i + 1}`))
    }

    const handlePlayerNameChange = (index: number, name: string) => {
        const newPlayers = [...players]
        newPlayers[index] = name
        setPlayers(newPlayers)
    }

    const handleResultNameChange = (index: number, name: string) => {
        const newResults = [...results]
        newResults[index] = name
        setResults(newResults)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Ladder Game</h1>

                <div className="mb-8">
                    <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Players:
                    </label>
                    <input
                        type="number"
                        id="playerCount"
                        min="2"
                        max="10"
                        value={playerCount}
                        onChange={handlePlayerCountChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Players</h2>
                        {players.map((player, index) => (
                            <input
                                key={`player-${index}`}
                                type="text"
                                value={player}
                                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-3"
                                placeholder={`Player ${index + 1}`}
                            />
                        ))}
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Results</h2>
                        {results.map((result, index) => (
                            <input
                                key={`result-${index}`}
                                type="text"
                                value={result}
                                onChange={(e) => handleResultNameChange(index, e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-3"
                                placeholder={`Result ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto"> {/* overflow-x-auto 추가 */}
                    <LadderGame players={players} results={results} />
                </div>
            </div>
        </div>
    )
}

export default Home