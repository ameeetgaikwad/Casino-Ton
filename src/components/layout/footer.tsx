// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: '#121628',
    color: 'white',
    textAlign: 'center',
    padding: '1rem', // Adjust padding as needed
    marginTop: '1rem', // Adjust margin top as needed
    borderRadius: '13px', // Add this line for rounded corners
    fontSize: '10px', // Add this line for smaller font size
  };

  return (
    <footer style={footerStyle}>
      <p>
        &copy; FlipYa Gaming - Next Games Launching March 2024 (Rock Paper Scissors, Dice & Roulette) - {' '}
        <a href="https://explorer.vitruveo.xyz/address/0x1aE6bc5210361C2a33be8f80360042911DfAbf62" target="_blank" rel="noopener noreferrer">
         Contract Verified Vitruveo Blockchain
        </a>
      </p>
    </footer>
  );
};

export default Footer;
