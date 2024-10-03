'use client';
import { useState, useEffect } from 'react';

function mixColor(color1: number[], color2: number[], factor: number){
    if (arguments.length < 3) { 
        factor = 0.5; 
      }
      let result = color1.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
}

function rgbToCSS(rgb: number[]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

const ScrollingGradient = () => {

    useEffect(() => {
      const handleScroll = () => {
        // Get the scroll position and document height
        const scrollTop = window.scrollY; 
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
        // Calculate scroll factor
        const scrollFraction = scrollTop / docHeight;
  
        // The two colors we're mixing
        const startColor = [125, 216, 255]; // Day Color
        const endColor = [25, 7, 66]; // Night Color
        
        const newColor = mixColor(startColor, endColor, scrollFraction);
        
        // Set the background color
        document.body.style.backgroundColor = rgbToCSS(newColor);
      };
  
      // Scroll event listener
      window.addEventListener('scroll', handleScroll);
  
      // Cleanup the event listener when the component unmounts
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return null;
  };
  
  export default ScrollingGradient;