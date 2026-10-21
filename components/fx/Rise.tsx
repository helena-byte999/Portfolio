import { Fragment } from 'react';

// Splits a title into words for the text-rise effect in globals.css. The words animate when the
// nearest [data-reveal] block comes into view; screen readers get the plain sentence.
export default function Rise({ text }: { text: string }) {
  return (
    <span className="rise">
      <span className="visually-hidden">{text}</span>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span aria-hidden="true" style={{ ['--i' as string]: i }}>
            {word}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
