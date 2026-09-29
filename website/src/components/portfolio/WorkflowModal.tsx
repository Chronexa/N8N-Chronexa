"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { PortfolioWorkflow } from "../../lib/portfolio-data";
import { site } from "../../lib/site";
import s from "./WorkflowModal.module.css";

interface Props {
  workflow: PortfolioWorkflow;
  onClose: () => void;
}

export default function WorkflowModal({ workflow, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    /* Focus trap: focus the modal on open */
    modalRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const {
    title,
    subtitle,
    description,
    category,
    integrations,
    nodeCount,
    complexity,
    stats,
    previewImage,
  } = workflow;

  return (
    <div
      className={s.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={s.modal} ref={modalRef} tabIndex={-1}>
        {/* Close button */}
        <button
          className={s.close}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Image header */}
        <div className={s.imageHeader}>
          <Image
            src={previewImage}
            alt={`${title} workflow diagram`}
            fill
            sizes="820px"
            className={s.headerImg}
            priority
          />
        </div>

        {/* Content */}
        <div className={s.content}>
          <span className={s.categoryTag}>{category}</span>

          <h2 className={s.title}>{title}</h2>
          <p className={s.subtitle}>{subtitle}</p>
          <p className={s.description}>{description}</p>

          {/* Impact stats */}
          <div className={s.statsGrid}>
            {stats.map((stat) => (
              <span key={stat} className={s.statChip}>
                {stat}
              </span>
            ))}
          </div>

          {/* Integrations */}
          <p className={s.sectionLabel}>Integrations Used</p>
          <div className={s.integrationsList}>
            {integrations.map((int) => (
              <span key={int} className={s.integrationChip}>
                {int}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className={s.metaRow}>
            <span className={s.metaItem}>
              <span className={s.metaIcon} aria-hidden="true">⬡</span>
              {nodeCount} nodes
            </span>
            <span className={`${s.complexityBadge} ${s[complexity]}`}>
              {complexity}
            </span>
          </div>

          {/* CTA */}
          <a
            href={site.booking}
            target="_blank"
            rel="noopener noreferrer"
            className={s.cta}
          >
            Build Something Like This →
          </a>
        </div>
      </div>
    </div>
  );
}
