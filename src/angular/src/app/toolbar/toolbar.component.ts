import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  private _isToolbarCollapsed: boolean = false;

  @HostBinding("className")
  private _componentClass: string;

  constructor() {
  }

  public get isCollapsed(): boolean {
    return this._componentClass?.length > 0;
  }

  public changeToolbarCollapseState() {
    this._isToolbarCollapsed = !this._isToolbarCollapsed;
    this.updateToolbarClassString();
  }

  private updateToolbarClassString() {
    this._componentClass = this._isToolbarCollapsed ? "collapsed" : "";
  }

  ngOnInit(): void {
  }
}
