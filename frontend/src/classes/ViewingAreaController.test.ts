import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { ViewingArea as ViewingAreaModel } from '../generated/client';
import ViewingAreaController, { ViewingAreaEvents } from './ViewingAreaController';

describe('Viewing Area Controller', () => {
  // A valid ViewingAreaController to be reused within the tests
  let testArea: ViewingAreaController;
  // The ViewingAreaModel corresponding to the testArea
  let testAreaModel: ViewingAreaModel;
  // Mock listeners for each of the ViewingAreaEvents, will be added to the testArea
  const mockListeners = mock<ViewingAreaEvents>();
  beforeEach(() => {
    testAreaModel = {
      id: nanoid(),
      isPlaying: true,
      elapsedTimeSec: 12,
      video: nanoid(),
    };
    testArea = new ViewingAreaController(testAreaModel);
    mockClear(mockListeners.playbackChange);
    mockClear(mockListeners.progressChange);
    mockClear(mockListeners.videoChange);
    testArea.addListener('playbackChange', mockListeners.playbackChange);
    testArea.addListener('progressChange', mockListeners.progressChange);
    testArea.addListener('videoChange', mockListeners.videoChange);
  });

  describe('updateFrom', () => {
    it('Updates the isPlaying, elapsedTimeSec and video properties', () => {
      const newModel: ViewingAreaModel = {
        id: testAreaModel.id,
        video: nanoid(),
        elapsedTimeSec: testArea.elapsedTimeSec + 1,
        isPlaying: !testArea.isPlaying,
      };
      testArea.updateFrom(newModel);
      expect(testArea.video).toEqual(newModel.video);
      expect(testArea.elapsedTimeSec).toEqual(newModel.elapsedTimeSec);
      expect(testArea.isPlaying).toEqual(newModel.isPlaying);
      expect(mockListeners.videoChange).toBeCalledWith(newModel.video);
      expect(mockListeners.progressChange).toBeCalledWith(newModel.elapsedTimeSec);
      expect(mockListeners.playbackChange).toBeCalledWith(newModel.isPlaying);
    });
    it('Does not update the id property', () => {
      const existingID = testArea.id;
      const newModel: ViewingAreaModel = {
        id: nanoid(),
        video: nanoid(),
        elapsedTimeSec: testArea.elapsedTimeSec + 1,
        isPlaying: !testArea.isPlaying,
      };
      testArea.updateFrom(newModel);
      expect(testArea.id).toEqual(existingID);
    });
  });

  describe('video', () => {
    it('Does not update the video or emit event if the video passed is that same as the old one', () => {
      const newVideo = testArea.video;
      testArea.video = newVideo;
      expect(mockListeners.videoChange).not.toBeCalled();
      expect(testArea.video).toBe(newVideo);
    });
    it('Does not update the video if passed undefined if video is undefined', () => {
      const viewingAreaModel = {
        id: nanoid(),
        video: undefined,
        isPlaying: false,
        elapsedTimeSec: 0,
      };
      const areaWithUndefinedTopic = new ViewingAreaController(viewingAreaModel);
      areaWithUndefinedTopic.video = undefined;
      expect(mockListeners.videoChange).not.toBeCalled();
      expect(areaWithUndefinedTopic.video).toBe(undefined);
    });
    it('Updates video and emits videoChange event when passed a new video', () => {
      const newVideo = 'funnyVideo';
      testArea.video = newVideo;
      expect(mockListeners.videoChange).toBeCalled();
      expect(testArea.video).toBe(newVideo);
    });
    it('Updates video and emits topicChange event when passed undefined if video is defined', () => {
      testArea.video = undefined;
      expect(mockListeners.videoChange).toBeCalled();
      expect(testArea.video).toBe(undefined);
    });
  });

  describe('elapsedTimeSec', () => {
    it('Does not update elapsedTimeSec or emit event if elapsedTimeSec is that same as the old one', () => {
      testArea.elapsedTimeSec = 12;
      expect(mockListeners.progressChange).not.toBeCalled();
      expect(testArea.elapsedTimeSec).toBe(12);
    });
    it('Updates elapsedTimeSec and emits progressChange event when passed a new elapsedTimeSec', () => {
      testArea.elapsedTimeSec = 100;
      expect(mockListeners.progressChange).toBeCalled();
      expect(testArea.elapsedTimeSec).toBe(100);
    });
  });

  describe('isPlaying', () => {
    it('Does not update isPlaying or emit event if isPlaying is that same as the old one', () => {
      testArea.isPlaying = true;
      expect(mockListeners.playbackChange).not.toBeCalled();
      expect(testArea.isPlaying).toBe(true);
    });
    it('Updates isPlaying and emits playbackChange event when passed a new isPlaying value', () => {
      testArea.isPlaying = false;
      expect(mockListeners.playbackChange).toBeCalled();
      expect(testArea.isPlaying).toBe(false);
    });
  });

  describe('toViewingAreaModel', () => {
    it('Succeeds on a filled out ViewingArea', () => {
      expect(testArea.viewingAreaModel()).toEqual(testAreaModel);
    });
    it('Succeeds on a ConversationArea with no viedo', () => {
      testArea.video = undefined;
      testAreaModel.video = undefined;
      expect(testArea.viewingAreaModel()).toEqual(testAreaModel);
    });
  });
});
