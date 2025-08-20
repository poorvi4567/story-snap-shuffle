import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface StoryImage {
  id: number;
  src: string;
  alt: string;
  correctPosition: number;
}

// Sample story data - you can replace with your actual story images
const storyImages: StoryImage[] = [
  { id: 1, src: "/lovable-uploads/f7cd1248-38c9-41e2-8432-b03a6612ddce.png", alt: "Mending the broken statue", correctPosition: 1 },
  { id: 2, src: "/lovable-uploads/75519923-cfcb-4672-9fd6-a66be3a7a7b6.png", alt: "Kali's Darshan", correctPosition: 2 },
  { id: 3, src: "/lovable-uploads/c9c6c3f2-b9ca-4800-83e3-3feeb5e9e525.png", alt: "Marriage with Holy Mother", correctPosition: 3 },
  { id: 4, src: "/lovable-uploads/54c53b9d-d624-4740-9ded-569f6627dea7.png", alt: "Tantra Sadhana", correctPosition: 4 },
  { id: 5, src: "/lovable-uploads/60e017b3-acd5-4969-8da6-c1d5c26682b6.png", alt: "Meeting Jatadhari", correctPosition: 5 },
  { id: 6, src: "/lovable-uploads/dee1e578-9c7c-497c-bede-7ca78f09e33a.png", alt: "Vedanta Sadhana", correctPosition: 6 },
  { id: 7, src: "/lovable-uploads/5d2c11d1-79f1-4372-8174-00eea8a21d77.png", alt: "Practice of Islam", correctPosition: 7 },
  { id: 8, src: "/lovable-uploads/60e78365-40cd-472a-9253-aefcd7d40161.png", alt: "Spiritual devotion", correctPosition: 8 },
  { id: 9, src: "/lovable-uploads/1f1ed2a0-9689-4b75-b132-c1961ed9d558.png", alt: "First Biksha", correctPosition: 9 }
];

