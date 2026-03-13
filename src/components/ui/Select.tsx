'use client';

import React, { useState, useRef, useEffect, type ReactNode, type HTMLAttributes } from 'react';

interface SelectProps {
  value?: string | number;
  onChange?: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, children, placeholder = 'Select...', className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedChild = Array.isArray(children)
    ? children.find((child: any) => child?.props?.value === value)
    : null;
  const displayValue = selectedChild?.props?.children || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setIsOpen(false);
    onChange?.(value);
  };

  const renderChildren = () => {
    if (!Array.isArray(children)) return children;

    console.log('Select children:', children);

    return children.map((child: any, index: number) => {
      console.log('Select child:', child, 'props:', child?.props);
      // Check if child has value prop (indicates SelectItem)
      if (child && typeof child === 'object' && 'props' in child && 'value' in child.props) {
        return React.cloneElement(child, {
          key: child.props.value || child.key || index,
          onItemSelect: handleSelect
        });
      }
      return child;
    });
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border rounded-md bg-white text-left flex justify-between items-center"
      >
        <span className={value ? '' : 'text-gray-400'}>{displayValue}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {renderChildren()}
        </div>
      )}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  onItemSelect?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function SelectItem({ value, children, className = '', onItemSelect }: SelectItemProps) {
  console.log('SelectItem render:', { value, children, onItemSelect: !!onItemSelect });

  const handleClick = () => {
    console.log('SelectItem clicked:', value, 'onItemSelect:', !!onItemSelect);
    onItemSelect?.(value);
  };

  return (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={handleClick}
      data-value={value}
    >
      {children}
    </div>
  );
}
