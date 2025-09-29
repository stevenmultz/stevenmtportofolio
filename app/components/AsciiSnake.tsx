'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- Snake Game Logic ---
const BOARD_WIDTH = 24;
const BOARD_HEIGHT = 16;

type Coordinates = { x: number; y: number };

const createInitialSnake = (): Coordinates[] => [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];

const createFood = (snake: Coordinates[]): Coordinates => {
    let newFood: Coordinates;
    do {
        newFood = {
            x: Math.floor(Math.random() * (BOARD_WIDTH - 2)) + 1,
            y: Math.floor(Math.random() * (BOARD_HEIGHT - 2)) + 1,
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
};

const AsciiSnake = ({ command, onGameOver }: { command: string | null, onGameOver: (score: number) => void }) => {
    const [snake, setSnake] = useState<Coordinates[]>(createInitialSnake());
    const [food, setFood] = useState<Coordinates>(() => createFood(createInitialSnake()));
    const [direction, setDirection] = useState<Coordinates>({ x: 1, y: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleDirectionChange = useCallback((newDir: Coordinates) => {
        setDirection(prevDir => {
            if (prevDir.x === -newDir.x && prevDir.x !== 0) return prevDir;
            if (prevDir.y === -newDir.y && prevDir.y !== 0) return prevDir;
            return newDir;
        });
    }, []);

    useEffect(() => {
        if (!command || gameOver) return;
        if (command === 'UP') handleDirectionChange({ x: 0, y: -1 });
        else if (command === 'DOWN') handleDirectionChange({ x: 0, y: 1 });
        else if (command === 'LEFT') handleDirectionChange({ x: -1, y: 0 });
        else if (command === 'RIGHT') handleDirectionChange({ x: 1, y: 0 });
    }, [command, gameOver, handleDirectionChange]);

    useEffect(() => {
        if (gameOver) return;

        const gameLoop = setInterval(() => {
            setSnake(prevSnake => {
                const newSnake = [...prevSnake];
                const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

                if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT || newSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
                    setGameOver(true);
                    onGameOver(score);
                    return prevSnake;
                }

                newSnake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(createFood(newSnake));
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, 150);

        return () => clearInterval(gameLoop);
    }, [snake, direction, food, gameOver, score, onGameOver]);

    const renderBoard = () => {
        let output = '╔' + '═'.repeat(BOARD_WIDTH) + '╗\n';
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            let row = '║';
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const isSnake = snake.some(seg => seg.x === x && seg.y === y);
                const isFood = food.x === x && food.y === y;
                if (isSnake) {
                    row += snake[0].x === x && snake[0].y === y ? 'O' : 'o';
                } else if (isFood) {
                    row += '●';
                } else {
                    row += ' ';
                }
            }
            row += '║\n';
            output += row;
        }
        output += '╚' + '═'.repeat(BOARD_WIDTH) + '╝';
        return output;
    };

    if (gameOver) {
        return <div className="game-over-text">GAME OVER<br/>SCORE: {score}</div>
    }

    return (
        <div className="game-container">
            <pre className="game-board">{renderBoard()}</pre>
            <div className="game-footer">[ Arrow Keys / D-Pad to Move ] [ B to Exit ]</div>
        </div>
    );
};

export default AsciiSnake;