'use client';
import React, { useState } from 'react';
import { ConfigProvider, Flex, Segmented, Tooltip } from 'antd';
import styles from './Tooltip.module.css';

interface TooltipLocationProps {
  address?: string;
  children: React.ReactNode;
}

const buttonWidth = 80;

export default function TooltipLocation({
  address,
  children,
}: TooltipLocationProps) {
  const text = address || '주소 정보 없음';
  const [arrow, setArrow] = useState<'Show' | 'Hide' | 'Center'>('Show');

  return (
    <ConfigProvider button={{ style: { width: buttonWidth, margin: 4 } }}>
      <Segmented
        value={arrow}
        options={[]}
        onChange={setArrow}
        style={{ marginBottom: 24 }}
      />
      <Flex vertical justify="center" align="center" className="demo">
        <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Tooltip 
            placement="bottomRight" 
            title={text} 
            arrow={false}
            overlayClassName={styles.customTooltip}
          >
            {children}
          </Tooltip>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
}
