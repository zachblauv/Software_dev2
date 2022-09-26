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
  describe('occupants', () => {
    it('Does not update the occupant list or emit event if the one passed is that same as the old one', () => {
      const currentOccupants = testArea.occupants;
      testArea.occupants = currentOccupants;
      expect(mockListeners.occupantsChange).not.toBeCalled();
      expect(testArea.occupants).toBe(currentOccupants);
    });
    it('Does not update the occupant list or emit event if the passed the same list in a different order', () => {
      const currentOccupants = testArea.occupants;
      const reorderedOccupants = [];
      reorderedOccupants.push(currentOccupants[2]);
      reorderedOccupants.push(currentOccupants[0]);
      reorderedOccupants.push(currentOccupants[1]);
      testArea.occupants = reorderedOccupants;
      expect(mockListeners.occupantsChange).not.toBeCalled();
      expect(testArea.occupants).toBe(currentOccupants);
    });
    it('Updates occupants list and emits occupantsChange event when passed a new occupants list', () => {
      const newOccupants = [
        new PlayerController(nanoid(), nanoid(), { moving: false, x: 1, y: 0, rotation: 'front' }),
        new PlayerController(nanoid(), nanoid(), { moving: false, x: 0, y: 0, rotation: 'front' }),
        new PlayerController(nanoid(), nanoid(), { moving: false, x: 13, y: 0, rotation: 'front' }),
      ];
      testArea.occupants = newOccupants;
      expect(mockListeners.occupantsChange).toBeCalled();
      expect(testArea.occupants).toBe(newOccupants);
      newOccupants.pop();
      expect(newOccupants.length).toBe(2);
      testArea.occupants = newOccupants;
      expect(mockListeners.occupantsChange).toBeCalled();
      expect(testArea.occupants).toBe(newOccupants);
    });
    it('Updates occupants list and emits occupantsChange event when passed an empty list', () => {
      const newOccupants: PlayerController[] = [];
      testArea.occupants = newOccupants;
      expect(mockListeners.occupantsChange).toBeCalled();
      expect(testArea.occupants).toBe(newOccupants);
    });
  });
  describe('topic', () => {
    it('Does not update the topic or emit event if the topic passed is that same as the old one', () => {
      const currentTopic = testArea.topic;
      testArea.topic = currentTopic;
      expect(mockListeners.topicChange).not.toBeCalled();
      expect(testArea.topic).toBe(currentTopic);
    });
    it('Does not update the topic if passed undefined if topic is undefined', () => {
      const areaWithUndefinedTopic = new ConversationAreaController(nanoid(), undefined);
      areaWithUndefinedTopic.topic = undefined;
      expect(mockListeners.topicChange).not.toBeCalled();
      expect(areaWithUndefinedTopic.topic).toBe(undefined);
    });
    it('Updates topic and emits topicChange event when passed a new topic', () => {
      const newTopic = 'fruits';
      testArea.topic = newTopic;
      expect(mockListeners.topicChange).toBeCalled();
      expect(testArea.topic).toBe(newTopic);
    });
    it('Updates topic and emits topicChange event when passed undefined if topic is defined', () => {
      testArea.topic = undefined;
      expect(mockListeners.topicChange).toBeCalled();
      expect(testArea.topic).toBe(undefined);
    });
  });
  describe('toConversationAreaModel', () => {
    it('Succeeds on a filled out ConverstionArea', () => {
      const conversationAreaModel = {
        id: testArea.id,
        topic: testArea.topic,
        occupantsByID: [
          testArea.occupants[0].id,
          testArea.occupants[1].id,
          testArea.occupants[2].id,
        ],
      };
      expect(testArea.toConversationAreaModel()).toEqual(conversationAreaModel);
    });
    it('Succeeds on a ConversationArea with no occupants', () => {
      const conversationAreaModel = {
        id: testArea.id,
        topic: testArea.topic,
        occupantsByID: [],
      };
      testArea.occupants = [];
      expect(testArea.toConversationAreaModel()).toEqual(conversationAreaModel);
    });
    it('Succeeds on a ConversationArea with no topic', () => {
      const conversationAreaModel = {
        id: testArea.id,
        topic: undefined,
        occupantsByID: [],
      };
      testArea.topic = undefined;
      testArea.occupants = [];
      expect(testArea.toConversationAreaModel()).toEqual(conversationAreaModel);
    });
  });
});
