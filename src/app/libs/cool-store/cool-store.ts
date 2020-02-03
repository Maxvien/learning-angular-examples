import { Subject } from "rxjs";
import produce, { Draft } from "immer";

export class CoolStore<CoolState> {
  private initialState: CoolState;
  private _state: CoolState;
  private state$ = new Subject<CoolState>();

  constructor(initialState: CoolState) {
    this._state = this.clone(initialState);
    this.initialState = this.clone(initialState);
    this.emit();
  }

  private clone(state: CoolState) {
    return produce(state, (draft: Draft<CoolState>) => {});
  }

  private emit() {
    this.state$.next(this.state);
  }

  set(recipe: (state: Draft<CoolState>) => void) {
    this._state = produce(this._state, recipe);
    this.emit();
  }

  reset() {
    this._state = this.clone(this.initialState);
    this.emit();
  }

  get state() {
    return this.clone(this._state);
  }

  get stateChanges() {
    return this.state$.asObservable();
  }
}
