import { Container } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useInteractable, useViewingAreaController } from '../../../classes/TownController';
import ViewingAreaController from '../../../classes/ViewingAreaController';
import useTownController from '../../../hooks/useTownController';
import SelectVideoModal from './SelectVideoModal';
import ViewingAreaInteractable from './ViewingArea';

const ALLOWED_DRIFT = 3;
export class MockReactPlayer extends ReactPlayer {
  render(): React.ReactNode {
    return <></>;
  }
}

/**
 * The ViewingAreaVideo component renders a ViewingArea's video, using the ReactPlayer component.
 * The URL property of the ReactPlayer is set to the ViewingAreaController's video property, and the isPlaying
 * property is set, by default, to the controller's isPlaying property.
 *
 * The ViewingAreaVideo subscribes to the ViewingAreaController's events, and responds to
 * playbackChange events by pausing (or resuming) the video playback as appropriate. In response to
 * progressChange events, the ViewingAreaVideo component will seek the video playback to the same timecode.
 * To avoid jittering, the playback is allowed to drift by up to ALLOWED_DRIFT before seeking: the video should
 * not be seek'ed to the newTime from a progressChange event unless the difference between the current time of
 * the video playback exceeds ALLOWED_DRIFT.
 *
 * The ViewingAreaVideo also subscribes to onProgress, onPause, onPlay, and onEnded events of the ReactPlayer.
 * In response to these events, the ViewingAreaVideo updates the ViewingAreaController's properties, and
 * uses the TownController to emit a viewing area update.
 *
 * @param props: A single property 'controller', which is the ViewingAreaController corresponding to the
 *               current viewing area.
 */
export function ViewingAreaVideo({
  controller,
}: {
  controller: ViewingAreaController;
}): JSX.Element {
  const reactPlayerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(controller.isPlaying);
  useEffect(() => {
    const updateIsPlaying = (newIsPlaying: boolean) => {
      setIsPlaying(newIsPlaying);
    };
    controller.addListener('playbackChange', updateIsPlaying);
    return () => {
      controller.removeListener('playbackChange', updateIsPlaying);
    };
  }, [controller, setIsPlaying]);
  useEffect(() => {
    const updateTimecode = (newTime: integer) => {
      if (reactPlayerRef.current) {
        if (newTime > reactPlayerRef.current?.getCurrentTime() + ALLOWED_DRIFT) {
          reactPlayerRef.current.seekTo(newTime, 'seconds');
        } else if (newTime < reactPlayerRef.current?.getCurrentTime() - ALLOWED_DRIFT) {
          reactPlayerRef.current.seekTo(newTime, 'seconds');
        }
      }
    };
    controller.addListener('progressChange', updateTimecode);
    return () => {
      controller.removeListener('progressChange', updateTimecode);
    };
  }, [controller]);
  // TODO: Task 4 - implement this component to the spec
  return (
    <Container className='participant-wrapper'>
      Viewing Area: {controller.id}
      <ReactPlayer
        ref={reactPlayerRef}
        url={controller.video}
        playing={isPlaying}
        config={{
          youtube: {
            playerVars: {
              // disable skipping time via keyboard to avoid weirdness with chat, etc
              disablekb: 1,
              autoplay: 1,
              // modestbranding: 1,
            },
          },
        }}
        controls={true}
        width='100%'
        height='100%'
      />
    </Container>
  );
}

/**
 * The ViewingArea monitors the player's interaction with a ViewingArea on the map: displaying either
 * a popup to set the video for a viewing area, or if the video is set, a video player.
 *
 * @param props: the viewing area interactable that is being interacted with
 */
export function ViewingArea({
  viewingArea,
}: {
  viewingArea: ViewingAreaInteractable;
}): JSX.Element {
  const townController = useTownController();
  const viewingAreaController = useViewingAreaController(viewingArea.name);
  const [selectIsOpen, setSelectIsOpen] = useState(viewingAreaController.video === undefined);
  const [viewingAreaVideoURL, setViewingAreaVideoURL] = useState(viewingAreaController.video);
  useEffect(() => {
    const setURL = (url: string | undefined) => {
      if (!url) {
        townController.interactableEmitter.emit('endIteraction', viewingAreaController);
      } else {
        setViewingAreaVideoURL(url);
      }
    };
    viewingAreaController.addListener('videoChange', setURL);
    return () => {
      viewingAreaController.removeListener('videoChange', setURL);
    };
  }, [viewingAreaController, townController]);

  if (!viewingAreaVideoURL) {
    return (
      <SelectVideoModal
        isOpen={selectIsOpen}
        close={() => setSelectIsOpen(false)}
        viewingArea={viewingArea}
      />
    );
  }
  return (
    <>
      <ViewingAreaVideo controller={viewingAreaController} />
    </>
  );
}

/**
 * The ViewingAreaWrapper is suitable to be *always* rendered inside of a town, and
 * will activate only if the player begins interacting with a viewing area.
 */
export default function ViewingAreaWrapper(): JSX.Element {
  const viewingArea = useInteractable<ViewingAreaInteractable>('viewingArea');
  if (viewingArea) {
    return <ViewingArea viewingArea={viewingArea} />;
  }
  return <></>;
}
