import { HostBinding } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'toolbar-button',
  templateUrl: './toolbar-button.component.html',
  styleUrls: ['./toolbar-button.component.scss']
})
export class ToolbarButtonComponent implements OnInit {

  @Input()
  public text: string;

  @Input()
  public icon: string;

  @Input()
  public exClass: string;

  @HostBinding("className")
  private _componentClass: string;

  constructor() {
  }

  ngOnInit(): void {
    this._componentClass = "btn" + " " + this.exClass;
  }

}
