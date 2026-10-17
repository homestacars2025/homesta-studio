import React from 'react';
import { Composition, Still } from 'remotion';
import './shared/fonts';
import type { StudioProps } from './shared/types';
import { S3_FindYourStayIn, S3_FRAMES } from './templates/S3_FindYourStayIn';
import { S7_StayCard } from './templates/S7_StayCard';
import { S2_CityEscape, S2_FRAMES } from './templates/S2_CityEscape';
import sampleS2 from '../test/sample-s2.json';
import { P1_StaySpotlight, P1_SLIDES } from './templates/P1_StaySpotlight';
import sampleP1 from '../test/sample-p1.json';
import { S1_JustJoined, S1_FRAMES } from './templates/S1_JustJoined';
import sampleS1 from '../test/sample-s1.json';
import { S6_ThisOrThat, S6_FRAMES } from './templates/S6_ThisOrThat';
import sampleS6 from '../test/sample-s6.json';
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
    <Composition
      id="S1-JustJoined"
      component={S1_JustJoined as React.FC<any>}
      durationInFrames={S1_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={sampleS1 as unknown as StudioProps}
    />
    <Composition
      id="S6-ThisOrThat"
      component={S6_ThisOrThat as React.FC<any>}
      durationInFrames={S6_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={sampleS6 as unknown as StudioProps}
    />
    <Composition
      id="S2-CityEscape"
      component={S2_CityEscape as React.FC<any>}
      durationInFrames={S2_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={sampleS2 as unknown as StudioProps}
    />
    <Still
      id="S7-StayCard"
      component={S7_StayCard as React.FC<any>}
      width={1080}
      height={1920}
      defaultProps={sample as unknown as StudioProps}
    />
    {Array.from({ length: P1_SLIDES }, (_, i) => (
      <Still
        key={i}
        id={`P1-StaySpotlight-S${i + 1}`}
        component={P1_StaySpotlight as React.FC<any>}
        width={1080}
        height={1350}
        defaultProps={{ ...(sampleP1 as unknown as StudioProps), slide: i + 1 }}
      />
    ))}
  </>
);
