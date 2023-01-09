import { forwardRef } from 'react';
import cn from 'classnames';
import s from './index.module.css';

export const FormInput = forwardRef((props, ref) => {
  return props.typeinput === 'textarea' ? (
    <textarea ref={ref} className={cn(s.input, s.textarea)} {...props} />
  ) : (
    <input ref={ref} className={s.input} {...props} />
  );
});
