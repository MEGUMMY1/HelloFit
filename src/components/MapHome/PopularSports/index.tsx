import React, { useState, useRef } from 'react';
import DropDown from '@/components/DropDown';
import SportButtonList from '@/components/MapHome/SportButtonList';
import IconComponent from '@/components/Asset/Icon';
import styles from './PopularSports.module.scss';

export default function PopularSports() {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const maxDragDistance = 140;

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    initialY.current = 'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const delta = currentY - initialY.current;

    setPosition((prevPosition) => {
      const newPosition = prevPosition + delta;
      return Math.max(Math.min(newPosition, maxDragDistance), 0);
    });

    initialY.current = currentY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setPosition((prevPosition) => (prevPosition < maxDragDistance / 2 ? maxDragDistance : 0));
  };

  return (
    <div
      className={styles.popularSportsContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onTouchEnd={handleDragEnd}
    >
      <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
      <div className={styles.content}>
        <header className={styles.header}>
          <DropDown
            placeholder="지역"
            options={['서울시 송파구', '서울시 종로구']} // 임의 지정
            onSelect={(selectedLocation) => console.log('선택된 위치:', selectedLocation)}
          />
        </header>
        <h2 className={styles.title}>인기 스포츠</h2>
        <SportButtonList />
      </div>
    </div>
  );
}
