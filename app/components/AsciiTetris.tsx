'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- Tetris Game Logic & Assets ---
const STAGE_WIDTH = 12;
const STAGE_HEIGHT = 20;

export const createStage = (): (string|number)[][][] => 
    Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']));

type TetrominoShape = (string | number)[][];
type Tetromino = { shape: TetrominoShape; color: string; };
type Player = {
    pos: { x: number; y: number };
    tetromino: Tetromino;
    collided: boolean;
};

export const TETROMINOS: { [key: string]: Tetromino } = {
    '0': { shape: [[0]], color: '0, 0, 0' },
    I: { shape: [[0, 'I', 0, 0], ['I', 'I', 'I', 'I'], [0, 0, 0, 0], [0, 0, 0, 0]], color: '80, 227, 230' },
    J: { shape: [[0, 'J', 0], ['J', 'J', 'J'], [0, 0, 0]], color: '36, 95, 223' },
    L: { shape: [[0, 0, 'L'], ['L', 'L', 'L'], [0, 0, 0]], color: '223, 173, 36' },
    O: { shape: [['O', 'O'], ['O', 'O']], color: '223, 217, 36' },
    S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: '48, 211, 56' },
    T: { shape: [[0, 'T', 0], ['T', 'T', 'T'], [0, 0, 0]], color: '132, 61, 198' },
    Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: '227, 78, 78' },
};

const randomTetromino = (): Tetromino => {
    const tetrominos = 'IJLOSTZ';
    const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return TETROMINOS[randTetromino];
};

const AsciiTetris = ({ command, onGameOver }: { command: string | null, onGameOver: (score: number) => void }) => {
    const [board, setBoard] = useState(createStage());
    const [player, setPlayer] = useState<Player>({ 
        pos: { x: 0, y: 0 }, 
        tetromino: TETROMINOS['0'], 
        collided: false 
    });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino(),
            collided: false,
        });
    }, []);
    
    useEffect(() => {
        resetPlayer();
    }, [resetPlayer]);

    const checkCollision = (p: typeof player, b: typeof board, { x: moveX, y: moveY }: { x: number, y: number }): boolean => {
        for (let y = 0; y < p.tetromino.shape.length; y += 1) {
            for (let x = 0; x < p.tetromino.shape[y].length; x += 1) {
                if (p.tetromino.shape[y][x] !== 0) {
                    if (!b[y + p.pos.y + moveY] || !b[y + p.pos.y + moveY][x + p.pos.x + moveX] || b[y + p.pos.y + moveY][x + p.pos.x + moveX][1] !== 'clear') {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    
    const updatePlayerPos = ({ x, y, collided }: { x: number, y: number, collided?: boolean }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided: collided ?? prev.collided,
        }));
    };
    
    const drop = useCallback(() => {
        if (!checkCollision(player, board, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1 });
        } else {
            if (player.pos.y < 1) {
                setGameOver(true);
                onGameOver(score);
            }
            setPlayer(prev => ({ ...prev, collided: true }));
        }
    }, [player, board, score, onGameOver]);

    const movePlayer = (dir: -1 | 1) => {
        if (!checkCollision(player, board, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const rotate = (matrix: (string|number)[][]) => {
        const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]));
        return rotatedTetro.map(row => row.reverse());
    };

    const playerRotate = (b: typeof board) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, b, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino.shape[0].length) {
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    useEffect(() => {
        if (player.collided) {
            setBoard(prevBoard => {
                const newBoard = prevBoard.map(row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)));
                player.tetromino.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            newBoard[y + player.pos.y][x + player.pos.x] = [value, 'merged'];
                        }
                    });
                });
                return newBoard;
            });
            resetPlayer();
        }
    }, [player.collided, resetPlayer]);
    
    useEffect(() => {
        if (gameOver) return;
        const dropInterval = setInterval(() => drop(), 800);
        return () => clearInterval(dropInterval);
    }, [player, board, gameOver, drop]);

    useEffect(() => {
        if (!command || gameOver) return;
        if (command === 'LEFT') movePlayer(-1);
        else if (command === 'RIGHT') movePlayer(1);
        else if (command === 'DOWN') drop();
        else if (command === 'ROTATE') playerRotate(board);
    }, [command, gameOver]);

    const renderBoard = () => {
        const displayBoard: (string|number)[][][] = JSON.parse(JSON.stringify(board));
        player.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    displayBoard[y + player.pos.y][x + player.pos.x] = [value, 'player'];
                }
            });
        });

        return displayBoard.map((row: any[][]) => 
            `║${row.map(cell => (cell[0] !== 0 ? '▓' : ' ')).join('')}║\n`
        ).join('');
    };

    if (gameOver) {
        return <div className="game-over-text">GAME OVER<br/>SCORE: {score}</div>
    }

    return (
        <div className="game-container">
            <pre className="game-board">
                {'╔' + '═'.repeat(12) + '╗\n'}
                {renderBoard()}
                {'╚' + '═'.repeat(12) + '╝'}
            </pre>
            <div className="game-footer">[ ↑ / A: Rotate ] [ B: Exit ]</div>
        </div>
    );
};

export default AsciiTetris;