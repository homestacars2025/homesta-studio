import React from 'react';
import { Composition } from 'remotion';
import './shared/fonts';
import type { StudioProps } from './shared/types';
import { S3_FindYourStayIn, S3_FRAMES } from './templates/S3_FindYourStayIn';
import sample from '../test/sample-s3.json';

/**
 * Every template = one composition. The id must equal media.templates.composition_id with '_' replaced by '-'.
 * Video templates use <Composition>, image templates (posters) use <Still> or a
 * one-frame Composition per slide.
 */
export const Root: React.FC = () => (
  <>
    <Composition
      id="S3-FindYourStayIn"
      component={S3_FindYourStayIn as React.FC<any>}
      durationInFrames={S3_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={sample as unknown as StudioProps}
    />
  </>
);
