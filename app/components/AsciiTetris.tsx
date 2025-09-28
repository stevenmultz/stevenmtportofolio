'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// Konstanta Game
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;

const TETROMINOS: { [key: string]: { shape: number[][] } } = {
  'I': { shape: [[1, 1, 1, 1]] }, 'J': { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]] },
  'L': { shape: [[0, 1, 0], [0, 1, 0], [0, 1, 1]] }, 'O': { shape: [[1, 1], [1, 1]] },
  'S': { shape: [[0, 1, 1], [1, 1, 0]] }, 'T': { shape: [[0, 0, 0], [1, 1, 1], [0, 1, 0]] },
  'Z': { shape: [[1, 1, 0], [0, 1, 1]] },
};

// Hook kustom untuk game loop
const useGameLoop = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<(() => void) | null>(null);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    function tick() { if (savedCallback.current) savedCallback.current(); }
    if (delay !== null) {
      const id = setInterval(tick, delay); return () => clearInterval(id);
    }
  }, [delay]);
};

// Komponen Utama Tetris
export const AsciiTetris = ({ controlsRef }: { controlsRef: React.MutableRefObject<any> }) => {
  const createEmptyBoard = (): (string | number)[][] => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

  const [board, setBoard] = useState(() => createEmptyBoard());
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: TETROMINOS['I'].shape });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const checkCollision = useCallback((playerToCheck: { pos: { x: number; y: number }; tetromino: number[][] }, boardToCheck: (string | number)[][]): boolean => {
    for (let y = 0; y < playerToCheck.tetromino.length; y++) {
      for (let x = 0; x < playerToCheck.tetromino[y].length; x++) {
        if (playerToCheck.tetromino[y][x] !== 0) {
          const newY = y + playerToCheck.pos.y;
          const newX = x + playerToCheck.pos.x;
          if (newY >= BOARD_HEIGHT || newX < 0 || newX >= BOARD_WIDTH || (boardToCheck[newY] && boardToCheck[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const resetPlayer = useCallback(() => {
    const pieces = 'IJLOSTZ';
    const randPiece = pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOS;
    const newPlayer = { pos: { x: BOARD_WIDTH / 2 - 2, y: 0 }, tetromino: TETROMINOS[randPiece].shape };
    if (checkCollision(newPlayer, board)) {
      setGameOver(true);
    } else {
      setPlayer(newPlayer);
    }
  }, [board, checkCollision]);

  useEffect(() => { if (!gameOver) resetPlayer(); }, [gameOver, resetPlayer]);

  const drop = useCallback(() => {
    if (gameOver) return;
    const newPlayer = { ...player, pos: { ...player.pos, y: player.pos.y + 1 } };
    if (!checkCollision(newPlayer, board)) {
      setPlayer(newPlayer);
    } else {
      const newBoard = board.map(row => [...row]);
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) newBoard[y + player.pos.y][x + player.pos.x] = 1;
        });
      });
      let completedLines = 0;
      for (let y = newBoard.length - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== 0)) {
          completedLines++;
          newBoard.splice(y, 1);
        }
      }
      if (completedLines > 0) {
        const newLines = Array.from({ length: completedLines }, () => Array(BOARD_WIDTH).fill(0));
        newBoard.unshift(...newLines);
        setScore(prev => prev + completedLines * 10 * completedLines); // Skor bonus
      }
      setBoard(newBoard);
      resetPlayer();
    }
  }, [board, checkCollision, gameOver, player, resetPlayer]);

  useGameLoop(drop, gameOver ? null : 800);

  const move = useCallback((dir: -1 | 1) => {
    if (gameOver) return;
    const newPlayer = { ...player, pos: { ...player.pos, x: player.pos.x + dir } };
    if (!checkCollision(newPlayer, board)) setPlayer(newPlayer);
  }, [board, checkCollision, gameOver, player]);

  const rotate = useCallback(() => {
    if (gameOver) return;
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    const rotated = clonedPlayer.tetromino[0].map((_: number, colIndex: number) => clonedPlayer.tetromino.map((row: number[]) => row[colIndex]).reverse());
    clonedPlayer.tetromino = rotated;
    if (!checkCollision(clonedPlayer, board)) setPlayer(clonedPlayer);
  }, [board, checkCollision, gameOver, player]);

  useEffect(() => {
    controlsRef.current = { moveLeft: () => move(-1), moveRight: () => move(1), rotate, drop };
  }, [move, rotate, drop, controlsRef]);

  const displayBoard = board.map(row => [...row]);
  if (!gameOver) {
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) displayBoard[y + player.pos.y][x + player.pos.x] = 1;
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        <pre className="crt-text text-base leading-tight tracking-widest">{displayBoard.map(row => `║${row.map(cell => (cell === 0 ? ' ·' : '██')).join('')}║`).join('\n')} {'╚' + '══'.repeat(BOARD_WIDTH) + '╝'}</pre>
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-3xl crt-text animate-pulse">GAME OVER</p>
            <p className="text-xl crt-text">Score: {score}</p>
            <button onClick={() => { setGameOver(false); setBoard(createEmptyBoard()); setScore(0); }} className="mt-4 px-4 py-2 crt-text ascii-button">RESTART</button>
          </div>
        )}
      </div>
      <p className="crt-text text-xl mt-2">SCORE: {score}</p>
    </div>
  );
};