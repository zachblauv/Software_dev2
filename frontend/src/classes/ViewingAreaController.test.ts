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
});
