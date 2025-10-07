'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Konfigurasi Game
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;

// Bentuk-bentuk balok Tetris (Tetromino)
const TETROMINOS: { [key: string]: { shape: number[][], color: string } } = {
    'I': { shape: [[1, 1, 1, 1]], color: 'cyan' },
    'J': { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' },
    'L': { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' },
    'O': { shape: [[1, 1], [1, 1]], color: 'yellow' },
    'S': { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
    'T': { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
    'Z': { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
};
const TETROMINO_KEYS = Object.keys(TETROMINOS);

type Command = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK' | null;

// Tipe untuk props
interface AsciiTetrisProps {
    command: Command;
    onCommandProcessed: () => void;
    onGameOver: (score: number) => void;
}

const AsciiTetris: React.FC<AsciiTetrisProps> = ({ command, onCommandProcessed, onGameOver }) => {
    const [board, setBoard] = useState(() => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    const [piece, setPiece] = useState(generateNewPiece());
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    function generateNewPiece() {
        const type = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
        const newPiece = TETROMINOS[type];
        return {
            shape: newPiece.shape,
            x: Math.floor(BOARD_WIDTH / 2) - 1,
            y: 0,
            color: newPiece.color
        };
    }
    
    const checkCollision = useCallback((p: typeof piece, b: typeof board) => {
        for (let y = 0; y < p.shape.length; y++) {
            for (let x = 0; x < p.shape[y].length; x++) {
                if (p.shape[y][x] !== 0) {
                    const newY = p.y + y;
                    const newX = p.x + x;
                    if (newY >= BOARD_HEIGHT || newX < 0 || newX >= BOARD_WIDTH || (b[newY] && b[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []);

    const resetGame = useCallback(() => {
        const newBoard = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
        setBoard(newBoard);
        setPiece(generateNewPiece());
        setScore(0);
        setIsGameOver(false);
    }, []);

    useEffect(() => {
        if (isGameOver) {
            onGameOver(score);
            return;
        }

        const gameInterval = setInterval(() => {
            const nextPiece = { ...piece, y: piece.y + 1 };
            if (checkCollision(nextPiece, board)) {
                const newBoard = board.map(row => [...row]);
                piece.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            newBoard[piece.y + y][piece.x + x] = piece.color;
                        }
                    });
                });

                // Cek dan hapus baris yang penuh
                let linesCleared = 0;
                for (let y = newBoard.length - 1; y >= 0; y--) {
                    if (newBoard[y].every(cell => cell !== 0)) {
                        newBoard.splice(y, 1);
                        linesCleared++;
                    }
                }
                if (linesCleared > 0) {
                    const newRows = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));
                    newBoard.unshift(...newRows);
                    setScore(prev => prev + linesCleared * 100);
                }

                setBoard(newBoard);
                const newPiece = generateNewPiece();

                if (checkCollision(newPiece, newBoard)) {
                    setIsGameOver(true);
                } else {
                    setPiece(newPiece);
                }
            } else {
                setPiece(nextPiece);
            }
        }, 800); // Kecepatan jatuh

        return () => clearInterval(gameInterval);
    }, [piece, board, isGameOver, checkCollision, onGameOver, score]);

    useEffect(() => {
        if (!command || isGameOver) return;

        let nextPiece = { ...piece };
        if (command === 'LEFT') nextPiece = { ...nextPiece, x: nextPiece.x - 1 };
        if (command === 'RIGHT') nextPiece = { ...nextPiece, x: nextPiece.x + 1 };
        if (command === 'DOWN') nextPiece = { ...nextPiece, y: nextPiece.y + 1 };
        if (command === 'UP') { // Rotasi
            const shape = nextPiece.shape[0].map((_, colIndex) => nextPiece.shape.map(row => row[colIndex]).reverse());
            nextPiece = { ...nextPiece, shape };
        }
        if (command === 'SELECT') { // Drop
             let tempPiece = { ...piece };
             while(!checkCollision(tempPiece, board)){
                 tempPiece.y++;
             }
             tempPiece.y--;
             nextPiece = tempPiece;
        }
        
        if (!checkCollision(nextPiece, board)) {
            setPiece(nextPiece);
        }
        onCommandProcessed();
    }, [command, isGameOver, onCommandProcessed, board, piece, checkCollision]);

    if (command === 'BACK') resetGame();

    // Render Tampilan Game
    const displayBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                displayBoard[piece.y + y][piece.x + x] = piece.color;
            }
        });
    });

    return (
        <div className="tetris-container">
            <pre className="tetris-board">
                {`╔${'═'.repeat(BOARD_WIDTH * 2)}╗\n`}
                {displayBoard.map((row, y) =>
                    `║${row.map(cell => cell !== 0 ? '▓▓' : '··').join('')}║\n`
                ).join('')}
                {`╚${'═'.repeat(BOARD_WIDTH * 2)}╝`}
            </pre>
            <div className="tetris-info">
                {isGameOver ? (
                    <div className="game-over">
                        <p>GAME OVER</p>
                        <p>FINAL SCORE: {score}</p>
                        <p>Press B to Restart</p>
                    </div>
                ) : (
                    <>
                        <p>SCORE: {score}</p>
                        <p className="controls">[A] Drop [B] Restart [▲] Rotate</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AsciiTetris;