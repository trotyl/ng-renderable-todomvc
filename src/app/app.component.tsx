import { Component, Injector } from '@angular/core'
import { createElement, Renderable } from 'ng-vdom'

let counter = 0

@Component({
  selector: 'app-root',
  template: '',
})
export class AppComponent extends Renderable {
  newTodoTitle = ''

  constructor(injector: Injector) {
    super(injector)

    this.onNewTodoChange = this.onNewTodoChange.bind(this)
    this.onNewTodoSubmit = this.onNewTodoSubmit.bind(this)
  }

  render() {
    console.log(`rendered ${++counter} times`)

    return (
      <section className="todoapp">
        <Header title={this.newTodoTitle} onChange={this.onNewTodoChange} onSubmit={this.onNewTodoSubmit} />
      </section>
    )
  }

  onNewTodoChange(title: string) {
    this.newTodoTitle = title
  }

  onNewTodoSubmit() {
    this.newTodoTitle = ''
  }
}

function Header(props: { title: string, onChange: (title: string) => void, onSubmit: () => void }) {
  const { title, onChange, onSubmit } = props

  return (
    <header className="header">
      <h1>todos</h1>
      <input className="new-todo" placeholder="What needs to be done?" autofocus value={title} onInput={onInputInput} onKeyup={onInputKeyup} />
    </header>
  )

  function onInputInput(event: KeyboardEvent) {
    onChange((event.target as HTMLInputElement).value)
  }

  function onInputKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }
}
