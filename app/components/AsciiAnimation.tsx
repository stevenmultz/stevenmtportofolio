'use client';

import React, { useState, useEffect } from 'react';

// Pre-rendered frames of a spinning ASCII torus
const asciiFrames: string[] = [
  "               .,-~:;=!*#$@ .,-~:;=!*#$@                ",
  "           ,-=iii==i*#$@   .,-~:;=!*#$@                 ",
  "         ,-=i==!!!!=#$@ .,-~:;=!*#$@                    ",
  "       ~=i==!!!!*#$@ .,-~:;=!*#$@                       ",
  "      ;i==!!!!*#$@ .,-~:;=!*#$@                         ",
  "     :i==!!!!*#$@ .,-~:;=!*#$@                          ",
  "    ,i==!!!!*#$@ .,-~:;=!*#$@                           ",
  "    i==!!!!*#$@ .,-~:;=!*#$@                            ",
  "   ;i==!!!!*#$@ .,-~:;=!*#$@                            ",
  "  ,i==!!!!*#$@ .,-~:;=!*#$@                             ",
  "  i==!!!!*#$@ .,-~:;=!*#$@                              ",
  "  i==!!!!*#$@ .,-~:;=!*#$@                              ",
  " ,i==!!!!*#$@ .,-~:;=!*#$@                              ",
  " ;i==!!!!*#$@ .,-~:;=!*#$@                              ",
  " i==!!!!*#$@ .,-~:;=!*#$@                               ",
  " i==!!!!*#$@ .,-~:;=!*#$@                               ",
  " i==!!!!*#$@ .,-~:;=!*#$@                               ",
  " ;i==!!!!*#$@ .,-~:;=!*#$@                              ",
  " ,i==!!!!*#$@ .,-~:;=!*#$@                              ",
  "  i==!!!!*#$@ .,-~:;=!*#$@                              ",
  "  i==!!!!*#$@ .,-~:;=!*#$@                              ",
  "  ,i==!!!!*#$@ .,-~:;=!*#$@                             ",
  "   ;i==!!!!*#$@ .,-~:;=!*#$@                            ",
  "    i==!!!!*#$@ .,-~:;=!*#$@                            ",
  "    ,i==!!!!*#$@ .,-~:;=!*#$@                           ",
  "     :i==!!!!*#$@ .,-~:;=!*#$@                          ",
  "      ;i==!!!!*#$@ .,-~:;=!*#$@                         ",
  "       ~=i==!!!!*#$@ .,-~:;=!*#$@                       ",
  "         ,-=i==!!!!=#$@ .,-~:;=!*#$@                    ",
  "           ,-=iii==i*#$@   .,-~:;=!*#$@                 ",
  "               .,-~:;=!*#$@ .,-~:;=!*#$@                ",
  "                                                       "
];


const AsciiAnimation = () => {
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const animationInterval = setInterval(() => {
            setFrameIndex(prevIndex => (prevIndex + 1) % asciiFrames.length);
        }, 100); // Animation speed

        return () => clearInterval(animationInterval);
    }, []);

    return (
        <div className="ascii-animation-container">
            <pre>{asciiFrames[frameIndex]}</pre>
        </div>
    );
};

export default AsciiAnimation;