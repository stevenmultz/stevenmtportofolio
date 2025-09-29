'use client';

import React, { useState, useEffect } from 'react';

const AsciiTetris = () => {
    const [board, setBoard] = useState(Array(18).fill(0).map(() => Array(10).fill(' ')));
    const [score, setScore] = useState(0);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setBoard(prevBoard => {
                const newBoard = prevBoard.map(row => [...row]);
                // Simple falling animation simulation
                for (let y = newBoard.length - 1; y > 0; y--) {
                    for (let x = 0; x < newBoard[y].length; x++) {
                        if (newBoard[y][x] === ' ' && newBoard[y - 1][x] === '▓') {
                            newBoard[y][x] = '▓';
                            newBoard[y - 1][x] = ' ';
                        }
                    }
                }
                // Randomly add new pieces at the top
                if (Math.random() < 0.1) {
                    const x = Math.floor(Math.random() * (newBoard[0].length - 2));
                    newBoard[0][x] = '▓';
                    newBoard[0][x+1] = '▓';
                    newBoard[1][x] = '▓';
                    newBoard[1][x+1] = '▓';
                }
                return newBoard;
            });
        }, 200);
        return () => clearInterval(gameLoop);
    }, []);

    return (
        <div className="game-container">
            <pre className="game-board">
                {` SCORE: ${score}\n`}
                {'╔' + '═'.repeat(20) + '╗\n'}
                {board.map((row) => `║${row.join('')}${row.join('')}║\n`).join('')}
                {'╚' + '═'.repeat(20) + '╝'}
            </pre>
            <div className="game-footer">[ Press 'B' to Exit ]</div>
        </div>
    );
};

export default AsciiTetris;