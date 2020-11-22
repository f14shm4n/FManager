import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  private readonly CSS_TOOLBAR: string = "toolbar";
  private readonly CSS_COLLAPSED: string = "collapsed";

  @HostBinding("className")
  private _componentClass: string;

  private _classSet: Set<string>;

  constructor() {
    this._classSet = new Set<string>();
    this._classSet.add(this.CSS_TOOLBAR);

    this.updateClassName();
  }

  public get isCollapsed(): boolean {
    return this._classSet.has(this.CSS_COLLAPSED);
  }

  public changeToolbarCollapseState() {
    if (this.isCollapsed) {
      this._classSet.delete(this.CSS_COLLAPSED);
    } else {
      this._classSet.add(this.CSS_COLLAPSED);
    }
    this.updateClassName();
  }

  private updateClassName() {
    this._componentClass = Array.from(this._classSet).join(" ");
  }

  ngOnInit(): void {
  }
}
