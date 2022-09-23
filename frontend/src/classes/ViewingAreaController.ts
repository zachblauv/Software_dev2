import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { ViewingArea as ViewingAreaModel } from '../types/CoveyTownSocket';

/**
 * The events that a ViewingAreaController can emit
 */
export type ViewingAreaEvents = {
  /**
   * A playbackChange event indicates that the playing/paused state has changed.
   * Listeners are passed the new state in the parameter `isPlaying`
   */
  playbackChange: (isPlaying: boolean) => void;
  /**
   * A progressChange event indicates that the progress of the video has changed, either
   * due to the user scrubbing through the video, or from the natural progression of time.
   * Listeners are passed the new playback time elapsed in seconds.
   */
  progressChange: (elapsedTimeSec: number) => void;
  /**
   * A videoChange event indicates that the video selected for this viewing area has changed.
   * Listeners are passed the new video, which is either a string (the URL to a video), or
   * the value `undefined` to indicate that there is no video set.
   */
  videoChange: (video: string | undefined) => void;
};

/**
 * A ViewingAreaController manages the state for a ViewingArea in the frontend app, serving as a bridge between the video
 * that is playing in the user's browser and the backend TownService, ensuring that all players watching the same video
 * are synchronized in their playback.
 *
 * The ViewingAreaController implements callbacks that handle events from the video player in this browser window, and
 * emits updates when the state is updated, @see ViewingAreaEvents
 */
export default class ViewingAreaController extends (EventEmitter as new () => TypedEventEmitter<ViewingAreaEvents>) {

  /**
   * Constructs a new ViewingAreaController, initialized with the state of the
   * provided viewingAreaModel.
   *
   * @param viewingAreaModel The viewing area model that this controller should represent
   */
  constructor(viewingAreaModel: ViewingAreaModel) {
    super();
  }

  /**
   * The ID of the viewing area represented by this viewing area controller
   * This property is read-only: once a ViewingAreaController is created, it will always be
   * tied to the same viewing area ID.
   */
  public get id(): string {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The URL of the video assigned to this viewing area, or undefined if there is not one.
   */
  public get video(): string {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The URL of the video assigned to this viewing area, or undefined if there is not one.
   *
   * Changing this value will emit a 'videoChange' event to listeners
   */
  public set video(video: string | undefined) {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The playback position of the video, in seconds (a floating point number)
   */
  public get elapsedTimeSec(): number {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The playback position of the video, in seconds (a floating point number)
   *
   * Changing this value will emit a 'progressChange' event to listeners
   */
  public set elapsedTimeSec(elapsedTimeSec: number) {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The playback state - true indicating that the video is playing, false indicating
   * that the video is paused.
   */
  public get isPlaying(): boolean {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * The playback state - true indicating that the video is playing, false indicating
   * that the video is paused.
   *
   * Changing this value will emit a 'playbackChange' event to listeners
   */
  public set isPlaying(isPlaying: boolean) {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * @returns ViewingAreaModel that represents the current state of this ViewingAreaController
   */
  public viewingAreaModel(): ViewingAreaModel {
    throw new Error('Unimplemented: Task 2 ViewingAreaController');
  }

  /**
   * Applies updates to this viewing area controller's model, setting the fields
   * isPlaying, elapsedTimeSec and video from the updatedModel
   *
   * @param updatedModel
   */
  public updateFrom(updatedModel: ViewingAreaModel): void {
    this.isPlaying = updatedModel.isPlaying;
    this.elapsedTimeSec = updatedModel.elapsedTimeSec;
    this.video = updatedModel.video;
  }
}
