import { Component, Injector } from '@angular/core'
import { createElement, Renderable } from 'ng-vdom'

let counter = 0

export interface Todo {
  title: string
  completed: boolean
}

@Component({
  selector: 'app-root',
  template: '',
})
export class AppComponent extends Renderable {
  newTodoTitle = ''
  todos: Todo[] = []

  constructor(injector: Injector) {
    super(injector)

    this.onNewTodoChange = this.onNewTodoChange.bind(this)
    this.onNewTodoSubmit = this.onNewTodoSubmit.bind(this)
    this.onClearCompleted = this.onClearCompleted.bind(this)

    const restored = localStorage.getItem('todos')

    if (restored) {
      this.todos = JSON.parse(restored)
    }
  }

  render() {
    console.log(`rendered ${++counter} times`)

    return (
      <section className="todoapp">
        <Header title={this.newTodoTitle} onChange={this.onNewTodoChange} onSubmit={this.onNewTodoSubmit} />
        <Footer list={this.todos} onClear={this.onClearCompleted} />
      </section>
    )
  }

  onNewTodoChange(title: string) {
    this.newTodoTitle = title
  }

  onNewTodoSubmit() {
    this.todos.push({ title: this.newTodoTitle, completed: false })
    this.newTodoTitle = ''

    this.commit()
  }

  onClearCompleted() {
    for (let i = this.todos.length - 1; i >= 0; i--) {
      if (this.todos[i].completed) {
        this.todos.splice(i, 1)
      }
    }

    this.commit()
  }

  private commit() {
    const serialized = JSON.stringify(this.todos)
    localStorage.setItem('todos', serialized)
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

function Footer(props: { list: Todo[], onClear: () => void }) {
  const { list, onClear } = props

  const remaining = list.filter(x => !x.completed).length

  return list.length > 0 && (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining}</strong>
        &nbsp;{remaining === 1 ? 'item' : 'items'}
        &nbsp;left
      </span>
      {remaining > 0 && <button className="clear-completed" onClick={onButtonClick}>Clear completed</button>}
    </footer>
  )

  function onButtonClick() {
    onClear()
  }
}
