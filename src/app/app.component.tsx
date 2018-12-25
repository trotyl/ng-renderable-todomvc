import { Component } from '@angular/core'
import { createElement, Renderable } from 'ng-vdom'

@Component({
  selector: 'app-root',
  template: '',
})
export class AppComponent extends Renderable {
  title = 'ng-renderable-mvc'

  render() {
    return (
      <section className="todoapp"></section>
    )
  }
}
