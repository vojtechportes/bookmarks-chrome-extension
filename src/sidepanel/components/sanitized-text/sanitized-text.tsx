import React, { type HTMLElementType } from 'react';
import sanitize from 'sanitize-html';
import { SANITIZED_TEXT_CONFIG_DEFAULT } from './constants';

interface SanitizedTextProps {
  text: string;
  config?: sanitize.IOptions;
  tagName?: keyof HTMLElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const SanitizedText: React.FC<SanitizedTextProps> = ({
  text,
  config = SANITIZED_TEXT_CONFIG_DEFAULT,
  tagName = 'span',
  className,
  style,
}) =>
  React.createElement(String(tagName), {
    style,
    className,
    dangerouslySetInnerHTML: {
      __html: sanitize(`${text}`, config),
    },
  });
