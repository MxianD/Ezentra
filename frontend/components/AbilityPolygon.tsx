import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, G } from 'react-native-svg';

interface Stat {
  title: string;
  value: string;
  maxValue: number;
}

interface AbilityPolygonProps {
  stats: Stat[];
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  backgroundColor?: string;
}

export default function AbilityPolygon({ 
  stats, 
  size = 200,
  strokeColor = '#7834E6',
  fillColor = 'rgba(120, 52, 230, 0.2)',
  backgroundColor = 'rgba(120, 52, 230, 0.1)'
}: AbilityPolygonProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (2 * Math.PI) / stats.length;

  const getPoints = (scale: number = 1) => {
    return stats.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle) * scale;
      const y = center + radius * Math.sin(angle) * scale;
      return `${x},${y}`;
    }).join(' ');
  };

  const getValuePoints = () => {
    return stats.map((stat, i) => {
      const scale = Number(stat.value) / stat.maxValue;
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle) * scale;
      const y = center + radius * Math.sin(angle) * scale;
      return `${x},${y}`;
    }).join(' ');
  };

  const getPointPosition = (index: number) => {
    const scale = Number(stats[index].value) / stats[index].maxValue;
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle) * scale;
    const y = center + radius * Math.sin(angle) * scale;
    return { x, y };
  };

  const getTooltipPosition = (index: number) => {
    const { x, y } = getPointPosition(index);
    const angle = index * angleStep - Math.PI / 2;
    const tooltipOffset = 20;
    const tooltipX = x + (Math.cos(angle) * tooltipOffset);
    const tooltipY = y + (Math.sin(angle) * tooltipOffset);
    return { x: tooltipX, y: tooltipY };
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background polygon */}
        <Polygon
          points={getPoints()}
          fill={backgroundColor}
          stroke={strokeColor}
          strokeWidth="1"
          opacity={0.3}
        />

        {/* Grid lines */}
        {[0.2, 0.4, 0.6, 0.8].map((scale, i) => (
          <Polygon
            key={i}
            points={getPoints(scale)}
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.5"
            opacity={0.2}
          />
        ))}

        {/* Axes */}
        {stats.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke={strokeColor}
              strokeWidth="0.5"
              opacity={0.3}
            />
          );
        })}

        {/* Value polygon */}
        <Polygon
          points={getValuePoints()}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Interactive points and tooltips */}
        {stats.map((stat, i) => {
          const pointPos = getPointPosition(i);
          const tooltipPos = getTooltipPosition(i);
          
          return (
            <G key={i}>
              <Circle
                cx={pointPos.x}
                cy={pointPos.y}
                r="8"
                fill={strokeColor}
                opacity={activePoint === i ? 1 : 0.6}
                onPressIn={() => setActivePoint(i)}
                onPressOut={() => setActivePoint(null)}
              />
              
              {activePoint === i && (
                <G>
                  <Circle
                    cx={pointPos.x}
                    cy={pointPos.y}
                    r="12"
                    fill={strokeColor}
                    opacity={0.2}
                  />
                  <SvgText
                    x={tooltipPos.x}
                    y={tooltipPos.y}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {stat.title}
                  </SvgText>
                  <SvgText
                    x={tooltipPos.x}
                    y={tooltipPos.y + 20}
                    fill="rgba(255,255,255,0.8)"
                    fontSize="12"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {stat.value}
                  </SvgText>
                </G>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 