export default function StorySequenceGame() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [placedCards, setPlacedCards] = useState<{ [key: number]: StoryImage | null }>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [draggedImage, setDraggedImage] = useState<StoryImage | null>(null);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const successSoundRef = useRef<HTMLAudioElement>(null);
  const errorSoundRef = useRef<HTMLAudioElement>(null);

  // Initialize empty board
  useEffect(() => {
    const initialBoard: { [key: number]: StoryImage | null } = {};
    for (let i = 1; i <= 9; i++) {
      initialBoard[i] = null;
    }
    setPlacedCards(initialBoard);
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const playResultSound = (isSuccess: boolean) => {
    const sound = isSuccess ? successSoundRef.current : errorSoundRef.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const nextImage = () => {
    playClickSound();
    setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
  };

  const prevImage = () => {
    playClickSound();
    setCurrentImageIndex((prev) => (prev - 1 + storyImages.length) % storyImages.length);
  };

  const handleDragStart = (e: React.DragEvent, image: StoryImage) => {
    playClickSound();
    setDraggedImage(image);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (draggedImage && !placedCards[position]) {
      setPlacedCards(prev => ({
        ...prev,
        [position]: draggedImage
      }));
      setDraggedImage(null);
      
      // Check if game is complete
      const newPlacedCards = { ...placedCards, [position]: draggedImage };
      const placedCount = Object.values(newPlacedCards).filter(card => card !== null).length;
      
      if (placedCount === 9) {
        checkSequence(newPlacedCards);
      }
    }
  };

  const checkSequence = (cards: { [key: number]: StoryImage | null }) => {
    let isCorrect = true;
    for (let i = 1; i <= 9; i++) {
      const card = cards[i];
      if (!card || card.correctPosition !== i) {
        isCorrect = false;
        break;
      }
    }
    
    setGameComplete(true);
    if (isCorrect) {
      setResultMessage('🎉 Excellent! You have arranged the story in the correct sequence!');
      playResultSound(true);
    } else {
      setResultMessage('❌ The sequence is not correct. Try again!');
      playResultSound(false);
    }
  };

  const resetGame = () => {
    playClickSound();
    const initialBoard: { [key: number]: StoryImage | null } = {};
    for (let i = 1; i <= 9; i++) {
      initialBoard[i] = null;
    }
    setPlacedCards(initialBoard);
    setGameComplete(false);
    setResultMessage('');
    setCurrentImageIndex(0);
  };

  const currentImage = storyImages[currentImageIndex];
  const isCurrentImagePlaced = Object.values(placedCards).some(card => card?.id === currentImage.id);

  return (
    <div className="game-container">
      <audio ref={clickSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAjl4ufK8Rig6" type="audio/wav" />
      </audio>
      <audio ref={successSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRvIBAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YU4BAAATKWiCvgTEFQAAAgAAgAEABAAOABsAKwA/AFYAagCBAJwAuQDXAPYAFQE2AVkBfQGfAcQB5wEJAi0CUQJ0ApcCugLcAv0CGwM4A1UDcgONA6gDwwPcA/QDCwQhBDYETgRkBHsEkgSqBL0E0ATiBPMEBAUUBSQFMgVBBU4FWQVkBW8FegWEBY4FmQWjBasFtAW8BcMFyQXOBdEF0wXUBdUF1AXQBM0xUwAA" type="audio/wav" />
      </audio>
      <audio ref={errorSoundRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRuIBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4BAADMhjFvXJLGfB/jAu+Xpg3TnjNAHwHRiOSJU6CcmjtdDweIeqKcvxH5xOaGcImR/2JHo9AjGO6XpYe8P/uWfKgCu7AKeFKvkbSYM2X/v2oREfeXovA/2h3LlKv1SJrAKQDJiMGJV6mfnC9QGPyOe7CjwhT/y+mOdomY/8qRoAgKKKsNmHr+wOp1evvPihHOjapFW6SemjtRGgOHebKjuRb0yukFdYGZ6jdLhtQjHeqXq5O9QfmcgKkD+GgJeFOtkrOXM2b9v2oaEPeXovA/2h3LlKv1SJrAKQDJiMGJVqmdnC9RGPyOe7CjwhT/y+mO" type="audio/wav" />
      </audio>
      
      <header className="text-center mb-8">
        <h1 className="story-title mb-4">Spiritual Journey Sequence Game</h1>
        <p className="text-lg text-muted-foreground">
          Arrange the cards in the correct sequence to tell the complete spiritual story
        </p>
      </header>

      <div className="board-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => (
          <div
            key={position}
            className={`drop-zone ${placedCards[position] ? 'occupied' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, position)}
          >
            {placedCards[position] ? (
              <div className="story-card">
                <img
                  src={placedCards[position]!.src}
                  alt={placedCards[position]!.alt}
                  draggable={false}
                />
                <div className="p-2 text-xs text-center font-medium">
                  Position {position}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="text-2xl font-bold mb-2">{position}</div>
                <div className="text-sm">Drop card here</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="carousel-container">
        <div className="carousel-inner">
          <div className="carousel-item active">
            {!isCurrentImagePlaced ? (
              <div
                className="story-card"
                draggable
                onDragStart={(e) => handleDragStart(e, currentImage)}
              >
                <img src={currentImage.src} alt={currentImage.alt} />
                <div className="p-3 text-center">
                  <div className="font-medium text-sm">{currentImage.alt}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Card {currentImage.id} of {storyImages.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="text-lg font-medium">Card Already Placed</div>
                <div className="text-sm">"{currentImage.alt}" is on the board</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="carousel-nav">
          <Button 
            variant="carousel" 
            onClick={prevImage}
            disabled={storyImages.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="text-center text-sm text-muted-foreground self-center">
            {currentImageIndex + 1} of {storyImages.length}
          </div>
          
          <Button 
            variant="carousel" 
            onClick={nextImage}
            disabled={storyImages.length <= 1}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {gameComplete && (
        <div className={`result-message ${resultMessage.includes('Excellent') ? 'success' : 'error'}`}>
          {resultMessage}
        </div>
      )}

      <div className="text-center mt-6">
        <Button variant="game" onClick={resetGame}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </Button>
      </div>
    </div>
  );
}