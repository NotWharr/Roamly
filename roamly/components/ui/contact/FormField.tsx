"use client";

import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  /** Decorative icon rendered inside the control. */
  icon?: ReactNode;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}

/**
 * One labelled form control.
 *
 * The label sits above the control and is tied to it with `htmlFor`, so the
 * field is announced correctly and clicking the label focuses the input.
 * Errors use `role="alert"` so they are spoken when validation fails, and are
 * wired back to the control with `aria-describedby`.
 *
 * Rendering the control through a function keeps the id and ARIA wiring in one
 * place, so the three fields cannot drift apart.
 */
export default function Field({ id, label, icon, error, children }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="rl-field-group">
      <label htmlFor={id} className="rl-field-label">
        {label}
      </label>

      <div className={icon ? "rl-field" : undefined}>
        {icon ? (
          <span className="rl-field-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        {children({
          id,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        })}
      </div>

      {/*
        Always rendered, so the layout does not jump when a message appears.
        Empty and role-hidden while there is nothing to say.
      */}
      <p id={errorId} className="rl-error" role={error ? "alert" : undefined}>
        {error ?? ""}
      </p>
    </div>
  );
}
