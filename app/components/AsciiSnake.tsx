'use client';

import React, { useState, useEffect } from 'react';

const AsciiSnake = () => {
    const [snake, setSnake] = useState([{x: 5, y: 5}]);
    const [food, setFood] = useState({x: 10, y: 10});
    const [direction, setDirection] = useState({x: 1, y: 0});
    const boardSize = {width: 20, height: 15};

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setSnake(prevSnake => {
                const newHead = {x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y};
                // Auto-pilot logic
                if (newHead.x >= boardSize.width -1 || newHead.x <= 0 || newHead.y >= boardSize.height -1 || newHead.y <= 0) {
                    setDirection(d => d.x !== 0 ? {x: 0, y: 1} : {x: 1, y: 0});
                }
                return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
            });
        }, 150);
        return () => clearInterval(gameLoop);
    }, [direction, boardSize.width, boardSize.height]);

    const renderBoard = () => {
        let output = '╔' + '═'.repeat(boardSize.width) + '╗\n';
        for (let y = 0; y < boardSize.height; y++) {
            let row = '║';
            for (let x = 0; x < boardSize.width; x++) {
                const isSnake = snake.some(seg => seg.x === x && seg.y === y);
                const isFood = food.x === x && food.y === y;
                if (isSnake) row += '█';
                else if (isFood) row += '●';
                else row += ' ';
            }
            row += '║\n';
            output += row;
        }
        output += '╚' + '═'.repeat(boardSize.width) + '╝';
        return output;
    };
    
    return (
        <div className="game-container">
            <pre className="game-board">{renderBoard()}</pre>
            <div className="game-footer">[ Press 'B' to Exit ]</div>
        </div>
    );
};

export default AsciiSnake;