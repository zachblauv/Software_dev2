import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PlayerLocation } from '../types/CoveyTownSocket';
import ConversationAreaController, { ConversationAreaEvents } from './ConversationAreaController';
import PlayerController from './PlayerController';

describe('ConversationArea', () => {
  // A valid ConversationAreaController to be reused within the tests
  let testArea: ConversationAreaController;
  // Mock listeners for each of the ConversationAreaEvents, will be added to the testArea
  const mockListeners = mock<ConversationAreaEvents>();
  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    testArea = new ConversationAreaController(nanoid(), nanoid());
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
    ];
    mockClear(mockListeners.occupantsChange);
    mockClear(mockListeners.topicChange);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
    testArea.addListener('topicChange', mockListeners.topicChange);
  });
  describe('isEmpty', () => {
    it('Returns true if the occupants list is empty', () => {
      testArea.occupants = [];
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns true if the topic is undefined', () => {
      testArea.topic = undefined;
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns false if the occupants list is set and the topic is defined', () => {
      expect(testArea.isEmpty()).toBe(false);
    });
  });
  // TODO implement tests for the other functions in ConversationAreaController
});
