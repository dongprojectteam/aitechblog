'use client'

import React, { useState, useEffect, useRef } from 'react'

interface LadderGameProps {
    players: string[]
    results: string[]
}

interface PathSegment {
    x: number
    y: number
}

const playerColors = [
    '#ed8936', // 주황색
    '#48bb78', // 녹색
    '#4299e1', // 파란색
    '#9f7aea', // 보라색
    '#f56565', // 빨간색
    '#38b2ac', // 청록색
    '#ed64a6', // 분홍색
    '#ecc94b', // 노란색
    '#667eea', // 인디고
    '#fc8181', // 연한 빨간색
]
const LadderGame: React.FC<LadderGameProps> = ({ players, results }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [ladderLines, setLadderLines] = useState<boolean[][]>([])
    const [playerResults, setPlayerResults] = useState<string[]>([])
    const [showLadder, setShowLadder] = useState(false)
    const [animationProgress, setAnimationProgress] = useState<number[]>([])
    const [paths, setPaths] = useState<PathSegment[][]>([])
    const [showModal, setShowModal] = useState(false);
    const [reCalculate, setReCalculate] = useState(false);
    const [prepared, setPrepared] = useState(false);

    const resetGame = () => {
        generateLadder()
        setPlayerResults(Array(players.length).fill(''))
        setShowLadder(false)
        setAnimationProgress([])
        setPaths([])
        setReCalculate(false)
    }

    useEffect(() => {
        resetGame()
    }, [players, results])

    useEffect(() => {
        drawCanvas()
    }, [showLadder, ladderLines, playerResults, players, results, animationProgress])

    const showResultsModal = () => {
        setShowModal(true);
    };

    const generateLadder = () => {
        const lines: boolean[][] = []
        for (let i = 0; i < players.length - 1; i++) {
            const column: boolean[] = []
            for (let j = 0; j < 10; j++) {
                if (j === 0) {
                    column.push(Math.random() < 0.5)
                } else {
                    const prevRowHasLine = j > 0 && column[j - 1]
                    const adjacentColumnHasLine = (i > 0 && lines[i - 1][j]) || (i < players.length - 2 && lines[i + 1] && lines[i + 1][j])

                    if (prevRowHasLine || adjacentColumnHasLine) {
                        column.push(false)
                    } else {
                        column.push(Math.random() < 0.3)
                    }
                }
            }
            lines.push(column)
        }

        // 연속된 수평선 제거
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < lines.length - 1; i++) {
                if (lines[i][j] && lines[i + 1][j]) {
                    lines[i + 1][j] = false 
                }
            }
        }

        // 각 라인별 마지막 칸은 모두 false 처리
        for (let i = 0; i < lines.length; i++) {
            lines[i][lines[i].length - 1] = false
        }

        setLadderLines(lines)
    }

    const drawCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height
        const columnWidth = width / (players.length - 1)
        const rowHeight = height / 12

        // Set background
        ctx.fillStyle = '#f0f4f8'
        ctx.fillRect(0, 0, width, height)

        // Set font for player names and results
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#2c5282'

        // Draw player names
        players.forEach((player, index) => {
            let x = index * columnWidth
            const margin = getMargin(ctx, player)

            if (index === 0) x = margin
            if (index === players.length - 1) x = width - margin

            ctx.fillText(player, x, 30, columnWidth - 10)
        })

        if (showLadder) {
            // Draw vertical lines
            ctx.beginPath()
            for (let i = 0; i < players.length; i++) {
                let x = i * columnWidth
                const margin = getMargin(ctx, players[i])

                if (i === 0) x = margin
                if (i === players.length - 1) x = width - margin

                ctx.moveTo(x, rowHeight)
                ctx.lineTo(x, height - rowHeight)
            }
            ctx.strokeStyle = '#a0aec0'
            ctx.lineWidth = 2
            ctx.stroke()

            // Draw horizontal lines
            ctx.beginPath()
            for (let i = 0; i < ladderLines.length; i++) {
                for (let j = 0; j < ladderLines[i].length - 1; j++) {
                    if (ladderLines[i][j]) {
                        const y = (j + 2) * rowHeight
                        let startX = i * columnWidth
                        let endX = (i + 1) * columnWidth

                        const startMargin = getMargin(ctx, players[i])
                        const endMargin = getMargin(ctx, players[i + 1])

                        if (i === 0) startX = startMargin
                        if (i === ladderLines.length - 1) endX = width - endMargin

                        ctx.moveTo(startX, y)
                        ctx.lineTo(endX, y)
                    }
                }
            }
            ctx.strokeStyle = '#4299e1'
            ctx.lineWidth = 3
            ctx.stroke()

            // Draw animated paths
            paths.forEach((path, index) => {
                const progress = animationProgress[index] || 0
                const segmentsToDraw = Math.floor(progress * path.length)

                ctx.beginPath()
                ctx.moveTo(path[0].x, path[0].y)
                for (let i = 1; i < segmentsToDraw; i++) {
                    ctx.lineTo(path[i].x, path[i].y)
                }
                ctx.strokeStyle = playerColors[index % playerColors.length]
                ctx.lineWidth = 5
                ctx.stroke()
            })

            // Draw results
            playerResults.forEach((result, index) => {
                let x = index * columnWidth
                const margin = getMargin(ctx, result)

                if (index === 0) x = margin
                if (index === playerResults.length - 1) x = width - margin

                ctx.fillText(result, x, height - 30, columnWidth - 10)
            })
        } else {
            ctx.fillStyle = '#4a5568'
            ctx.font = 'italic 20px Arial'
            ctx.fillText('Click "Calculate Results" to show the ladder', width / 2, height / 2)
        }

        setPrepared(true)
    }

    const getMargin = (ctx: CanvasRenderingContext2D, text: string): number => {
        const textWidth = ctx.measureText(text).width;
        return Math.max(20, textWidth / 2 + 5);
    }

    const calculateResults = async () => {
        setShowLadder(true)
        const newPaths: PathSegment[][] = []
        const newResults = [...playerResults]

        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        const width = canvas.width
        const height = canvas.height
        const columnWidth = width / (players.length - 1)
        const rowHeight = height / 12

        ctx.font = 'bold 16px Arial' // 텍스트 측정을 위해 폰트 설정

        for (let i = 0; i < players.length; i++) {
            let currentPosition = i
            const path: PathSegment[] = []

            let x = i * columnWidth
            const startMargin = getMargin(ctx, players[i])
            const endMargin = getMargin(ctx, players[players.length - 1])

            if (i === 0) x = startMargin
            if (i === players.length - 1) x = width - endMargin

            path.push({ x, y: rowHeight })

            for (let j = 0; j < ladderLines[0].length; j++) {
                const y = (j + 2) * rowHeight
                if (currentPosition > 0 && ladderLines[currentPosition - 1] && ladderLines[currentPosition - 1][j]) {
                    path.push({ x, y })
                    currentPosition--
                    x = currentPosition * columnWidth
                    if (currentPosition === 0) x = getMargin(ctx, players[currentPosition])
                    path.push({ x, y })
                } else if (currentPosition < ladderLines.length && ladderLines[currentPosition] && ladderLines[currentPosition][j]) {
                    path.push({ x, y })
                    currentPosition++
                    x = currentPosition * columnWidth
                    if (currentPosition === players.length - 1) x = width - getMargin(ctx, players[currentPosition])
                    path.push({ x, y })
                } else {
                    path.push({ x, y })
                }
            }

            path.push({ x, y: height - rowHeight })
            newPaths.push(path)
            newResults[i] = results[currentPosition]

            setPaths(prevPaths => [...prevPaths, path])
            await animatePath(i, path.length)
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        setPlayerResults(newResults)
        showResultsModal();
        setReCalculate(true)
    }

    const animatePath = async (playerIndex: number, pathLength: number) => {
        for (let i = 0; i <= pathLength; i++) {
            await new Promise(resolve => setTimeout(resolve, 50)) // 50ms로 증가
            setAnimationProgress(prev => {
                const newProgress = [...prev]
                newProgress[playerIndex] = i / pathLength
                return newProgress
            })
        }
    }

    const ResultsModal = ({ isOpen, onClose, players, playerResults }:
        { isOpen: boolean, onClose: () => void, players: string[], playerResults: string[] }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3 text-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Game Results</h3>
                        <div className="mt-2 px-7 py-3">
                            {players.map((player, index) => (
                                <p key={index} className="text-sm text-gray-500">
                                    {player}: {playerResults[index]}
                                </p>
                            ))}
                        </div>
                        <div className="items-center px-4 py-3">
                            <button
                                id="ok-btn"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={onClose}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center">
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="rounded-lg shadow-lg mb-4"
            />
            <button
                onClick={reCalculate ? resetGame : calculateResults}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                disabled={showLadder && !reCalculate && prepared}
            >
                {reCalculate ? 'Redraw Ladder' : 'Show Results'}
            </button>

            <ResultsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                players={players}
                playerResults={playerResults}
            />
        </div>
    )
}

export default LadderGame