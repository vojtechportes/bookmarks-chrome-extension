import { useMemo, type FC } from 'react';
import type { IDataTest } from '../../types/data-test';
import { clsx } from 'clsx';
import classes from './textarea.module.css';
import sanitizeHtml from 'sanitize-html';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  IDataTest;

export const Textarea: FC<TextareaProps> = ({
  className,
  children,
  ...rest
}) => {
  const sanitizedChildren = useMemo(() => {
    if (!children) {
      return '';
    }

    return sanitizeHtml(String(children), {
      allowedTags: [],
      allowedAttributes: {},
    });
  }, [children]);

  return (
    <textarea
      className={clsx(classes.textarea, className)}
      {...rest}
      defaultValue={sanitizedChildren}
    />
  );
};
